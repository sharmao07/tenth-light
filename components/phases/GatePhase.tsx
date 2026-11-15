'use client';
import React from 'react';
import type { ShipDesign, DialogueLine } from '@/lib/gameTypes';
import { STOP_DOSSIER_INFO } from '@/lib/gameTypes';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { DialogueBar } from '@/components/DialogueBar';
import { MoonHorizons } from '@/components/puzzles/MoonHorizons';
import { MarsSouvenir } from '@/components/puzzles/MarsSouvenir';
import { CeresSelection } from '@/components/puzzles/CeresSelection';
import { FormationShooter } from '@/components/FormationShooter';
import { EnceladusPlume } from '@/components/puzzles/EnceladusPlume';
import { UranusBreakers } from '@/components/puzzles/UranusBreakers';
import { NeptuneLag } from '@/components/puzzles/NeptuneLag';
import { PlutoHeart } from '@/components/puzzles/PlutoHeart';
import { HeliopauseOrder } from '@/components/puzzles/HeliopauseOrder';
import { SleeveMaze } from '@/components/SleeveMaze';

interface GatePhaseProps {
  currentStop: number;
  stopName: string;
  lives: number;
  currentDeltaV: number;
  shipDesign: ShipDesign;
  isPaused: boolean;
  dialoguePhase: 'before' | 'success' | null;
  activeDialogueLines: DialogueLine[];
  dialogueIndex: number;
  onAdvanceDialogue: () => void;
  onPreviousDialogue: () => void;
  onDialogueComplete: () => void;
  onPuzzleSuccess: () => void;
  onSpendLife: () => void;
  onScrubToHangar: () => void;
  onUranusBreakersPassed: () => void;
  onHarborSampleVictory: (water: boolean, soil: boolean) => void;
  onOpenHowThisWorks: () => void;
}

