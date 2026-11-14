"use client";

import { useEffect, useRef } from "react";
import type { NeoBody } from "@/lib/game/types";

const START = 208;
const END = 278;

function arc(start: number, end: number, radius: number) {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [120 + Math.cos(rad) * radius, 120 + Math.sin(rad) * radius];
  };
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
}

export function DodgeRing({
  neo,
  showTip,
  onResult,
}: {
  neo: NeoBody;
  showTip: boolean;
  onResult: (hit: boolean) => void;
}) {
  const angle = useRef(0);
  const dot = useRef<SVGCircleElement>(null);
  const ring = useRef<SVGSVGElement>(null);
  const done = useRef(false);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      angle.current = (angle.current + dt * 0.11) % 360;
      const rad = ((angle.current - 90) * Math.PI) / 180;
      const cx = 120 + Math.cos(rad) * 78;
      const cy = 120 + Math.sin(rad) * 78;
      dot.current?.setAttribute("cx", cx.toFixed(2));
      dot.current?.setAttribute("cy", cy.toFixed(2));
      ring.current?.setAttribute("data-angle", angle.current.toFixed(1));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  function resolve() {
    if (done.current) return;
    done.current = true;
    const value = angle.current;
    const hit = value >= START && value <= END;
    onResult(hit);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        resolve();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const diameter =
    neo.diameterKm == null ? "diameter withheld" : `${neo.diameterKm.toFixed(3)} km across`;
  const speed = neo.velocityKmS == null ? "speed withheld" : `${neo.velocityKmS.toFixed(1)} km/s`;

  return (
    <div className="dodge">
      <div>
        <button type="button" className="ring-button" onClick={resolve} data-testid="dodge">
          <svg ref={ring} viewBox="0 0 240 240" className="ring" aria-hidden="true">
            <circle cx="120" cy="120" r="78" fill="none" stroke="#2a261f" strokeWidth="10" />
            <path d={arc(START, END, 78)} fill="none" stroke="#e39b12" strokeWidth="16" strokeLinecap="butt" />
            <circle ref={dot} cx="120" cy="42" r="8" fill="#f3eee4" />
          </svg>
          <span className="ring-label">Click on the amber arc</span>
        </button>
      </div>
      <div className="neo-card">
        {showTip && (
          <p>Nori: Amber arc. Click when the white mark is on it. Miss, and we spend a life.</p>
        )}
        <p className="neo-name">{neo.name}</p>
        <p>{diameter}</p>
        <p>{speed}</p>
        <p>{neo.hazardous ? "Flagged potentially hazardous." : "Not flagged hazardous."}</p>
        <p className="caption">NASA NeoWs, or the onboard snapshot if the feed is quiet.</p>
      </div>
    </div>
  );
}
