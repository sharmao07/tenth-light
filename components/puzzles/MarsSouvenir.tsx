'use client';
import React, { useState } from 'react';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface MarsSouvenirProps {
  onSuccess: () => void;
}

export function MarsSouvenir({ onSuccess }: MarsSouvenirProps) {
  const [droppedItem, setDroppedItem] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const marsPlate = NASA_IMAGE_PLATES[2];

  const handleJettison = (item: 'souvenir' | 'optic' | 'avionics') => {
    sound.playUiClick();
    if (item === 'souvenir') {
      sound.playSuccess();
      setDroppedItem('souvenir');
      setErrorMsg(null);
      setTimeout(onSuccess, 800);
    } else if (item === 'optic') {
      sound.playMiss();
      setErrorMsg('ABORT: Do NOT drop Nori’s optic! The droid needs both eyes to certify Harbor!');
    } else {
      sound.playMiss();
      setErrorMsg('SYSTEM ERROR: Cannot jettison primary avionics without loss of mission!');
    }
  };

  return (
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-5 rounded-lg max-w-2xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-4 py-2.5 rounded border border-[#e39b12]/50 text-sm font-mono text-[#e39b12] mb-4 text-center leading-relaxed">
        HOW-TO: The ship is exactly 9 kg over mass cap. Jettison the unauthorized souvenir, not Nori’s optic.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        {/* NASA Mars Image Plate */}
        <div className="bg-[#100e0c] p-2.5 border border-[#efe6d6]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#1a1714]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={marsPlate.url}
              alt="Mars"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs font-mono text-[#efe6d6]/80 text-left leading-relaxed">
            <span className="text-[#e39b12] font-bold block">{marsPlate.credit}</span>
            <div className="truncate">{marsPlate.caption}</div>
          </div>
        </div>

        {/* Cargo Bay Bay doors & Jettison list */}
        <div className="space-y-3 font-sans">
          <div className="text-xs md:text-sm font-mono text-[#e39b12] border-b border-[#efe6d6]/15 pb-1.5 font-bold">
            Cargo Bay Mass Excess: <span className="text-[#c4452d] font-bold">+9.0 kg</span>
          </div>

          <p className="text-xs md:text-sm text-[#efe6d6]/90 leading-relaxed">
            Redline’s radar gate will vaporize any vessel exceeding entry mass. Select cargo to eject into orbit:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleJettison('souvenir')}
              className={`w-full py-2.5 px-3.5 text-left font-mono text-xs md:text-sm border rounded-lg transition-colors flex justify-between items-center shadow-sm ${
                droppedItem === 'souvenir'
                  ? 'bg-[#5bc0be] text-[#100e0c] border-[#5bc0be] font-bold'
                  : 'bg-[#100e0c] hover:bg-[#e39b12] hover:text-[#100e0c] border-[#efe6d6]/30 text-[#efe6d6]'
              }`}
            >
              <span>📦 Unauthorized Souvenir Crate</span>
              <span className="font-bold text-[#c4452d]">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('optic')}
              className="w-full py-2.5 px-3.5 text-left font-mono text-xs md:text-sm bg-[#100e0c] hover:bg-[#c4452d]/20 border border-[#efe6d6]/30 hover:border-[#c4452d] text-[#efe6d6] rounded-lg transition-colors flex justify-between items-center"
            >
              <span>👁️ Nori’s Secondary Optical Array</span>
              <span className="text-[#efe6d6]/60 font-bold">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('avionics')}
              className="w-full py-2.5 px-3.5 text-left font-mono text-xs md:text-sm bg-[#100e0c] hover:bg-[#c4452d]/20 border border-[#efe6d6]/30 hover:border-[#c4452d] text-[#efe6d6] rounded-lg transition-colors flex justify-between items-center"
            >
              <span>⚡ Primary Avionics Rack</span>
              <span className="text-[#efe6d6]/60 font-bold">(9.0 kg)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs md:text-sm font-mono text-[#c4452d] leading-relaxed">
              {errorMsg}
            </div>
          )}

          {droppedItem === 'souvenir' && (
            <div className="p-2.5 bg-[#5bc0be]/20 border border-[#5bc0be] rounded text-xs md:text-sm font-mono text-[#5bc0be] leading-relaxed">
              ✓ Souvenir ejected! Ship mass within limits. Mars gate opens.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
