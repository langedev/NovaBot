export interface player {
    name:       string;
    race:       string;
    class:      string;
    weapon:     weapon;
    nuts:       number;
    level:      number;
    staminaMax: number;
    stamina:    number;
    dm:         boolean;
    dm_points:  number;
}

export interface weapon {
    weaponName:  string;
    attackStat:  number;
    defenseStat: number;
    secondStat:  number;
}
