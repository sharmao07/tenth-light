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
      setStatusMsg('✓ Tombaugh Regio marked ❤️! Nitrogen ice glacier recognized. Heart grants clearance!');
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setStatusMsg('That is Cthulhu Macula (the dark irradiated tar plain). Mark the bright frozen heart ❤️!');
    }
  };

  return (
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-5 rounded-lg max-w-2xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-4 py-2.5 rounded border border-[#e39b12]/50 text-sm font-mono text-[#e39b12] mb-4 text-center leading-relaxed">
        HOW-TO: Mark the bright frozen heart ❤️ (Tombaugh Regio), not a dark plain. A photograph is not a soil sample.
      </div>

      <div className="space-y-4 font-sans">
        {/* Pluto Interactive Plate */}
        <div className="relative w-full h-64 bg-[#100e0c] border border-[#efe6d6]/30 rounded-lg overflow-hidden shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plutoPlate.url}
            alt="Pluto"
            className="w-full h-full object-cover"
          />

          {/* The Heart ❤️ Tombaugh Regio */}
          <button
            onClick={() => handleSelectZone('heart')}
            className={`absolute top-[32%] right-[26%] w-28 h-28 rounded-full border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group shadow-lg ${
              markedTarget === 'heart'
                ? 'bg-[#e39b12]/30 border-[#e39b12] scale-105'
                : 'border-[#efe6d6]/70 hover:border-[#e39b12] hover:bg-[#e39b12]/20'
            }`}
            title="Mark Tombaugh Regio (The Heart ❤️)"
          >
            <span className="text-3xl animate-bounce">❤️</span>
            <span className="text-xs font-mono font-bold bg-[#100e0c]/90 px-1.5 py-0.5 rounded text-[#efe6d6] mt-0.5">
              Tombaugh Regio
            </span>
          </button>

          {/* Dark Plain Cthulhu Macula */}
          <button
            onClick={() => handleSelectZone('dark_plain')}
            className={`absolute top-[45%] left-[10%] w-24 h-20 rounded border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
              markedTarget === 'dark_plain'
                ? 'bg-[#c4452d]/30 border-[#c4452d]'
                : 'border-[#efe6d6]/30 hover:border-[#c4452d] hover:bg-[#c4452d]/15'
            }`}
            title="Cthulhu Macula (Dark Plain)"
          >
            <span className="text-xs font-mono bg-[#100e0c]/85 px-1.5 py-0.5 rounded text-[#efe6d6]/70 font-semibold">
              Dark Plain
            </span>
          </button>
        </div>

        {/* Footer info & Honesty quote */}
        <div className="flex flex-wrap justify-between items-center text-xs md:text-sm font-mono text-[#efe6d6]/80 border-t border-[#efe6d6]/15 pt-2 leading-relaxed">
          <span className="font-bold text-[#e39b12]">{plutoPlate.credit}</span>
          <span className="italic text-[#e39b12] font-serif text-sm">“A photograph is not a soil sample.”</span>
        </div>

        {statusMsg && (
          <div className="p-2.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg text-xs md:text-sm font-mono leading-relaxed">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
