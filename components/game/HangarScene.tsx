"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { PartId } from "@/lib/game/types";
import { ShipMesh } from "./ShipMesh";

export default function HangarScene({ parts, spin = false }: { parts: PartId[]; spin?: boolean }) {
  return (
    <Canvas camera={{ position: [3.4, 2.1, 4.4], fov: 42 }}>
      <color attach="background" args={["#14120e"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 2]} intensity={1.7} />
      <ShipMesh parts={parts} spin={spin} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#1c1914" />
      </mesh>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} autoRotate={spin} autoRotateSpeed={0.6} />
    </Canvas>
  );
}
