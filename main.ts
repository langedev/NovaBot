// Created by Dalton Lange

//===Requirements===
export const fs = require('fs');
const Discord = require('discord.js');

const info = JSON.parse(fs.readFileSync(`./data/info.json`));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

export const client = new Discord.Client();
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}



//===Initalization===
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//===When receiving messages
client.on('message', msg => {
    //Reasons to exit
    if (!msg.content.split(" ")[0].startsWith(info.prefix) || msg.author.bot) return; // if the message doesn't start with the prefix

    executeCommand(msg);
});

// Log the bot in
client.login(info.key);

function executeCommand(msg: any) {
    const messageContent: Array<string> = msg.content.slice(1).split(" "); // split message into an array on spaces
    const command: string = messageContent[0].toLowerCase(); // This is the command they are using
    let args: Array<string> = [""]; // arguments of the message
    if (messageContent.length > 1) args = messageContent.slice(1);

    if (!client.commands.has(command)) {
        msg.reply(`That command: "${command}" doesn't exist. Sad.`);
        return;
    }
    try {
        client.commands.get(command).execute(msg, args);
    } catch (e) {
        if (e.code === 'ENOENT')
            msg.reply(`Please create a squirrel using "!create" first, before trying that command.`);
        else {
            console.error(e);
            msg.reply(`Failed to execute the given command for some reason. Sad.`);
        }
    }
}