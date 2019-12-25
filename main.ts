// Created by Dalton Lange

//===Requirements===
export const Discord = require('discord.js');
const client = new Discord.Client();
export const fs = require('fs');
const info = JSON.parse(fs.readFileSync(`./data/info.json`));

import { player } from "./scripts/enums";
import { processes, channels } from "./scripts/commands";
import { encounterInProgress } from "./scripts/functions";


//===Global editable variables===


//===Initalization===
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    channels.general = client.channels.find(ch => ch.id === info.channels.general);
    channels.encounter = client.channels.find(ch => ch.id === info.channels.encounter);
    channels.preparing = client.channels.find(ch => ch.id === info.channels.preparing);
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
    if (!msg.content.split(" ")[0].startsWith(info.prefix)) return; // if the message doesn't start with the prefix
    switch(msg.channel) {
        case channels.encounter:
            if(encounterInProgress) return;
            encounterChannelMessage(msg);
            break;
        default:
            defaultChannelMessage(msg);
    }
    
});

// Log the bot in
client.login(info.key);


// Channel Cases
function defaultChannelMessage(msg: any): void {
    let messageContent: Array<string> = msg.content.split(" "); // split message into an array on spaces
    let command: string = messageContent[0]; // This is the command they are using

    let args: Array<string> = [""]; // arguments of the message
    if (messageContent.length > 1) args = messageContent.slice(1);
    let authorId: number = msg.author.id; // Message Author
    let playerFile: string = `./data/playerdata/${authorId}.json`;

    if (fs.existsSync(playerFile)) { // If they're file exists, they can use commands, otherwise direct them to the create command
        let playerData: player = JSON.parse(fs.readFileSync(playerFile));

        Object.keys(processes).forEach(process => { // See if the command they typed is a command
            if(`${info.prefix}${processes[process].title.toLowerCase()}` === command){
                processes[process].run(msg, playerData, args, playerFile);
            }
        });

    } else {
        if(command === `${info.prefix}create`){ // if they are using the create command
            console.log(`Attempting to make a squirrel for ${authorId}`);
            if (processes["create"]["create"].run(msg, null, args, playerFile))
                console.log(`Squirrel made succesfully for ${authorId}`);
            else
                console.log(`Failed to create a squirrel for ${authorId}`);
        } else {
            msg.reply(`Please make a squirrel before interacting with the bot. To do so please use the create command. For more information on creation type "!help create"`);
        }
    }
}

function encounterChannelMessage(msg: any): void {
    
}