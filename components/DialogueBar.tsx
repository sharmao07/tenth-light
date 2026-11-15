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
    <div
      className={`fixed bottom-0 left-0 right-0 min-h-[130px] bg-[#1a1714] border-t-2 border-[#e39b12] text-[#efe6d6] px-4 py-3 select-none z-40 shadow-2xl transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto w-full">
        {/* Pixel Portrait */}
        <div className="shrink-0 flex items-center">
          <PixelPortrait speaker={currentLine.speaker} size={80} />
        </div>

        {/* Content: Relaxed, clear, non-compact typography */}
        <div className="flex-1 min-w-0 w-full py-0.5">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-serif font-bold text-base md:text-lg text-[#e39b12] tracking-wide">
              {currentLine.speakerName}
            </span>
            <span className="text-xs text-[#efe6d6]/60 uppercase tracking-widest font-mono">
              [Line {currentIndex + 1} of {lines.length}]
            </span>
            {currentLine.speaker === 'nori' && (
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#5bc0be] bg-[#5bc0be]/10 px-2 py-0.5 rounded border border-[#5bc0be]/30">
                [AUTONOMY: RUNNING // SLEEVE: ARMED]
              </span>
            )}
            {currentLine.speaker === 'wren' && (
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#e39b12] bg-[#e39b12]/10 px-2 py-0.5 rounded border border-[#e39b12]/30">
                [CABIN: PRESSURIZED // IN SEAT]
              </span>
            )}
            {isAuto && (
              <span className="text-[11px] font-mono text-[#5bc0be] bg-[#5bc0be]/15 px-2 py-0.5 rounded border border-[#5bc0be]/40 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5bc0be]"></span>
                Auto Playing (3s)
              </span>
            )}
          </div>

          <p className="text-base md:text-lg leading-relaxed text-[#efe6d6] font-serif">
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
            className={`sensory-btn px-3 py-2 text-xs md:text-sm font-mono uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 ${
              isFirst
                ? 'bg-[#100e0c]/50 text-[#efe6d6]/30 border-[#efe6d6]/10 cursor-not-allowed'
                : 'bg-[#100e0c] hover:bg-[#e39b12] hover:text-[#100e0c] text-[#efe6d6] border-[#efe6d6]/40 cursor-pointer'
            }`}
            title="Go to previous dialogue line"
          >
            <span>◀</span>
            <span>Previous</span>
          </button>

          {/* 2. Auto Button (3 seconds) */}
          <button
            onClick={toggleAuto}
            onMouseEnter={() => sound.playHoverBlip()}
            className={`sensory-btn px-3 py-2 text-xs md:text-sm font-mono uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 ${
              isAuto
                ? 'bg-[#e39b12] text-[#100e0c] border-[#e39b12] font-bold shadow'
                : 'bg-[#100e0c] hover:bg-[#efe6d6]/10 text-[#efe6d6] border-[#efe6d6]/40'
            }`}
            title="Automatically advance dialogue every 3 seconds"
          >
            <span>{isAuto ? '⏸' : '▶'}</span>
            <span>Auto (3s)</span>
          </button>

          {/* 3. Next Button */}
          <button
            onClick={handleNext}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-4 py-2 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-bold border border-[#e39b12] text-xs md:text-sm font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow"
            title="Go to next dialogue line (or press Space)"
          >
            <span>{isLast ? 'Proceed' : 'Next'}</span>
            <span className="animate-pulse">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
