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
      className={`fixed bottom-0 left-0 right-0 min-h-[130px] bg-[#12151b] border-t-2 border-[#f0562b] text-[#e9e6dc] px-6 py-5 select-none z-40 shadow-2xl transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 max-w-6xl mx-auto w-full">
        {/* Pixel Portrait */}
        <div className="shrink-0 flex items-center">
          <PixelPortrait speaker={currentLine.speaker} size={80} />
        </div>

        {/* Content: Relaxed, clear, non-compact typography */}
        <div className="flex-1 min-w-0 w-full py-0.5">
          <div className="flex items-center gap-5 mb-1.5">
            <span className="font-serif text-base md:text-lg text-[#f0562b] tracking-wide">
              {currentLine.speakerName}
            </span>
            <span className="text-xs text-[#e9e6dc]/60 uppercase tracking-widest ">
              [Line {currentIndex + 1} of {lines.length}]
            </span>
            {currentLine.speaker === 'nori' && (
              <span className="hidden sm:inline-block text-xs text-[#e9e6dc] bg-[#e9e6dc]/10 px-3 py-0.5 rounded border border-[#e9e6dc]/30">
                [AUTONOMY: RUNNING // SLEEVE: ARMED]
              </span>
            )}
            {currentLine.speaker === 'wren' && (
              <span className="hidden sm:inline-block text-xs text-[#f0562b] bg-[#f0562b]/10 px-3 py-0.5 rounded border border-[#f0562b]/30">
                [CABIN: PRESSURIZED // IN SEAT]
              </span>
            )}
            {isAuto && (
              <span className="text-xs text-[#e9e6dc] bg-[#e9e6dc]/15 px-3 py-0.5 rounded border border-[#e9e6dc]/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9e6dc]"></span>
                Auto Playing (3s)
              </span>
            )}
          </div>

          <p className="text-base md:text-lg leading-relaxed text-[#e9e6dc] font-serif">
            {currentLine.text}
          </p>
        </div>

        {/* The 3 Navigation Buttons: Previous, Auto, Next */}
        <div className="shrink-0 flex items-center gap-3 mt-2 md:mt-0">
          {/* 1. Previous Button */}
          <button
            onClick={handlePrevious}
            onMouseEnter={() => !isFirst && sound.playHoverBlip()}
            disabled={isFirst}
            className={`sensory-btn px-5 py-3 text-xs md:text-sm tracking-wide rounded border transition-colors flex items-center gap-2 ${
              isFirst
                ? 'bg-[#0a0c10]/50 text-[#e9e6dc]/30 border-[#e9e6dc]/10 cursor-not-allowed'
                : 'bg-[#0a0c10] hover:bg-[#f0562b] hover:text-[#0a0c10] text-[#e9e6dc] border-[#e9e6dc]/40 cursor-pointer'
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
            className={`sensory-btn px-5 py-3 text-xs md:text-sm tracking-wide rounded border transition-colors flex items-center gap-2 ${
              isAuto
                ? 'bg-[#f0562b] text-[#0a0c10] border-[#f0562b] font-bold shadow'
                : 'bg-[#0a0c10] hover:bg-[#e9e6dc]/10 text-[#e9e6dc] border-[#e9e6dc]/40'
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
            className="sensory-btn px-6 py-3 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] border border-[#f0562b] text-xs md:text-sm tracking-wide rounded transition-colors flex items-center gap-2 shadow"
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
