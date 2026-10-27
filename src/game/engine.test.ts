import { describe, it, expect, vi, afterEach } from "vitest";
import { performMove } from "./engine";
import { characters } from "./characters";
import type { FighterState } from "./types";

function makeFighter(id: string): FighterState {
    const character = characters.find((c) => c.id === id)!;
    return {
        character,
        hp: character.maxHp,
        cursedEnergy: character.maxCursedEnergy,
    };
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("performMove", () => {
    it("deals damage and spends cursed energy on a hit", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const gojo = makeFighter("gojo");
        const sukuna = makeFighter("sukuna");
        const purple = gojo.character.moves.find((m) => m.id === "hollow_purple")!;

        const result = performMove(gojo, sukuna, purple);

        expect(result.type).toBe("hit");
        expect(sukuna.hp).toBe(70);
        expect(gojo.cursedEnergy).toBe(80);
    });

    it("refuses a move when cursed energy is too low", () => {
        const gojo = makeFighter("gojo");
        const sukuna = makeFighter("sukuna");
        gojo.cursedEnergy = 5;
        const purple = gojo.character.moves.find((m) => m.id === "hollow_purple")!;

        const result = performMove(gojo, sukuna, purple);

        expect(result.type).toBe("miss");
        expect(sukuna.hp).toBe(120);
    });
});