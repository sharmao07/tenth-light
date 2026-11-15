'use client';
import React from 'react';
import type { ShipDesign } from '@/lib/gameTypes';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { Ship3DView } from '@/components/Ship3DView';
import { DodgeRing } from '@/components/DodgeRing';

interface TransitPhaseProps {
  currentStop: number;
  currentDeltaV: number;
  stopName: string;
  shipDesign: ShipDesign;
  isPaused: boolean;
  currentDodgeIndex: number;
  totalDodgesOnLeg: number;
  onDodgeSuccess: () => void;
  onDodgeMiss: () => void;
}

export function TransitPhase({
  currentStop,
  currentDeltaV,
  stopName,
  shipDesign,
  isPaused,
  currentDodgeIndex,
  totalDodgesOnLeg,
  onDodgeSuccess,
  onDodgeMiss,
}: TransitPhaseProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-3 md:py-4 select-none animate-fadeIn flex flex-col justify-start pb-6">
      {/* Top Dossier Ledger Bar */}
      <div className="flex items-baseline justify-between border-b border-paper/15 pb-2 mb-3">
        <div className="flex items-baseline gap-3">
          <span className="label text-signal">
            DOSSIER &middot; TRANSIT LEG 0<span className="tabular-nums">{currentStop}</span>
          </span>
          <span className="text-paper/40 text-xs font-mono">/</span>
          <span className="label text-paper-muted">
            INTERPLANETARY CORRIDOR &middot; {stopName}
          </span>
        </div>
        <div className="label text-paper-muted">
          REMAINING DELTA-V: <span className="text-signal font-bold tabular-nums font-mono">{currentDeltaV} m/s</span>
        </div>
      </div>

      {/* Monumental Headline */}
      <div className="mb-3">
        <p className="label text-[11px]">Interplanetary Burn &middot; Hazard Avoidance</p>
        <h1 className="font-serif font-extralight text-3xl sm:text-4xl md:text-5xl tracking-tight text-paper mt-0.5">
          Cruising to <span className="font-extrabold text-paper">{stopName.replace(/\s*\([^)]*\)/g, '').trim()}</span>
        </h1>
      </div>

      {/* Ruled 2-Column Transit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mb-3">
        {/* Left Column: Approaching Target Real NASA Image Plate */}
        <div className="lg:col-span-5 space-y-2">
          {NASA_IMAGE_PLATES[currentStop] && (
            <figure className="w-full border border-paper/15 bg-void p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={NASA_IMAGE_PLATES[currentStop].url}
                alt={NASA_IMAGE_PLATES[currentStop].caption}
                className="w-full max-h-[220px] sm:max-h-[250px] md:max-h-[280px] object-contain bg-void"
              />
              <figcaption className="mt-1.5 font-mono text-[11px] text-paper-muted leading-tight border-t border-paper/10 pt-1.5">
                <span className="text-signal font-bold">APPROACH TARGET &middot;</span> {NASA_IMAGE_PLATES[currentStop].caption}
                <span className="block mt-0.5 text-paper-dim font-mono text-[10px]">
                  Credit: {NASA_IMAGE_PLATES[currentStop].credit}
                </span>
              </figcaption>
            </figure>
          )}
        </div>

        {/* Right Column: 3D Cruising View & Dodge Ring */}
        <div className="lg:col-span-7">
          <div className="border border-paper/15 h-[280px] sm:h-[310px] md:h-[330px] relative bg-void">
            <Ship3DView design={shipDesign} cruiseMode={true} interactive={true} />
            <DodgeRing
              key={`dodge-${currentDodgeIndex}`}
              isPaused={isPaused}
              dodgeIndex={currentDodgeIndex}
              totalDodges={totalDodgesOnLeg}
              onSuccess={onDodgeSuccess}
              onMiss={onDodgeMiss}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
