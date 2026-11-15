"use client";

import dynamic from "next/dynamic";
import type { DragEvent } from "react";
import { PARTS, VEHICLES } from "@/lib/game/catalog";
import type { Action } from "@/lib/game/logic";
import { analyze } from "@/lib/game/ship";
import type { GameState, PartId } from "@/lib/game/types";

const HangarScene = dynamic(() => import("./HangarScene"), {
  ssr: false,
  loading: () => <div className="stage-loading">Lighting the hangar</div>,
});

const OPTIONAL: PartId[] = ["tank", "solar", "rtg", "spectrometer", "drill", "imager"];

export function Hangar({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: (action: Action) => void;
}) {
  const report = analyze(state.ship);

  function onDrop(event: DragEvent) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/part") as PartId;
    if (id) dispatch({ type: "add", id });
  }

  return (
    <section className="hangar">
      <div className="ledger">
        <div className="ledger-body">
          <p className="eyebrow">Teaching budget {report.budget}</p>
          <h2>Build the ship</h2>
          <div className="vehicle-row">
            {(Object.values(VEHICLES)).map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                className={state.ship.vehicle === vehicle.id ? "selected" : ""}
                onClick={() => dispatch({ type: "vehicle", id: vehicle.id })}
              >
                <strong>{vehicle.name}</strong>
                <span>{vehicle.cost} cost · {vehicle.massCap} kg</span>
                <span>{vehicle.blurb}</span>
              </button>
            ))}
          </div>
          <Meter label="Mass kg" value={report.mass} max={report.massCap} warn={report.mass > report.massCap} />
          <Meter label="Cost" value={report.cost} max={report.budget} warn={report.cost > report.budget} />
          <Meter label="Watts at Earth" value={Math.round(report.drawEarth)} max={Math.max(report.drawEarth, report.supplyEarth, 1)} warn={report.supplyEarth + 0.05 < report.drawEarth} />
          <Meter label="Delta-v m/s" value={report.dv} max={7200} warn={report.dv < 6700} />
          <p>Uranus supply {report.supplyUranus.toFixed(1)} W. Heater bus {report.aliveDraw} W.</p>
          {report.hard.map((line) => <p key={line} className="bad">{line}</p>)}
          {report.warnings.map((line) => <p key={line} className="warn">{line}</p>)}
        </div>
        <div className="ledger-actions">
          <button type="button" data-testid="auto" onClick={() => dispatch({ type: "autobuild" })}>
            Auto-build
          </button>
          <button
            type="button"
            className="primary"
            data-testid="launch"
            disabled={report.hard.length > 0}
            onClick={() => dispatch({ type: "launch" })}
          >
            {report.warnings.length > 0 ? "Launch anyway" : "Launch"}
          </button>
        </div>
      </div>
      <div
        className="stage"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <HangarScene parts={state.ship.parts} />
        <p className="caption">Side view. Drag a card onto the stack, or press it. Command, engine, and antenna are already on.</p>
      </div>
      <div className="parts">
        {OPTIONAL.map((id) => {
          const part = PARTS[id];
          const count = state.ship.parts.filter((item) => item === id).length;
          return (
            <article key={id} className="part-card">
              <button
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/part", id);
                  event.dataTransfer.setData("text/plain", id);
                }}
                onClick={() => dispatch({ type: "add", id })}
              >
                <strong>{part.name}{id === "tank" ? ` · ${count}` : count ? " · aboard" : ""}</strong>
                <span>{part.mass} kg · {part.role === "draw" ? `draws ${part.watts} W` : part.role === "none" ? "2.4 km/s" : `${part.watts} W`} · {part.cost}</span>
              </button>
              <p>{part.blurb}</p>
              {count > 0 && !part.required && (
                <button type="button" onClick={() => dispatch({ type: "remove", id })}>Remove</button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Meter({ label, value, max, warn }: { label: string; value: number; max: number; warn: boolean }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="meter">
      <div className="meter-label"><span>{label}</span><span>{value} / {max}</span></div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${width}%`, background: warn ? "var(--blood)" : "var(--amber)" }} />
      </div>
    </div>
  );
}
