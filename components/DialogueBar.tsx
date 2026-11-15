'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DialogueLine } from '@/lib/gameTypes';
import { PixelPortrait } from './PixelPortraits';
import { sound } from './AudioController';

interface DialogueBarProps {
  lines: DialogueLine[];
  currentIndex: number;
  onAdvance: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  className?: string;
}

export function DialogueBar({
  lines,
  currentIndex,
  onAdvance,
  onPrevious,
  onComplete,
  className = '',
}: DialogueBarProps) {
  const [isAuto, setIsAuto] = useState(false);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLine = lines[currentIndex] || lines[lines.length - 1];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= lines.length - 1;

  // Sound effect on line change
  useEffect(() => {
    if (currentLine) {
      sound.playTalkBeep(currentLine.speaker === 'nori');
    }
  }, [currentIndex, currentLine]);

  // Handle Next
  const handleNext = () => {
    sound.playUiClick();
    if (!isLast) {
      onAdvance();
    } else if (onComplete) {
      setIsAuto(false);
      onComplete();
    }
  };

  // Handle Previous
  const handlePrevious = () => {
    if (isFirst || !onPrevious) return;
    sound.playUiClick();
    onPrevious();
  };

  // Toggle Auto (advances every 3 seconds)
  const toggleAuto = () => {
    sound.playUiClick();
    setIsAuto((prev) => !prev);
  };

  // Auto-advance loop: exactly 3 seconds (3000ms)
  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }

    if (isAuto) {
      autoTimerRef.current = setTimeout(() => {
        if (!isLast) {
          onAdvance();
        } else {
          setIsAuto(false);
          if (onComplete) {
            onComplete();
          }
        }
      }, 3000);
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [isAuto, currentIndex, isLast, onAdvance, onComplete]);

  if (!currentLine) return null;

  return (
    <section
      aria-label="Mission Dialogue Comms"
      className={`fixed bottom-0 left-0 right-0 min-h-[105px] bg-surface-raised border-t-2 border-signal text-paper px-6 py-3 md:py-3.5 select-none z-40 transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto w-full">
        {/* Pixel Portrait */}
        <div className="shrink-0 flex items-center">
          <PixelPortrait speaker={currentLine.speaker} size={64} />
        </div>

        {/* Content: Relaxed, clear, non-compact typography */}
        <div className="flex-1 min-w-0 w-full py-0.5">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-serif text-sm md:text-base text-signal tracking-wide font-bold">
              {currentLine.speakerName}
            </span>
            <span className="label text-paper-muted">
              [Line <span className="tabular-nums">{currentIndex + 1}</span> of <span className="tabular-nums">{lines.length}</span>]
            </span>
            {currentLine.speaker === 'nori' && (
              <span className="hidden sm:inline-block label text-paper bg-paper/10 px-2 py-0.5 border border-paper/30">
                [Autonomy: Running &middot; Sleeve: Armed]
              </span>
            )}
            {currentLine.speaker === 'wren' && (
              <span className="hidden sm:inline-block label text-signal bg-signal/10 px-2 py-0.5 border border-signal/30">
                [Cabin: Pressurized &middot; In Seat]
              </span>
            )}
            {isAuto && (
              <span className="label text-paper bg-paper/15 px-2 py-0.5 border border-paper/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-signal" aria-hidden="true" />
                Auto Playing (3s)
              </span>
            )}
          </div>

          <p className="text-sm md:text-base leading-relaxed text-paper font-serif m-0">
            {currentLine.text}
          </p>
        </div>

        {/* The 3 Navigation Buttons: Previous, Auto, Next */}
        <div className="shrink-0 flex items-center gap-2 mt-2 md:mt-0">
          {/* 1. Previous Button */}
          <button
            onClick={handlePrevious}
            onMouseEnter={() => !isFirst && sound.playHoverBlip()}
            disabled={isFirst}
            aria-disabled={isFirst}
            className={`sensory-btn !py-2 !px-3 text-xs uppercase font-mono tracking-wider border transition-colors flex items-center gap-1.5 ${
              isFirst
                ? 'bg-void/60 text-paper/40 border-paper/15 cursor-not-allowed'
                : 'bg-void hover:bg-signal hover:text-void text-paper border-paper/30 cursor-pointer'
            }`}
            title="Go to previous dialogue line"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Prev</span>
          </button>

          {/* 2. Auto Button (3 seconds) */}
          <button
            onClick={toggleAuto}
            onMouseEnter={() => sound.playHoverBlip()}
            className={`sensory-btn !py-2 !px-3 text-xs uppercase font-mono tracking-wider border transition-colors flex items-center gap-1.5 ${
              isAuto
                ? 'bg-signal text-void border-signal font-bold'
                : 'bg-void hover:bg-paper/15 text-paper border-paper/30'
            }`}
            title="Automatically advance dialogue every 3 seconds"
          >
            <span aria-hidden="true">{isAuto ? '||' : '>'}</span>
            <span>Auto</span>
          </button>

          {/* 3. Next Button */}
          <button
            onClick={handleNext}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn !py-2 !px-4 bg-signal hover:bg-signal-hover text-void border border-signal text-xs uppercase font-mono font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Go to next dialogue line (or press Space)"
          >
            <span>{isLast ? 'Proceed' : 'Next'}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
