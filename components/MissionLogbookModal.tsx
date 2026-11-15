'use client';
import React, { useState } from 'react';
import { MISSION_LOGBOOK, LogbookEntry } from '@/lib/storyLogbook';
import { sound } from './AudioController';

interface MissionLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxUnlockedStop: number; // Highest stop reached so far (0..10)
  callsign: string;
}

export function MissionLogbookModal({
  isOpen,
  onClose,
  maxUnlockedStop,
  callsign,
}: MissionLogbookModalProps) {
  const [selectedStop, setSelectedStop] = useState<number>(Math.min(maxUnlockedStop, 10));

  if (!isOpen) return null;

  const entry: LogbookEntry | undefined = MISSION_LOGBOOK[selectedStop];

  const handleSelectChapter = (stopIdx: number) => {
    sound.playUiClick();
    setSelectedStop(stopIdx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#100e0c]/90 backdrop-blur-sm p-3 md:p-6 select-none animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#1a1714] border-2 border-[#e39b12] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#efe6d6]">
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-[#100e0c] px-5 py-3.5 border-b border-[#efe6d6]/20">
          <div className="flex items-center gap-3">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="font-serif text-lg md:text-xl font-bold text-[#e39b12] tracking-wider">
                SPECIALIST’S MISSION LOGBOOK & TELEMETRY ARCHIVE
              </h2>
              <p className="text-xs font-mono text-[#efe6d6]/70">
                Deep Space Exploration Vessel Tenth Light • Specialist {callsign} & Droid Nori
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="px-3 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] text-xs font-mono uppercase tracking-wider rounded transition-colors font-bold"
          >
            Close ✕
          </button>
        </div>

        {/* Content Area: Chapter Sidebar + Journal Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Chapter Selector Sidebar */}
          <div className="w-full md:w-64 bg-[#141210] border-b md:border-b-0 md:border-r border-[#efe6d6]/15 overflow-y-auto p-2.5 space-y-1.5 shrink-0">
            <div className="text-xs font-mono uppercase tracking-wider text-[#e39b12] px-2 py-1 font-bold">
              Mission Chapters:
            </div>
            {Object.keys(MISSION_LOGBOOK).map((key) => {
              const stopIdx = parseInt(key);
              const isUnlocked = stopIdx <= maxUnlockedStop;
              const isSelected = selectedStop === stopIdx;
              const item = MISSION_LOGBOOK[stopIdx];

              return (
                <button
                  key={stopIdx}
                  disabled={!isUnlocked}
                  onClick={() => handleSelectChapter(stopIdx)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#e39b12] text-[#100e0c] font-bold shadow'
                      : isUnlocked
                      ? 'hover:bg-[#efe6d6]/10 text-[#efe6d6]/90'
                      : 'text-[#efe6d6]/30 cursor-not-allowed bg-transparent'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="opacity-75 font-semibold">Stop {stopIdx}: </span>
                    <span>{item.locationName.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px]">
                    {isUnlocked ? (isSelected ? '●' : '✓') : '🔒'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Chapter Body View */}
          <div className="flex-1 p-5 md:p-7 overflow-y-auto space-y-5 bg-[#1a1714]">
            {entry ? (
              <div className="space-y-5">
                {/* Chapter Title & Location Info */}
                <div className="border-b border-[#efe6d6]/20 pb-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#e39b12] font-bold mb-1">
                    Stop {entry.stopIndex} • {entry.realDistance}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#efe6d6]">
                    {entry.chapterTitle}
                  </h3>
                  <div className="text-sm font-mono text-[#5bc0be] mt-1">
                    {entry.locationName}
                  </div>
                </div>

                {/* Epigraph */}
                <blockquote className="p-4 bg-[#100e0c] border-l-4 border-[#e39b12] rounded-r-lg font-serif italic text-base md:text-lg text-[#efe6d6]/90 leading-relaxed">
                  {entry.epigraph}
                </blockquote>

                {/* Specialist's Personal Journal */}
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-base text-[#e39b12] flex items-center gap-2">
                    <span>✍️</span> Specialist {callsign}’s Personal Journal
                  </h4>
                  <p className="font-serif text-sm md:text-base text-[#efe6d6] leading-relaxed pl-3 border-l-2 border-[#efe6d6]/20">
                    {entry.specialistJournal.replaceAll('Wren', callsign)}
                  </p>
                </div>

                {/* Droid Nori's Sensor Telemetry Log */}
                <div className="p-4 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg space-y-2">
                  <h4 className="font-mono text-xs uppercase font-bold text-[#5bc0be] flex items-center gap-2">
                    <span>🤖</span> Droid Nori • Internal Sensor Telemetry
                  </h4>
                  <p className="font-mono text-xs md:text-sm text-[#efe6d6]/90 leading-relaxed italic">
                    {entry.noriLog.replaceAll('Wren', callsign)}
                  </p>
                </div>

                {/* Real NASA Archival Context */}
                <div className="p-4 bg-[#141210] border border-[#e39b12]/30 rounded-lg space-y-1.5 text-xs font-sans">
                  <div className="font-mono text-xs font-bold text-[#e39b12] uppercase tracking-wider">
                    🛰️ NASA Planetary Heritage & Science Archive
                  </div>
                  <p className="text-[#efe6d6]/80 leading-relaxed">
                    {entry.historicalContext}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#efe6d6]/50 font-mono text-sm">
                Select an unlocked chapter from the sidebar.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#100e0c] px-5 py-2.5 border-t border-[#efe6d6]/15 flex justify-between items-center text-xs font-mono text-[#efe6d6]/60">
          <span>Chapters unlock as you journey toward Harbor.</span>
          <span>Stops 0 through 10</span>
        </div>
      </div>
    </div>
  );
}
