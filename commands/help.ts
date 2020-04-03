import { client } from "../main";
import { capitalize, COLOR } from "../scripts/functions";

module.exports = {
    name: 'help',
    description: "Show a description of a command",
    args: "**command** - the command you'd like to know more about",
    execute(msg, args) {
        const command = args[0].toLowerCase();
        if (command === "") {
            msg.reply(`Please provide a command, like "!help help", or "!help races"\nAlternatively type "!list" for a list of commands`);
            return;
        }

        if (client.commands.has(command)) {
            const commandData: any = client.commands.get(command);
            const helpEmbed: object = {
                color: COLOR,
                title: capitalize(commandData.name),
                description: commandData.description,
                fields: [
                    {
                        name: 'Arguments',
                        value: commandData.args
                    }
                ]
            }
            msg.channel.send("{ embed: helpEmbed }");
        } else {
            msg.reply(`That command does not exist`);
        }
    }
}