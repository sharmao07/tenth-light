"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { isWall, mazeChar, mazeSize, mazeStart, MAZE_ROWS } from "@/lib/game/maze";

export function Maze({
  onDone,
}: {
  onDone: (samples: { water: boolean; soil: boolean }) => void;
}) {
  const start = mazeStart();
  const [cell, setCell] = useState(start);
  const [taken, setTaken] = useState<string[]>([]);
  const water = taken.filter((item) => item.startsWith("W")).length;
  const soil = taken.filter((item) => item.startsWith("D")).length;
  const open = water >= 2 && soil >= 2;

  function move(dRow: number, dCol: number) {
    const next = { row: cell.row + dRow, col: cell.col + dCol };
    if (isWall(next.row, next.col)) return;
    const key = `${next.row},${next.col}`;
    const char = mazeChar(next.row, next.col);
    if ((char === "W" || char === "D") && !taken.includes(`${char}${key}`)) {
      setTaken((items) => [...items, `${char}${key}`]);
    }
    if (char === "E") {
      const nextWater = water + 0;
      const nextSoil = soil + 0;
      if (nextWater >= 2 && nextSoil >= 2) {
        onDone({ water: true, soil: true });
        return;
      }
    }
    setCell(next);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const step: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        w: [-1, 0],
        W: [-1, 0],
        ArrowDown: [1, 0],
        s: [1, 0],
        S: [1, 0],
        ArrowLeft: [0, -1],
        a: [0, -1],
        A: [0, -1],
        ArrowRight: [0, 1],
        d: [0, 1],
        D: [0, 1],
      };
      const delta = step[event.key];
      if (!delta) return;
      event.preventDefault();
      move(delta[0], delta[1]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="maze-wrap">
      <div className="maze-copy">
        <p className="eyebrow">Harbor, inside the sleeve</p>
        <h2>Nori walks. You do not.</h2>
        <p>Water {water}/2. Soil {soil}/2. The exit opens when both are in the sleeve.</p>
      </div>
      <div className="maze-stage">
        <Canvas camera={{ position: [5, 11, 12], fov: 42 }}>
          <color attach="background" args={["#14120e"]} />
          <ambientLight intensity={0.85} />
          <directionalLight position={[6, 10, 4]} intensity={1.4} />
          {MAZE_ROWS.map((line, row) =>
            [...line].map((char, col) => {
              if (char === "#") {
                return (
                  <mesh key={`${row}-${col}`} position={[col, 0.45, row]}>
                    <boxGeometry args={[0.92, 0.9, 0.92]} />
                    <meshStandardMaterial color="#4a4338" />
                  </mesh>
                );
              }
              const token = `${char}${row},${col}`;
              const showWater = char === "W" && !taken.includes(token);
              const showSoil = char === "D" && !taken.includes(token);
              return (
                <group key={`${row}-${col}`}>
                  <mesh position={[col, 0, row]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.98, 0.98]} />
                    <meshStandardMaterial color={char === "E" && open ? "#e39b12" : "#2a261f"} />
                  </mesh>
                  {showWater && (
                    <mesh position={[col, 0.28, row]}>
                      <sphereGeometry args={[0.22, 16, 12]} />
                      <meshStandardMaterial color="#7eb0c4" />
                    </mesh>
                  )}
                  {showSoil && (
                    <mesh position={[col, 0.22, row]}>
                      <boxGeometry args={[0.28, 0.28, 0.28]} />
                      <meshStandardMaterial color="#a36b3c" />
                    </mesh>
                  )}
                </group>
              );
            }),
          )}
          <group position={[cell.col, 0.35, cell.row]}>
            <mesh>
              <sphereGeometry args={[0.28, 18, 14]} />
              <meshStandardMaterial color="#e39b12" />
            </mesh>
            <mesh position={[-0.16, 0.22, 0]}>
              <coneGeometry args={[0.08, 0.18, 8]} />
              <meshStandardMaterial color="#e39b12" />
            </mesh>
            <mesh position={[0.16, 0.22, 0]}>
              <coneGeometry args={[0.08, 0.18, 8]} />
              <meshStandardMaterial color="#e39b12" />
            </mesh>
          </group>
        </Canvas>
      </div>
      <div className="pad">
        <button type="button" onClick={() => move(-1, 0)}>North</button>
        <button type="button" onClick={() => move(0, -1)}>West</button>
        <button type="button" onClick={() => move(0, 1)}>East</button>
        <button type="button" onClick={() => move(1, 0)}>South</button>
      </div>
      <p className="caption">Sleeve map, {mazeSize().cols} by {mazeSize().rows}. Appearance is a model, not a photograph of TOI-700 e.</p>
    </div>
  );
}
