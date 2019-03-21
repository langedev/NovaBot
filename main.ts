// Created by Dalton Lange

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const info = JSON.parse(fs.readFileSync(`./data/info.json`));
import { player } from "./data/enums/playerdata";

const races: Array<string> = ["tree", "ground", "chipmunk"];
const classes: Array<string> = ["rogue", "berserker", "knight", "ranger", "huntsman", "priest"];
const lastNames: Array<string> = ["Nutcrack", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
const newPlayerTemplate: player = {
    "name": "",
    "race": "",
    "class": "",
    "level": 1,
    "nuts": 0,
    "dm": false,
    "dm_points": 0
}
const processes: any = {
    "read": {
        title: "Read",
        description: "Read a description of your squirrel",
        run: (msg: any, data: player, args: string[], file: any) => read(msg, data)
    },
    "create": {
        title: "Create",
        description: "Create a squirrel, can only be used once.",
        run: (msg: any, data: player, args: string[], file: any) => create(msg, args)
    },
    "namechange": {
        title: "Namechange",
        description: "Change the name of your squirrel, can only be used once",
        run: (msg: any, data: player, args: string[], file: any) => nameChange(msg, data, file)
    },
    "races": {
        title: "Races",
        description: "List all the races",
        run: (msg: any, data: player, args: string[], file: any) => printRaces(msg)
    },
    "classes": {
        title: "Classes",
        description: "List all the classes",
        run: (msg: any, data: player, args: string[], file: any) => printClasses(msg)
    }
}

let authorId: number;
let playerFile: string;
let rawPlayerData: string;
let command: string;
let messageContent: Array<string>;
let args: Array<string> = [""];
let encounterInProgress: boolean;
let playerData: player;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const encounterChannel = client.channels.find(ch => ch.name === 'the-wild');
    const preparingChannel = client.channels.find(ch => ch.name === 'preparing-for-expedition');
    // const preparingCollector = new Discord.MessageCollector(preparingChannel);
    // preparingCollector.on('collect', msg => {
    //     console.log(msg.content);
    // });
    // setInterval( function() { encounter(encounterChannel); }, 300000 );
    // encounter(encounterChannel);
});

client.on('message', msg => {
    if (msg.channel.type === "dm") return;

    messageContent = msg.content.split(" ");
    command = messageContent[0];
    if (messageContent.length > 1) args = messageContent.slice(1);

    if (!command.startsWith(info.prefix)) return;

    authorId = msg.author.id;
    playerFile = `./data/playerdata/${authorId}.json`;

    if (fs.existsSync(playerFile)) {

        rawPlayerData = fs.readFileSync(playerFile);
        playerData = JSON.parse(rawPlayerData);

        processes.forEach(process => {
            if(command === `!${process.title}`){
                process.run(msg, playerData, args, playerFile);
            }
        });

    } else if (command === `!create`) {
        console.log(`Attempting to make a squirrel for ${authorId}`);
        if (create(msg, args))
            console.log(`Squirrel made succesfully for ${authorId}`);
        else
            console.log(`Failed to create quirrel for ${authorId}`);
    }
});

client.login(info.key);

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

// Commands:

function read(msg: any, data: player): void {
    let embed = new Discord.RichEmbed()
        .setTitle(msg.author.username)
        .setDescription("Squirrel Info")
        .setColor("#E81B47")
        .setThumbnail(msg.author.avatarURL)
        .addField("Name", data.name)
        .addField("Race", raceText(data.race))
        .addField("Class", capitalize(data.class))
        .addField("Nuts", data.nuts)
        .addField("Level", data.level);
    if (data.dm === true)
        embed.addField("DM Points", data.dm_points);

    msg.channel.send(embed);
}

function create(msg: any, args: Array<string>): boolean {
    if (args.length === 3) {
        let newSquirrel: Array<string> = msg.content.split(' ');
        let newPlayer: player = newPlayerTemplate;
        let incorrect: string = "";

        incorrect = " race";
        races.some(type => {
            if (newSquirrel[2].toLowerCase() == type) {
                incorrect = "";
                return true;
            }
        });

        if (incorrect == "")
            incorrect = " class";
        else
            incorrect += ", and class";
        classes.some(type => {
            if (newSquirrel[3].toLowerCase() == type) {
                if (incorrect == " race, and class")
                    incorrect = " race";
                else
                    incorrect = "";
                return true;
            }
        });

        if (incorrect === "") {
            newPlayer.name = newSquirrel[1] + " " + lastNames[randomInt(0, lastNames.length - 1)];
            newPlayer.race = newSquirrel[2];
            newPlayer.class = newSquirrel[3];
            fs.writeFileSync(playerFile, JSON.stringify(newPlayer));
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

function nameChange(msg: any, data: player, file: any): void {
    if (data.level == 1) {
        if (msg.content.split(' ').length >= 2) {
            let newName: string = msg.content.split(' ')[1];
            data.name = capitalize(newName) + " " + data.name.split(' ')[1];
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