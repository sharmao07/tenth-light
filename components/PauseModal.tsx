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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10]/90 backdrop-blur-none p-8 select-none">
      <div className="w-full max-w-lg bg-[#12151b] border border-[#f0562b] p-7 text-[#e9e6dc] shadow-2xl rounded-lg space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl text-[#f0562b] tracking-tight">
            SIMULATION PAUSED
          </h2>
          <p className="text-sm text-[#e9e6dc]/70 leading-relaxed">
            Internal telemetry clocks, combat logic, and delay timers are frozen.
          </p>
        </div>

        <div className="space-y-5 text-sm md:text-base font-sans text-[#e9e6dc]/90 leading-relaxed border-t border-b border-[#e9e6dc]/15 py-6">
          <p>
            • All active dodge sweeps, depot combat, sleeve patrols, and signal delays are suspended.
          </p>
          <p>
            • Your progress is checkpointed at the start of the current stop under <code className="text-[#f0562b] font-bold bg-[#0a0c10] px-2 py-0.5 rounded">tenth-light-v1</code>.
          </p>

          {/* PC Controls & Hotkey Legend (pc-games skill) */}
          <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-md text-xs space-y-1.5 text-[#e9e6dc]/80">
            <div className="text-[#f0562b] font-bold uppercase tracking-wider mb-1">
              Keyboard Navigation & Controls:
            </div>
            <div className="flex justify-between">
              <span><kbd className="px-1.5 bg-[#12151b] border border-[#e9e6dc]/30 rounded">Esc</kbd> Pause / Resume</span>
              <span><kbd className="px-1.5 bg-[#12151b] border border-[#e9e6dc]/30 rounded">L</kbd> Mission Logbook</span>
              <span><kbd className="px-1.5 bg-[#12151b] border border-[#e9e6dc]/30 rounded">M</kbd> Mute Audio</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span><kbd className="px-1.5 bg-[#12151b] border border-[#e9e6dc]/30 rounded">Space</kbd> Action / Fire</span>
              <span><kbd className="px-1.5 bg-[#12151b] border border-[#e9e6dc]/30 rounded">WASD / Arrows</kbd> Movement</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-1.5">
          <button
            onClick={() => {
              onResume();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-5 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] tracking-wide text-sm md:text-base rounded-md transition-colors shadow-lg"
          >
            Resume Simulation (Esc)
          </button>

          <a
            href="/presentation"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-4 bg-[#0a0c10] hover:bg-[#e9e6dc]/20 border border-[#e9e6dc] text-[#e9e6dc] text-xs md:text-sm tracking-wide rounded-md transition-colors text-center"
          >
            7-Slide Space Apps Demo Deck
          </a>

          <button
            onClick={() => {
              onReturnToMenu();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-4 bg-[#0a0c10] hover:bg-[#e9e6dc]/10 border border-[#e9e6dc]/30 text-[#e9e6dc] text-xs md:text-sm tracking-wide rounded-md transition-colors"
          >
            Return to Title (Keep Save)
          </button>
        </div>
      </div>
    </div>
  );
}
