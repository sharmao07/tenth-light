"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { PartId } from "@/lib/game/types";

export function ShipMesh({ parts, spin = false }: { parts: PartId[]; spin?: boolean }) {
  const ref = useRef<Group>(null);
  const tanks = parts.filter((part) => part === "tank").length;
  const nose = -0.15 + tanks * 0.46;

  useFrame((_, delta) => {
    if (spin && ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={ref}>
      {parts.includes("engine") && (
        <mesh position={[0, 0, -1.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.46, 0.68, 20]} />
          <meshStandardMaterial color="#c4452d" />
        </mesh>
      )}
      {Array.from({ length: tanks }, (_, index) => (
        <mesh key={index} position={[0, 0, -0.72 + index * 0.46]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.38, 20]} />
          <meshStandardMaterial color="#8a8175" />
        </mesh>
      ))}
      {parts.includes("command") && (
        <mesh position={[0, 0.06, nose]}>
          <sphereGeometry args={[0.42, 28, 18]} />
          <meshStandardMaterial color="#e6dfd0" />
        </mesh>
      )}
      {parts.includes("antenna") && (
        <group position={[0, 0.55, nose]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
            <meshStandardMaterial color="#efe6d6" />
          </mesh>
          <mesh position={[0, 0.32, 0]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#e39b12" />
          </mesh>
        </group>
      )}
      {parts.includes("solar") && (
        <group position={[0, 0, -0.35]}>
          <mesh position={[-1.15, 0, 0]}>
            <boxGeometry args={[1.5, 0.035, 0.46]} />
            <meshStandardMaterial color="#245066" />
          </mesh>
          <mesh position={[1.15, 0, 0]}>
            <boxGeometry args={[1.5, 0.035, 0.46]} />
            <meshStandardMaterial color="#245066" />
          </mesh>
        </group>
      )}
      {parts.includes("rtg") && (
        <mesh position={[0.58, -0.12, -1.05]}>
          <boxGeometry args={[0.26, 0.32, 0.4]} />
          <meshStandardMaterial color="#e39b12" />
        </mesh>
      )}
      {parts.includes("spectrometer") && (
        <mesh position={[-0.38, 0.32, nose - 0.05]}>
          <boxGeometry args={[0.18, 0.16, 0.28]} />
          <meshStandardMaterial color="#e39b12" />
        </mesh>
      )}
      {parts.includes("drill") && (
        <mesh position={[0.34, -0.22, nose + 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
          <meshStandardMaterial color="#f3eee4" />
        </mesh>
      )}
      {parts.includes("imager") && (
        <mesh position={[0.22, 0.42, nose + 0.18]}>
          <boxGeometry args={[0.12, 0.1, 0.16]} />
          <meshStandardMaterial color="#d9d2c5" />
        </mesh>
      )}
    </group>
  );
}

export function useStarfield() {
  return useMemo(
    () =>
      Array.from({ length: 70 }, (_, index) => ({
        x: ((index * 47) % 40) - 20,
        y: ((index * 19) % 18) - 8,
        z: -(((index * 13) % 48) + 6),
      })),
    [],
  );
}
