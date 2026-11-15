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
      <div className="bg-[#141210]/95 border border-[#e39b12]/50 rounded-xl shadow-2xl backdrop-blur-md text-[#efe6d6] font-mono text-xs overflow-hidden transition-all duration-200">
        {/* Header / Toggle Button */}
        <button
          onClick={() => {
            sound.playHoverBlip();
            setIsExpanded((p) => !p);
          }}
          className="sensory-btn w-full px-3.5 py-2 bg-[#100e0c] hover:bg-[#e39b12]/20 flex items-center justify-between gap-3 text-left border-b border-[#efe6d6]/15"
          title="Toggle Pinned Flight Telemetry"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e39b12] animate-pulse" />
            <span className="font-bold text-[#e39b12] uppercase tracking-wider text-[11px]">
              PINNED TELEMETRY
            </span>
          </div>
          <span className="text-[#efe6d6]/60 text-[10px]">
            {isExpanded ? '▲ DOCK' : '▼ PIN'}
          </span>
        </button>

        {/* Collapsible Body */}
        {isExpanded ? (
          <div className="p-3.5 space-y-2.5 w-64 animate-fadeIn">
            <div className="flex justify-between items-center text-[11px] border-b border-[#efe6d6]/10 pb-1.5">
              <span className="text-[#efe6d6]/70">Corridor Gate:</span>
              <span className="font-bold text-[#e39b12]">Stop {currentStopIndex} / 10</span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-[#efe6d6]/10 pb-1.5">
              <span className="text-[#efe6d6]/70">Delta-v Tank:</span>
              <span className="font-bold text-[#5bc0be]">{currentDeltaV} m/s</span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-[#efe6d6]/10 pb-1.5">
              <span className="text-[#efe6d6]/70">Hull Integrity:</span>
              <div className="flex gap-1 text-[#c4452d]">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={i < lives ? 'opacity-100' : 'opacity-20'}>
                    ♥
                  </span>
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
                className="sensory-btn flex-1 py-1.5 bg-[#1a1714] hover:bg-[#e39b12]/20 border border-[#e39b12] rounded text-[10px] text-[#e39b12] font-bold text-center"
              >
                📖 Logbook
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  onToggleMute();
                }}
                className="sensory-btn px-2.5 py-1.5 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 rounded text-[10px] text-[#efe6d6] text-center"
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 flex items-center gap-3 text-[11px] text-[#efe6d6]/80">
            <span>Δv: <strong className="text-[#5bc0be]">{currentDeltaV}</strong></span>
            <span>Stop: <strong className="text-[#e39b12]">{currentStopIndex}</strong></span>
          </div>
        )}
      </div>
    </aside>
  );
}
