import { races, channels } from "./commands";

export let encounterInProgress: boolean = false;

export function encounter(): void {
    if (encounterInProgress == false) { // randomInt(1,20) === 20 && 
        console.log("Starting Encounter");
        encounterInProgress = true;
        channels.encounter.send("An encounter is beginning!");

        channels.encounter.send(`\`■■■   ■■■    ■■■  ■■■\`\n\`■■■   ■■■    ■■■  ■■■\`\n\`■■■   ■■■    ■■■  ■■■\``)
        console.log("Encounter finished");
        encounterInProgress = false;
    }
}

export function randomInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

export function raceText(race: string): string {
    if (race === races[2]) return capitalize(race);
    else if (race === races[0] || race === races[1]) return `${capitalize(race)} Squirrel`;
    else {
        console.log(`Error ${race} is not a valid race`);
        return "";
    }
}

export function capitalize(toCaps: string): string {
    return toCaps.charAt(0).toUpperCase() + toCaps.slice(1).toLowerCase();
}