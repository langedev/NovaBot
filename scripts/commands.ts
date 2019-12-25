import { Discord, fs} from "../main";
import { player } from "./enums";
import { raceText, capitalize, randomInt, encounter } from "./functions";

//===Data stored for use, such as class, race, and last names===
export const races: Array<string> = ["tree", "ground", "chipmunk"];
const classes: Array<string> = ["rogue", "berserker", "knight", "ranger", "priest"];
const lastNames: Array<string> = ["Nutcrack", "Nutmeg", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
const COLOR: string = "#E81B47";
const newPlayerTemplate: player = {
    "name":  "",
    "race":  "",
    "class": "",
    "weapon": {
        "weaponName": "",
        "attackStat":  0,
        "defenseStat": 0,
        "secondStat":  0
    },
    "level":      1,
    "nuts":       0,
    "staminaMax": 0,
    "stamina":    0,
    "dm":     false,
    "dm_points":  0
}
export let channels: any = {
    general: "",
    encounter: "",
    preparing: ""    
}
export let processes: any = {
    "test": {
        title: "Test",
        description: "For testing",
        args: "",
        run: (msg: any, data: player, args: string[], file: any) => encounter()
    },
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
    },
    "create": {
        title: "Create",
        description: "Create a squirrel, can only be used once",
        args: "**name** - the name of the created squirrel\n**race** - The race of the created squirrel, type !races for race options\n**class** - The class of the created squirrel, type !classes for class options",
        run: (msg: any, data: player, args: string[], file: any) => create(msg, args, file)
    }
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