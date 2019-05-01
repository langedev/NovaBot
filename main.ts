// Created by Dalton Lange

//===Requirements===
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const info = JSON.parse(fs.readFileSync(`./data/info.json`));
import { player } from "./data/enums/playerdata";

//===Data stored for use, such as class, race, and last names===
const races: Array<string> = ["tree", "ground", "chipmunk"];
const classes: Array<string> = ["rogue", "berserker", "knight", "ranger", "huntsman", "priest"];
const lastNames: Array<string> = ["Nutcrack", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
const COLOR: string = "#E81B47";
const newPlayerTemplate: player = {
    "name": "",
    "race": "",
    "class": "",
    "level": 1,
    "nuts": 0,
    "dm": false,
    "dm_points": 0
}

//===Commands===
const processes: any = {
    "help": {
        title: "Help",
        description: "Show a description of a command",
        args: "**command** - the command you'd like to know more about",
        run: (msg: any, data: player, args: string[], file: any) => help(msg, args)
    },
    "list": {
        title: "List",
        description: "List all commands",
        args: "",
        run: (msg: any, data: player, args: string[], file: any) => list(msg)
    },
    "read": {
        title: "Read",
        description: "Read a description of your squirrel",
        args: "",
        run: (msg: any, data: player, args: string[], file: any) => read(msg, data)
    },
    "create": {
        title: "Create",
        description: "Create a squirrel, can only be used once",
        args: "**name** - the name of the created squirrel\n**race** - The race of the created squirrel, type !races for race options\n**class** - The class of the created squirrel, type !classes for class options",
        run: (msg: any, data: player, args: string[], file: any) => msg.reply(`You already have a squirrel silly.`)
    },
    "namechange": {
        title: "Namechange",
        description: "Change the name of your squirrel, can only be used at level 1",
        args: "**name** - the new name for your squirrel",
        run: (msg: any, data: player, args: string[], file: any) => nameChange(msg, data, args, file)
    },
    "races": {
        title: "Races",
        description: "List all the races",
        args: "",
        run: (msg: any, data: player, args: string[], file: any) => printRaces(msg)
    },
    "classes": {
        title: "Classes",
        description: "List all the classes",
        args: "",
        run: (msg: any, data: player, args: string[], file: any) => printClasses(msg)
    }
}

//===Global editable variables===
let encounterChannel;
let preparingChannel;
let generalChannel;
let barChannel;
// let encounterInProgress: boolean;

//===Initalization===
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    encounterChannel = client.channels.find(ch => ch.name === 'the-wild');
    preparingChannel = client.channels.find(ch => ch.name === 'preparing-for-expedition');
    generalChannel = client.channels.find(ch => ch.name === 'general-table');
    barChannel = client.channels.find(ch => ch.name === 'the-bar');
    // const preparingCollector = new Discord.MessageCollector(preparingChannel);
    // preparingCollector.on('collect', msg => {
    //     console.log(msg.content);
    // });
    // setInterval( function() { encounter(encounterChannel); }, 300000 );
    // encounter(encounterChannel);
});

//===When receiving messages
client.on('message', msg => {
    //Reasons to exit
    // if (msg.channel.type === "dm") return;
    if (!msg.content.split(" ")[0].startsWith(info.prefix)) return;

    let messageContent: Array<string> = msg.content.split(" ");
    let command: string = messageContent[0]; // This is the command they are using

    let args: Array<string> = [""]; // arguments of the message
    if (messageContent.length > 1) args = messageContent.slice(1);

    let authorId: number = msg.author.id; // Message Author
    let playerFile: string = `./data/playerdata/${authorId}.json`;

    if (fs.existsSync(playerFile)) { // If they're file exists, they can use commands, otherwise direct them to the create command
        let rawPlayerData: string = fs.readFileSync(playerFile);
        let playerData: player = JSON.parse(rawPlayerData);

        Object.keys(processes).forEach(process => { // See if the command they typed is a command
            if(`${info.prefix}${processes[process].title.toLowerCase()}` === command){
                processes[process].run(msg, playerData, args, playerFile);
            }
        });

    } else {
        if(command === `${info.prefix}create`){
            console.log(`Attempting to make a squirrel for ${authorId}`);
            if (create(msg, args, playerFile))
                console.log(`Squirrel made succesfully for ${authorId}`);
            else
                console.log(`Failed to create a squirrel for ${authorId}`);
        } else {
            msg.reply(`Please make a squirrel before interacting with the bot. To do so please use the create command. For more information on creation type "!help create"`);
        }
    }
});

// Log the bot in
client.login(info.key);

//===FUNCTIONS===
/*
function encounter(encounterChannel: any): void {
    if (!encounterInProgress) { // randomInt(1,60) === 60 && 
        console.log("Starting Encounter");
        encounterInProgress = true;
        encounterChannel.send("An encounter is beginning!");

        encounterChannel.send(`\`■■■   ■■■    ■■■  ■■■\`\n\`■■■   ■■■    ■■■  ■■■\`\n\`■■■   ■■■    ■■■  ■■■\``).then(msg => {



            console.log("Encounter finished");
            encounterInProgress = false;
        });
    }
}
*/
function randomInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

