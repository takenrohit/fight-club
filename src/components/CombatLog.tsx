"use client";

import { useEffect, useRef } from "react";

export default function CombatLog({ logs }: { logs: string[] }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="mt-4 max-h-40 space-y-2 overflow-y-auto border-t border-white/10 pt-4">
            {logs.map((message, index) => (
                <p key={`${index}-${message}`} className="text-sm text-gray-400">
                    {message}
                </p>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}