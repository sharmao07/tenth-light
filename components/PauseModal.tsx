'use client';
import React, { useEffect } from 'react';
import { sound } from './AudioController';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onReturnToMenu: () => void;
}

export function PauseModal({ isOpen, onResume, onReturnToMenu }: PauseModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          onResume();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100e0c]/90 backdrop-blur-none p-5 select-none">
      <div className="w-full max-w-lg bg-[#1a1714] border-2 border-[#e39b12] p-7 text-[#efe6d6] shadow-2xl rounded-lg space-y-5">
        <div className="text-center space-y-1.5">
          <h2 className="font-serif text-3xl font-bold text-[#e39b12] tracking-wider">
            SIMULATION PAUSED
          </h2>
          <p className="text-sm font-mono text-[#efe6d6]/70 leading-relaxed">
            Internal telemetry clocks, combat logic, and delay timers are frozen.
          </p>
        </div>

        <div className="space-y-3.5 text-sm md:text-base font-sans text-[#efe6d6]/90 leading-relaxed border-t border-b border-[#efe6d6]/15 py-5">
          <p>
            • All active dodge sweeps, depot combat, sleeve patrols, and signal delays are suspended.
          </p>
          <p>
            • Your progress is checkpointed at the start of the current stop under <code className="text-[#e39b12] font-mono font-bold bg-[#100e0c] px-1.5 py-0.5 rounded">tenth-light-v1</code>.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 pt-1">
          <button
            onClick={() => {
              onResume();
              sound.playUiClick();
            }}
            className="w-full py-3 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold tracking-wider uppercase text-sm md:text-base rounded-md transition-colors shadow-lg"
          >
            Resume Simulation (Esc)
          </button>

          <button
            onClick={() => {
              onReturnToMenu();
              sound.playUiClick();
            }}
            className="w-full py-2.5 bg-[#100e0c] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-[#efe6d6] font-mono text-xs md:text-sm tracking-wider uppercase rounded-md transition-colors"
          >
            Return to Title (Keep Save)
          </button>
        </div>
      </div>
    </div>
  );
}
