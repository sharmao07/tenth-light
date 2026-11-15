'use client';
import React, { useEffect, useState } from 'react';
import { sound } from './AudioController';
import { GameSaveState } from '@/lib/gameTypes';
import { exportSaveString, importSaveString } from '@/lib/gameStore';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onReturnToMenu: () => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  soundCaptions?: boolean;
  onToggleSoundCaptions?: () => void;
  gameState?: GameSaveState;
  onImportState?: (state: GameSaveState) => void;
}

export function PauseModal({
  isOpen,
  onResume,
  onReturnToMenu,
  reducedMotion = false,
  onToggleReducedMotion,
  soundCaptions = true,
  onToggleSoundCaptions,
  gameState,
  onImportState,
}: PauseModalProps) {
  const [showSaveTransfer, setShowSaveTransfer] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);

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

  const handleExportClipboard = () => {
    if (!gameState) return;
    const str = exportSaveString(gameState);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(str).then(() => {
        sound.playSuccess();
        setSaveStatusMsg('✓ Flight telemetry copied to clipboard!');
        setTimeout(() => setSaveStatusMsg(null), 3500);
      });
    }
  };

  const handleExportDownload = () => {
    if (!gameState) return;
    const str = exportSaveString(gameState);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenth-light-save-${gameState.callsign || 'pilot'}-stop${gameState.currentStop}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playSuccess();
    setSaveStatusMsg('✓ Manifest file downloaded!');
    setTimeout(() => setSaveStatusMsg(null), 3500);
  };

  const handleImport = () => {
    sound.playUiClick();
    if (!importInput.trim()) {
      setSaveStatusMsg('Please paste a telemetry manifest JSON string.');
      return;
    }
    const res = importSaveString(importInput);
    if (res.success && res.state) {
      sound.playSuccess();
      setSaveStatusMsg('✓ Manifest successfully restored! Resuming flight.');
      setTimeout(() => {
        onImportState?.(res.state!);
        onResume();
      }, 700);
    } else {
      sound.playMiss();
      setSaveStatusMsg(`Failed to import: ${res.error || 'Invalid manifest'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="pause-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-none p-6 select-none animate-fadeIn overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-void border border-signal p-8 text-paper space-y-6 my-auto">
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

          {/* Cross-Device Save & Telemetry Transfer Panel */}
          <div className="pt-2 border-t border-paper/10">
            <button
              type="button"
              onClick={() => {
                sound.playUiClick();
                setShowSaveTransfer((prev) => !prev);
              }}
              className="w-full flex items-center justify-between text-left p-2.5 bg-surface border border-paper/15 hover:border-paper/30 transition-colors"
            >
              <span className="label text-signal">
                Cross-Device Save &middot; Transfer Manifest
              </span>
              <span className="font-mono text-xs text-paper-muted">
                {showSaveTransfer ? '[-] Close' : '[+] Export / Import'}
              </span>
            </button>

            {showSaveTransfer && (
              <div className="p-4 bg-void border-x border-b border-paper/15 space-y-4 text-xs font-mono animate-fadeIn">
                <p className="text-paper-muted leading-relaxed text-[11px]">
                  Export your mission save to transfer progress between browsers or devices, or paste an exported manifest below to resume:
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleExportClipboard}
                    className="flex-1 py-2 px-3 border border-paper/20 hover:border-signal text-paper font-bold transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    type="button"
                    onClick={handleExportDownload}
                    className="py-2 px-3 border border-paper/20 hover:border-signal text-paper font-bold transition-colors"
                  >
                    Save File (.json)
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-paper/10">
                  <label htmlFor="import-save-area" className="label text-paper-muted block">
                    Import Save Manifest:
                  </label>
                  <textarea
                    id="import-save-area"
                    rows={3}
                    value={importInput}
                    onChange={(e) => setImportInput(e.target.value)}
                    placeholder="Paste exported telemetry JSON manifest here..."
                    className="w-full bg-surface border border-paper/20 p-2 font-mono text-[11px] text-paper placeholder:text-paper-muted/50 focus:border-signal outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleImport}
                    className="w-full py-2 bg-signal text-void font-bold uppercase tracking-wider hover:bg-signal-hover transition-colors"
                  >
                    Load &amp; Restore Flight Manifest
                  </button>
                </div>

                {saveStatusMsg && (
                  <div className="p-2 border border-signal bg-signal/15 text-paper text-[11px] leading-relaxed">
                    {saveStatusMsg}
                  </div>
                )}
              </div>
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
