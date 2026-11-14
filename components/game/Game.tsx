"use client";

import dynamic from "next/dynamic";
import { useEffect, useReducer, useState, useSyncExternalStore, type ReactNode } from "react";
import { legBetween, STOPS } from "@/lib/game/catalog";
import { briefingLines, SCRIPTS, TALK_CTA } from "@/lib/game/dialogue";
import { endingKind } from "@/lib/game/ship";
import { initialState, reduce, type Action } from "@/lib/game/logic";
import { HONESTY, parsecsToLightYears, ARCHIVE_SNAPSHOT, type WorldCard } from "@/lib/game/snapshot";
import type { GameState, PartId, Who } from "@/lib/game/types";
import { blip, setMuted } from "./audio";
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
  const [muted, setMuteState] = useState(true);
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
    if (action.type === "fight-hit") blip("miss");
    if (action.type === "fight-win" || action.type === "puzzle-pass") blip("ok");
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

  return (
    <div className="game-root">
      <header className="hud">
        <div>
          <p className="brand">Tenth Light</p>
          <p className="hud-meta">{stopName}{state.phase.kind !== "title" && state.phase.kind !== "briefing" && state.phase.kind !== "hangar" ? ` · ${state.dv} m/s left` : ""}</p>
        </div>
        <div className="lives" aria-label={`${state.lives} lives`}>
          {[0, 1, 2].map((index) => (
            <span key={index} className={index < state.lives ? "life on" : "life"} />
          ))}
        </div>
        <button type="button" onClick={toggleSound}>{muted ? "Turn sound on" : "Turn sound off"}</button>
      </header>
      <main>
        {state.phase.kind === "title" && (
          <section className="title">
            <div>
              <p className="eyebrow">NASA Space Apps 2026 · Space Mission Design Game</p>
              <h1>Tenth Light</h1>
              <p className="lede">Design the ship. Stay in the seat. Send the cat.</p>
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
            who={briefingLines(state.callsign || "Wren")[state.phase.line].who}
            name={briefingLines(state.callsign || "Wren")[state.phase.line].name}
            text={briefingLines(state.callsign || "Wren")[state.phase.line].text}
            cta={state.phase.line === briefingLines(state.callsign || "Wren").length - 1 ? "Build the ship" : null}
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
                onResult={(hit) => send({ type: "dodge", hit })}
              />
            )}
          </section>
        )}

        {state.phase.kind === "talk" && (
          <Talk
            who={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].who}
            name={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].name}
            text={SCRIPTS[state.phase.script](state.callsign)[state.phase.line].text}
            cta={state.phase.line === SCRIPTS[state.phase.script](state.callsign).length - 1 ? TALK_CTA[state.phase.script] : null}
            onNext={() => send({ type: "talk-next" })}
            onCta={() => send({ type: "talk-cta" })}
          />
        )}

        {state.phase.kind === "puzzle" && (
          <section className="puzzle-screen">
            <Puzzle stop={state.phase.stop} state={state} dispatch={send} />
          </section>
        )}

        {state.phase.kind === "fight" && (
          <Fight
            parts={state.ship.parts}
            lives={state.lives}
            onHit={() => send({ type: "fight-hit" })}
            onWin={() => send({ type: "fight-win" })}
          />
        )}

        {state.phase.kind === "maze" && (
          <Maze onDone={(samples) => send({ type: "maze-done", ...samples })} />
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
      </main>
      <footer>
        <p>{HONESTY}</p>
        <details>
          <summary>Mission log</summary>
          <ul>
            {state.log.slice(-8).map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
          </ul>
        </details>
        <a href="/data">Data and credits</a>
      </footer>
    </div>
  );
}

function Talk({
  who,
  name,
  text,
  cta,
  onNext,
  onCta,
  children,
}: {
  who: Who;
  name: string;
  text: string;
  cta: string | null;
  onNext: () => void;
  onCta: () => void;
  children?: ReactNode;
}) {
  return (
    <section className="dialogue" aria-live="polite">
      <Portrait who={who} />
      <div>
        <p className="who">{name}</p>
        <p className="dialogue-copy">{text}</p>
        {children}
        <div className="row">
          {cta ? (
            <button type="button" className="primary" data-testid="cta" onClick={onCta}>{cta}</button>
          ) : (
            <button type="button" className="primary" data-testid="continue" onClick={onNext}>Continue</button>
          )}
        </div>
      </div>
    </section>
  );
}

function Puzzle({
  stop,
  state,
  dispatch,
}: {
  stop: number;
  state: GameState;
  dispatch: (action: Action) => void;
}) {
  const pass = (frozen?: PartId[]) => dispatch({ type: "puzzle-pass", frozen });
  if (stop === 1) return <MoonPuzzle onPass={() => pass()} />;
  if (stop === 2) return <MarsPuzzle ship={state.ship} onPass={() => pass()} />;
  if (stop === 3) return <CeresPuzzle onPass={() => pass()} />;
  if (stop === 5) return <EnceladusPuzzle onPass={() => pass()} />;
  if (stop === 6) return <UranusPuzzle ship={state.ship} onPass={(frozen) => pass(frozen)} onScrub={() => dispatch({ type: "scrub" })} />;
  if (stop === 7) return <NeptunePuzzle onPass={() => pass()} />;
  if (stop === 8) return <PlutoPuzzle onPass={() => pass()} />;
  if (stop === 9) return <ManifestPuzzle onPass={() => pass()} />;
  return null;
}
