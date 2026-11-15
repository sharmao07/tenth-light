'use client';
import React from 'react';
import type { ShipDesign, DialogueLine } from '@/lib/gameTypes';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { Ship3DView } from '@/components/Ship3DView';
import { DialogueBar } from '@/components/DialogueBar';
import { sound } from '@/components/AudioController';

interface BriefingPhaseProps {
  callsign: string;
  shipDesign: ShipDesign;
  activeDialogueLines: DialogueLine[];
  dialogueIndex: number;
  onAdvanceDialogue: () => void;
  onPreviousDialogue: () => void;
  onBriefingComplete: () => void;
}

export function BriefingPhase({
  callsign,
  shipDesign,
  activeDialogueLines,
  dialogueIndex,
  onAdvanceDialogue,
  onPreviousDialogue,
  onBriefingComplete,
}: BriefingPhaseProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-16 pt-8 md:pt-12 pb-44 select-none animate-fadeIn flex flex-col justify-between min-h-[calc(100vh-160px)]">
      <div>
        {/* Dossier Header */}
        <div className="flex items-baseline justify-between border-b border-paper/15 pb-4 mb-8">
          <div className="flex items-baseline gap-4">
            <span className="label text-signal">
              DOSSIER &middot; EXPEDITION ORDER 00
            </span>
            <span className="text-paper/40 text-xs font-mono">/</span>
            <span className="label text-paper-muted">
              DEPARTURE CLEARANCE PROTOCOL
            </span>
          </div>
          <div className="label text-paper-muted font-mono">
            REF: NASA-EXOPLANET-ARCHIVE-2026
          </div>
        </div>

        {/* Monumental Headline */}
        <div className="mb-8">
          <p className="label">Mission Directive &middot; Ground Station Uplink</p>
          <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-7xl tracking-tight text-paper mt-2">
            Flight Directive: <span className="font-extrabold text-paper">TOI-700 e</span>
          </h1>
          <p className="font-serif italic text-lg text-paper-muted mt-2 max-w-xl">
            Specialist {callsign} &middot; Sealed cabin flight &middot; Astromech Droid Nori deployed for surface sampling
          </p>
        </div>

        {/* Ruled Asymmetrical Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left Column: Large Uncropped NASA Photo of Earth + Exoplanet Archive Stats */}
          <div className="lg:col-span-6 space-y-6">
            <figure className="w-full border border-paper/15 bg-void p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={NASA_IMAGE_PLATES[10].url}
                alt={NASA_IMAGE_PLATES[10].caption}
                className="w-full max-h-[360px] object-contain bg-void"
              />
              <figcaption className="mt-3 font-mono text-xs text-paper-muted leading-relaxed border-t border-paper/10 pt-2">
                <span className="text-signal font-bold">PLATE 00 &middot;</span> {NASA_IMAGE_PLATES[10].caption}
                <span className="block mt-0.5 text-paper-muted font-mono text-[11px]">
                  Credit: {NASA_IMAGE_PLATES[10].credit}
                </span>
              </figcaption>
            </figure>

            {/* Exoplanet Archive Dossier Ledger */}
            <div className="border border-paper/15 p-5 bg-void font-mono text-xs space-y-3">
              <h2 className="label text-signal border-b border-paper/10 pb-2">
                NASA Exoplanet Archive Composite Parameters
              </h2>
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span className="text-paper font-bold">&check; Target: TOI-700 e (Harbor)</span>
                <span className="text-signal font-mono text-xs uppercase">Optimistic Habitable Zone</span>
              </div>
              <div className="text-paper-muted pl-2 space-y-0.5 text-[11px] tabular-nums">
                <div>Radius: 0.919 R&oplus; &middot; Mass: 0.718 M&oplus; &middot; Orbital Period: 27.81 days</div>
                <div>Insolation: 1.27 &middot; Equilibrium Temp: 272.9 K &middot; Distance: 101.5 ly (31.13 pc)</div>
                <div className="text-paper-muted italic">Discovered 2023 by transit photometry.</div>
              </div>

              <div className="flex justify-between py-1 border-b border-paper/10 pt-2">
                <span className="text-paper-muted font-bold">&cross; Twin You Do Not Fly: TOI-700 d</span>
                <span className="text-paper-muted text-[11px] uppercase">Outer Conservative Zone</span>
              </div>
              <div className="text-paper-muted pl-2 text-[11px] tabular-nums">
                1.145 R&oplus; &middot; 1.580 M&oplus; &middot; 37.42 days &middot; 268.8 K &middot; Discovered 2020.
              </div>
            </div>
          </div>

          {/* Right Column: 3D Vessel View + Pre-Flight Directives */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border border-paper/15 h-[360px] relative bg-void">
              <div className="absolute top-3 left-3 z-10 label text-[11px]">
                Integration Gantry &middot; Tenth Light Cabin
              </div>
              <Ship3DView design={shipDesign} interactive={true} />
            </div>

            <div className="border border-paper/15 p-5 bg-void space-y-4">
              <h2 className="label text-signal">Specialist Flight Orders</h2>
              <p className="font-serif text-sm text-paper leading-relaxed">
                &ldquo;Scientists demand empirical soil and water samples from Harbor. The hatch never opens
                for human footsteps. At TOI-700 e, Droid Nori walks the sample sleeve across the cryogenic
                regolith. Earth&rsquo;s reception when you coast home depends entirely on what your sensors certify.&rdquo;
              </p>
              <button
                onClick={onBriefingComplete}
                onMouseEnter={() => sound.playHoverBlip()}
                className="btn w-full text-center"
              >
                <span>Enter VAB Assembly Bay (Stage 0)</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Dialogue Bar */}
      <DialogueBar
        lines={activeDialogueLines}
        currentIndex={dialogueIndex}
        onAdvance={onAdvanceDialogue}
        onPrevious={onPreviousDialogue}
        onComplete={onBriefingComplete}
      />
    </div>
  );
}
