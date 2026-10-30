import type { Character, FighterState, CombatResult } from "./types";
import { performMove } from "./engine";

export type PlayerId = "player1" | "player2";

export type BattleState = {
    player1: FighterState;
    player2: FighterState;
    currentTurn: PlayerId;
    status: "playing" | "finished";
    winner: PlayerId | null;
};

const CE_REGEN_PER_TURN = 10;

export function createBattle(
    character1: Character,
    character2: Character
): BattleState {
    return {
        player1: {
            character: character1,
            hp: character1.maxHp,
            cursedEnergy: character1.maxCursedEnergy,
        },

        player2: {
            character: character2,
            hp: character2.maxHp,
            cursedEnergy: character2.maxCursedEnergy,
        },

        currentTurn: "player1",
        status: "playing",
        winner: null,
    };
}

export type TurnOutcome = {
    state: BattleState;
    result: CombatResult;
};

function resting(fighter: FighterState): FighterState {
    return {
        ...fighter,
        cursedEnergy: Math.min(
            fighter.character.maxCursedEnergy,
            fighter.cursedEnergy + CE_REGEN_PER_TURN
        ),
    };
}

export function executeTurn(
    battle: BattleState,
    moveId: string
): TurnOutcome {
    if (battle.status === "finished") {
        return {
            state: battle,
            result: { type: "miss", message: "The battle has already ended!" },
        };
    }

    const isP1Turn = battle.currentTurn === "player1";

    const attacker: FighterState = { ...(isP1Turn ? battle.player1 : battle.player2) };
    const defender: FighterState = { ...(isP1Turn ? battle.player2 : battle.player1) };

    const move = attacker.character.moves.find((m) => m.id === moveId);

    if (!move) {
        return {
            state: battle,
            result: { type: "miss", message: "Invalid move!" },
        };
    }

    if (attacker.cursedEnergy < move.cursedEnergy) {
        return {
            state: battle,
            result: { type: "miss", message: "NOT ENOUGH CURSED ENERGY!" },
        };
    }

    const result = performMove(attacker, defender, move);

    if (defender.hp <= 0) {
        return {
            state: {
                ...battle,
                player1: isP1Turn ? attacker : defender,
                player2: isP1Turn ? defender : attacker,
                status: "finished",
                winner: battle.currentTurn,
            },
            result,
        };
    }

    const nextFighter = resting(defender);

    return {
        state: {
            ...battle,
            player1: isP1Turn ? attacker : nextFighter,
            player2: isP1Turn ? nextFighter : attacker,
            currentTurn: isP1Turn ? "player2" : "player1",
        },
        result,
    };
}