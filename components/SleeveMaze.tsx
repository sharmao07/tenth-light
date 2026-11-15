'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from './AudioController';

interface SleeveMazeProps {
  isPaused: boolean;
  onVictory: (collectedWater: boolean, collectedSoil: boolean) => void;
  onHit: () => void;
  lives: number;
}

// 14x12 tile maze
// 0: empty path, 1: wall, 2: spawn mouth, 3: amber key, 4: red gate, 5: water node, 6: soil node, 7: exit
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 1, 0, 0, 0, 1, 5, 0, 6, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 3, 0, 0, 0, 1, 0, 4, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 6, 0, 5, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 7, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface PatrolAlien {
  x: number;
  y: number;
  dir: number; // 1 or -1
  axis: 'x' | 'y';
  min: number;
  max: number;
}

export function SleeveMaze({ isPaused, onVictory, onHit, lives }: SleeveMazeProps) {
  const [noriPos, setNoriPos] = useState({ x: 1, y: 1 });
  const [hasAmberKey, setHasAmberKey] = useState(false);
  const [waterCollected, setWaterCollected] = useState(0); // 2 total
  const [soilCollected, setSoilCollected] = useState(0); // 2 total
  const [waterNodes, setWaterNodes] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 1 },
    { x: 12, y: 5 },
  ]);
  const [soilNodes, setSoilNodes] = useState<{ x: number; y: number }[]>([
    { x: 12, y: 1 },
    { x: 10, y: 5 },
  ]);
  const [gracePeriod, setGracePeriod] = useState(1.5);

  const aliensRef = useRef<PatrolAlien[]>([
    { x: 6, y: 1, dir: 1, axis: 'y', min: 1, max: 9 }, // Alien 1 patrols hallway
    { x: 1, y: 9, dir: 1, axis: 'x', min: 1, max: 8 }, // Alien 2 patrols lower run
  ]);

  const [aliensPos, setAliensPos] = useState([
    { x: 6, y: 1 },
    { x: 1, y: 9 },
  ]);

  // Respawn Nori at mouth (1, 1) with grace period
  const respawnNori = useCallback(() => {
    setNoriPos({ x: 1, y: 1 });
    setGracePeriod(1.8);
  }, []);

  // Move handler
  const tryMove = useCallback(
    (dx: number, dy: number) => {
      if (isPaused) return;

      setNoriPos((prev) => {
        const nx = prev.x + dx;
        const ny = prev.y + dy;

        // Check bounds
        if (ny < 0 || ny >= INITIAL_MAP.length || nx < 0 || nx >= INITIAL_MAP[0].length) {
          return prev;
        }

        const tile = INITIAL_MAP[ny][nx];

        // Wall check
        if (tile === 1) return prev;

        // Red gate check (tile 4)
        if (tile === 4 && !hasAmberKey) {
          sound.playMiss();
          return prev;
        }

        // Amber key pickup (tile 3)
        if (tile === 3 && !hasAmberKey) {
          setHasAmberKey(true);
          sound.playSuccess();
        }

        // Water nodes
        setWaterNodes((curr) => {
          const matchIdx = curr.findIndex((wn) => wn.x === nx && wn.y === ny);
          if (matchIdx !== -1) {
            sound.playSuccess();
            setWaterCollected((w) => w + 1);
            return curr.filter((_, i) => i !== matchIdx);
          }
          return curr;
        });

        // Soil nodes
        setSoilNodes((curr) => {
          const matchIdx = curr.findIndex((sn) => sn.x === nx && sn.y === ny);
          if (matchIdx !== -1) {
            sound.playSuccess();
            setSoilCollected((s) => s + 1);
            return curr.filter((_, i) => i !== matchIdx);
          }
          return curr;
        });

        // Exit check (tile 7)
        if (tile === 7 && waterCollected >= 2 && soilCollected >= 2) {
          sound.playSuccess();
          onVictory(true, true);
        }

        sound.playTalkBeep(true);
        return { x: nx, y: ny };
      });
    },
    [isPaused, hasAmberKey, waterCollected, soilCollected, onVictory]
  );

  // Window keydown listener with capture phase
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        e.stopPropagation();
        tryMove(0, -1);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        e.stopPropagation();
        tryMove(0, 1);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        e.stopPropagation();
        tryMove(-1, 0);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        e.stopPropagation();
        tryMove(1, 0);
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [tryMove, isPaused]);

  // Patrol loop & collision
  useEffect(() => {
    if (isPaused) return;

    let stepTimer = 0;
    const interval = 450; // ms per step

    const intervalId = setInterval(() => {
      if (isPaused) return;

      // Update grace period
      setGracePeriod((g) => Math.max(0, g - 0.45));

      // Update alien patrol positions
      const newPos = aliensRef.current.map((al) => {
        if (al.axis === 'y') {
          let nextY = al.y + al.dir;
          if (nextY > al.max || nextY < al.min) {
            al.dir = -al.dir;
            nextY = al.y + al.dir;
          }
          al.y = nextY;
          return { x: al.x, y: al.y };
        } else {
          let nextX = al.x + al.dir;
          if (nextX > al.max || nextX < al.min) {
            al.dir = -al.dir;
            nextX = al.x + al.dir;
          }
          al.x = nextX;
          return { x: al.x, y: al.y };
        }
      });

      setAliensPos(newPos);

      // Check collision if grace period is 0
      if (gracePeriod <= 0) {
        for (const al of aliensRef.current) {
          if (Math.round(al.x) === noriPos.x && Math.round(al.y) === noriPos.y) {
            sound.playMiss();
            onHit();
            respawnNori();
            break;
          }
        }
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [isPaused, gracePeriod, noriPos, onHit, respawnNori]);

  const allSamplesCollected = waterCollected >= 2 && soilCollected >= 2;

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      {/* Header Info */}
      <div className="w-full max-w-[560px] flex flex-wrap justify-between items-center mb-1 text-xs font-mono">
        <span className="text-[#e39b12] uppercase font-bold tracking-wider">
          Harbor Surface Sleeve • Top-Down Probe
        </span>
        <span className="text-[#efe6d6]/60 text-[10px] italic">
          This place is a model, not a photograph of TOI-700 e.
        </span>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-[560px] bg-[#1a1714] border border-[#efe6d6]/20 p-2 rounded flex flex-wrap justify-between items-center text-xs font-mono mb-2">
        <div className="flex items-center gap-3">
          <span className={hasAmberKey ? 'text-[#e39b12] font-bold' : 'text-[#efe6d6]/40'}>
            🔑 Amber Key: {hasAmberKey ? 'ACQUIRED' : 'MISSING'}
          </span>
          <span className="text-[#efe6d6]/30">|</span>
          <span className={waterCollected >= 2 ? 'text-[#5bc0be] font-bold' : 'text-[#efe6d6]/60'}>
            💧 Water: {waterCollected}/2
          </span>
          <span className="text-[#efe6d6]/30">|</span>
          <span className={soilCollected >= 2 ? 'text-[#e39b12] font-bold' : 'text-[#efe6d6]/60'}>
            🌱 Soil: {soilCollected}/2
          </span>
        </div>
        <div className="text-[11px]">
          {allSamplesCollected ? (
            <span className="text-[#5bc0be] animate-pulse font-bold">EXIT IS UNLOCKED!</span>
          ) : (
            <span className="text-[#efe6d6]/50">Exit locked until samples gathered</span>
          )}
        </div>
      </div>

      {/* The 2D Maze Canvas / Grid (Whole maze on screen) */}
      <div className="relative border-2 border-[#e39b12] rounded bg-[#100e0c] p-1 shadow-2xl">
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${INITIAL_MAP[0].length}, minmax(0, 1fr))`,
            width: 'min(90vw, 540px)',
            height: 'min(55vh, 330px)',
          }}
        >
          {INITIAL_MAP.map((row, y) =>
            row.map((tile, x) => {
              const isNori = noriPos.x === x && noriPos.y === y;
              const hasAlien = aliensPos.some((al) => al.x === x && al.y === y);
              const isWaterNode = waterNodes.some((wn) => wn.x === x && wn.y === y);
              const isSoilNode = soilNodes.some((sn) => sn.x === x && sn.y === y);
              const isKey = tile === 3 && !hasAmberKey;
              const isGate = tile === 4;
              const isExit = tile === 7;

              let bg = 'bg-[#1a1714]';
              if (tile === 1) bg = 'bg-[#2a241e] border border-[#3b342b]'; // Wall
              if (tile === 2) bg = 'bg-[#100e0c] border border-[#efe6d6]/20'; // Mouth

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex items-center justify-center rounded-[2px] transition-colors ${bg}`}
                >
                  {/* Amber Key */}
                  {isKey && (
                    <span className="text-base animate-bounce" title="Amber Key">
                      🔑
                    </span>
                  )}

                  {/* Red Gate */}
                  {isGate && (
                    <div
                      className={`w-full h-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        hasAmberKey
                          ? 'bg-[#5bc0be]/20 text-[#5bc0be] border border-[#5bc0be]/40'
                          : 'bg-[#c4452d]/40 text-[#c4452d] border border-[#c4452d]'
                      }`}
                    >
                      {hasAmberKey ? 'OPEN' : 'GATE'}
                    </div>
                  )}

                  {/* Water Nodes */}
                  {isWaterNode && (
                    <span className="text-sm animate-pulse" title="Water Sample Node">
                      💧
                    </span>
                  )}

                  {/* Soil Nodes */}
                  {isSoilNode && (
                    <span className="text-sm animate-pulse" title="Soil Sample Node">
                      🌱
                    </span>
                  )}

                  {/* Exit */}
                  {isExit && (
                    <div
                      className={`w-full h-full flex items-center justify-center text-[9px] font-mono font-bold uppercase ${
                        allSamplesCollected
                          ? 'bg-[#5bc0be] text-[#100e0c] animate-pulse'
                          : 'bg-[#100e0c] text-[#efe6d6]/30 border border-[#efe6d6]/20'
                      }`}
                    >
                      Exit
                    </div>
                  )}

                  {/* Patrolling Alien */}
                  {hasAlien && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm z-10 animate-pulse">
                      👾
                    </div>
                  )}

                  {/* Nori Droid */}
                  {isNori && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-sm z-20 ${
                        gracePeriod > 0 ? 'opacity-60 animate-ping' : 'opacity-100'
                      }`}
                      title="Nori Astromech Droid"
                    >
                      🤖
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* On-screen Directional Controls (North/West/East/South) */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-[560px] mt-2 gap-2">
        <div className="text-[11px] font-mono text-[#efe6d6]/70">
          Controls: <kbd className="px-1 py-0.5 bg-[#1a1714] border border-[#efe6d6]/30 rounded">WASD</kbd> or <kbd className="px-1 py-0.5 bg-[#1a1714] border border-[#efe6d6]/30 rounded">Arrow Keys</kbd>
        </div>

        {/* Directional Pad */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => tryMove(0, -1)}
            className="px-2.5 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#efe6d6]/30 text-xs font-mono rounded"
          >
            ↑ N
          </button>
          <button
            onClick={() => tryMove(-1, 0)}
            className="px-2.5 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#efe6d6]/30 text-xs font-mono rounded"
          >
            ← W
          </button>
          <button
            onClick={() => tryMove(0, 1)}
            className="px-2.5 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#efe6d6]/30 text-xs font-mono rounded"
          >
            ↓ S
          </button>
          <button
            onClick={() => tryMove(1, 0)}
            className="px-2.5 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#efe6d6]/30 text-xs font-mono rounded"
          >
            → E
          </button>
        </div>
      </div>
    </div>
  );
}
