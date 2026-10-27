"use client";

import FighterPanel from "@/components/FighterPanel";
import MoveButton from "@/components/MoveButton";
import CombatLog from "@/components/CombatLog";
import { useState } from "react";
import { characters } from "@/game/characters";
import {
    createBattle,
    executeTurn,
    type BattleState,
    type PlayerId,
} from "@/game/battle";
import type { CombatResult } from "@/game/types";
import Arena from "@/components/Arena";

export default function Home() {
    const [character1Id, setCharacter1Id] = useState(characters[0].id);
    const [character2Id, setCharacter2Id] = useState(characters[1].id);
    const [battle, setBattle] = useState<BattleState | null>(null);
    const [lastResult, setLastResult] = useState<CombatResult | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const player1Character = characters.find(
        (character) => character.id === character1Id
    )!;
    const player2Character = characters.find(
        (character) => character.id === character2Id
    )!;

    function startBattle() {
        if (character1Id === character2Id) return;

        setBattle(createBattle(player1Character, player2Character));
        setLastResult(null);
        setLogs(["Battle started!"]);
    }

    function handleMove(moveId: string) {
        if (!battle || battle.status === "finished") return;

        const result = executeTurn(battle, moveId);

        setBattle({ ...battle });
        setLastResult(result);
        setLogs((previous) => [...previous, result.message]);
    }

    function getFighter(playerId: PlayerId) {
        return battle?.[playerId] ??
            (playerId === "player1"
                ? {
                    character: player1Character,
                    hp: player1Character.maxHp,
                    cursedEnergy: player1Character.maxCursedEnergy,
                }
                : {
                    character: player2Character,
                    hp: player2Character.maxHp,
                    cursedEnergy: player2Character.maxCursedEnergy,
                });
    }

    const player1 = getFighter("player1");
    const player2 = getFighter("player2");
    const activeFighter = battle
        ? battle[battle.currentTurn]
        : null;



    return (
        <main className="min-h-screen bg-[#080810] px-4 py-8 text-white sm:px-8">
            <header className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
                        Jujutsu Combat
                    </p>
                    <h1 className="mt-2 text-4xl font-black tracking-wider sm:text-5xl">
                        FIGHT <span className="text-red-600">CLUB</span>
                    </h1>
                </div>
                <span className="rounded-md border border-red-900/70 px-4 py-2 text-xs font-bold tracking-widest text-red-400">
                    PROTOTYPE
                </span>
            </header>

            <section className="mx-auto max-w-6xl">
                <div className="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm text-gray-300">
                        Player 1
                        <select
                            value={character1Id}
                            onChange={(event) => {
                                setCharacter1Id(event.target.value);
                                setBattle(null);
                            }}
                            className="rounded-md border border-white/10 bg-[#151522] p-3 text-white"
                        >
                            {characters.map((character) => (
                                <option key={character.id} value={character.id}>
                                    {character.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-gray-300">
                        Player 2
                        <select
                            value={character2Id}
                            onChange={(event) => {
                                setCharacter2Id(event.target.value);
                                setBattle(null);
                            }}
                            className="rounded-md border border-white/10 bg-[#151522] p-3 text-white"
                        >
                            {characters.map((character) => (
                                <option key={character.id} value={character.id}>
                                    {character.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        onClick={startBattle}
                        disabled={character1Id === character2Id}
                        className="rounded-md bg-red-600 px-5 py-3 font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2"
                    >
                        Start Battle
                    </button>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FighterPanel
                        name={player1.character.name}
                        hp={player1.hp}
                        maxHp={player1.character.maxHp}
                        cursedEnergy={player1.cursedEnergy}
                        maxCursedEnergy={player1.character.maxCursedEnergy}
                        passive={player1.character.passive}
                        borderColor="border-indigo-500/40"
                    />
                    <FighterPanel
                        name={player2.character.name}
                        hp={player2.hp}
                        maxHp={player2.character.maxHp}
                        cursedEnergy={player2.cursedEnergy}
                        maxCursedEnergy={player2.character.maxCursedEnergy}
                        borderColor="border-red-500/40"
                        passive={player2.character.passive}
                        alignRight
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10">
                    <Arena
                        player1Id={player1.character.id}
                        player2Id={player2.character.id} />
                </div>

                {battle && (
                    <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <h2 className="text-lg font-bold">Combat Controls</h2>

                        {battle.status === "finished" ? (
                            <p className="mt-3 font-semibold text-amber-300">
                                Winner: {battle.winner === "player1"
                                    ? battle.player1.character.name
                                    : battle.player2.character.name}
                            </p>
                        ) : (
                            <>
                                <p className="mt-2 text-sm text-gray-400">
                                    Current turn: {activeFighter?.character.name}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {activeFighter?.character.moves.map((move) => (
                                        <MoveButton
                                            key={move.id}
                                            move={move}
                                            disabled={activeFighter.cursedEnergy < move.cursedEnergy}
                                            onClick={() => handleMove(move.id)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {lastResult && (
                            <p className="mt-4 rounded-md bg-black/30 p-3 text-sm text-gray-200">
                                {lastResult.message}
                            </p>
                        )}

                        <CombatLog logs={logs} />
                    </section>
                )}
            </section>
        </main>
    );
}
