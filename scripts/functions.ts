import { squirrel } from "../scripts/enums";
import { fs } from "../main";

const races: Array<string> = ["tree", "ground", "chipmunk"];
const classes: Array<string> = ["rogue", "berserker", "knight", "ranger", "priest"];
const lastNames: Array<string> = ["Nutcrack", "Nutmeg", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
// const COLOR: string = "#E81B47";

export function newSquirrel(name: string, race: string, classtype: string): squirrel {
    let raceNum: number = -1;
    let classNum: number = -1;

    if (races.includes(race.toLowerCase()))
        raceNum = races.indexOf(race.toLowerCase());

    if (classes.includes(classtype.toLowerCase()))
        classNum = classes.indexOf(classtype.toLowerCase());

    return {
        "name": `${capitalize(name)} ${lastNames[randomInt(0, lastNames.length - 1)]}`,
        "race": raceNum,
        "class": classNum,
        "weapon": {
            "weaponName": "",
            "attackStat": 0,
            "defenseStat": 0,
            "secondStat": 0
        },
        "level": 1,
        "nuts": 0,
        "staminaMax": 0,
        "stamina": 0,
        "dm": false,
        "dm_points": 0
    };
}

export function updateSquirrelFile(playerId: string, squirrel: squirrel): void {
    let playerFile: string = `./data/playerdata/${playerId}.json`;
    fs.writeFileSync(playerFile, JSON.stringify(squirrel));
}

export function randomInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

// export function raceText(race: number): string {
//     if (race === 2) return capitalize(races[race]);
//     else if (race === 0 || race === 1) return `${capitalize(races[race])} Squirrel`;
//     else {
//         console.log(`Error ${race} is not a valid race`);
//         return "";
//     }
// }

export function capitalize(toCaps: string): string {
    return toCaps.charAt(0).toUpperCase() + toCaps.slice(1).toLowerCase();
}