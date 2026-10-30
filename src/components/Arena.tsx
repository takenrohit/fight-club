"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";

type ArenaProps = {
    player1Id: string;
    player2Id: string;
};

function CharacterModel({
    id,
    position,
}: {
    id: string;
    position: [number, number, number];
}) {
    const modelSettings: Record<
        string,
        { path: string; scale: number; rotationOffset: number; y: number }
    > = {
        gojo: {
            path: "/models/gojo.glb",
            scale: 1,
            rotationOffset: 0,
            y: 0,
        },
        sukuna: {
            path: "/models/sukuna.glb",
            scale: 0.25,
            rotationOffset: 0,
            y: 0,
        },
        yuji: {
            path: "/models/yuji.glb",
            scale: 0.78,
            rotationOffset: 0,
            y: 1,
        },
    };

    const settings = modelSettings[id] ?? modelSettings.gojo;
    const { scene } = useGLTF(settings.path);

    // Left fighter faces right; right fighter faces left.
    const facingRotation =
        (position[0] < 0 ? Math.PI / 2 : -Math.PI / 2) +
        settings.rotationOffset;

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={settings.scale}
                position={[0, settings.y, 0]}
                rotation={[0, facingRotation, 0]}
            />
        </group>
    );
}


export default function Arena({ player1Id, player2Id }: ArenaProps) {

    return (
        <div className="h-[500px] w-full overflow-hidden rounded-xl bg-slate-950">
            <Canvas camera={{ position: [0, 4, 9], fov: 45 }} shadows>
                <ambientLight intensity={1.2} />
                <directionalLight
                    intensity={2}
                    position={[4, 8, 5]}
                    castShadow
                />

                <pointLight position={[-4, 3, -2]} color="#6366f1" intensity={25} />

                {/* Floor */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                    receiveShadow
                >
                    <circleGeometry args={[6, 64]} />
                    <meshStandardMaterial color="#25283b" />
                </mesh>

                {/* Arena center */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                >
                    <ringGeometry args={[2.7, 2.8, 64]} />
                    <meshStandardMaterial
                        color="#818cf8"
                        emissive="#4f46e5"
                        emissiveIntensity={1.5}
                    />
                </mesh>

                {/* Spotlight */}
                <spotLight
                    position={[0, 3.5, 0]}
                    angle={0.35}
                    penumbra={0.6}
                    intensity={20}
                    castShadow
                />

                <Suspense fallback={null}>
                    <CharacterModel id={player1Id} position={[-2, 0, 0]} />
                    <CharacterModel id={player2Id} position={[2, 0, 0]} />
                </Suspense>

                <ContactShadows
                    position={[0, 0, 0]}
                    opacity={0.45}
                    scale={12}
                    blur={2}
                />

                <OrbitControls
                    target={[0, 1, 0]}
                    enablePan={false}
                    minDistance={6}
                    maxDistance={12}
                />
            </Canvas>
        </div>
    );
}