"use strict";
// Created by Dalton Lange
exports.__esModule = true;
var fs = require('fs');
var Discord = require('discord.js');
var client = new Discord.Client();
var info = JSON.parse(fs.readFileSync("./data/info.json"));
var races = ["tree", "ground", "chipmunk"];
var classes = ["rogue", "berserker", "knight", "ranger", "huntsman", "priest"];
var lastNames = ["Nutcrack", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
var newPlayerTemplate = {
    "name": "",
    "race": "",
    "class": "",
    "level": 1,
    "nuts": 0,
    "dm": false,
    "dm_points": 0
};
var processes = {
    "!read": {
        title: "read",
        description: "Read a description of your character",
        run: function (msg, data) { return read(msg, data); }
    },
    "!create": {
        title: "create",
        description: "Create a character, can only be used once.",
        run: function (msg, args) { return create(msg, args); }
    }
};
var authorId;
var playerFile;
var rawPlayerData;
var command;
var messageContent;
var args = [""];
var encounterInProgress;
var playerData;
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
    var encounterChannel = client.channels.find(function (ch) { return ch.name === 'the-wild'; });
    var preparingChannel = client.channels.find(function (ch) { return ch.name === 'preparing-for-expedition'; });
    // const preparingCollector = new Discord.MessageCollector(preparingChannel);
    // preparingCollector.on('collect', msg => {
    //     console.log(msg.content);
    // });
    // setInterval( function() { encounter(encounterChannel); }, 300000 );
    // encounter(encounterChannel);
});
client.on('message', function (msg) {
    if (msg.channel.type === "dm")
        return;
    messageContent = msg.content.split(" ");
    command = messageContent[0];
    if (messageContent.length > 1)
        args = messageContent.slice(1);
    if (!command.startsWith(info.prefix))
        return;
    authorId = msg.author.id;
    playerFile = "./data/playerdata/" + authorId + ".json";
    if (fs.existsSync(playerFile)) {
        rawPlayerData = fs.readFileSync(playerFile);
        playerData = JSON.parse(rawPlayerData);
        processes.forEach(function (process) {
            if (command === "!" + process.title) {
                process.run();
            }
        });
        if (command === "!read") {
            read(msg, playerData);
        }
        else if (command === "!create") {
            msg.reply("You already have a squirrel silly.");
        }
        else if (command === "!namechange") {
            nameChange(msg, playerData, playerFile);
        }
        else if (command === "!races") {
            printRaces(msg);
        }
        else if (command === "!classes") {
            printClasses(msg);
        }
    }
    else if (command === "!create") {
        console.log("Attempting to make a squirrel for " + authorId);
        if (create(msg, args))
            console.log("Squirrel made succesfully for " + authorId);
        else
            console.log("Failed to create quirrel for " + authorId);
    }
});
client.login(info.key);
function encounter(encounterChannel) {
    if (!encounterInProgress) { // randomInt(1,60) === 60 && 
        console.log("Starting Encounter");
        encounterInProgress = true;
        encounterChannel.send("An encounter is beginning!");
        encounterChannel.send("`\u25A0\u25A0\u25A0   \u25A0\u25A0\u25A0    \u25A0\u25A0\u25A0  \u25A0\u25A0\u25A0`\n`\u25A0\u25A0\u25A0   \u25A0\u25A0\u25A0    \u25A0\u25A0\u25A0  \u25A0\u25A0\u25A0`\n`\u25A0\u25A0\u25A0   \u25A0\u25A0\u25A0    \u25A0\u25A0\u25A0  \u25A0\u25A0\u25A0`").then(function (msg) {
            console.log("Encounter finished");
            encounterInProgress = false;
        });
    }
}
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
function raceText(race) {
    if (race === races[2])
        return capitalize(race);
    else if (race === races[0] || race === races[1])
        return capitalize(race) + " Squirrel";
    else {
        console.log("Error " + race + " is not a valid race");
        return "";
    }
}
function capitalize(toCaps) {
    return toCaps.charAt(0).toUpperCase() + toCaps.slice(1).toLowerCase();
}
// Commands:
function read(msg, data) {
    var embed = new Discord.RichEmbed()
        .setTitle(msg.author.username)
        .setDescription("Squirrel Info")
        .setColor("#E81B47")
        .setThumbnail(msg.author.avatarURL)
        .addField("Name", data.name)
        .addField("Race", raceText(data.race))
        .addField("Class", capitalize(data["class"]))
        .addField("Nuts", data.nuts)
        .addField("Level", data.level);
    if (data.dm === true)
        embed.addField("DM Points", data.dm_points);
    msg.channel.send(embed);
}
function create(msg, args) {
    if (args.length === 3) {
        var newSquirrel_1 = msg.content.split(' ');
        var newPlayer = newPlayerTemplate;
        var incorrect_1 = "";
        incorrect_1 = " race";
        races.some(function (type) {
            if (newSquirrel_1[2].toLowerCase() == type) {
                incorrect_1 = "";
                return true;
            }
        });
        if (incorrect_1 == "")
            incorrect_1 = " class";
        else
            incorrect_1 += ", and class";
        classes.some(function (type) {
            if (newSquirrel_1[3].toLowerCase() == type) {
                if (incorrect_1 == " race, and class")
                    incorrect_1 = " race";
                else
                    incorrect_1 = "";
                return true;
            }
        });
        if (incorrect_1 === "") {
            newPlayer.name = newSquirrel_1[1] + " " + lastNames[randomInt(0, lastNames.length - 1)];
            newPlayer.race = newSquirrel_1[2];
            newPlayer["class"] = newSquirrel_1[3];
            fs.writeFileSync(playerFile, JSON.stringify(newPlayer));
            msg.reply("Squirrel " + newPlayer.name + " has been created");
            return true;
        }
        else {
            msg.reply("Some parameters were entered incorrectly. Remember the format is \"create name race class\". Your name can be whatever you want, but you have to choose from !race, and !class. You incorrectly entered your:" + incorrect_1 + ".");
            return false;
        }
    }
    else {
        msg.reply("Too many or too few parameters were entered. The format is \"create name race class\". You only get to choose your first name, don't write a last name.");
        return false;
    }
}
function nameChange(msg, data, file) {
    if (data.level == 1) {
        if (msg.content.split(' ').length >= 2) {
            var newName = msg.content.split(' ')[1];
            data.name = capitalize(newName) + " " + data.name.split(' ')[1];
            fs.writeFileSync(file, JSON.stringify(data));
            msg.reply("Name changed to " + data.name);
        }
        else {
            msg.reply("Please provide a name");
        }
    }
    else {
        msg.reply("Sorry, you have to be level 1 to change your name. You're stuck with " + data.name);
    }
}
function printRaces(msg) {
    var print = "The races are: ";
    for (var i = 0; i < races.length; i++) {
        if (i === races.length - 1) {
            print += "& " + raceText(races[i]) + "s";
        }
        else {
            print += raceText(races[i]) + "s, ";
        }
    }
    msg.reply(print);
}
function printClasses(msg) {
    var print = "The classes are: ";
    for (var i = 0; i < classes.length; i++) {
        if (i === classes.length - 1) {
            print += "& " + capitalize(classes[i]) + "s";
        }
        else {
            print += capitalize(classes[i]) + "s, ";
        }
    }
    msg.reply(print);
}
