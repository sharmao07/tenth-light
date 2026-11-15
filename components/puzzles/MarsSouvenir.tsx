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
    <div className="bg-[#12151b]/95 border border-[#f0562b] p-8 rounded-lg max-w-2xl mx-auto text-[#e9e6dc] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#0a0c10] px-6 py-4 rounded border border-[#f0562b]/50 text-sm text-[#f0562b] mb-4 text-center leading-relaxed">
        HOW-TO: The ship is exactly 9 kg over mass cap. Jettison the unauthorized souvenir, not Nori’s optic.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* NASA Mars Image Plate */}
        <div className="bg-[#0a0c10] p-4 border border-[#e9e6dc]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#12151b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={marsPlate.url}
              alt="Mars"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-[#e9e6dc]/80 text-left leading-relaxed">
            <span className="text-[#f0562b] font-bold block">{marsPlate.credit}</span>
            <div className="truncate">{marsPlate.caption}</div>
          </div>
        </div>

        {/* Cargo Bay Bay doors & Jettison list */}
        <div className="space-y-5 font-sans">
          <div className="text-xs md:text-sm text-[#f0562b] border-b border-[#e9e6dc]/15 pb-2 font-bold">
            Cargo Bay Mass Excess: <span className="text-[#f0562b] font-bold">+9.0 kg</span>
          </div>

          <p className="text-xs md:text-sm text-[#e9e6dc]/90 leading-relaxed">
            Redline’s radar gate will vaporize any vessel exceeding entry mass. Select cargo to eject into orbit:
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleJettison('souvenir')}
              className={`w-full py-4 px-5 text-left text-xs md:text-sm border rounded-lg transition-colors flex justify-between items-center shadow-sm ${
                droppedItem === 'souvenir'
                  ? 'bg-[#e9e6dc] text-[#0a0c10] border-[#e9e6dc] font-bold'
                  : 'bg-[#0a0c10] hover:bg-[#f0562b] hover:text-[#0a0c10] border-[#e9e6dc]/30 text-[#e9e6dc]'
              }`}
            >
              <span>Unauthorized Souvenir Crate</span>
              <span className="font-bold text-[#f0562b]">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('optic')}
              className="w-full py-4 px-5 text-left text-xs md:text-sm bg-[#0a0c10] hover:bg-[#f0562b]/20 border border-[#e9e6dc]/30 hover:border-[#f0562b] text-[#e9e6dc] rounded-lg transition-colors flex justify-between items-center"
            >
              <span>Nori’s Secondary Optical Array</span>
              <span className="text-[#e9e6dc]/60 font-bold">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('avionics')}
              className="w-full py-4 px-5 text-left text-xs md:text-sm bg-[#0a0c10] hover:bg-[#f0562b]/20 border border-[#e9e6dc]/30 hover:border-[#f0562b] text-[#e9e6dc] rounded-lg transition-colors flex justify-between items-center"
            >
              <span>Primary Avionics Rack</span>
              <span className="text-[#e9e6dc]/60 font-bold">(9.0 kg)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-[#f0562b]/20 border border-[#f0562b] rounded text-xs md:text-sm text-[#f0562b] leading-relaxed">
              {errorMsg}
            </div>
          )}

          {droppedItem === 'souvenir' && (
            <div className="p-4 bg-[#e9e6dc]/20 border border-[#e9e6dc] rounded text-xs md:text-sm text-[#e9e6dc] leading-relaxed">
              ✓ Souvenir ejected! Ship mass within limits. Mars gate opens.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
