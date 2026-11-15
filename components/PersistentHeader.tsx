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

const STOPS_LIST = [
  { idx: 0, name: 'Earth' },
  { idx: 1, name: 'Moon' },
  { idx: 2, name: 'Mars' },
  { idx: 3, name: 'Ceres' },
  { idx: 4, name: 'Jupiter' },
  { idx: 5, name: 'Enceladus' },
  { idx: 6, name: 'Uranus' },
  { idx: 7, name: 'Neptune' },
  { idx: 8, name: 'Pluto' },
  { idx: 9, name: 'Heliopause' },
  { idx: 10, name: 'Harbor' },
];

export function PersistentHeader({
  lives,
  currentStopName,
  currentStopIndex = 0,
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
      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-5 pb-4 flex items-center justify-between gap-8">
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

      {/* Progress Spine: Thin line with 10 ticks (stops 0 through 10) */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 pb-3 pt-1">
        <div className="relative w-full py-2">
          {/* Base ruled line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#e9e6dc]/15 -translate-y-1/2" />
          
          {/* Progress fill */}
          <div 
            className="absolute top-1/2 left-0 h-[1px] bg-[#f0562b] -translate-y-1/2 transition-all duration-700" 
            style={{ width: `${Math.min(100, Math.max(0, (currentStopIndex / 10) * 100))}%` }}
          />

          {/* 11 Ticks across the 10 legs */}
          <div className="relative flex justify-between items-center w-full">
            {STOPS_LIST.map((stop) => {
              const isPast = stop.idx < currentStopIndex;
              const isCurrent = stop.idx === currentStopIndex;
              return (
                <div
                  key={stop.idx}
                  className="group relative flex flex-col items-center"
                  title={`Stop ${stop.idx}: ${stop.name}`}
                >
                  {/* Tick marker */}
                  <div
                    className={`transition-all duration-500 ${
                      isCurrent
                        ? 'w-2 h-2 bg-[#f0562b] ring-4 ring-[#f0562b]/20'
                        : isPast
                        ? 'w-1.5 h-1.5 bg-[#e9e6dc]'
                        : 'w-1 h-1 bg-[#e9e6dc]/25'
                    }`}
                  />

                  {/* Numeral tick label */}
                  <span
                    className={`mt-1 font-mono text-[9px] uppercase tracking-tighter ${
                      isCurrent
                        ? 'text-[#f0562b] font-bold'
                        : isPast
                        ? 'text-[#e9e6dc]/70'
                        : 'text-[#e9e6dc]/30'
                    }`}
                  >
                    {stop.idx}
                  </span>

                  {/* Micro name tooltip on hover */}
                  <span className="pointer-events-none absolute -bottom-5 hidden group-hover:block font-mono text-[9px] uppercase tracking-wider text-[#e9e6dc] bg-[#0a0c10] border border-[#e9e6dc]/20 px-1.5 py-0.5 whitespace-nowrap z-50">
                    {stop.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showSentence && (
        <p className="max-w-7xl mx-auto px-8 md:px-16 pb-4 text-[12px] leading-relaxed text-[#e9e6dc]/45 font-serif italic border-t border-[#e9e6dc]/5 pt-2">
          “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”
        </p>
      )}
    </header>
  );
}
