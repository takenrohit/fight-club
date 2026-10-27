import { redirect } from "next/navigation";
import { characters } from "@/game/characters";
import BattleScreen from "@/components/BattleScreen";

export default async function BattlePage({
    searchParams,
}: {
    searchParams: Promise<{ p1?: string; p2?: string }>;
}) {
    const { p1, p2 } = await searchParams;
    const isValid = (id: string) => characters.some((c) => c.id === id);

    if (!p1 || !p2 || p1 === p2 || !isValid(p1) || !isValid(p2)) {
        redirect("/select");
    }

    return <BattleScreen player1Id={p1} player2Id={p2} />;
}