"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { blip } from "./audio";
import { findChar, isBlocked, mazeChar, mazeSize, mazeStart, MAZE_ROWS } from "@/lib/game/maze";

const DIRS: Array<[number, number]> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

type Alien = { row: number; col: number; dir: number };
type Spot = { row: number; col: number };

function freshAliens(): Alien[] {
  return findChar("A").map((spot, index) => ({ row: spot.row, col: spot.col, dir: index % 4 }));
}

export function Maze({
  lives,
  paused,
  onDone,
  onHit,
}: {
  lives: number;
  paused: boolean;
  onDone: (samples: { water: boolean; soil: boolean }) => void;
  onHit: () => void;
}) {
  const size = mazeSize();
  const [cell, setCell] = useState(mazeStart);
  const [hasKey, setHasKey] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [taken, setTaken] = useState<string[]>([]);
  const [aliens, setAliens] = useState<Alien[]>(freshAliens);
  const [note, setNote] = useState("The key is somewhere in the sleeve. The gate does not care until Nori has it.");
  const water = taken.filter((item) => item.startsWith("W")).length;
  const soil = taken.filter((item) => item.startsWith("D")).length;
  const ready = water >= 2 && soil >= 2;

  const cellRef = useRef(cell);
  const keyRef = useRef(hasKey);
  const gateRef = useRef(gateOpen);
  const takenRef = useRef(taken);
  const aliensRef = useRef(aliens);
  const hurtRef = useRef(false);
  const graceRef = useRef(0);
  const pausedRef = useRef(paused);
  const onHitRef = useRef(onHit);
  const onDoneRef = useRef(onDone);
  const moveRef = useRef<(dRow: number, dCol: number) => void>(() => {});
  const seenLives = useRef(lives);

  useLayoutEffect(() => {
    cellRef.current = cell;
    keyRef.current = hasKey;
    gateRef.current = gateOpen;
    takenRef.current = taken;
    aliensRef.current = aliens;
    pausedRef.current = paused;
    onHitRef.current = onHit;
    onDoneRef.current = onDone;
    moveRef.current = move;
  });

  function same(a: Spot, b: Spot) {
    return a.row === b.row && a.col === b.col;
  }

  function struck() {
    if (hurtRef.current || performance.now() < graceRef.current) return;
    hurtRef.current = true;
    onHitRef.current();
    const home = mazeStart();
    cellRef.current = home;
    setCell(home);
    setNote("An alien touched the droid. Nori is back at the sleeve mouth.");
    graceRef.current = performance.now() + 900;
    window.setTimeout(() => {
      hurtRef.current = false;
    }, 700);
  }

  function arrive(next: Spot, crowd: Alien[]) {
    if (crowd.some((alien) => same(alien, next))) {
      struck();
      return;
    }
    const char = mazeChar(next.row, next.col);
    if (char === "K" && !keyRef.current) {
      keyRef.current = true;
      setHasKey(true);
      setNote("Key aboard. Walk Nori into the red gate.");
      blip("ok");
    }
    if (char === "G" && keyRef.current && !gateRef.current) {
      gateRef.current = true;
      setGateOpen(true);
      setNote("Gate open. Water and soil are in the bay.");
      blip("ok");
    }
    let nextTaken = takenRef.current;
    if ((char === "W" || char === "D") && !takenRef.current.includes(`${char}${next.row},${next.col}`)) {
      nextTaken = [...takenRef.current, `${char}${next.row},${next.col}`];
      takenRef.current = nextTaken;
      setTaken(nextTaken);
      const nextWater = nextTaken.filter((item) => item.startsWith("W")).length;
      const nextSoil = nextTaken.filter((item) => item.startsWith("D")).length;
      setNote(`Water ${nextWater}/2. Soil ${nextSoil}/2.`);
      blip("ok");
    }
    if (char === "E") {
      const waters = nextTaken.filter((item) => item.startsWith("W")).length;
      const soils = nextTaken.filter((item) => item.startsWith("D")).length;
      if (waters >= 2 && soils >= 2) {
        onDoneRef.current({ water: true, soil: true });
        return;
      }
      setNote("The exit wants both samples. The bay is still short.");
    }
    cellRef.current = next;
    setCell(next);
  }

  function move(dRow: number, dCol: number) {
    const next = { row: cellRef.current.row + dRow, col: cellRef.current.col + dCol };
    const opening = mazeChar(next.row, next.col) === "G" && keyRef.current;
    if (isBlocked(next.row, next.col, gateRef.current || opening)) return;
    arrive(next, aliensRef.current);
  }

  useEffect(() => {
    graceRef.current = performance.now() + 900;
  }, []);

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
      if (pausedRef.current) return;
      const delta = step[event.key];
      if (!delta) return;
      event.preventDefault();
      moveRef.current(delta[0], delta[1]);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (hurtRef.current || pausedRef.current) return;
      const gate = gateRef.current;
      const nextAliens = aliensRef.current.map((alien) => {
        const turns = [0, 1, 3, 2];
        for (const turn of turns) {
          const dir = (alien.dir + turn) % 4;
          const [dRow, dCol] = DIRS[dir];
          const row = alien.row + dRow;
          const col = alien.col + dCol;
          if (isBlocked(row, col, gate)) continue;
          return { row, col, dir };
        }
        return alien;
      });
      aliensRef.current = nextAliens;
      setAliens(nextAliens);
      if (nextAliens.some((alien) => alien.row === cellRef.current.row && alien.col === cellRef.current.col)) {
        struck();
      }
    }, 460);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lives <= seenLives.current) {
      seenLives.current = lives;
      return;
    }
    seenLives.current = lives;
    const home = mazeStart();
    cellRef.current = home;
    keyRef.current = false;
    gateRef.current = false;
    takenRef.current = [];
    const resetAliens = freshAliens();
    aliensRef.current = resetAliens;
    setCell(home);
    setHasKey(false);
    setGateOpen(false);
    setTaken([]);
    setAliens(resetAliens);
    setNote("The sleeve run starts again. Find the key.");
  }, [lives]);

  return (
    <section className="maze-play">
      <div className="maze-status">
        <p className="eyebrow">Harbor sleeve · Nori, ship droid</p>
        <p>
          {hasKey ? "Key aboard." : "Key missing."} {gateOpen ? "Gate open." : "Gate shut."} Water {water}/2. Soil {soil}/2.
          {ready ? " Exit is lit." : ""}
        </p>
        <p className="caption">{note}</p>
      </div>
      <div className="maze-board">
        <div
          className="maze-grid"
          style={{
            gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
            gridTemplateRows: `repeat(${size.rows}, 1fr)`,
          }}
          role="grid"
          aria-label="Sleeve map"
        >
          {MAZE_ROWS.map((line, row) =>
            [...line].map((char, col) => {
              const token = `${char}${row},${col}`;
              const showKey = char === "K" && !hasKey;
              const showWater = char === "W" && !taken.includes(token);
              const showSoil = char === "D" && !taken.includes(token);
              const gate = char === "G";
              const exit = char === "E";
              const kind = char === "#" ? "wall" : "floor";
              return (
                <div
                  key={`${row}-${col}`}
                  className={`tile tile-${kind}${gate ? " tile-gate" : ""}${gate && gateOpen ? " open" : ""}${exit ? " tile-exit" : ""}${exit && ready ? " ready" : ""}`}
                >
                  {showKey && <span className="token key" aria-label="Key" />}
                  {showWater && <span className="token water" aria-label="Water sample" />}
                  {showSoil && <span className="token soil" aria-label="Soil sample" />}
                  {gate && !gateOpen && <span className="gate-bars" aria-hidden="true" />}
                  {exit && <span className="token exit-mark">Out</span>}
                </div>
              );
            }),
          )}
          {aliens.map((alien, index) => (
            <div key={`alien-${index}`} className="pawn alien" style={{ gridRow: alien.row + 1, gridColumn: alien.col + 1 }}>
              <AlienPawn />
            </div>
          ))}
          <div className="pawn droid" style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}>
            <DroidPawn />
          </div>
        </div>
      </div>
      <div className="maze-controls">
        <div className="pad">
          <button type="button" onClick={() => move(-1, 0)}>North</button>
          <button type="button" onClick={() => move(0, -1)}>West</button>
          <button type="button" onClick={() => move(0, 1)}>East</button>
          <button type="button" onClick={() => move(1, 0)}>South</button>
        </div>
        <p className="caption">Whole sleeve, {size.cols} by {size.rows}. Arrows move Nori. A model, not a photograph of TOI-700 e.</p>
      </div>
    </section>
  );
}

