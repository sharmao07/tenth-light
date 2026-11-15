'use client';
import React, { useState } from 'react';
import { sound } from '../AudioController';

interface MarsSouvenirProps {
  onSuccess: () => void;
}

export function MarsSouvenir({ onSuccess }: MarsSouvenirProps) {
  const [droppedItem, setDroppedItem] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: The ship is exactly 9 kg over mass cap. Jettison the unauthorized souvenir, not Nori’s optic.
      </div>

      {/* Cargo Bay Bay doors & Jettison console */}
      <div className="space-y-4 font-sans">
        <div className="border-b border-paper/15 pb-3 flex justify-between items-center">
          <span className="text-sm md:text-base text-signal font-bold font-mono">
            Cargo Bay Mass Threshold
          </span>
          <span className="text-xs sm:text-sm font-mono text-signal bg-signal/15 border border-signal/30 px-3 py-1 font-bold tabular-nums">
            Excess: +9.0 kg
          </span>
        </div>

        <p className="text-xs sm:text-sm text-paper-muted leading-relaxed my-3 font-sans">
          Redline’s radar gate will vaporize any vessel exceeding entry mass. Select cargo item to eject into Martian orbit:
        </p>

        <div className="space-y-3">
          <button
            onClick={() => handleJettison('souvenir')}
            className={`w-full py-3 px-4 text-left text-xs sm:text-sm border transition-colors flex justify-between items-center ${
              droppedItem === 'souvenir'
                ? 'bg-paper text-void border-paper font-bold'
                : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
            }`}
          >
            <span className="font-medium">Unauthorized Souvenir Crate</span>
            <span className="font-bold text-signal tabular-nums font-mono">(9.0 kg)</span>
          </button>

          <button
            onClick={() => handleJettison('optic')}
            className="w-full py-3 px-4 text-left text-xs sm:text-sm bg-void hover:bg-signal/20 border border-paper/30 hover:border-signal text-paper transition-colors flex justify-between items-center"
          >
            <span className="font-medium">Nori’s Secondary Optical Array</span>
            <span className="text-paper-muted font-bold tabular-nums font-mono">(9.0 kg)</span>
          </button>

          <button
            onClick={() => handleJettison('avionics')}
            className="w-full py-3 px-4 text-left text-xs sm:text-sm bg-void hover:bg-signal/20 border border-paper/30 hover:border-signal text-paper transition-colors flex justify-between items-center"
          >
            <span className="font-medium">Primary Avionics Rack</span>
            <span className="text-paper-muted font-bold tabular-nums font-mono">(9.0 kg)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-signal/20 border border-signal text-xs sm:text-sm text-signal leading-relaxed font-mono mt-4">
            {errorMsg}
          </div>
        )}

        {droppedItem === 'souvenir' && (
          <div className="p-3.5 bg-surface border border-paper/30 text-xs sm:text-sm text-paper leading-relaxed font-mono mt-4">
            ✓ Souvenir ejected! Ship mass within limits. Mars orbital insertion cleared.
          </div>
        )}
      </div>
    </div>
  );
}
