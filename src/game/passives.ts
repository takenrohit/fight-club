import type { FighterState, Move } from "./types";

export type AttackContext = {
    attacker: FighterState;
    defender: FighterState;
    move: Move;
    isCrit: boolean;
}

export type DamageModifier = {
    damage: number;
    message?: string;
    ceRefund?: number;
}

export type PassiveHooks = {

    blocksAttack?: (ctx: AttackContext) => boolean;

    modifyDamage?: (ctx: AttackContext, damage: number) => DamageModifier;
}

const INFINITY_BLOCK_CHANCE = 0.1;
const BLACK_FLASH_CHANCE = 0.2;
const BLACK_FLASH_MULTIPLIER = 1.5;
const BLACK_FLASH_CE_REFUND = 12;
const KING_HP_THRESHOLD = 0.5;
const KING_DAMAGE_MULTIPLIER = 1.25;

export const passives: Record<string, PassiveHooks> = {
    infinity: {
        blocksAttack: () => Math.random() < INFINITY_BLOCK_CHANCE,
    },

    black_flash: {
        modifyDamage: ({ isCrit }, damage) => {
            if (isCrit || Math.random() >= BLACK_FLASH_CHANCE) {
                return { damage };
            }
            return {
                damage: Math.round(damage * BLACK_FLASH_MULTIPLIER),
                ceRefund: BLACK_FLASH_CE_REFUND,
                message: "BLACK FLASH! Yuji enters the zone!",
            };
        },
    },

    king_of_curses: {
        modifyDamage: ({ attacker }, damage) => {
            const isWounded =
                attacker.hp <= attacker.character.maxHp * KING_HP_THRESHOLD;
            if (!isWounded) return { damage };
            return {
                damage: Math.round(damage * KING_DAMAGE_MULTIPLIER),
                message: "The King of Curses grows more dangerous!",
            };
        },
    },
};

export function getHooks(fighter: FighterState): PassiveHooks {
    const id = fighter.character.passive?.id;
    return (id && passives[id]) || {};
}