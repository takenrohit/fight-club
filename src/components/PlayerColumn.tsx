import Image from "next/image";
import { characters } from "@/game/characters";

export type SelectSlot = { picked: string | null; ready: boolean };

type PlayerColumnProps = {
    title: string;
    badge: string;
    slot: SelectSlot;
    blocked: boolean;
    onPick: (id: string) => void;
    onToggleReady: () => void;
};

export default function PlayerColumn({
    title, badge, slot, blocked, onPick, onToggleReady,
}: PlayerColumnProps) {
    return (
        <div className="flex flex-col items-center">
            <h2 className="font-display -skew-x-12 text-2xl tracking-wider sm:text-3xl">
                {title}
            </h2>

            <div className="mt-4 grid w-full grid-cols-3 gap-3">
                {characters.map((c) => {
                    const selected = slot.picked === c.id;
                    return (
                        <button
                            key={c.id}
                            onClick={() => onPick(c.id)}
                            disabled={slot.ready}
                            className="group flex flex-col items-center gap-2 disabled:cursor-default"
                        >
                            <span className="font-display -skew-x-12 text-sm sm:text-lg">
                                {c.id.toUpperCase()}
                            </span>
                            <span
                                className={`relative block aspect-[1/2] w-full overflow-hidden border-2 transition duration-200 ${selected
                                        ? "scale-105 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                                        : "border-white/40 opacity-70 group-hover:scale-[1.03] group-hover:border-white group-hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={`/portraits/${c.id}.png`}
                                    alt={c.name}
                                    fill
                                    sizes="(min-width: 768px) 15vw, 30vw"
                                    className="object-cover"
                                />
                                {selected && (
                                    <span className="absolute right-1 top-1 bg-black/70 px-1.5 text-xs font-black italic">
                                        {badge}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onToggleReady}
                disabled={!slot.picked || (blocked && !slot.ready)}
                className={`font-display mt-6 -skew-x-12 px-8 py-3 text-3xl transition disabled:opacity-30 ${slot.ready ? "bg-white text-black" : "border border-white/60 hover:bg-white/10"
                    }`}
            >
                {slot.ready ? "READY!" : "READY?"}
            </button>
        </div>
    );
}