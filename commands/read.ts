import { squirrel } from "../scripts/enums";
import { classText, COLOR, getPlayerData, raceText } from "../scripts/functions";

module.exports = {
    name: "read",
    description: "Read a description of your squirrel",
    args: "",
    execute(msg, args) {
        const data: squirrel = getPlayerData(msg.author.id);
        const squirrelEmbed: object = {
            color: COLOR,
            title: msg.author.username,
            thumbnail: {
                url: msg.author.avatarURL()
            },
            fields: [
                {
                    name: 'Name',
                    value: data.name
                },
                {
                    name: 'Race',
                    value: raceText(data.race)
                },
                {
                    name: 'Class',
                    value: classText(data.class)
                },
                {
                    name: 'Nuts',
                    value: data.nuts
                },
                {
                    name: 'Level',
                    value: data.level
                }
            ]
        }
        msg.channel.send({ embed: squirrelEmbed });
    }
}
