'use client';
import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'chapters' | 'fieldNotes'>('chapters');
  const [selectedStop, setSelectedStop] = useState<number>(Math.min(maxUnlockedStop, 10));
  const [fieldNotes, setFieldNotes] = useState<string>('');
  const [notesSaved, setNotesSaved] = useState<boolean>(false);

  // Load field notes from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tenth-light-field-notes-v1');
      if (saved) {
        setFieldNotes(saved);
      } else {
        setFieldNotes(`// Specialist ${callsign}'s Field Log\n// Stationed in command module. Life support bus steady at 20W.\n// Nori reports all external sensor arrays calibrated.`);
      }
    }
  }, [callsign]);

  if (!isOpen) return null;

  const entry: LogbookEntry | undefined = MISSION_LOGBOOK[selectedStop];

  const handleSelectChapter = (stopIdx: number) => {
    sound.playHoverBlip();
    setSelectedStop(stopIdx);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    sound.playKeystroke();
    const val = e.target.value;
    setFieldNotes(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenth-light-field-notes-v1', val);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
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
          
          <div className="flex items-center gap-3">
            {/* Tab Switcher (mdxcn / rtecn) */}
            <div className="flex bg-[#141210] p-1 rounded border border-[#efe6d6]/20 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('chapters');
                }}
                className={`sensory-btn px-3 py-1 rounded transition-colors font-bold ${
                  activeTab === 'chapters'
                    ? 'bg-[#e39b12] text-[#100e0c]'
                    : 'text-[#efe6d6]/70 hover:text-[#efe6d6]'
                }`}
              >
                Acts 0–10
              </button>
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('fieldNotes');
                }}
                className={`sensory-btn px-3 py-1 rounded transition-colors font-bold ${
                  activeTab === 'fieldNotes'
                    ? 'bg-[#e39b12] text-[#100e0c]'
                    : 'text-[#efe6d6]/70 hover:text-[#efe6d6]'
                }`}
              >
                ✍️ Field Notes (rtecn)
              </button>
            </div>

            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="sensory-btn px-3 py-1 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] text-xs font-mono uppercase tracking-wider rounded transition-colors font-bold"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Narrative Chapters (Acts 0 to 10) */}
        {activeTab === 'chapters' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Chapter Selector Sidebar */}
            <div className="w-full md:w-64 bg-[#141210] border-b md:border-b-0 md:border-r border-[#efe6d6]/15 overflow-y-auto p-2.5 space-y-1.5 shrink-0">
              <div className="text-xs font-mono uppercase tracking-wider text-[#e39b12] px-2 py-1 font-bold">
                Corridor Chapters:
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
                    onMouseEnter={() => isUnlocked && sound.playHoverBlip()}
                    className={`sensory-btn w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all flex items-center justify-between ${
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

            {/* Chapter Body View (mdxcn style) */}
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

                  {/* Droid Nori's Sensor Telemetry Log (agentcn style) */}
                  <div className="p-4 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs uppercase font-bold text-[#5bc0be] flex items-center gap-2">
                        <span>🤖</span> Droid Nori • Autonomous Sensor Telemetry
                      </h4>
                      <span className="text-[10px] font-mono text-[#5bc0be]/70 bg-[#5bc0be]/10 px-1.5 py-0.5 rounded">
                        AUTONOMY: NOMINAL
                      </span>
                    </div>
                    <p className="font-mono text-xs md:text-sm text-[#efe6d6]/90 leading-relaxed italic">
                      {entry.noriLog.replaceAll('Wren', callsign)}
                    </p>
                  </div>

                  {/* Real NASA Archival Context (mdxcn callout style) */}
                  <div className="p-4 bg-[#141210] border-l-4 border-[#5bc0be] border-y border-r border-[#efe6d6]/15 rounded-r-lg space-y-1.5 text-xs font-sans">
                    <div className="font-mono text-xs font-bold text-[#5bc0be] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🛰️</span>
                      <span>NASA Planetary Heritage & Science Archive</span>
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
        )}

        {/* Tab 2: Specialist's Field Notes (rtecn style) */}
        {activeTab === 'fieldNotes' && (
          <div className="flex-1 p-5 md:p-7 overflow-y-auto space-y-4 bg-[#1a1714]">
            <div className="flex justify-between items-center border-b border-[#efe6d6]/20 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#e39b12]">
                  Specialist’s Field Notes Pad
                </h3>
                <p className="text-xs font-mono text-[#efe6d6]/70">
                  Interactive in-flight notepad (rtecn / mdxcn). Saved automatically to local storage.
                </p>
              </div>
              {notesSaved && (
                <span className="text-xs font-mono text-[#5bc0be] bg-[#5bc0be]/15 px-2.5 py-1 rounded border border-[#5bc0be]/30 animate-pulse">
                  ✓ Autosaved locally
                </span>
              )}
            </div>

            <div className="tui-frame rounded-lg p-3 bg-[#100e0c]">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#efe6d6]/50 mb-2 border-b border-[#efe6d6]/10 pb-1">
                <span>TERMINAL: NOTEPAD.TXT</span>
                <span>CHARS: {fieldNotes.length} | LINES: {fieldNotes.split('\n').length}</span>
              </div>
              <textarea
                value={fieldNotes}
                onChange={handleNotesChange}
                placeholder="Type your flight notes, observations on Droid Nori, or thoughts on the exoplanet corridor..."
                className="w-full h-80 bg-transparent text-[#efe6d6] font-mono text-xs md:text-sm leading-relaxed focus:outline-none resize-none selection:bg-[#e39b12] selection:text-[#100e0c]"
              />
            </div>

            <div className="p-3 bg-[#141210] border border-[#efe6d6]/15 rounded text-xs font-mono text-[#efe6d6]/70 flex items-center gap-2">
              <span>💡</span>
              <span>All notes remain on this machine under local key <code>tenth-light-field-notes-v1</code>.</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#100e0c] px-5 py-2.5 border-t border-[#efe6d6]/15 flex justify-between items-center text-xs font-mono text-[#efe6d6]/60">
          <span>Chapters unlock as you journey toward Harbor.</span>
          <span>Stops 0 through 10</span>
        </div>
      </div>
    </div>
  );
}
