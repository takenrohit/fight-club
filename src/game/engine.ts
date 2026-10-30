import type { Move, FighterState, CombatResult } from "./types";
import { getHooks } from "./passives";

export function performMove(
    attacker: FighterState,
    defender: FighterState,
    move: Move
): CombatResult {

    attacker.cursedEnergy -= move.cursedEnergy;


    if (move.type === "attack") {
        const isHit = Math.random() * 100 < move.accuracy;

        if (!isHit) {
            return {
                type: "miss",
                message: `${attacker.character.name} used ${move.name} and missed!`,
            };
        }

        const isCrit = Math.random() * 100 < move.critRate;
        const ctx = { attacker, defender, move, isCrit };

        if (getHooks(defender).blocksAttack?.(ctx)) {
            return {
                type: "blocked",
                message: `${defender.character.name} blocked the attack with ${defender.character.passive?.name}!`,
                damage: 0,
            };
        }

        const baseDamage = move.damage ?? 0;
        let damage = isCrit ? Math.round(baseDamage * 1.5) : baseDamage;

        const notes: string[] = [];
        const effect = getHooks(attacker).modifyDamage?.(ctx, damage);
        if (effect) {
            damage = effect.damage;
            if (effect.message) notes.push(effect.message);
            if (effect.ceRefund) {
                attacker.cursedEnergy = Math.min(
                    attacker.character.maxCursedEnergy,
                    attacker.cursedEnergy + effect.ceRefund
                );
            }
        }

        defender.hp = Math.max(0, defender.hp - damage);

        const base = isCrit
            ? `${attacker.character.name} used ${move.name} and landed a critical hit for ${damage} damage!`
            : `${attacker.character.name} used ${move.name} and landed a hit for ${damage} damage!`;

        return {
            type: isCrit ? "crit" : "hit",
            message: [base, ...notes].join(" "),
            damage,
        };
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