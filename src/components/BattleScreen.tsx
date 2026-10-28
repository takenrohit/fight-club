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
    const winner = battle.winner ? battle[battle.winner] : null;

    return (
        <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-8">
            <header className="mx-auto mb-8 max-w-6xl">
                <h1 className="font-display -skew-x-12 text-4xl tracking-wider [text-shadow:0_0_24px_rgba(255,255,255,0.5)] sm:text-5xl">
                    FIGHT <span className="text-red-600">CLUB</span>
                </h1>
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
                        borderColor="border-white/50"
                    />
                    <FighterPanel
                        name={player2.character.name}
                        hp={player2.hp}
                        maxHp={player2.character.maxHp}
                        cursedEnergy={player2.cursedEnergy}
                        maxCursedEnergy={player2.character.maxCursedEnergy}
                        passive={player2.character.passive}
                        borderColor="border-red-600/70"
                        alignRight
                    />
                </div>

                <div className="overflow-hidden border-2 border border-white/40">
                    <Arena
                        player1Id={player1.character.id}
                        player2Id={player2.character.id}
                    />
                </div>

                <section className="mt-6 border border-white/40 bg-white/[0.03] p-5">
                    <h2 className="font-display -skew-x-12 text-xl tracking-wider">
                        Combat Controls
                    </h2>

                    {battle.status === "playing" && (
                        <>
                            <p className="mt-2 text-sm text-gray-400">
                                Current Turn:{" "}
                                <span className="font-semibold text-white">
                                    {activeFighter.character.name}
                                </span>
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
                        <p className="mt-4 border-l-2 border-red-600 bg-black/40 p-3 text-sm text-gray-200">
                            {lastResult.message}
                        </p>
                    )}

                    <CombatLog logs={logs} />
                </section>
            </section>

            {/* VICTORY WINDOW */}

            {battle.status === "finished" && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md border-2 border-white bg-black px-8 py-10 text-center shadow-[0_0_40px_rgba(255,255,255,0.25)]">
                        <p className="font-display -skew-x-12 text-sm tracking-[0.4em] text-red-600">
                            K.O.
                        </p>
                        <h2 className="font-display mt-3 -skew-x-12 text-4xl [text-shadow:0_0_20px_rgba(255,255,255,0.6)] sm:text-5xl">
                            {winner.character.name.toUpperCase()}
                        </h2>
                        <p className="font-display mt-2 -skew-x-12 text-2xl tracking-widest">
                            WINS!
                        </p>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={rematch}
                                className="font-display -skew-x-12 bg-white px-8 py-3 text-2xl tracking-widest text-black transition hover:bg-red-600 hover:text-white"
                            >
                                RESTART
                            </button>
                            <Link
                                href="/select"
                                className="font-display -skew-x-12 border border-white/60 px-8 py-2 text-lg tracking-widest transition hover:bg-white/10"
                            >
                                CHANGE FIGHTERS
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}