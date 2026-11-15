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
    <div className="bg-[#12151b]/95 border border-[#f0562b] p-8 rounded-lg max-w-2xl mx-auto text-[#e9e6dc] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#0a0c10] px-6 py-4 rounded border border-[#f0562b]/50 text-sm text-[#f0562b] mb-4 text-center leading-relaxed">
        HOW-TO: Mark the bright frozen heart ♥ (Tombaugh Regio), not a dark plain. A photograph is not a soil sample.
      </div>

      <div className="space-y-6 font-sans">
        {/* Pluto Interactive Plate */}
        <div className="relative w-full h-64 bg-[#0a0c10] border border-[#e9e6dc]/30 rounded-lg overflow-hidden shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plutoPlate.url}
            alt="Pluto"
            className="w-full h-full object-cover"
          />

          {/* The Heart ♥ Tombaugh Regio */}
          <button
            onClick={() => handleSelectZone('heart')}
            className={`absolute top-[32%] right-[26%] w-28 h-28 rounded-full border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group shadow-lg ${
              markedTarget === 'heart'
                ? 'bg-[#f0562b]/30 border-[#f0562b] scale-105'
                : 'border-[#e9e6dc]/70 hover:border-[#f0562b] hover:bg-[#f0562b]/20'
            }`}
            title="Mark Tombaugh Regio (The Heart ♥)"
          >
            <span className="text-3xl animate-bounce">♥</span>
            <span className="text-xs font-bold bg-[#0a0c10]/90 px-2 py-0.5 rounded text-[#e9e6dc] mt-0.5">
              Tombaugh Regio
            </span>
          </button>

          {/* Dark Plain Cthulhu Macula */}
          <button
            onClick={() => handleSelectZone('dark_plain')}
            className={`absolute top-[45%] left-[10%] w-24 h-20 rounded border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
              markedTarget === 'dark_plain'
                ? 'bg-[#f0562b]/30 border-[#f0562b]'
                : 'border-[#e9e6dc]/30 hover:border-[#f0562b] hover:bg-[#f0562b]/15'
            }`}
            title="Cthulhu Macula (Dark Plain)"
          >
            <span className="text-xs bg-[#0a0c10]/85 px-2 py-0.5 rounded text-[#e9e6dc]/70 font-semibold">
              Dark Plain
            </span>
          </button>
        </div>

        {/* Footer info & Honesty quote */}
        <div className="flex flex-wrap justify-between items-center text-xs md:text-sm text-[#e9e6dc]/80 border-t border-[#e9e6dc]/15 pt-3 leading-relaxed">
          <span className="font-bold text-[#f0562b]">{plutoPlate.credit}</span>
          <span className="italic text-[#f0562b] font-serif text-sm">“A photograph is not a soil sample.”</span>
        </div>

        {statusMsg && (
          <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg text-xs md:text-sm leading-relaxed">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
