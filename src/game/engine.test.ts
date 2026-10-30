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
        expect(sukuna.hp).toBe(90);
        expect(gojo.cursedEnergy).toBe(80);
    });

    it("King of Curses boosts damage when Sukuna is below half HP", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const sukuna = makeFighter("sukuna");
        const gojo = makeFighter("gojo");
        sukuna.hp = 50;
        const cleave = sukuna.character.moves.find((m) => m.id === "cleave")!;

        performMove(sukuna, gojo, cleave);

        expect(gojo.hp).toBe(95);
    });

    it("Black Flash deals 1.5x damage and refunds cursed energy", () => {
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0.1)
            .mockReturnValueOnce(0.99)
            .mockReturnValueOnce(0.05);
        const yuji = makeFighter("yuji");
        const sukuna = makeFighter("sukuna");
        yuji.cursedEnergy = 50;
        const punch = yuji.character.moves.find((m) => m.id === "punch")!;

        performMove(yuji, sukuna, punch);

        expect(sukuna.hp).toBe(90);
        expect(yuji.cursedEnergy).toBe(55);
    });
});