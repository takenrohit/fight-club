export type Move = {
    id: string;
    name: string;
    damage: number;
    accuracy: number;
    critRate: number;
    cursedEnergy: number;
}

export type Passive = {
    id: string;
    name: string;
    description: string;
}

export type Character = {
    id: string;
    name: string;
    maxHp: number;
    maxCursedEnergy: number;
    passive?: Passive;
    moves: Move[];
}

export type LogEntry = {
    id: string;
    message: string;
    timestamp: number;
}

export type CombatResult = {
    type: "hit" | "miss" | "crit" | "heal";
    message: string;
    damage?: number;
    heal?: number;
}

export type FighterState = {
    character: Character;
    hp: number;
    cursedEnergy: number;
}