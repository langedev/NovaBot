import { squirrel } from "../scripts/enums";
import { capitalize, getPlayerData, updateSquirrelFile } from "../scripts/functions";

module.exports = {
    name: "namechange",
    description: "Change the name of your squirrel, can only be used at level 1",
    args: "**name** - the new name for your squirrel",
    execute(msg, args) {
        let data: squirrel = getPlayerData(msg.author.id);

        if (data.level == 1) {
            if (args.length >= 1) {
                data.name = capitalize(args[0]) + " " + data.name.split(' ')[1];
                updateSquirrelFile(msg.author.id, data);
                msg.reply(`Name changed to ${data.name}`);
            } else {
                msg.reply(`Please provide a name`);
            }
        } else {
            msg.reply(`Sorry, you have to be level 1 to change your name. You're stuck with ${data.name}`);
        }
    }
}