export function GatePhase({
  currentStop,
  stopName,
  lives,
  currentDeltaV,
  shipDesign,
  isPaused,
  dialoguePhase,
  activeDialogueLines,
  dialogueIndex,
  onAdvanceDialogue,
  onPreviousDialogue,
  onDialogueComplete,
  onPuzzleSuccess,
  onSpendLife,
  onScrubToHangar,
  onUranusBreakersPassed,
  onHarborSampleVictory,
  onOpenHowThisWorks,
}: GatePhaseProps) {
  const dossier = STOP_DOSSIER_INFO[currentStop] || STOP_DOSSIER_INFO[0];

  return (
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 py-3 md:py-4 select-none animate-fadeIn flex flex-col justify-start ${
      dialoguePhase ? 'pb-32 md:pb-36' : 'pb-6'
    }`}>
      <div>
        {/* Top Dossier Ledger Bar */}
        <div className="flex flex-wrap items-baseline justify-between border-b border-paper/15 pb-3 mb-4 gap-3">
          <div className="flex items-baseline gap-3">
            <span className="label text-signal">
              DOSSIER &middot; STOP 0<span className="tabular-nums">{currentStop}</span>
            </span>
            <span className="text-paper/40 text-xs font-mono">/</span>
            <span className="label text-paper-muted">
              {dossier.sector} &middot; <span className="tabular-nums">{dossier.distance}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenHowThisWorks}
              className="btn-quiet !border-signal !text-signal font-mono text-xs uppercase"
              title="Review Clearance Directive Instructions [H]"
            >
              How this works [H]
            </button>
            <div className="label text-paper-muted font-mono hidden sm:block">
              HERITAGE: {dossier.historicalMission}
            </div>
          </div>
        </div>

        {/* Monumental Type-Led Headline */}
        <div className="mb-4 border-b border-paper/15 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <p className="label text-[11px]">Planetary Gate Challenge &middot; Clearance Required</p>
            <h1 className="font-serif font-extralight text-3xl sm:text-4xl md:text-5xl tracking-tight text-paper mt-0.5">
              {stopName.replace(/\s*\([^)]*\)/g, '').trim()} <span className="font-extrabold text-paper">Station</span>
            </h1>
          </div>

          <div className="label text-paper-muted font-mono">
            Hull: <span className="text-signal font-bold tabular-nums">{lives}/3</span> &middot; Delta-V: <span className="text-paper font-bold tabular-nums">{currentDeltaV} m/s</span>
          </div>
        </div>

        {/* Ruled 2-Column Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-4">
          {/* Left Column: Real NASA Image Plate */}
          <div className="lg:col-span-5 space-y-2">
            {NASA_IMAGE_PLATES[currentStop] && (
              <figure className="w-full border border-paper/15 bg-void p-2.5 sm:p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={NASA_IMAGE_PLATES[currentStop].url}
                  alt={NASA_IMAGE_PLATES[currentStop].caption}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className={`w-full object-contain bg-void ${
                    dialoguePhase ? 'max-h-[180px] sm:max-h-[210px] md:max-h-[230px]' : 'max-h-[220px] sm:max-h-[260px] md:max-h-[280px]'
                  }`}
                />
                <figcaption className="mt-2.5 font-mono text-xs text-paper-muted leading-relaxed border-t border-paper/10 pt-2">
                  <span className="text-signal font-bold">PLATE 0<span className="tabular-nums">{currentStop}</span> &middot;</span> {NASA_IMAGE_PLATES[currentStop].caption}
                  <span className="block mt-1 text-paper-dim font-mono text-[11px]">
                    Credit: {NASA_IMAGE_PLATES[currentStop].credit}
                  </span>
                </figcaption>
              </figure>
            )}
          </div>

          {/* Right Column: Interactive Puzzle Console */}
          <div className="lg:col-span-7">
            {!dialoguePhase ? (
              <div className="w-full border border-paper/15 p-4 sm:p-5 md:p-6 bg-void">
                {currentStop === 1 && <MoonHorizons onSuccess={onPuzzleSuccess} />}
                {currentStop === 2 && <MarsSouvenir onSuccess={onPuzzleSuccess} />}
                {currentStop === 3 && <CeresSelection onSuccess={onPuzzleSuccess} />}
                {currentStop === 4 && (
                  <FormationShooter
                    isPaused={isPaused}
                    onVictory={onPuzzleSuccess}
                    onHit={onSpendLife}
                  />
                )}
                {currentStop === 5 && <EnceladusPlume onSuccess={onPuzzleSuccess} />}
                {currentStop === 6 && (
                  <UranusBreakers
                    design={shipDesign}
                    onSuccess={() => {
                      onUranusBreakersPassed();
                      onPuzzleSuccess();
                    }}
                    onScrubToHangar={onScrubToHangar}
                  />
                )}
                {currentStop === 7 && (
                  <NeptuneLag isPaused={isPaused} onSuccess={onPuzzleSuccess} />
                )}
                {currentStop === 8 && <PlutoHeart onSuccess={onPuzzleSuccess} />}
                {currentStop === 9 && <HeliopauseOrder onSuccess={onPuzzleSuccess} />}
                {currentStop === 10 && (
                  <SleeveMaze
                    isPaused={isPaused}
                    lives={lives}
                    onVictory={(w, s) => {
                      onHarborSampleVictory(w, s);
                      onPuzzleSuccess();
                    }}
                    onHit={onSpendLife}
                  />
                )}
              </div>
            ) : (
              <div className="w-full border border-paper/15 p-4 bg-void space-y-2">
                <span className="label text-signal">Incoming Gate Transmission</span>
                <p className="font-serif italic text-sm md:text-base text-paper leading-relaxed">
                  Communications feed established with the planetary gate entity. Review mission dialogue below.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Dialogue Bar */}
      {dialoguePhase && (
        <DialogueBar
          lines={activeDialogueLines}
          currentIndex={dialogueIndex}
          onAdvance={onAdvanceDialogue}
          onPrevious={onPreviousDialogue}
          onComplete={onDialogueComplete}
        />
      )}
    </div>
  );
}
