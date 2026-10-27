"use client";

import Link from "next/link";
import { useState } from "react";
import FighterPanel from "@/components/FighterPanel";
import MoveButton from "@/components/MoveButton";
import CombatLog from "@/components/CombatLog";
import Arena from "@/components/Arena";
import { characters } from "@/game/characters";
import { createBattle, executeTurn, type BattleState } from "@/game/battle";
import type { CombatResult } from "@/game/types";

type BattleScreenProps = {
    player1Id: string;
    player2Id: string;
};

export default function BattleScreen({ player1Id, player2Id }: BattleScreenProps) {
    const player1Character = characters.find((c) => c.id === player1Id)!;
    const player2Character = characters.find((c) => c.id === player2Id)!;

    const [battle, setBattle] = useState<BattleState>(() =>
        createBattle(player1Character, player2Character)
    );
    const [lastResult, setLastResult] = useState<CombatResult | null>(null);
    const [logs, setLogs] = useState<string[]>(["Battle started!"]);

    function rematch() {
        setBattle(createBattle(player1Character, player2Character));
        setLastResult(null);
        setLogs(["Battle started!"]);
    }

    function handleMove(moveId: string) {
        if (battle.status === "finished") return;

        const result = executeTurn(battle, moveId);

        setBattle({ ...battle });
        setLastResult(result);
        setLogs((previous) => [...previous, result.message]);
    }

    const player1 = battle.player1;
    const player2 = battle.player2;
    const activeFighter = battle[battle.currentTurn];

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
                        passive={player2.character.passive}
                        borderColor="border-red-500/40"
                        alignRight
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10">
                    <Arena
                        player1Id={player1.character.id}
                        player2Id={player2.character.id}
                    />
                </div>

                <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="text-lg font-bold">Combat Controls</h2>

                    {battle.status === "finished" ? (
                        <>
                            <p className="mt-3 font-semibold text-amber-300">
                                Winner:{" "}
                                {battle.winner === "player1"
                                    ? battle.player1.character.name
                                    : battle.player2.character.name}
                            </p>
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={rematch}
                                    className="rounded-md bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
                                >
                                    Rematch
                                </button>
                                <Link
                                    href="/select"
                                    className="rounded-md border border-white/20 px-4 py-2 font-bold hover:bg-white/10"
                                >
                                    Change fighters
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-gray-400">
                                Current turn: {activeFighter.character.name}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {activeFighter.character.moves.map((move) => (
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
            </section>
        </main>
    );
}