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
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded max-w-xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-3 py-1.5 rounded border border-[#e39b12]/50 text-xs font-mono text-[#e39b12] mb-3 text-center">
        HOW-TO: Mark the bright frozen heart ❤️ (Tombaugh Regio), not a dark plain. A photograph is not a soil sample.
      </div>

      <div className="space-y-3 font-sans">
        {/* Pluto Interactive Plate */}
        <div className="relative w-full h-52 bg-[#100e0c] border border-[#efe6d6]/30 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plutoPlate.url}
            alt="Pluto"
            className="w-full h-full object-cover"
          />

          {/* Interactive Target Areas */}
          {/* The Heart ❤️ Tombaugh Regio (Center-Right bright area) */}
          <button
            onClick={() => handleSelectZone('heart')}
            className={`absolute top-[35%] right-[28%] w-24 h-24 rounded-full border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${
              markedTarget === 'heart'
                ? 'bg-[#e39b12]/30 border-[#e39b12] scale-105'
                : 'border-[#efe6d6]/60 hover:border-[#e39b12] hover:bg-[#e39b12]/20'
            }`}
            title="Mark Tombaugh Regio (The Heart ❤️)"
          >
            <span className="text-2xl animate-bounce">❤️</span>
            <span className="text-[10px] font-mono font-bold bg-[#100e0c]/80 px-1 rounded text-[#efe6d6]">
              Tombaugh Regio
            </span>
          </button>

          {/* Dark Plain Cthulhu Macula (Left dark area) */}
          <button
            onClick={() => handleSelectZone('dark_plain')}
            className={`absolute top-[45%] left-[12%] w-20 h-16 rounded border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
              markedTarget === 'dark_plain'
                ? 'bg-[#c4452d]/30 border-[#c4452d]'
                : 'border-[#efe6d6]/30 hover:border-[#c4452d] hover:bg-[#c4452d]/10'
            }`}
            title="Cthulhu Macula (Dark Plain)"
          >
            <span className="text-[9px] font-mono bg-[#100e0c]/80 px-1 rounded text-[#efe6d6]/60">
              Dark Plain
            </span>
          </button>
        </div>

        {/* Footer info & Honesty quote */}
        <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-[#efe6d6]/70 border-t border-[#efe6d6]/10 pt-1.5">
          <span>{plutoPlate.credit}</span>
          <span className="italic text-[#e39b12]">“A photograph is not a soil sample.”</span>
        </div>

        {statusMsg && (
          <div className="p-1.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-xs font-mono leading-tight">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
