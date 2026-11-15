"use client";

import { useEffect, useState } from "react";
import { PARTS, URANUS_AU } from "@/lib/game/catalog";
import { aliveDraw, analyze, scienceDraw } from "@/lib/game/ship";
import type { PartId, ShipDesign } from "@/lib/game/types";
import { Plate } from "./Plate";

export function MoonPuzzle({ onPass }: { onPass: () => void }) {
  const [fix, setFix] = useState<{ azimuth: number; elevation: number; source: string; note: string } | null>(null);
  const [angle, setAngle] = useState(20);

  useEffect(() => {
    let dead = false;
    fetch("/api/horizons")
      .then((response) => response.json())
      .then((data) => {
        if (!dead) setFix(data);
      })
      .catch(() => {
        if (!dead) setFix({ azimuth: 124, elevation: 18, source: "snapshot", note: "Sample fix." });
      });
    return () => {
      dead = true;
    };
  }, []);

  const target = fix?.azimuth ?? 0;
  const gap = fix ? Math.min(Math.abs(angle - target), 360 - Math.abs(angle - target)) : 999;
  const locked = gap <= 14;

  return (
    <div className="puzzle">
      <Plate id="moon" alt="NASA photograph of the lunar surface" />
      <p>Lock the dish to the azimuth of Earth. Elevation says whether Earth is above the rim.</p>
      {!fix && <p>Asking JPL Horizons…</p>}
      {fix && (
        <>
          <p className="caption">{fix.note} Source: {fix.source}.</p>
          <p>Elevation {fix.elevation.toFixed(1)}°. Target azimuth {target.toFixed(1)}°.</p>
          <label>
            Dish bearing {angle.toFixed(0)}°
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
            />
          </label>
          <p>{locked ? "Earth is in the beam." : `${gap.toFixed(0)}° off the bearing.`}</p>
          <button type="button" className="primary" disabled={!locked} onClick={onPass}>
            Lock the dish
          </button>
        </>
      )}
    </div>
  );
}

export function MarsPuzzle({ ship, onPass }: { ship: ShipDesign; onPass: () => void }) {
  const report = analyze(ship);
  const [note, setNote] = useState("A souvenir is sitting on the scale. Nine kilograms.");
  return (
    <div className="puzzle">
      <Plate id="mars" alt="NASA photograph of the Martian surface" />
      <p>Ship mass without the souvenir: {report.mass} kg. The gate wants the souvenir gone, not the harness.</p>
      <p>{note}</p>
      <div className="choices">
        <button type="button" onClick={() => setNote("Nori: Absolutely not.")}>Drop the harness, 2 kg</button>
        <button type="button" className="primary" onClick={onPass}>Drop the souvenir, 9 kg</button>
        <button type="button" onClick={() => setNote("A lens cloth does not close a nine-kilogram door.")}>
          Drop the lens cloth, 1 kg
        </button>
      </div>
    </div>
  );
}

type Body = { name: string; className: string; diameterKm: number | null };

export function CeresPuzzle({ onPass }: { onPass: () => void }) {
  const [bodies, setBodies] = useState<Body[] | null>(null);
  const [source, setSource] = useState("snapshot");
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    fetch("/api/sbdb")
      .then((response) => response.json())
      .then((data) => {
        setBodies(data.bodies);
        setSource(data.source);
      })
      .catch(() => {
        setSource("snapshot");
        setBodies([
          { name: "1 Ceres", className: "Main-belt Asteroid", diameterKm: 939.4 },
          { name: "4 Vesta", className: "Main-belt Asteroid", diameterKm: 525.4 },
          { name: "2 Pallas", className: "Main-belt Asteroid", diameterKm: 511 },
        ]);
      });
  }, []);

  const answer = bodies?.reduce((best, body) =>
    (body.diameterKm ?? 0) > (best.diameterKm ?? 0) ? body : best,
  );

  return (
    <div className="puzzle">
      <Plate id="ceres" alt="NASA photograph of Ceres from the Dawn mission" />
      <p>Dawn orbited the largest of these three. The Small-Body Database is the judge.</p>
      <p className="caption">Source: {source}.</p>
      <div className="choices">
        {(bodies ?? []).map((body) => (
          <button
            key={body.name}
            type="button"
            onClick={() => {
              if (body.name === answer?.name) onPass();
              else setWrong(true);
            }}
          >
            <strong>{body.name}</strong>
            <span>{body.className}</span>
            <span>{body.diameterKm == null ? "No diameter" : `${body.diameterKm} km`}</span>
          </button>
        ))}
      </div>
      {wrong && <p>Nori: That is a rock. It is not the rock.</p>}
    </div>
  );
}