function DroidPawn() {
  return (
    <svg viewBox="0 0 16 16" className="pawn-svg" aria-label="Nori">
      <rect x="4" y="2" width="8" height="6" fill="#efe6d6" />
      <rect x="6" y="4" width="4" height="2" fill="#e39b12" />
      <rect x="7" y="4" width="2" height="2" fill="#1a1714" />
      <rect x="5" y="8" width="6" height="4" fill="#9a9084" />
      <rect x="3" y="9" width="2" height="3" fill="#e39b12" />
      <rect x="11" y="9" width="2" height="3" fill="#e39b12" />
      <rect x="6" y="12" width="1" height="2" fill="#1a1714" />
      <rect x="9" y="12" width="1" height="2" fill="#1a1714" />
    </svg>
  );
}

function AlienPawn() {
  return (
    <svg viewBox="0 0 16 16" className="pawn-svg" aria-label="Alien">
      <rect x="4" y="3" width="8" height="6" fill="#c4452d" />
      <rect x="5" y="4" width="2" height="2" fill="#efe6d6" />
      <rect x="9" y="4" width="2" height="2" fill="#efe6d6" />
      <rect x="7" y="9" width="2" height="4" fill="#8a8175" />
      <rect x="4" y="12" width="2" height="2" fill="#1a1714" />
      <rect x="10" y="12" width="2" height="2" fill="#1a1714" />
    </svg>
  );
}