function raceText(race: string): string {
    if (race === races[2]) return capitalize(race);
    else if (race === races[0] || race === races[1]) return `${capitalize(race)} Squirrel`;
    else {
        console.log(`Error ${race} is not a valid race`);
        return "";
    }
}

function capitalize(toCaps: string): string {
    return toCaps.charAt(0).toUpperCase() + toCaps.slice(1).toLowerCase();
}

//===COMMAND FUNCTIONS==

function help(msg: any, args: string[]): void {
    let argument: string = args[0].toLowerCase();
    if(argument === "") {
        msg.reply(`Please provide a command, like "!help help", or "!help races"\nAlternatively type "!list" for a list of commands`);
    } else if(processes.hasOwnProperty(argument)){
        let embed = new Discord.RichEmbed()
            .setTitle(processes[argument].title)
            .setColor(COLOR)
            .setDescription(processes[argument].description);
        if(processes[argument].args === "") {
            embed.addField("Arguments:", `This command has no arguments`);
        } else {
            embed.addField("Arguments:", processes[argument].args);
        }
        msg.channel.send(embed);
    } else {
        msg.reply(`That command does not exist`);
    }
}

function list(msg: any): void {
    let embed = new Discord.RichEmbed()
        .setTitle("List of Commands")
        .setColor(COLOR);
    let description: string = "";
    Object.keys(processes).forEach(process => {
        description += `**${processes[process].title}:** ${processes[process].description}.\n`;
    });
    embed.setDescription(description);
    msg.author.send(embed);
}

function read(msg: any, data: player): void {
    let embed = new Discord.RichEmbed()
        .setTitle(msg.author.username)
        .setColor(COLOR)
        .setThumbnail(msg.author.avatarURL)
        .setDescription("Squirrel Info")
        .addField("Name", data.name)
        .addField("Race", raceText(data.race))
        .addField("Class", capitalize(data.class))
        .addField("Nuts", data.nuts)
        .addField("Level", data.level);
    if (data.dm === true)
        embed.addField("DM Points", data.dm_points);

    msg.channel.send(embed);
}

function create(msg: any, args: Array<string>, file: any): boolean {
    if (args.length === 3) {
        let newPlayer: player = newPlayerTemplate;
        let incorrect: string = "";

        incorrect = " race";
        races.some(type => {
            if (args[1].toLowerCase() == type) {
                incorrect = "";
                return true;
            }
        });

        if (incorrect == "")
            incorrect = " class";
        else
            incorrect += ", and class";
        classes.some(type => {
            if (args[2].toLowerCase() == type) {
                if (incorrect == " race, and class")
                    incorrect = " race";
                else
                    incorrect = "";
                return true;
            }
        });

        if (incorrect === "") {
            newPlayer.name = args[0] + " " + lastNames[randomInt(0, lastNames.length - 1)];
            newPlayer.race = args[1];
            newPlayer.class = args[2];
            fs.writeFileSync(file, JSON.stringify(newPlayer));
            msg.reply(`Squirrel ${newPlayer.name} has been created`);
            return true;
        } else {
            msg.reply(`Some parameters were entered incorrectly. Remember the format is "create name race class". Your name can be whatever you want, but you have to choose from !race, and !class. You incorrectly entered your:${incorrect}.`);
            return false;
        }
    } else {
        msg.reply(`Too many or too few parameters were entered. The format is "create name race class". You only get to choose your first name, don't write a last name.`);
        return false;
    }
}

function nameChange(msg: any, data: player, args: string[], file: any): void {
    if (data.level == 1) {
        if (args.length >= 1) {
            data.name = capitalize(args[0]) + " " + data.name.split(' ')[1];
            fs.writeFileSync(file, JSON.stringify(data));
            msg.reply(`Name changed to ${data.name}`);
        } else {
            msg.reply(`Please provide a name`);
        }
    } else {
        msg.reply(`Sorry, you have to be level 1 to change your name. You're stuck with ${data.name}`);
    }
}

function printRaces(msg: any): void {
    let print = "The races are: ";
    for (let i = 0; i < races.length; i++) {
        if (i === races.length - 1) {
            print += `& ${raceText(races[i])}s`;
        } else {
            print += `${raceText(races[i])}s, `;
        }
    }
    msg.reply(print);
}

function printClasses(msg: any): void {
    let print = "The classes are: ";
    for (let i = 0; i < classes.length; i++) {
        if (i === classes.length - 1) {
            print += `& ${capitalize(classes[i])}s`;
        } else {
            print += `${capitalize(classes[i])}s, `;
        }
    }
    msg.reply(print);
}