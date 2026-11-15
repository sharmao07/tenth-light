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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10]/90 backdrop-blur-none p-6 select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0a0c10] border border-[#f0562b] p-8 text-[#e9e6dc] space-y-6">
        <div className="space-y-1">
          <p className="label text-[#f0562b]">Simulation Paused</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#e9e6dc] tracking-tight">
            Telemetry Frozen
          </h2>
          <p className="text-xs text-[#e9e6dc]/60 font-mono leading-relaxed mt-1">
            Internal clocks, combat logic, and delay timers are suspended.
          </p>
        </div>

        <div className="space-y-4 text-xs font-mono text-[#e9e6dc]/80 leading-relaxed border-t border-b border-[#e9e6dc]/15 py-4">
          <p>
            &middot; Checkpoint active at start of current stop under <code className="text-[#f0562b] bg-[#e9e6dc]/10 px-1 py-0.5">tenth-light-v1</code>.
          </p>

          <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/15 space-y-2 text-[11px]">
            <span className="label">Keyboard Navigation</span>
            <div className="flex justify-between text-[#e9e6dc]/70">
              <span><kbd className="px-1 border border-[#e9e6dc]/30">Esc</kbd> Resume</span>
              <span><kbd className="px-1 border border-[#e9e6dc]/30">L</kbd> Logbook</span>
              <span><kbd className="px-1 border border-[#e9e6dc]/30">M</kbd> Mute</span>
            </div>
            <div className="flex justify-between text-[#e9e6dc]/70 pt-1">
              <span><kbd className="px-1 border border-[#e9e6dc]/30">Space</kbd> Action</span>
              <span><kbd className="px-1 border border-[#e9e6dc]/30">WASD / Arrows</kbd> Move</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => {
              onResume();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn w-full"
          >
            Resume simulation (Esc) &rarr;
          </button>

          <button
            onClick={() => {
              onReturnToMenu();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn-quiet w-full text-center"
          >
            Return to title (keeps save)
          </button>
        </div>
      </div>
    </div>
  );
}
