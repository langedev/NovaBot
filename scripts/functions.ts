import { fs } from "../main";
import { squirrel } from "../scripts/enums";

const races: Array<string> = ["tree", "ground", "chipmunk"];
const classes: Array<string> = ["rogue", "berserker", "knight", "ranger", "priest"];
const lastNames: Array<string> = ["Nutcrack", "Nutmeg", "Seedsower", "McScuiri", "Rodentia", "Arbora", "Patagi"];
export const COLOR: string = "#E81B47";

export function getPlayerData(playerId: string): squirrel {
    return JSON.parse(fs.readFileSync(`./data/playerdata/${playerId}.json`))
}

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

export function raceText(raceIndex: number): string {
    if (raceIndex >= races.length) {
        console.log(`Error ${raceIndex} is outside of bounds`);
        return "";
    }

    if (raceIndex === 2) return capitalize(races[raceIndex]);
    else if (raceIndex === 0 || raceIndex === 1) return `${capitalize(races[raceIndex])} Squirrel`;
}

export function classText(classIndex: number): string {
    if (classIndex >= classes.length) {
        console.log(`Error ${classIndex} is outside of bounds`);
        return "";
    }

    return capitalize(classes[classIndex]);
}

export function capitalize(toCaps: string): string {
    return toCaps.charAt(0).toUpperCase() + toCaps.slice(1).toLowerCase();
}