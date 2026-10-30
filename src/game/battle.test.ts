import { describe, it, expect, vi, afterEach } from "vitest";
import { createBattle, executeTurn } from "./battle";
import { characters } from "./characters";

const get = (id: string) => characters.find((c) => c.id === id)!;

afterEach(() => {
    vi.restoreAllMocks();
});

describe("executeTurn", () => {
    it("does not mutate the input state", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const battle = createBattle(get("gojo"), get("sukuna"));
        const snapshot = structuredClone(battle);

        executeTurn(battle, "blue");

        expect(battle).toEqual(snapshot);
    });

    it("returns a new state with damage done and the turn switched", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const battle = createBattle(get("gojo"), get("sukuna"));

        const { state, result } = executeTurn(battle, "blue");

        expect(result.type).toBe("hit");
        expect(state).not.toBe(battle);
        expect(state.player2.hp).toBe(100);
        expect(state.player1.cursedEnergy).toBe(90);
        expect(state.currentTurn).toBe("player2");
        expect(battle.player2.hp).toBe(120);
    });

    it("keeps the same state when the move requires more CE than available", () => {
        const battle = createBattle(get("gojo"), get("sukuna"));
        battle.player1.cursedEnergy = 0;

        const { state, result } = executeTurn(battle, "blue");

        expect(state).toBe(battle);
        expect(result.message).toMatch(/not enough cursed energy/i);
        expect(state.currentTurn).toBe("player1");
    });

    it("finishes the battle and sets the winner after a killing blow", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const battle = createBattle(get("gojo"), get("sukuna"));
        battle.player2.hp = 10;

        const { state } = executeTurn(battle, "blue");

        expect(state.status).toBe("finished");
        expect(state.winner).toBe("player1");
        expect(state.player2.hp).toBe(0);
    });
});