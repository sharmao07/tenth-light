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
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: The ship is exactly 9 kg over mass cap. Jettison the unauthorized souvenir, not Nori’s optic.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Mars Image Plate */}
        <div className="bg-void p-3 border border-paper/20 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={marsPlate.url}
              alt="Mars"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-paper-muted text-left leading-relaxed">
            <span className="text-signal font-bold block">{marsPlate.credit}</span>
            <div className="truncate">{marsPlate.caption}</div>
          </div>
        </div>

        {/* Cargo Bay Bay doors & Jettison list */}
        <div className="space-y-3 font-sans">
          <div className="text-xs md:text-sm text-signal border-b border-paper/15 pb-1.5 font-bold font-mono">
            Cargo Bay Mass Excess: <span className="text-signal font-bold tabular-nums">+9.0 kg</span>
          </div>

          <p className="text-xs text-paper-muted leading-relaxed">
            Redline’s radar gate will vaporize any vessel exceeding entry mass. Select cargo to eject into orbit:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleJettison('souvenir')}
              className={`w-full py-2.5 px-3.5 text-left text-xs md:text-sm border transition-colors flex justify-between items-center ${
                droppedItem === 'souvenir'
                  ? 'bg-paper text-void border-paper font-bold'
                  : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
              }`}
            >
              <span>Unauthorized Souvenir Crate</span>
              <span className="font-bold text-signal tabular-nums">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('optic')}
              className="w-full py-2.5 px-3.5 text-left text-xs md:text-sm bg-void hover:bg-signal/20 border border-paper/30 hover:border-signal text-paper transition-colors flex justify-between items-center"
            >
              <span>Nori’s Secondary Optical Array</span>
              <span className="text-paper-muted font-bold tabular-nums">(9.0 kg)</span>
            </button>

            <button
              onClick={() => handleJettison('avionics')}
              className="w-full py-2.5 px-3.5 text-left text-xs md:text-sm bg-void hover:bg-signal/20 border border-paper/30 hover:border-signal text-paper transition-colors flex justify-between items-center"
            >
              <span>Primary Avionics Rack</span>
              <span className="text-paper-muted font-bold tabular-nums">(9.0 kg)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-signal/20 border border-signal text-xs text-signal leading-relaxed">
              {errorMsg}
            </div>
          )}

          {droppedItem === 'souvenir' && (
            <div className="p-2.5 bg-surface border border-paper/30 text-xs text-paper leading-relaxed">
              ✓ Souvenir ejected! Ship mass within limits. Mars gate opens.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
