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
  onOpenClearance?: () => void;
  showClearanceButton?: boolean;
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
  onOpenClearance,
  showClearanceButton = false,
  isMuted,
  onToggleMute,
  showSentence = true,
}: PersistentHeaderProps) {
  const act = (fn: () => void) => () => {
    fn();
    sound.playUiClick();
  };
  return (
    <header className="w-full bg-[#0a0c10] text-[#e9e6dc] z-50 select-none border-b border-[#e9e6dc]/10">
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-6 flex items-center justify-between gap-8">
        <div className="flex items-baseline gap-8">
          <span className="font-serif text-2xl font-extrabold tracking-tight">Tenth Light</span>
          {currentStopName && (
            <span className="label">
              Stop {currentStopIndex} &middot; <span className="text-[#e9e6dc]">{currentStopName}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3" aria-label={`Hull integrity ${lives} of 3`}>
            <span className="label">Hull</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className={`block h-2.5 w-5 transition-colors duration-700 ${i < lives ? 'bg-[#f0562b]' : 'bg-[#e9e6dc]/15'}`}
              />
            ))}
          </div>

          <nav className="flex items-center gap-3">
            {showClearanceButton && onOpenClearance && (
              <button onClick={act(onOpenClearance)} onMouseEnter={() => sound.playHoverBlip()} className="btn-quiet !border-[#f0562b] !text-[#f0562b]" title="View Gate Clearance Protocol [H]">
                How to clear
              </button>
            )}
            <button onClick={act(onOpenLogbook)} onMouseEnter={() => sound.playHoverBlip()} className="btn-quiet" title="Open the specialist’s journal">Logbook</button>
            <button onClick={act(onToggleMute)} onMouseEnter={() => sound.playHoverBlip()} className="btn-quiet" title={isMuted ? 'Unmute audio' : 'Mute audio'}>{isMuted ? 'Muted' : 'Audio'}</button>
            <button onClick={act(onPause)} onMouseEnter={() => sound.playHoverBlip()} className="btn-quiet" title="Pause (Esc)">Pause</button>
            <button onClick={act(onMenu)} onMouseEnter={() => sound.playHoverBlip()} className="btn-quiet" title="Return to title (keeps save)">Title</button>
          </nav>
        </div>
      </div>
      {showSentence && (
        <p className="max-w-7xl mx-auto px-8 md:px-16 pb-5 -mt-1 text-[13px] leading-relaxed text-[#e9e6dc]/45 font-serif italic">
          “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”
        </p>
      )}
    </header>
  );
}
