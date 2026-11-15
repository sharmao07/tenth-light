'use client';
import React, { useEffect } from 'react';
import { sound } from './AudioController';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onReturnToMenu: () => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  soundCaptions?: boolean;
  onToggleSoundCaptions?: () => void;
}

export function PauseModal({
  isOpen,
  onResume,
  onReturnToMenu,
  reducedMotion = false,
  onToggleReducedMotion,
  soundCaptions = true,
  onToggleSoundCaptions,
}: PauseModalProps) {
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
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="pause-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-none p-6 select-none animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-void border border-signal p-8 text-paper space-y-6">
        <div className="space-y-1">
          <span className="label text-signal">Simulation Paused</span>
          <h2 id="pause-modal-title" className="font-serif text-3xl md:text-4xl text-paper tracking-tight">
            Telemetry Frozen
          </h2>
          <p className="text-xs text-paper-muted font-mono leading-relaxed mt-1">
            Internal clocks, physics engines, and delay timers are suspended.
          </p>
        </div>

        {/* Accessibility & Audio Preferences */}
        <div className="space-y-3 border-t border-b border-paper/15 py-4">
          <h3 className="label text-paper border-b border-paper/15 pb-1">
            Accessibility &amp; Sensory Settings
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {onToggleReducedMotion && (
              <button
                type="button"
                onClick={() => {
                  onToggleReducedMotion();
                  sound.playSwitchClick();
                }}
                className={`p-3 text-left border flex items-center justify-between text-xs font-mono transition-colors ${
                  reducedMotion
                    ? 'border-signal bg-signal/15 text-paper'
                    : 'border-paper/20 bg-void hover:border-paper/40 text-paper-muted'
                }`}
                title="Toggle reduced motion for camera drift and animations"
              >
                <span>Motion:</span>
                <span className={`font-bold tabular-nums ${reducedMotion ? 'text-signal' : 'text-paper'}`}>
                  {reducedMotion ? '[REDUCED]' : '[FULL]'}
                </span>
              </button>
            )}

            {onToggleSoundCaptions && (
              <button
                type="button"
                onClick={() => {
                  onToggleSoundCaptions();
                  sound.playSwitchClick();
                }}
                className={`p-3 text-left border flex items-center justify-between text-xs font-mono transition-colors ${
                  soundCaptions
                    ? 'border-signal bg-signal/15 text-paper'
                    : 'border-paper/20 bg-void hover:border-paper/40 text-paper-muted'
                }`}
                title="Toggle real-time closed captions for audio cues"
              >
                <span>Audio Captions:</span>
                <span className={`font-bold tabular-nums ${soundCaptions ? 'text-signal' : 'text-paper'}`}>
                  {soundCaptions ? '[ON]' : '[OFF]'}
                </span>
              </button>
            )}
          </div>

          <div className="p-3 bg-surface border border-paper/15 space-y-2 text-[11px] font-mono mt-3">
            <span className="label text-paper">Keyboard Navigation</span>
            <div className="flex justify-between text-paper-muted">
              <span><kbd className="px-1 border border-paper/30">Esc</kbd> Resume</span>
              <span><kbd className="px-1 border border-paper/30">L</kbd> Logbook</span>
              <span><kbd className="px-1 border border-paper/30">M</kbd> Mute</span>
            </div>
            <div className="flex justify-between text-paper-muted pt-1">
              <span><kbd className="px-1 border border-paper/30">Space</kbd> Action</span>
              <span><kbd className="px-1 border border-paper/30">WASD / Arrows</kbd> Move</span>
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
            className="btn w-full"
          >
            <span>Resume simulation (Esc)</span>
            <span aria-hidden="true">&rarr;</span>
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
