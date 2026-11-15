'use client';
import React from 'react';
import { sound } from './AudioController';
import { AudioMorphIcon, ClearanceMorphIcon } from './MorphingIcons';

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
    <header className="w-full bg-void text-paper z-50 select-none border-b border-paper/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-6">
          <span className="font-serif text-2xl font-extrabold tracking-tight text-paper">Tenth Light</span>
          {currentStopName && (
            <span className="label text-paper-muted">
              Stop <span className="tabular-nums">{currentStopIndex}</span> &middot; <span className="text-paper font-semibold">{currentStopName}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5" aria-label={`Hull integrity ${lives} of 3`}>
            <span className="label text-paper-muted">Hull</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`block h-2.5 w-5 transition-colors duration-700 ${i < lives ? 'bg-signal' : 'bg-paper/20'}`}
              />
            ))}
          </div>

          <nav aria-label="Flight Deck Navigation" className="flex items-center gap-2">
            {showClearanceButton && onOpenClearance && (
              <button 
                onClick={act(onOpenClearance)} 
                onMouseEnter={() => sound.playHoverBlip()} 
                className="btn-quiet !border-signal !text-signal font-mono text-xs uppercase flex items-center gap-1.5" 
                title="View How This Works Clearance Protocol [H]"
              >
                <ClearanceMorphIcon isCleared={false} size={13} />
                <span>How this works</span>
              </button>
            )}
            <button 
              onClick={act(onOpenLogbook)} 
              onMouseEnter={() => sound.playHoverBlip()} 
              className="btn-quiet font-mono text-xs uppercase" 
              title="Open the specialist’s journal (L)"
            >
              Logbook
            </button>
            <button 
              onClick={act(onToggleMute)} 
              onMouseEnter={() => sound.playHoverBlip()} 
              className="btn-quiet font-mono text-xs uppercase flex items-center gap-1.5" 
              title={isMuted ? 'Unmute audio (M)' : 'Mute audio (M)'}
            >
              <AudioMorphIcon isMuted={isMuted} size={14} />
              <span>{isMuted ? 'Muted' : 'Audio'}</span>
            </button>
            <button 
              onClick={act(onPause)} 
              onMouseEnter={() => sound.playHoverBlip()} 
              className="btn-quiet font-mono text-xs uppercase" 
              title="Pause Simulation (Esc)"
            >
              Pause
            </button>
            <button 
              onClick={act(onMenu)} 
              onMouseEnter={() => sound.playHoverBlip()} 
              className="btn-quiet font-mono text-xs uppercase" 
              title="Return to Title Screen"
            >
              Title
            </button>
          </nav>
        </div>
      </div>

      {/* Progress Spine: Thin line with 10 ticks (stops 0 through 10) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-2.5 pt-1">
        <div className="relative w-full py-2">
          {/* Base ruled line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-paper/15 -translate-y-1/2" />
          
          {/* Progress fill */}
          <div 
            className="absolute top-1/2 left-0 h-[1px] bg-signal -translate-y-1/2 transition-all duration-700" 
            style={{ width: `${Math.min(100, Math.max(0, (currentStopIndex / 10) * 100))}%` }}
          />

          {/* 11 Ticks across the 10 flight legs */}
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
                        ? 'w-2 h-2 bg-signal ring-4 ring-signal/20'
                        : isPast
                        ? 'w-1.5 h-1.5 bg-paper'
                        : 'w-1 h-1 bg-paper/40'
                    }`}
                  />

                  {/* Numeral tick label */}
                  <span
                    className={`mt-1 font-mono text-[9px] uppercase tracking-tighter tabular-nums ${
                      isCurrent
                        ? 'text-signal font-bold'
                        : isPast
                        ? 'text-paper-muted'
                        : 'text-paper-dim'
                    }`}
                  >
                    {stop.idx}
                  </span>

                  {/* Micro name tooltip on hover */}
                  <span className="pointer-events-none absolute -bottom-5 hidden group-hover:block font-mono text-[9px] uppercase tracking-wider text-paper bg-surface border border-paper/20 px-1.5 py-0.5 whitespace-nowrap z-50">
                    {stop.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showSentence && (
        <p className="max-w-7xl mx-auto px-6 md:px-12 pb-3.5 pt-2.5 text-xs sm:text-[13px] leading-relaxed text-paper-muted font-serif italic border-t border-paper/10 m-0">
          &ldquo;Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive&rsquo;s numbers. The aliens, the depot fight, and the droid are the story.&rdquo;
        </p>
      )}
    </header>
  );
}
