"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import type { PartId } from "@/lib/game/types";
import { ShipMesh, useStarfield } from "./ShipMesh";

function Rock({ approaching }: { approaching: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = approaching ? -2.4 : -16;
    ref.current.position.z += (target - ref.current.position.z) * Math.min(1, delta * 1.6);
    ref.current.rotation.x += delta * 0.4;
    ref.current.rotation.y += delta * 0.25;
  });
  return (
    <mesh ref={ref} position={[1.6, 0.4, -16]}>
      <icosahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#8a8175" flatShading />
    </mesh>
  );
}

export default function TransitScene({
  parts,
  approaching,
}: {
  parts: PartId[];
  approaching: boolean;
}) {
  const stars = useStarfield();
  return (
    <Canvas camera={{ position: [2.4, 1.8, 7.4], fov: 42 }}>
      <color attach="background" args={["#0c0b09"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      {stars.map((star, index) => (
        <mesh key={index} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[index % 5 === 0 ? 0.09 : 0.045, 6, 6]} />
          <meshStandardMaterial color={index % 7 === 0 ? "#e39b12" : "#efe6d6"} />
        </mesh>
      ))}
      <group position={[2.6, -0.2, 0]} scale={1.35}>
        <ShipMesh parts={parts} />
      </group>
      <Rock approaching={approaching} />
    </Canvas>
  );
}
