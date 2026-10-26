import type { Move } from "@/game/types";

type MoveButtonProps = {
    move: Move;
    disabled: boolean;
    onClick: () => void;
};

export default function MoveButton({ move, disabled, onClick }: MoveButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-left transition hover:border-red-500 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
            <span className="block font-semibold">{move.name}</span>
            <span className="mt-1 block text-xs text-gray-400">
                {move.type === "heal" ? `Heal ${move.heal ?? 0}` : `Damage ${move.damage ?? 0}`}
                {" · "}CE {move.cursedEnergy}
            </span>
        </button>
    );
}