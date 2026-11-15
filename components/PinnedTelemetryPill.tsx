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
      <div className="bg-[#0f1217]/95 border border-[#f0562b]/50 rounded-xl shadow-2xl backdrop-blur-md text-[#e9e6dc] text-xs overflow-hidden transition-all duration-700">
        {/* Header / Toggle Button */}
        <button
          onClick={() => {
            sound.playHoverBlip();
            setIsExpanded((p) => !p);
          }}
          className="sensory-btn w-full px-5 py-3 bg-[#0a0c10] hover:bg-[#f0562b]/20 flex items-center justify-between gap-5 text-left border-b border-[#e9e6dc]/15"
          title="Toggle Pinned Flight Telemetry"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#f0562b] animate-pulse" />
            <span className="font-bold text-[#f0562b] uppercase tracking-wider text-xs">
              PINNED TELEMETRY
            </span>
          </div>
          <span className="text-[#e9e6dc]/60 text-xs">
            {isExpanded ? '▲ DOCK' : '▼ PIN'}
          </span>
        </button>

        {/* Collapsible Body */}
        {isExpanded ? (
          <div className="p-5 space-y-4 w-64 animate-fadeIn">
            <div className="flex justify-between items-center text-xs border-b border-[#e9e6dc]/10 pb-2">
              <span className="text-[#e9e6dc]/70">Corridor Gate:</span>
              <span className="font-bold text-[#f0562b]">Stop {currentStopIndex} / 10</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-[#e9e6dc]/10 pb-2">
              <span className="text-[#e9e6dc]/70">Delta-v Tank:</span>
              <span className="font-bold text-[#e9e6dc]">{currentDeltaV} m/s</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-[#e9e6dc]/10 pb-2">
              <span className="text-[#e9e6dc]/70">Hull Integrity:</span>
              <div className="flex gap-1.5 text-[#f0562b]">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={i < lives ? 'opacity-100' : 'opacity-20'}>
                    ♥
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="pt-1.5 flex gap-3">
              <button
                onClick={() => {
                  sound.playUiClick();
                  onOpenLogbook();
                }}
                className="sensory-btn flex-1 py-2 bg-[#12151b] hover:bg-[#f0562b]/20 border border-[#f0562b] rounded text-xs text-[#f0562b] text-center"
              >
                Logbook
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  onToggleMute();
                }}
                className="sensory-btn px-4 py-2 bg-[#12151b] hover:bg-[#e9e6dc]/10 border border-[#e9e6dc]/30 rounded text-xs text-[#e9e6dc] text-center"
              >
                {isMuted ? '' : ''}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-2 flex items-center gap-5 text-xs text-[#e9e6dc]/80">
            <span>Δv: <strong className="text-[#e9e6dc]">{currentDeltaV}</strong></span>
            <span>Stop: <strong className="text-[#f0562b]">{currentStopIndex}</strong></span>
          </div>
        )}
      </div>
    </aside>
  );
}
