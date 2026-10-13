import type { Character, FighterState, CombatResult, Move } from "./types";
import { performMove } from "./engine";

export type PlayerId = "player1" | "player2";

export type BattleState = {
    player1: FighterState;
    player2: FighterState;
    currentTurn: PlayerId;
    status: "playing" | "finished";
    winner: PlayerId | null;
};

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

export function executeTurn(
    battle: BattleState,
    moveId: string
): CombatResult {
    if (battle.status === "finished") {
        return {
            type: "miss",
            message: "The battle has already ended!",
        };
    }

    const attacker = battle.currentTurn === "player1"
        ? battle.player1
        : battle.player2;

    const defender = battle.currentTurn === "player1"
        ? battle.player2
        : battle.player1;

    const move = attacker.character.moves.find(
        (move) => move.id === moveId
    );

    if (!move) {
        return {
            type: "miss",
            message: "Invalid move!",
        };

    }

    if (attacker.cursedEnergy < move.cursedEnergy) {
        return {
            type: "miss",
            message: "NOT ENOUGH CURSED ENERGY!",
        };
    }

    const result = performMove(attacker, defender, move);

    if (defender.hp <= 0) {
        battle.status = "finished";
        battle.winner = battle.currentTurn;
        return result;
    }

    battle.currentTurn =
        battle.currentTurn === "player1"
            ? "player2"
            : "player1";

    return result;

}