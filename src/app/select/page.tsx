"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerColumn, { type SelectSlot } from "@/components/PlayerColumn";

const EMPTY: SelectSlot = { picked: null, ready: false };

export default function SelectPage() {
    const router = useRouter();
    const [p1, setP1] = useState<SelectSlot>(EMPTY);
    const [p2, setP2] = useState<SelectSlot>(EMPTY);

    const sameFighter = p1.picked !== null && p1.picked === p2.picked;
    const bothReady = p1.ready && p2.ready;

    useEffect(() => {
        if (!bothReady || !p1.picked || !p2.picked) return;

        const timer = setTimeout(() => {
            router.push(`/battle?p1=${p1.picked}&p2=${p2.picked}`);
        }, 1200);

        return () => clearTimeout(timer); // cancels if someone un-readies
    }, [bothReady, p1.picked, p2.picked, router]);

    return (
        <main className="flex min-h-screen flex-col items-center bg-black px-4 py-8 text-white">
            <h1 className="font-display text-4xl [text-shadow:0_0_20px_rgba(255,255,255,0.6)] sm:text-6xl">
                SELECT YOUR FIGHTER
            </h1>

            <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr]">
                <PlayerColumn
                    title="PLAYER 1"
                    badge="1UP"
                    slot={p1}
                    blocked={sameFighter}
                    onPick={(id) => setP1({ picked: id, ready: false })}
                    onToggleReady={() => setP1((s) => ({ ...s, ready: !s.ready }))}
                />
                <div className="hidden w-px bg-white/70 md:block" />
                <PlayerColumn
                    title="PLAYER 2"
                    badge="2UP"
                    slot={p2}
                    blocked={sameFighter}
                    onPick={(id) => setP2({ picked: id, ready: false })}
                    onToggleReady={() => setP2((s) => ({ ...s, ready: !s.ready }))}
                />
            </div>

            <p className="font-display mt-8 h-8 text-xl tracking-widest">
                {bothReady ? "FIGHT!" : sameFighter ? "PICK TWO DIFFERENT FIGHTERS" : ""}
            </p>
        </main>
    );
}