export function EnceladusPuzzle({ onPass }: { onPass: () => void }) {
  const [miss, setMiss] = useState(false);
  return (
    <div className="puzzle">
      <Plate id="enceladus" alt="NASA photograph related to Enceladus" />
      <p>The photograph is the evidence. The diagram is the control. Point at the jets.</p>
      <svg viewBox="0 0 240 180" className="diagram" role="img" aria-label="Enceladus diagram">
        <rect width="240" height="180" fill="#1a1714" />
        <circle cx="120" cy="90" r="36" fill="#d5e4ea" />
        <path d="M96 118 C90 150 80 160 70 166" stroke="#7eb0c4" strokeWidth="6" fill="none" />
        <path
          d="M120 126 C118 156 122 162 120 170"
          stroke="#e39b12"
          strokeWidth="8"
          fill="none"
          onClick={onPass}
          style={{ cursor: "pointer" }}
        />
        <path d="M146 116 C160 146 170 150 178 158" stroke="#7eb0c4" strokeWidth="6" fill="none" />
        <circle cx="150" cy="78" r="8" fill="#8a8175" onClick={() => setMiss(true)} style={{ cursor: "pointer" }} />
      </svg>
      <div className="choices">
        <button type="button" onClick={() => setMiss(true)}>A crater</button>
        <button type="button" className="primary" onClick={onPass}>The south-pole jets</button>
        <button type="button" onClick={() => setMiss(true)}>A ring arc</button>
      </div>
      {miss && <p>Nori: Cassini did not fly through a crater to taste the ocean.</p>}
    </div>
  );
}

const SCIENCE: PartId[] = ["spectrometer", "drill", "imager"];

