"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { PartId } from "@/lib/game/types";

const ENGINE_H = 0.72;
const TANK_H = 0.58;
const POD_H = 0.78;

export function stackHeight(tanks: number): number {
  return ENGINE_H + tanks * TANK_H + POD_H + 0.35;
}

/** Vertical stack, engine at the pad, pod at the top. Same idea as a vehicle assembly building. */
export function ShipMesh({ parts, spin = false }: { parts: PartId[]; spin?: boolean }) {
  const ref = useRef<Group>(null);
  const tanks = parts.filter((part) => part === "tank").length;
  const height = stackHeight(tanks);
  const base = -height / 2;
  const engineY = base + ENGINE_H / 2;
  const tankYs = Array.from({ length: tanks }, (_tank, index) => base + ENGINE_H + index * TANK_H + TANK_H / 2);
  const podY = base + ENGINE_H + tanks * TANK_H + POD_H / 2;
  const antennaY = base + ENGINE_H + tanks * TANK_H + POD_H + 0.15;

  useFrame((_, delta) => {
    if (spin && ref.current) ref.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, base + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 24]} />
        <meshStandardMaterial color="#e39b12" />
      </mesh>
      {parts.includes("engine") && (
        <group position={[0, engineY, 0]}>
          <mesh>
            <cylinderGeometry args={[0.28, 0.5, ENGINE_H, 20]} />
            <meshStandardMaterial color="#c4452d" />
          </mesh>
          <mesh position={[0, -ENGINE_H * 0.28, 0]}>
            <cylinderGeometry args={[0.12, 0.22, ENGINE_H * 0.42, 16]} />
            <meshStandardMaterial color="#1a1714" />
          </mesh>
        </group>
      )}
      {tankYs.map((tankY, index) => (
        <group key={index} position={[0, tankY, 0]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, TANK_H - 0.06, 20]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#8a8175" : "#6e675e"} />
          </mesh>
          <mesh position={[0, TANK_H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.025, 6, 16]} />
            <meshStandardMaterial color="#e39b12" />
          </mesh>
        </group>
      ))}
      {parts.includes("command") && (
        <group position={[0, podY, 0]}>
          <mesh>
            <capsuleGeometry args={[0.34, 0.28, 6, 16]} />
            <meshStandardMaterial color="#efe6d6" />
          </mesh>
          <mesh position={[0, 0.02, 0.28]}>
            <boxGeometry args={[0.28, 0.12, 0.06]} />
            <meshStandardMaterial color="#1a1714" />
          </mesh>
        </group>
      )}
      {parts.includes("antenna") && (
        <group position={[0, antennaY, 0]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
            <meshStandardMaterial color="#efe6d6" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.22, 0.05, 0.06, 16]} />
            <meshStandardMaterial color="#e39b12" />
          </mesh>
        </group>
      )}
      {parts.includes("solar") && (
        <group position={[0, engineY + ENGINE_H / 2 + TANK_H * Math.max(tanks, 1) * 0.45, 0]}>
          <mesh position={[-1.15, 0, 0]}>
            <boxGeometry args={[1.4, 0.04, 0.42]} />
            <meshStandardMaterial color="#245066" />
          </mesh>
          <mesh position={[1.15, 0, 0]}>
            <boxGeometry args={[1.4, 0.04, 0.42]} />
            <meshStandardMaterial color="#245066" />
          </mesh>
        </group>
      )}
      {parts.includes("rtg") && (
        <group position={[0.62, podY - 0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.22, 0.36, 0.22]} />
            <meshStandardMaterial color="#e39b12" />
          </mesh>
          <mesh position={[0.14, 0, 0]}>
            <boxGeometry args={[0.04, 0.28, 0.16]} />
            <meshStandardMaterial color="#1a1714" />
          </mesh>
        </group>
      )}
      {parts.includes("spectrometer") && (
        <group position={[-0.58, podY, 0.1]}>
          <mesh>
            <boxGeometry args={[0.2, 0.2, 0.28]} />
            <meshStandardMaterial color="#c4452d" />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <boxGeometry args={[0.08, 0.08, 0.04]} />
            <meshStandardMaterial color="#efe6d6" />
          </mesh>
        </group>
      )}
      {parts.includes("drill") && (
        <group position={[0.15, podY - 0.55, 0.42]} rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.55, 8]} />
            <meshStandardMaterial color="#efe6d6" />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 8]} />
            <meshStandardMaterial color="#8a8175" />
          </mesh>
        </group>
      )}
      {parts.includes("imager") && (
        <group position={[-0.2, podY + 0.15, 0.4]}>
          <mesh>
            <boxGeometry args={[0.16, 0.12, 0.16]} />
            <meshStandardMaterial color="#d9d2c5" />
          </mesh>
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 10]} />
            <meshStandardMaterial color="#1a1714" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function useStarfield() {
  return useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => ({
        x: ((index * 47) % 46) - 23,
        y: ((index * 19) % 22) - 8,
        z: -(((index * 13) % 50) + 4),
      })),
    [],
  );
}
