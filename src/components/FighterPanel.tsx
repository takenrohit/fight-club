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
    alignRight?: boolean;
};

export default function FighterPanel({
    name, hp, maxHp, cursedEnergy, maxCursedEnergy, borderColor, alignRight = false,
}: FighterPanelProps) {
    return (
        <div className={`rounded-lg border ${borderColor} bg-white/[0.03] p-4`}>
            <p className={`text-xs font-bold tracking-widest text-gray-400 ${alignRight ? "text-right" : ""}`}>
                {name}
            </p>
            <StatBar label="HP" value={hp} max={maxHp} barColor="bg-red-500" alignRight={alignRight} />
            <StatBar label="Cursed Energy" value={cursedEnergy} max={maxCursedEnergy} barColor="bg-indigo-500" alignRight={alignRight} />
        </div>
    );
}