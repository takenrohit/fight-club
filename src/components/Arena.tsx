"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";

function Fighter({
    position,
    color,
}: {
    position: [number, number, number];
    color: string;
}) {
    return (
        <group position={position}>
            {/* Body */}
            <mesh position={[0, 1, 0]}>
                <capsuleGeometry args={[0.35, 1, 8, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.9, 0]}>
                <sphereGeometry args={[0.28, 24, 24]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.48, 1.15, 0]} rotation={[0, 0, 0.25]}>
                <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
                <meshStandardMaterial color={color} />
            </mesh>

            <mesh position={[0.48, 1.15, 0]} rotation={[0, 0, -0.25]}>
                <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.18, 0.25, 0]}>
                <capsuleGeometry args={[0.14, 0.5, 6, 12]} />
                <meshStandardMaterial color={color} />
            </mesh>

            <mesh position={[0.18, 0.25, 0]}>
                <capsuleGeometry args={[0.14, 0.5, 6, 12]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
}

export default function Arena() {
    return (
        <div className="h=[500px] w-full overflow-hidden rounded-x1 bg-slate-950">
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

                <Fighter position={[-2, 0, 0]} color="#e5e7eb" />
                <Fighter position={[2, 0, 0]} color="#991b1b" />

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