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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100e0c]/85 backdrop-blur-none p-4 select-none">
      <div className="w-full max-w-md bg-[#1a1714] border-2 border-[#e39b12] p-6 text-[#efe6d6] shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#e39b12] tracking-wider mb-1">
            SIMULATION PAUSED
          </h2>
          <p className="text-xs font-mono text-[#efe6d6]/60">
            Internal telemetry clocks and physical timers frozen.
          </p>
        </div>

        <div className="space-y-3 mb-6 text-sm font-sans text-[#efe6d6]/80 leading-relaxed border-t border-b border-[#efe6d6]/10 py-4">
          <p>
            • All active dodge sweeps, depot combat, sleeve patrols, and signal delays are suspended.
          </p>
          <p>
            • Your progress is checkpointed at the start of the current stop under <code className="text-[#e39b12] font-mono">tenth-light-v1</code>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onResume();
              sound.playUiClick();
            }}
            className="w-full py-2.5 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold tracking-wider uppercase text-sm rounded transition-colors"
          >
            Resume Simulation (Esc)
          </button>

          <button
            onClick={() => {
              onReturnToMenu();
              sound.playUiClick();
            }}
            className="w-full py-2 bg-[#100e0c] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-[#efe6d6] font-mono text-xs tracking-wider uppercase rounded transition-colors"
          >
            Return to Title (Keep Save)
          </button>
        </div>
      </div>
    </div>
  );
}
