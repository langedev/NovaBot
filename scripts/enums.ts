export interface squirrel {
    name: string;
    race: number;
    class: number;
    weapon: weapon;
    nuts: number;
    level: number;
    staminaMax: number;
    stamina: number;
    dm: boolean;
    dm_points: number;
}

export interface weapon {
    weaponName: string;
    attackStat: number;
    defenseStat: number;
    secondStat: number;
}