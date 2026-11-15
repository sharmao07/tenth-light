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
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-5 rounded-lg max-w-2xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-4 py-2.5 rounded border border-[#e39b12]/50 text-sm font-mono text-[#e39b12] mb-4 text-center leading-relaxed">
        HOW-TO: Click the illuminated south-pole water vapor jets (the plume Cassini flew through).
      </div>

      <div className="space-y-4 font-sans">
        {/* Interactive Image Container */}
        <div
          onClick={handleImageClick}
          className="relative w-full h-64 bg-[#100e0c] border border-[#efe6d6]/30 rounded-lg overflow-hidden cursor-crosshair group shadow-inner"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enceladusPlate.url}
            alt="Enceladus Plumes"
            className="w-full h-full object-cover"
          />

          {/* South pole guide indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#100e0c]/85 text-[#5bc0be] border border-[#5bc0be]/60 text-xs font-mono font-bold rounded pointer-events-none">
            [ South Polar Tiger Stripes ]
          </div>

          {/* Click crosshairs */}
          {clickPos && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
            >
              <div
                className={`w-9 h-9 rounded-full border-2 animate-ping ${
                  isSuccess ? 'border-[#5bc0be]' : 'border-[#c4452d]'
                }`}
              />
              <div
                className={`w-3.5 h-3.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  isSuccess ? 'bg-[#5bc0be]' : 'bg-[#c4452d]'
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-[#efe6d6]/80 leading-relaxed">
          <span className="font-bold text-[#e39b12]">{enceladusPlate.credit}</span>
          <span className="truncate max-w-[340px]">{enceladusPlate.caption}</span>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs md:text-sm font-mono text-[#c4452d] leading-relaxed">
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div className="p-2.5 bg-[#5bc0be]/20 border border-[#5bc0be] rounded text-xs md:text-sm font-mono text-[#5bc0be] leading-relaxed">
            ✓ Target locked on Cassini plume track! Salty vapor detected. Spray grants passage.
          </div>
        )}
      </div>
    </div>
  );
}
