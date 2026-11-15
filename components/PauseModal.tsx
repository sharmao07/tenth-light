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

        <div className="space-y-3.5 text-sm md:text-base font-sans text-[#efe6d6]/90 leading-relaxed border-t border-b border-[#efe6d6]/15 py-4">
          <p>
            • All active dodge sweeps, depot combat, sleeve patrols, and signal delays are suspended.
          </p>
          <p>
            • Your progress is checkpointed at the start of the current stop under <code className="text-[#e39b12] font-mono font-bold bg-[#100e0c] px-1.5 py-0.5 rounded">tenth-light-v1</code>.
          </p>

          {/* PC Controls & Hotkey Legend (pc-games skill) */}
          <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/20 rounded-md font-mono text-xs space-y-1 text-[#efe6d6]/80">
            <div className="text-[#e39b12] font-bold uppercase tracking-wider mb-1">
              🎮 Keyboard Navigation & Controls:
            </div>
            <div className="flex justify-between">
              <span><kbd className="px-1 bg-[#1a1714] border border-[#efe6d6]/30 rounded">Esc</kbd> Pause / Resume</span>
              <span><kbd className="px-1 bg-[#1a1714] border border-[#efe6d6]/30 rounded">L</kbd> Mission Logbook</span>
              <span><kbd className="px-1 bg-[#1a1714] border border-[#efe6d6]/30 rounded">M</kbd> Mute Audio</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span><kbd className="px-1 bg-[#1a1714] border border-[#efe6d6]/30 rounded">Space</kbd> Action / Fire</span>
              <span><kbd className="px-1 bg-[#1a1714] border border-[#efe6d6]/30 rounded">WASD / Arrows</kbd> Movement</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <button
            onClick={() => {
              onResume();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-3 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold tracking-wider uppercase text-sm md:text-base rounded-md transition-colors shadow-lg"
          >
            Resume Simulation (Esc)
          </button>

          <a
            href="/presentation"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-2.5 bg-[#100e0c] hover:bg-[#5bc0be]/20 border border-[#5bc0be] text-[#5bc0be] font-mono text-xs md:text-sm tracking-wider uppercase rounded-md transition-colors text-center font-bold"
          >
            📊 7-Slide Space Apps Demo Deck
          </a>

          <button
            onClick={() => {
              onReturnToMenu();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn w-full py-2.5 bg-[#100e0c] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-[#efe6d6] font-mono text-xs md:text-sm tracking-wider uppercase rounded-md transition-colors"
          >
            Return to Title (Keep Save)
          </button>
        </div>
      </div>
    </div>
  );
}
