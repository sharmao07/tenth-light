'use client';
import React from 'react';
import { sound } from './AudioController';

interface PersistentHeaderProps {
  lives: number;
  currentStopName?: string;
  currentStopIndex?: number;
  onPause: () => void;
  onMenu: () => void;
  onOpenLogbook: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showSentence?: boolean;
}

export function PersistentHeader({
  lives,
  currentStopName,
  currentStopIndex,
  onPause,
  onMenu,
  onOpenLogbook,
  isMuted,
  onToggleMute,
  showSentence = true,
}: PersistentHeaderProps) {
  return (
    <header className="w-full bg-[#100e0c] border-b border-[#efe6d6]/20 text-[#efe6d6] z-50 select-none">
      {/* Top Banner: The Sentence That Stays Visible (Comfortable, relaxed reading) */}
      {showSentence && (
        <div className="bg-[#1a1714] text-[#efe6d6]/90 text-xs md:text-sm py-2 px-4 text-center border-b border-[#efe6d6]/10 font-serif leading-relaxed tracking-normal">
          “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Stop status & Lives */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base md:text-lg text-[#e39b12] tracking-wider">
              TENTH LIGHT
            </span>
            {currentStopName && (
              <span className="text-xs md:text-sm font-mono text-[#efe6d6]/80 border-l border-[#efe6d6]/30 pl-3">
                Stop {currentStopIndex}: <span className="font-bold text-[#efe6d6]">{currentStopName}</span>
              </span>
            )}
          </div>

          {/* Lives (3 Hearts, filled blood-red when remaining) */}
          <div className="flex items-center gap-2 bg-[#1a1714] px-3 py-1.5 rounded border border-[#efe6d6]/30 shadow-sm">
            <span className="text-xs uppercase font-mono text-[#efe6d6]/80 mr-0.5 font-bold">Hull</span>
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  i < lives ? 'text-[#c4452d] fill-[#c4452d] scale-100' : 'text-[#efe6d6]/30 fill-transparent scale-90'
                }`}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Right: Controls (Logbook, Pause, Menu, Mute) */}
        <div className="flex items-center gap-2.5">
          {/* Mission Logbook Button */}
          <button
            onClick={() => {
              onOpenLogbook();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3 py-1.5 bg-[#1a1714] hover:bg-[#e39b12]/20 hover:border-[#e39b12] border border-[#efe6d6]/40 rounded text-xs md:text-sm font-mono text-[#e39b12] transition-colors flex items-center gap-1.5 font-bold shadow-sm"
            title="Open Specialist’s Journal & Mission Archive"
          >
            <span>📖</span>
            <span className="hidden sm:inline">Logbook</span>
          </button>

          {/* Mute Button */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3 py-1.5 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/40 rounded text-xs md:text-sm font-mono text-[#efe6d6] transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇 Muted' : '🔊 Audio'}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              onPause();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3 py-1.5 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/40 rounded text-xs md:text-sm font-mono text-[#efe6d6] transition-colors"
            title="Pause game (Escape)"
          >
            ⏸ Pause <span className="opacity-50 text-xs">(Esc)</span>
          </button>

          {/* Menu Button */}
          <button
            onClick={() => {
              onMenu();
              sound.playUiClick();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-3 py-1.5 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] rounded text-xs md:text-sm font-mono text-[#e39b12] transition-colors font-bold"
            title="Return to Title (keeps save)"
          >
            Title / Save
          </button>
        </div>
      </div>
    </header>
  );
}
