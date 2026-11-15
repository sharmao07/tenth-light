"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { legBetween, STOPS } from "@/lib/game/catalog";
import { briefingLines, SCRIPTS } from "@/lib/game/dialogue";
import { endingKind } from "@/lib/game/ship";
import { initialState, reduce, type Action } from "@/lib/game/logic";
import { HONESTY, parsecsToLightYears, ARCHIVE_SNAPSHOT, type WorldCard } from "@/lib/game/snapshot";
import type { GameState, PartId, Who } from "@/lib/game/types";
import { blip, setMuted } from "./audio";
import { HoldControls } from "./HoldControls";
import { DodgeRing } from "./DodgeRing";
import { Ending } from "./Ending";
import { Fight } from "./Fight";
import { Hangar } from "./Hangar";
import { Maze } from "./Maze";
import { Portrait } from "./Portrait";
import {
  CeresPuzzle,
  EnceladusPuzzle,
  ManifestPuzzle,
  MarsPuzzle,
  MoonPuzzle,
  NeptunePuzzle,
  PlutoPuzzle,
  UranusPuzzle,
} from "./Puzzles";

const HangarScene = dynamic(() => import("./HangarScene"), { ssr: false });
const TransitScene = dynamic(() => import("./TransitScene"), { ssr: false });

const SAVE = "tenth-light-v1";
const SAVE_EVENT = "tenth-light-save";

function rememberSave() {
  window.dispatchEvent(new Event(SAVE_EVENT));
}

function useSavedRun() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(SAVE_EVENT, onStoreChange);
      return () => window.removeEventListener(SAVE_EVENT, onStoreChange);
    },
    () => Boolean(window.localStorage.getItem(SAVE)),
    () => false,
  );
}

function useClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Game() {
  const [state, dispatch] = useReducer(reduce, initialState);
  const client = useClient();
  const canResume = useSavedRun();
  const [muted, setMuteState] = useState(false);
  const [paused, setPaused] = useState(false);
  const [worlds, setWorlds] = useState<WorldCard[]>(ARCHIVE_SNAPSHOT);
  const [archiveSource, setArchiveSource] = useState("snapshot");

  useEffect(() => {
    fetch("/api/neo")
      .then((response) => response.json())
      .then((data) => {
        if (data.bodies?.length) dispatch({ type: "neos", bodies: data.bodies });
      })
      .catch(() => undefined);
    fetch("/api/archive")
      .then((response) => response.json())
      .then((data) => {
        if (data.worlds?.length) {
          setWorlds(data.worlds);
          setArchiveSource(data.source);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (state.phase.kind === "title") return;
    window.localStorage.setItem(SAVE, JSON.stringify(state));
    rememberSave();
  }, [state]);

  function send(action: Action) {
    if (action.type === "dodge") blip(action.hit ? "ok" : "miss");
    else if (action.type === "fight-hit") blip("miss");
    else if (action.type === "maze-hit") blip("miss");
    else if (action.type === "fight-win" || action.type === "puzzle-pass" || action.type === "maze-done") blip("ok");
    else if (action.type === "launch" || action.type === "autobuild") blip("launch");
    else if (action.type === "next-line" || action.type === "prev-line" || action.type === "talk-next" || action.type === "talk-prev") blip("talk");
    else blip("ui");
    dispatch(action);
  }

  function toggleSound() {
    const next = !muted;
    setMuteState(next);
    setMuted(next);
    if (!next) blip("ok");
  }

  function resume() {
    const raw = window.localStorage.getItem(SAVE);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as GameState;
      if (saved.v === 1 && saved.phase) send({ type: "resume", state: saved });
    } catch {
      window.localStorage.removeItem(SAVE);
    }
  }

  function again() {
    window.localStorage.removeItem(SAVE);
    rememberSave();
    send({ type: "restart" });
  }

  function toMenu() {
    setPaused(false);
    send({ type: "restart" });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setPaused((value) => !value);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stopName = state.phase.kind === "transit"
    ? legBetween(state.phase.from, state.phase.to).name
    : state.phase.kind === "talk" || state.phase.kind === "puzzle"
      ? STOPS[state.phase.stop].name
      : state.phase.kind === "fight"
        ? "Jupiter"
        : state.phase.kind === "maze" || state.phase.kind === "return"
          ? "Harbor"
          : state.phase.kind === "ending"
            ? "Earth"
            : "Earth";

  const here = currentStop(state);
  const beat = beatId(state);
  const [closedHint, setClosedHint] = useState("");
  const hint = hintFor(beat);
  const showHint = Boolean(hint) && closedHint !== beat;

  return (
    <div className="game-root">
      <header className="hud">
        <div>
          <p className="brand">Tenth Light</p>
          <p className="hud-meta">{stopName}{state.phase.kind !== "title" && state.phase.kind !== "briefing" && state.phase.kind !== "hangar" ? ` · ${state.dv} m/s left` : ""}</p>
        </div>
        <ol className="rail" aria-label="Corridor">
          {STOPS.map((stop) => (
            <li key={stop.id} className={stop.id === here ? "here" : stop.id < here ? "done" : ""} title={stop.name}>
              {stop.id}
            </li>
          ))}
        </ol>
        <div className="lives" aria-label={`${state.lives} lives`}>
          {[0, 1, 2].map((index) => (
            <span key={index} className={index < state.lives ? "life on" : "life"} aria-hidden="true">♥</span>
          ))}
        </div>
        <div className="hud-tools">
          {state.phase.kind !== "title" && (
            <HoldControls paused={paused} onToggle={() => setPaused((value) => !value)} onMenu={toMenu} />
          )}
          <button type="button" onClick={toggleSound}>{muted ? "Sound" : "Mute"}</button>
        </div>
      </header>
      <main>
        <div key={sceneKey(state.phase)} className="screen-in">
        {state.phase.kind === "title" && (
          <section className="title">
            <div className="title-copy">
              <p className="eyebrow">NASA Space Apps 2026 · Space Mission Design Game</p>
              <h1>Tenth Light</h1>
              <p className="lede">Design the ship. Stay in the seat. Send the droid.</p>
              <label>
                Callsign
                <input
                  value={state.callsign}
                  maxLength={16}
                  onChange={(event) => dispatch({ type: "callsign", value: event.target.value })}
                />
              </label>
              <div className="row">
                <button type="button" className="primary" data-testid="begin" onClick={() => send({ type: "begin" })}>
                  Open the briefing
                </button>
                {canResume && (
                  <button type="button" onClick={resume}>Resume the corridor</button>
                )}
              </div>
              <p className="caption">{HONESTY}</p>
            </div>
            <div className="title-stage">
              {client ? <HangarScene parts={["command", "engine", "antenna"]} spin /> : <div className="stage-loading">Lighting the hangar</div>}
            </div>
          </section>
        )}

        {state.phase.kind === "briefing" && (
          <Talk
            parts={state.ship.parts}
            showScene={client}
            who={briefingLines(state.callsign || "Wren")[state.phase.line].who}
            name={briefingLines(state.callsign || "Wren")[state.phase.line].name}
            text={briefingLines(state.callsign || "Wren")[state.phase.line].text}
            line={state.phase.line}
            last={state.phase.line === briefingLines(state.callsign || "Wren").length - 1}
            paused={paused}
            onPrev={() => send({ type: "prev-line" })}
            onNext={() => send({ type: "next-line" })}
            onCta={() => send({ type: "briefing-done" })}
          >
            {state.phase.line === briefingLines(state.callsign || "Wren").length - 1 && (
              <div className="cards">
                {worlds.map((world) => (
                  <article key={world.name} className={world.name.endsWith("e") ? "card fly" : "card"}>
                    <p className="eyebrow">{world.nickname}</p>
                    <h3>{world.name}</h3>
                    <p>{Number(world.radius).toFixed(3)} Earth radii · {Number(world.insolation).toFixed(2)} Earth sunlight</p>
                    <p>Equilibrium temperature {Number(world.eqt).toFixed(1)} K. Not a weather report.</p>
                    <p>{parsecsToLightYears(Number(world.distancePc)).toFixed(1)} light years · discovered {world.year}</p>
                  </article>
                ))}
                <p className="caption">NASA Exoplanet Archive composite parameters. {archiveSource}.</p>
              </div>
            )}
          </Talk>
        )}

        {state.phase.kind === "hangar" && <Hangar state={state} dispatch={send} />}

        {state.phase.kind === "transit" && (
          <section className="transit">
            {client && <TransitScene parts={state.ship.parts} approaching={state.phase.dodgesLeft > 0} />}
            {state.phase.dodgesLeft > 0 && (
              <DodgeRing
                key={`${state.lives}-${state.phase.dodgesLeft}-${state.phase.neo.name}`}
                neo={state.phase.neo}
                showTip={state.phase.showTip}
                paused={paused}
                onResult={(hit) => send({ type: "dodge", hit })}
              />
            )}
          </section>
        )}

        {state.phase.kind === "talk" && (
          <Talk
            parts={state.ship.parts}
            showScene={client}
            who={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].who}
            name={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].name}
            text={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].text}
            line={state.phase.line}
            last={state.phase.line === SCRIPTS[state.phase.script](state.callsign).length - 1}
            paused={paused}
            onPrev={() => send({ type: "talk-prev" })}
            onNext={() => send({ type: "talk-next" })}
            onCta={() => send({ type: "talk-cta" })}
          />
        )}

        {state.phase.kind === "puzzle" && (
          <section className="puzzle-screen">
            <Puzzle stop={state.phase.stop} state={state} dispatch={send} paused={paused} />
          </section>
        )}

        {state.phase.kind === "fight" && (
          <Fight
            parts={state.ship.parts}
            lives={state.lives}
            paused={paused}
            onHit={() => send({ type: "fight-hit" })}
            onWin={() => send({ type: "fight-win" })}
          />
        )}

        {state.phase.kind === "maze" && (
          <Maze
            lives={state.lives}
            paused={paused}
            onHit={() => send({ type: "maze-hit" })}
            onDone={(samples) => send({ type: "maze-done", ...samples })}
          />
        )}

        {state.phase.kind === "return" && (
          <section className="return">
            {client && <TransitScene parts={state.ship.parts} approaching={false} />}
            <div className="return-card">
              <p className="eyebrow">Direct</p>
              <h2>No more gates.</h2>
              <p>The sleeve is stowed. The hatch never opened. Earth is the next word.</p>
              <button type="button" className="primary" onClick={() => send({ type: "coast-home" })}>
                Coast home
              </button>
            </div>
          </section>
        )}

        {state.phase.kind === "ending" && (
          <Ending kind={endingKind(state)} callsign={state.callsign} onAgain={again} />
        )}
        </div>
        {showHint && hint && (
          <div className="hint-backdrop">
            <div className="hint" role="dialog" aria-labelledby="hint-title">
              <p className="eyebrow">How to play</p>
              <h2 id="hint-title">{hint.gate}</h2>
              <p>{hint.how}</p>
              <button type="button" className="primary" onClick={() => { blip("ui"); setClosedHint(beat); }}>
                Start this gate
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="bar">
        <p>Real places through the heliopause. Harbor is a labeled simulation.</p>
        <details>
          <summary>Log</summary>
          <ul>
            {state.log.slice(-8).map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
          </ul>
        </details>
        <a href="/data">Data</a>
      </footer>
    </div>
  );
}

function Talk({
  who,
  name,
  text,
  line,
  last,
  paused,
  onPrev,
  onNext,
  onCta,
  children,
  parts,
  showScene,
}: {
  who: Who;
  name: string;
  text: string;
  line: number;
  last: boolean;
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onCta: () => void;
  children?: ReactNode;
  parts: PartId[];
  showScene: boolean;
}) {
  const [auto, setAuto] = useState(false);
  const nextRef = useRef(onNext);
  const ctaRef = useRef(onCta);
  useLayoutEffect(() => {
    nextRef.current = onNext;
    ctaRef.current = onCta;
  });

  useEffect(() => {
    if (!auto || paused) return;
    const timer = window.setInterval(() => {
      if (last) ctaRef.current();
      else nextRef.current();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [auto, paused, last, text]);

  function advance() {
    if (last) onCta();
    else onNext();
  }

  return (
    <section className="talk-stage">
      {showScene && <TransitScene parts={parts} approaching={false} />}
      {children && <div className="sky-cards">{children}</div>}
      <div className="dialogue-float">
        <div className="dialogue-box" aria-live="polite">
          <div key={who} className="line-in">
            <Portrait who={who} />
          </div>
          <div key={text} className="line-in">
            <p className="who">{name}</p>
            <p className="dialogue-copy">{text}</p>
          </div>
        </div>
        <div className="dialogue-nav">
          <button type="button" data-testid="prev" onClick={onPrev} disabled={line <= 0}>Previous</button>
          <button type="button" data-testid="auto" className={auto ? "selected" : ""} aria-pressed={auto} onClick={() => setAuto((value) => !value)}>
            Auto
          </button>
          <button type="button" className="primary" data-testid={last ? "cta" : "continue"} onClick={advance}>Next</button>
        </div>
      </div>
    </section>
  );
}

const HINTS: Record<string, { gate: string; how: string }> = {
  hangar: {
    gate: "Vehicle assembly",
    how: "Pick a launcher, then stack tanks, power, and the two sample tools. Auto-build loads the ship that can certify water and soil and still heat the bus at Uranus. Launch when the red lines are gone.",
  },
  moon: {
    gate: "The Moon",
    how: "Turn the dish until your bearing is within 14 degrees of the number from JPL Horizons. Then lock it.",
  },
  mars: {
    gate: "Mars",
    how: "The scale is nine kilograms over. Drop the souvenir. Leave Nori’s optic where it is.",
  },
  ceres: {
    gate: "Ceres",
    how: "Three rocks. Dawn orbited the largest. Choose that one. The diameters come from the Small-Body Database.",
  },
  fight: {
    gate: "Jupiter ambush",
    how: "Move with the arrows and shoot. Clear three waves. Each hit spends one of your three lives.",
  },
  enceladus: {
    gate: "Enceladus",
    how: "Point at the south-pole jets. That plume is the water Cassini flew through.",
  },
  uranus: {
    gate: "Uranus",
    how: "Keep the heater, computer, and radio on. If the bus is over the supply, switch the imager off. With no radioisotope power, the flight is scrubbed.",
  },
  neptune: {
    gate: "Neptune",
    how: "Send one command, then wait. A second command collides with the first. The hours on screen are the real light-time.",
  },
  pluto: {
    gate: "Pluto",
    how: "Mark the heart on the map. The NASA photograph is evidence. It is not a soil sample.",
  },
  whisper: {
    gate: "Heliopause",
    how: "Set the return in this order: water and soil readings, then the power log, then the postcard.",
  },
  maze: {
    gate: "Harbor",
    how: "You stay in the ship. Nori is the ship’s droid. Move her with the arrows. Find the key, walk her into the gate, then pick up two water nodes and two soil nodes. Step off the aliens. A touch spends a life.",
  },
};

function sceneKey(phase: GameState["phase"]): string {
  if (phase.kind === "transit") return `transit-${phase.from}-${phase.to}`;
  if (phase.kind === "talk") return `talk-${phase.script}`;
  if (phase.kind === "puzzle") return `puzzle-${phase.stop}`;
  return phase.kind;
}

function hintFor(beat: string): { gate: string; how: string } | null {
  if (beat.startsWith("dodge-")) {
    return {
      gate: "Asteroid",
      how: "A white mark sweeps the ring. Click while it sits on the amber arc. The name, size, and speed belong to a real near-Earth object. A miss spends a life.",
    };
  }
  return HINTS[beat] ?? null;
}

function beatId(state: GameState): string {
  if (state.phase.kind === "hangar") return "hangar";
  if (state.phase.kind === "transit" && state.phase.dodgesLeft > 0) {
    return `dodge-${state.phase.from}-${state.phase.to}`;
  }
  if (state.phase.kind === "puzzle") {
    const names = ["", "moon", "mars", "ceres", "", "enceladus", "uranus", "neptune", "pluto", "whisper"];
    return names[state.phase.stop] ?? "";
  }
  if (state.phase.kind === "fight") return "fight";
  if (state.phase.kind === "maze") return "maze";
  return "";
}

function currentStop(state: GameState): number {
  if (state.phase.kind === "transit") return state.phase.to;
  if (state.phase.kind === "talk" || state.phase.kind === "puzzle") return state.phase.stop;
  if (state.phase.kind === "fight") return 4;
  if (state.phase.kind === "maze" || state.phase.kind === "return") return 10;
  return 0;
}

function Puzzle({
  stop,
  state,
  dispatch,
  paused,
}: {
  stop: number;
  state: GameState;
  dispatch: (action: Action) => void;
  paused: boolean;
}) {
  const pass = (frozen?: PartId[]) => dispatch({ type: "puzzle-pass", frozen });
  if (stop === 1) return <MoonPuzzle onPass={() => pass()} />;
  if (stop === 2) return <MarsPuzzle ship={state.ship} onPass={() => pass()} />;
  if (stop === 3) return <CeresPuzzle onPass={() => pass()} />;
  if (stop === 5) return <EnceladusPuzzle onPass={() => pass()} />;
  if (stop === 6) return <UranusPuzzle ship={state.ship} onPass={(frozen) => pass(frozen)} onScrub={() => dispatch({ type: "scrub" })} />;
  if (stop === 7) return <NeptunePuzzle paused={paused} onPass={() => pass()} />;
  if (stop === 8) return <PlutoPuzzle onPass={() => pass()} />;
  if (stop === 9) return <ManifestPuzzle onPass={() => pass()} />;
  return null;
}
