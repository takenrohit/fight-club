import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
            <Image
                src="/images/home-bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 flex flex-col items-center gap-10 text-center">
                <h1 className="font-display text-6xl tracking-wider [text-shadow:0_0_24px_rgba(255,255,255,0.5)] sm:text-8xl">
                    FIGHT <span className="text-red-600">CLUB</span>
                </h1>
                <Link
                    href="/select"
                    className="font-display border-2 border-white px-10 py-4 text-2xl tracking-widest transition hover:bg-white hover:text-black"
                >
                    PLAY GAME
                </Link>
            </div>
        </main>
    );
}