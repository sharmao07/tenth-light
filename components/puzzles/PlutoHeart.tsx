'use client';
import React, { useState } from 'react';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface PlutoHeartProps {
  onSuccess: () => void;
}

export function PlutoHeart({ onSuccess }: PlutoHeartProps) {
  const [markedTarget, setMarkedTarget] = useState<'heart' | 'dark_plain' | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const plutoPlate = NASA_IMAGE_PLATES[8];

  const handleSelectZone = (zone: 'heart' | 'dark_plain') => {
    sound.playUiClick();
    setMarkedTarget(zone);

    if (zone === 'heart') {
      sound.playSuccess();
      setStatusMsg('✓ Tombaugh Regio marked ♥! Nitrogen ice glacier recognized. Heart grants clearance!');
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setStatusMsg('That is Cthulhu Macula (the dark irradiated tar plain). Mark the bright frozen heart ♥!');
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-4 text-center leading-relaxed font-sans">
        HOW-TO: Mark the bright frozen heart ♥ (Tombaugh Regio), not a dark plain. A photograph is not a soil sample.
      </div>

      <div className="space-y-4 font-sans">
        {/* Pluto Interactive Plate */}
        <div className="relative w-full h-48 sm:h-52 bg-void border border-paper/30 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plutoPlate.url}
            alt="Pluto"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />

          {/* The Heart ♥ Tombaugh Regio */}
          <button
            onClick={() => handleSelectZone('heart')}
            className={`absolute top-[30%] right-[24%] w-24 h-24 rounded-full border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${
              markedTarget === 'heart'
                ? 'bg-signal/30 border-signal scale-105'
                : 'border-paper/70 hover:border-signal hover:bg-signal/20'
            }`}
            title="Mark Tombaugh Regio (The Heart ♥)"
          >
            <span className="text-2xl animate-bounce">♥</span>
            <span className="text-[10px] font-mono font-bold bg-void/90 px-1.5 py-0.5 text-paper mt-0.5">
              Tombaugh Regio
            </span>
          </button>

          {/* Dark Plain Cthulhu Macula */}
          <button
            onClick={() => handleSelectZone('dark_plain')}
            className={`absolute top-[45%] left-[10%] w-20 h-16 border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
              markedTarget === 'dark_plain'
                ? 'bg-signal/30 border-signal'
                : 'border-paper/30 hover:border-signal hover:bg-signal/15'
            }`}
            title="Cthulhu Macula (Dark Plain)"
          >
            <span className="text-[10px] font-mono bg-void/85 px-1.5 py-0.5 text-paper-muted font-semibold">
              Dark Plain
            </span>
          </button>
        </div>

        {/* Footer info & Honesty quote */}
        <div className="flex flex-wrap justify-between items-center text-xs text-paper-muted border-t border-paper/15 pt-3 leading-relaxed font-mono">
          <span className="font-bold text-signal">{plutoPlate.credit}</span>
          <span className="italic text-signal font-serif text-xs md:text-sm">“A photograph is not a soil sample.”</span>
        </div>

        {statusMsg && (
          <div className="p-3.5 bg-surface border border-paper/20 text-xs sm:text-sm leading-relaxed font-mono mt-3">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
