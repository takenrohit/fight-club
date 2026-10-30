import type { Passive } from "@/game/types";

type StatBarProps = {
    label: string;
    value: number;
    max: number;
    barColor: string;
    alignRight?: boolean;
};

function StatBar({ label, value, max, barColor, alignRight }: StatBarProps) {
    const percent = Math.max(0, (value / max) * 100);

    return (
        <div className="mt-3">
            <div className={`flex items-center justify-between gap-2 ${alignRight ? "flex-row-reverse" : ""}`}>
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-sm text-gray-300">{value} / {max}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                    className={`h-full transition-all ${barColor}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

type FighterPanelProps = {
    name: string;
    hp: number;
    maxHp: number;
    cursedEnergy: number;
    maxCursedEnergy: number;
    borderColor: string;
    passive?: Passive;
    alignRight?: boolean;
};

export default function FighterPanel({
    name, hp, maxHp, cursedEnergy, maxCursedEnergy, borderColor, passive, alignRight = false,
}: FighterPanelProps) {
    return (
        <div className={`border ${borderColor} bg-white/[0.03] p-4`}>
            <p className={`font-display text-sm tracking-widest text-white ${alignRight ? "text-right" : ""}`}>
                {name}
            </p>

            {passive && (
                <div className={`mt-2 rounded-md bg-white/5 px-3 py-2 ${alignRight ? "text-right" : ""}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                        Passive · {passive.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{passive.description}</p>
                </div>
            )}
            <StatBar label="HP" value={hp} max={maxHp} barColor="bg-red-600" alignRight={alignRight} />
            <StatBar label="Cursed Energy" value={cursedEnergy} max={maxCursedEnergy} barColor="bg-white" alignRight={alignRight} />
        </div>
    );
}