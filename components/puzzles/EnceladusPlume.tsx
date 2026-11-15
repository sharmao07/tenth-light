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
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded max-w-xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-3 py-1.5 rounded border border-[#e39b12]/50 text-xs font-mono text-[#e39b12] mb-3 text-center">
        HOW-TO: Click the illuminated south-pole water vapor jets (the plume Cassini flew through).
      </div>

      <div className="space-y-3 font-sans">
        {/* Interactive Image Container */}
        <div
          onClick={handleImageClick}
          className="relative w-full h-56 bg-[#100e0c] border border-[#efe6d6]/30 rounded overflow-hidden cursor-crosshair group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enceladusPlate.url}
            alt="Enceladus Plumes"
            className="w-full h-full object-cover"
          />

          {/* South pole guide indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#100e0c]/80 text-[#5bc0be] border border-[#5bc0be]/50 text-[10px] font-mono rounded pointer-events-none">
            [ South Polar Tiger Stripes ]
          </div>

          {/* Click crosshairs */}
          {clickPos && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 animate-ping ${
                  isSuccess ? 'border-[#5bc0be]' : 'border-[#c4452d]'
                }`}
              />
              <div
                className={`w-3 h-3 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  isSuccess ? 'bg-[#5bc0be]' : 'bg-[#c4452d]'
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-[#efe6d6]/60">
          <span>{enceladusPlate.credit}</span>
          <span className="truncate max-w-[280px]">{enceladusPlate.caption}</span>
        </div>

        {errorMsg && (
          <div className="p-1.5 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs font-mono text-[#c4452d]">
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div className="p-1.5 bg-[#5bc0be]/20 border border-[#5bc0be] rounded text-xs font-mono text-[#5bc0be]">
            ✓ Target locked on Cassini plume track! Salty vapor detected. Spray grants passage.
          </div>
        )}
      </div>
    </div>
  );
}
