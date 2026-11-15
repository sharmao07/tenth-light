'use client';
import React, { useState } from 'react';
import { sound } from './AudioController';

interface PinnedTelemetryPillProps {
  currentStopIndex: number;
  currentDeltaV: number;
  lives: number;
  onOpenLogbook: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function PinnedTelemetryPill({
  currentStopIndex,
  currentDeltaV,
  lives,
  onOpenLogbook,
  isMuted,
  onToggleMute,
}: PinnedTelemetryPillProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Pinned Flight Telemetry Widget"
      className="fixed bottom-36 right-4 z-40 select-none hidden md:block"
    >
      <div className="bg-surface-raised border border-signal/50 text-paper text-xs overflow-hidden transition-all duration-700">
        {/* Header / Toggle Button */}
        <button
          onClick={() => {
            sound.playHoverBlip();
            setIsExpanded((p) => !p);
          }}
          className="sensory-btn w-full px-4 py-2.5 bg-void hover:bg-signal/20 flex items-center justify-between gap-4 text-left border-b border-paper/15"
          title="Toggle Pinned Flight Telemetry"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-signal animate-pulse" aria-hidden="true" />
            <span className="label text-signal font-bold">
              PINNED TELEMETRY
            </span>
          </div>
          <span className="label text-paper-muted font-mono">
            {isExpanded ? '[DOCK]' : '[PIN]'}
          </span>
        </button>

        {/* Collapsible Body */}
        {isExpanded ? (
          <div className="p-4 space-y-3 w-64 animate-fadeIn">
            <div className="flex justify-between items-center text-xs border-b border-paper/10 pb-1.5">
              <span className="text-paper-muted">Corridor Gate:</span>
              <span className="font-bold text-signal font-mono tabular-nums">Stop {currentStopIndex} / 10</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-paper/10 pb-1.5">
              <span className="text-paper-muted">Delta-v Tank:</span>
              <span className="font-bold text-paper font-mono tabular-nums">{currentDeltaV} m/s</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-paper/10 pb-1.5">
              <span className="text-paper-muted">Hull Integrity:</span>
              <div className="flex gap-1" aria-label={`Hull integrity ${lives} of 3`}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={`block h-2 w-4 transition-colors ${i < lives ? 'bg-signal' : 'bg-paper/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => {
                  sound.playUiClick();
                  onOpenLogbook();
                }}
                className="sensory-btn flex-1 py-1.5 bg-void hover:bg-signal/20 border border-signal text-xs text-signal font-mono uppercase text-center"
              >
                Logbook
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  onToggleMute();
                }}
                className="sensory-btn px-3 py-1.5 bg-void hover:bg-paper/10 border border-paper/30 text-xs text-paper font-mono uppercase text-center"
              >
                {isMuted ? 'Muted' : 'Audio'}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-2 flex items-center gap-4 text-xs text-paper-muted font-mono tabular-nums">
            <span>&Delta;v: <strong className="text-paper">{currentDeltaV}</strong></span>
            <span>Stop: <strong className="text-signal">{currentStopIndex}</strong></span>
            <span>Hull: <strong className="text-signal">{lives}/3</strong></span>
          </div>
        )}
      </div>
    </aside>
  );
}
