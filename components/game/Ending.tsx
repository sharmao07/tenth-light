"use client";

import { useEffect, useState } from "react";
import { endingLines } from "@/lib/game/dialogue";
import type { EndingId } from "@/lib/game/types";
import { Portrait } from "./Portrait";

export function Ending({
  kind,
  callsign,
  onAgain,
}: {
  kind: EndingId;
  callsign: string;
  onAgain: () => void;
}) {
  const lines = endingLines(kind, callsign);
  const [index, setIndex] = useState(0);
  const [earth, setEarth] = useState<string | null>(null);
  const [caption, setCaption] = useState("Earth");
  const line = lines[index];
  const last = index >= lines.length - 1;

  useEffect(() => {
    let dead = false;
    fetch("/api/epic")
      .then((response) => response.json())
      .then(async (data) => {
        if (dead) return;
        if (data.image) {
          setEarth(data.image);
          setCaption(data.caption || "EPIC natural color");
          return;
        }
        const plate = await fetch("/api/plate?id=earth").then((response) => response.json());
        if (!dead && plate.href) {
          setEarth(plate.href);
          setCaption(plate.title || "Earth");
        }
      })
      .catch(() => undefined);
    return () => {
      dead = true;
    };
  }, []);

  const title = kind === "certified" ? "The files go downstairs" : kind === "uncertified" ? "Alive, and not yet in the record" : "A thin file";

  return (
    <section className="ending">
      {kind === "certified" && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 7) * 0.18}s`, background: index % 3 === 0 ? "var(--blood)" : index % 3 === 1 ? "var(--paper)" : "var(--amber)" }} />
          ))}
        </div>
      )}
      <div className="ending-copy">
        <p className="eyebrow">{title}</p>
        <div className="dialogue">
          <div className="portrait-frame">
            <Portrait who={line.who} />
          </div>
          <div className="dialogue-body">
            <p className="who">{line.name}</p>
            <p className="dialogue-copy">{line.text}</p>
            <div className="row">
              {!last && (
                <button type="button" className="primary" onClick={() => setIndex((value) => value + 1)}>
                  Continue
                </button>
              )}
              {last && (
                <button type="button" className="primary" onClick={onAgain}>
                  Fly the design again
                </button>
              )}
              <a href="/data">Data and credits</a>
            </div>
          </div>
        </div>
      </div>
      <figure className="window">
        <Portrait who="nori" />
        <figcaption>Nori takes the window.</figcaption>
        {earth && (
          // Remote NASA frames are not known at build time.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={earth} alt="Earth from a NASA image" />
        )}
        <figcaption className="caption">NASA. {caption}. Unaltered.</figcaption>
      </figure>
    </section>
  );
}
