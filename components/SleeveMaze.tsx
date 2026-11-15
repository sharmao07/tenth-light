'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from './AudioController';
import {
  NoriPixelToken,
  AlienPixelToken,
  KeyPixelToken,
  GatePixelToken,
  WaterNodePixelToken,
  SoilNodePixelToken,
  ExitPixelToken,
} from './SleevePixelTokens';

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

export function SleeveMaze({ isPaused, onVictory, onHit }: SleeveMazeProps) {
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
  const [hitShake, setHitShake] = useState(false);

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
            setHitShake(true);
            setTimeout(() => setHitShake(false), 260);
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
    <div className="flex flex-col items-center justify-center p-3 select-none">
      {/* Header Info */}
      <div className="w-full max-w-[580px] flex flex-wrap justify-between items-center mb-1.5 text-xs md:text-sm">
        <span className="text-signal uppercase font-bold tracking-wider">
          Harbor Surface Sleeve &middot; Top-Down Probe
        </span>
        <span className="text-paper-muted text-xs italic">
          Educational simulation: Speculative in-situ biosignature and regolith sampling (surface conditions unconfirmed by telescopes).
        </span>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-[580px] bg-surface border border-paper/20 p-3 flex flex-wrap justify-between items-center text-xs md:text-sm mb-2.5">
        <div className="flex items-center gap-3.5">
          <span className={`inline-flex items-center gap-1.5 ${hasAmberKey ? 'text-signal font-bold' : 'text-paper-muted'}`}>
            <KeyPixelToken size={14} className="inline-block" />
            <span>Key: {hasAmberKey ? 'ACQUIRED' : 'MISSING'}</span>
          </span>
          <span className="text-paper/20">|</span>
          <span className={`inline-flex items-center gap-1.5 ${waterCollected >= 2 ? 'text-paper font-bold' : 'text-paper-muted'}`}>
            <WaterNodePixelToken size={14} className="inline-block" />
            <span>Water Simulant: {waterCollected}/2</span>
          </span>
          <span className="text-paper/20">|</span>
          <span className={`inline-flex items-center gap-1.5 ${soilCollected >= 2 ? 'text-signal font-bold' : 'text-paper-muted'}`}>
            <SoilNodePixelToken size={14} className="inline-block" />
            <span>Soil Simulant: {soilCollected}/2</span>
          </span>
        </div>
        <div>
          {allSamplesCollected ? (
            <span className="text-paper animate-pulse font-bold">EXIT IS UNLOCKED!</span>
          ) : (
            <span className="text-paper-muted">Exit locked until 4 nodes collected</span>
          )}
        </div>
      </div>

      {/* The 2D Maze Canvas / Grid (Whole maze on screen) */}
      <div className={`relative border bg-void p-1 transition-all ${
        hitShake ? 'animate-shake border-signal bg-signal/10' : 'border-signal'
      }`}>
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

              let bg = 'bg-surface';
              if (tile === 1) bg = 'bg-surface-raised border border-paper/15'; // Wall
              if (tile === 2) bg = 'bg-void border border-paper/20'; // Mouth

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative flex items-center justify-center transition-colors ${bg}`}
                >
                  {/* Amber Key */}
                  {isKey && (
                    <KeyPixelToken size={22} />
                  )}

                  {/* Red Gate */}
                  {isGate && (
                    <GatePixelToken isUnlocked={hasAmberKey} size={28} />
                  )}

                  {/* Water Nodes */}
                  {isWaterNode && (
                    <WaterNodePixelToken size={20} />
                  )}

                  {/* Soil Nodes */}
                  {isSoilNode && (
                    <SoilNodePixelToken size={20} />
                  )}

                  {/* Exit */}
                  {isExit && (
                    <ExitPixelToken isUnlocked={allSamplesCollected} size={28} />
                  )}

                  {/* Patrolling Alien */}
                  {hasAlien && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <AlienPixelToken size={24} />
                    </div>
                  )}

                  {/* Nori Droid */}
                  {isNori && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <NoriPixelToken size={26} isGrace={gracePeriod > 0} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* On-screen Directional Controls (North/West/East/South) */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-[580px] mt-3 gap-2.5">
        <div className="text-xs md:text-sm text-paper-muted">
          Controls: <kbd className="px-1.5 py-0.5 bg-surface border border-paper/30 text-paper font-mono">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-surface border border-paper/30 text-paper font-mono">Arrow Keys</kbd>
        </div>

        {/* Directional Pad */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => tryMove(0, -1)}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3.5 py-1.5 bg-surface hover:bg-signal hover:text-void border border-paper/40 text-xs md:text-sm text-paper font-mono"
          >
            &uarr; N
          </button>
          <button
            onClick={() => tryMove(-1, 0)}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3.5 py-1.5 bg-surface hover:bg-signal hover:text-void border border-paper/40 text-xs md:text-sm text-paper font-mono"
          >
            &larr; W
          </button>
          <button
            onClick={() => tryMove(0, 1)}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3.5 py-1.5 bg-surface hover:bg-signal hover:text-void border border-paper/40 text-xs md:text-sm text-paper font-mono"
          >
            &darr; S
          </button>
          <button
            onClick={() => tryMove(1, 0)}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3.5 py-1.5 bg-surface hover:bg-signal hover:text-void border border-paper/40 text-xs md:text-sm text-paper font-mono"
          >
            &rarr; E
          </button>
        </div>
      </div>
    </div>
  );
}
