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
    <Canvas camera={{ position: [0, 1.4, 6.2], fov: 48 }}>
      <color attach="background" args={["#14120e"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      {stars.map((star, index) => (
        <mesh key={index} position={[star.x, star.y, star.z]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#e6dfd0" />
        </mesh>
      ))}
      <ShipMesh parts={parts} />
      <Rock approaching={approaching} />
    </Canvas>
  );
}
