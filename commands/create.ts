import { squirrel } from "../scripts/enums";
import { newSquirrel, updateSquirrelFile } from "../scripts/functions";

module.exports = {
    name: 'create',
    description: "Create a squirrel, can only be used once",
    args: "**name** - the name of the created squirrel\n**race** - The race of the created squirrel, type !races for race options\n**class** - The class of the created squirrel, type !classes for class options",
    execute(msg, args) {
        if (args.length !== 3) {
            msg.reply(`Too many or too few parameters were entered. The format is "create name race class". You only get to choose your first name, don't write a last name.`);
            return false;
        }

        let newSquirrel: squirrel = squirrel(args[0], args[1], args[2]);

        let incorrect: string = "";

        if (newSquirrel.race === -1)
            incorrect += ` race as ${args[1]}`;
        if (newSquirrel.class === -1)
            incorrect += ` class as ${args[2]}`;

        if (incorrect === "") {
            updateSquirrelFile(msg.author.id, newSquirrel);
            msg.reply(`Squirrel ${newSquirrel.name} has been created`);
        } else {
            msg.reply(`Some parameters were entered incorrectly. Remember the format is "create first_name race class". Your name can be whatever you want, but you have to choose from !race, and !class. You incorrectly entered:${incorrect}.`);
        }
    }
}

function squirrel(name: string, race: string, classtype: string): squirrel {
    return newSquirrel(name, race, classtype);
}