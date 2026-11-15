'use client';
import React, { useEffect } from 'react';
import { DialogueLine } from '@/lib/gameTypes';
import { PixelPortrait } from './PixelPortraits';
import { sound } from './AudioController';

interface DialogueBarProps {
  lines: DialogueLine[];
  currentIndex: number;
  onAdvance: () => void;
  onComplete?: () => void;
  className?: string;
}

export function DialogueBar({
  lines,
  currentIndex,
  onAdvance,
  onComplete,
  className = '',
}: DialogueBarProps) {
  const currentLine = lines[currentIndex] || lines[lines.length - 1];

  const handleNext = () => {
    sound.playUiClick();
    if (currentIndex < lines.length - 1) {
      onAdvance();
    } else if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    if (currentLine) {
      sound.playTalkBeep(currentLine.speaker === 'nori');
    }
  }, [currentIndex, currentLine]);

  if (!currentLine) return null;

  const isLast = currentIndex >= lines.length - 1;

  return (
    <div
      onClick={handleNext}
      className={`fixed bottom-0 left-0 right-0 h-[120px] bg-[#1a1714] border-t-2 border-[#e39b12] text-[#efe6d6] px-4 py-2 flex items-center justify-between cursor-pointer select-none z-40 shadow-2xl transition-all ${className}`}
    >
      <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
        {/* Pixel Portrait */}
        <div className="shrink-0 flex items-center">
          <PixelPortrait speaker={currentLine.speaker} size={72} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif font-bold text-base text-[#e39b12] tracking-wide">
              {currentLine.speakerName}
            </span>
            <span className="text-xs text-[#efe6d6]/50 uppercase tracking-widest font-mono">
              [Line {currentIndex + 1}/{lines.length}]
            </span>
          </div>

          <p className="text-sm md:text-base leading-snug text-[#efe6d6] font-serif overflow-hidden text-ellipsis line-clamp-2">
            {currentLine.text}
          </p>
        </div>

        {/* Next indicator */}
        <div className="shrink-0 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="px-3 py-1.5 bg-[#100e0c] hover:bg-[#e39b12] text-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
          >
            <span>{isLast ? 'Proceed' : 'Next'}</span>
            <span className="animate-pulse">▶</span>
          </button>
          <div className="text-[10px] text-[#efe6d6]/40 mt-1 font-mono">
            Space / Click bar
          </div>
        </div>
      </div>
    </div>
  );
}