export function UranusPuzzle({
  ship,
  onPass,
  onScrub,
}: {
  ship: ShipDesign;
  onPass: (frozen: PartId[]) => void;
  onScrub: () => void;
}) {
  const report = analyze(ship);
  const [off, setOff] = useState<PartId[]>([]);
  const loads = SCIENCE.filter((id) => ship.parts.includes(id));
  const draw = aliveDraw(ship.parts) + scienceDraw(ship.parts, off);
  const supply = report.supplyUranus;
  const canHold = supply + 0.05 >= report.aliveDraw;
  const balanced = draw <= supply + 0.05;

  function toggle(id: PartId) {
    setOff((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  }

  return (
    <div className="puzzle">
      <Plate id="uranus" alt="NASA photograph of Uranus" />
      <p>
        Range {URANUS_AU} AU. Solar, if you brought it, is down to{" "}
        {ship.parts.includes("solar") ? (PARTS.solar.watts / (URANUS_AU * URANUS_AU)).toFixed(2) : "0"} W.
        The radioisotope unit does not care.
      </p>
      <p>
        Bus {draw.toFixed(0)} W. Supply {supply.toFixed(1)} W. Heater, computer, and radio stay closed.
      </p>
      {!canHold && (
        <p>The heater cannot hold on this ship. Mission control will scrub the flight and keep the design.</p>
      )}
      <div className="choices">
        {loads.map((id) => (
          <button key={id} type="button" aria-pressed={!off.includes(id)} onClick={() => toggle(id)}>
            {PARTS[id].name}: {off.includes(id) ? "open" : "closed"} · {PARTS[id].watts} W
          </button>
        ))}
      </div>
      {canHold ? (
        <button
          type="button"
          className="primary"
          disabled={!balanced}
          onClick={() => onPass(off.filter((id) => id === "spectrometer" || id === "drill"))}
        >
          {balanced ? "Hold the bus and depart" : "The bus is over the supply"}
        </button>
      ) : (
        <button type="button" className="primary" onClick={onScrub}>
          Scrub to the hangar
        </button>
      )}
    </div>
  );
}

export function NeptunePuzzle({ onPass }: { onPass: () => void }) {
  const hours = (30.1 * 499) / 3600;
  const [mode, setMode] = useState<"ready" | "wait" | "fail" | "done">("ready");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (mode !== "wait") return;
    let frame = 0;
    const started = performance.now();
    const loop = (now: number) => {
      const value = Math.min(1, (now - started) / 7000);
      setProgress(value);
      if (value >= 1) setMode("done");
      else frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  function send() {
    if (mode === "ready") setMode("wait");
    else if (mode === "wait") setMode("fail");
  }

  return (
    <div className="puzzle">
      <Plate id="neptune" alt="NASA photograph of Neptune" />
      <p>One-way light time at about 30.1 AU is {hours.toFixed(2)} hours. The drill timer is seven seconds. Send once.</p>
      <div className="meter-track" aria-hidden="true">
        <div className="meter-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      {mode === "fail" && <p>Nori: The second command tripped over the first. We send again, once.</p>}
      {mode === "done" ? (
        <button type="button" className="primary" onClick={onPass}>The reply is in. Depart.</button>
      ) : (
        <button type="button" className="primary" onClick={mode === "fail" ? () => { setMode("ready"); setProgress(0); } : send}>
          {mode === "wait" ? "Do not send again" : mode === "fail" ? "Reset the command" : "Send"}
        </button>
      )}
    </div>
  );
}

export function PlutoPuzzle({ onPass }: { onPass: () => void }) {
  const [miss, setMiss] = useState(false);
  return (
    <div className="puzzle">
      <Plate id="pluto" alt="NASA photograph of Pluto" />
      <p>The heart is a place. A photograph is not soil. Mark the heart, and leave the difference in the log.</p>
      <svg viewBox="0 0 240 160" className="diagram" role="img" aria-label="Simple map of Pluto">
        <rect width="240" height="160" fill="#1a1714" />
        <circle cx="120" cy="80" r="48" fill="#d9d2c5" />
        <path
          d="M120 96 l-18-16 a12 12 0 1 1 18-10 a12 12 0 1 1 18 10 z"
          fill="#c4452d"
          onClick={onPass}
          style={{ cursor: "pointer" }}
        />
        <circle cx="78" cy="70" r="8" fill="#8a8175" onClick={() => setMiss(true)} style={{ cursor: "pointer" }} />
      </svg>
      {miss && <p>Nori: That is not the heart.</p>}
      <button type="button" onClick={() => setMiss(true)}>Mark a dark plain instead</button>
    </div>
  );
}

const ORDER = ["samples", "log", "card"] as const;
const ITEMS = [
  { id: "card", label: "Postcard from the crew" },
  { id: "samples", label: "Water and soil readings" },
  { id: "log", label: "Power and navigation log" },
];

export function ManifestPuzzle({ onPass }: { onPass: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);

  function choose(id: string) {
    if (picked.includes(id)) return;
    const next = [...picked, id];
    const good = next.every((item, index) => item === ORDER[index]);
    if (!good) {
      setWrong(true);
      setPicked([]);
      return;
    }
    setWrong(false);
    setPicked(next);
    if (next.length === ORDER.length) onPass();
  }

  return (
    <div className="puzzle">
      <p>Voyager crossed this boundary in 2012, near 122 AU. Put the return in the order the mission can defend.</p>
      <ol>
        {picked.map((id) => (
          <li key={id}>{ITEMS.find((item) => item.id === id)?.label}</li>
        ))}
      </ol>
      <div className="choices">
        {ITEMS.map((item) => (
          <button key={item.id} type="button" onClick={() => choose(item.id)} disabled={picked.includes(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {wrong && <p>Nori: Samples, then the log, then the postcard.</p>}
    </div>
  );
}
