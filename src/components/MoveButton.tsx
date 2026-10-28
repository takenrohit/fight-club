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
            className="group border border-white/40 bg-transparent px-4 py-3 text-left transition hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
        >
            <span className="block font-semibold">{move.name}</span>
            <span className="mt-1 block text-xs text-gray-400 group-hover:text-black/70">
                {move.type === "heal" ? `Heal ${move.heal ?? 0}` : `Damage ${move.damage ?? 0}`}
                {" · "}CE {move.cursedEnergy}
            </span>
        </button>
    );
}