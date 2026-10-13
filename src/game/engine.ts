import type { Move, FighterState, CombatResult } from "./types";

export function performMove(
    attacker: FighterState,
    defender: FighterState,
    move: Move
): CombatResult {
    if (attacker.cursedEnergy < move.cursedEnergy) {
        return {
            type: "miss",
            message: "NOT ENOUGH CURSED ENERGY!",
        };
    }

    attacker.cursedEnergy -= move.cursedEnergy;


    if (move.type === "attack") {
        const accuracy = Math.random() * 100;

        const isHit = accuracy < move.accuracy;

        if (!isHit) {
            return {
                type: "miss",
                message: `${attacker.character.name} used ${move.name} and missed!`,
            };
        }

        const crit = Math.random() * 100;

        const isCrit = crit < move.critRate;
        const damage = isCrit
            ? Math.round((move.damage ?? 0) * 1.5)
            : move.damage ?? 0;

        if (defender.character.passive?.id === "infinity") {
            const blocked = Math.random() < 0.2;

            if (blocked) {
                return {
                    type: "blocked",
                    message: `${defender.character.name} blocked the attack with infinity!`,
                    damage: 0,
                }
            }
        }

        defender.hp = Math.max(0, defender.hp - damage);

        return {
            type: isCrit ? "crit" : "hit",
            message: isCrit
                ? `${attacker.character.name} used ${move.name} and landed a critical hit for ${damage} damage!`
                : `${attacker.character.name} used ${move.name} and landed a hit for ${damage} damage!`,
            damage
        }
    }
    else {
        const healAmt = move.heal ?? 0;

        const actualHeal = Math.min(
            healAmt,
            attacker.character.maxHp - attacker.hp
        );

        attacker.hp += actualHeal;

        return {
            type: "heal",
            message: `${attacker.character.name} used ${move.name} and recovered ${actualHeal} HP!`,
            heal: actualHeal,
        };
    }
}