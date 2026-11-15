'use client';
import React, { useState } from 'react';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface EnceladusPlumeProps {
  onSuccess: () => void;
}

export function EnceladusPlume({ onSuccess }: EnceladusPlumeProps) {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const enceladusPlate = NASA_IMAGE_PLATES[5];

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    sound.playUiClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x: xPct, y: yPct });

    // South pole plume is located in the bottom half (yPct > 65%)
    if (yPct >= 65 && xPct >= 20 && xPct <= 80) {
      sound.playSuccess();
      setIsSuccess(true);
      setErrorMsg(null);
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setErrorMsg('Target off! Aim at the south polar cryovolcanic plumes spraying into space.');
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-4 text-center leading-relaxed font-sans">
        HOW-TO: Click the illuminated south-pole water vapor jets (the plume Cassini flew through).
      </div>

      <div className="space-y-4 font-sans">
        {/* Interactive Image Container */}
        <div
          onClick={handleImageClick}
          className="relative w-full h-48 sm:h-52 bg-void border border-paper/30 overflow-hidden cursor-crosshair group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enceladusPlate.url}
            alt="Enceladus Plumes"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />

          {/* South pole guide indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-void/90 text-paper border border-paper/60 text-xs font-mono font-bold pointer-events-none">
            [ South Polar Tiger Stripes ]
          </div>

          {/* Click crosshairs */}
          {clickPos && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
            >
              <div
                className={`w-8 h-8 border animate-ping ${
                  isSuccess ? 'border-paper' : 'border-signal'
                }`}
              />
              <div
                className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  isSuccess ? 'bg-paper' : 'bg-signal'
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-paper-muted leading-relaxed font-mono pt-1">
          <span className="font-bold text-signal">{enceladusPlate.credit}</span>
          <span className="truncate max-w-[340px]">{enceladusPlate.caption}</span>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-signal/20 border border-signal text-xs sm:text-sm text-signal leading-relaxed font-mono mt-3">
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div className="p-3.5 bg-surface border border-paper/30 text-xs sm:text-sm text-paper leading-relaxed font-mono mt-3">
            ✓ Target locked on Cassini plume track! Salty vapor detected. Spray grants passage.
          </div>
        )}
      </div>
    </div>
  );
}
