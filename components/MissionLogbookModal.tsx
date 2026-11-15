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
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('tenth-light-field-notes-v1');
        if (saved) {
          setFieldNotes(saved);
        } else {
          setFieldNotes(`// Specialist ${callsign}'s Field Log\n// Stationed in command module. Life support bus steady at 20W.\n// Nori reports all external sensor arrays calibrated.`);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10]/90 backdrop-blur-sm p-5 md:p-10 select-none animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#12151b] border border-[#f0562b] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#e9e6dc]">
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-[#0a0c10] px-8 py-5 border-b border-[#e9e6dc]/20">
          <div className="flex items-center gap-5">
            <span className="text-xl"></span>
            <div>
              <h2 className="font-serif text-lg md:text-xl text-[#f0562b] tracking-tight">
                SPECIALIST’S MISSION LOGBOOK & TELEMETRY ARCHIVE
              </h2>
              <p className="text-xs text-[#e9e6dc]/70">
                Deep Space Exploration Vessel Tenth Light • Specialist {callsign} & Droid Nori
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Tab Switcher (mdxcn / rtecn) */}
            <div className="flex bg-[#0f1217] p-1.5 rounded border border-[#e9e6dc]/20 text-xs">
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('chapters');
                }}
                className={`sensory-btn px-5 py-1.5 rounded transition-colors ${
                  activeTab === 'chapters'
                    ? 'bg-[#f0562b] text-[#0a0c10]'
                    : 'text-[#e9e6dc]/70 hover:text-[#e9e6dc]'
                }`}
              >
                Acts 0–10
              </button>
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('fieldNotes');
                }}
                className={`sensory-btn px-5 py-1.5 rounded transition-colors ${
                  activeTab === 'fieldNotes'
                    ? 'bg-[#f0562b] text-[#0a0c10]'
                    : 'text-[#e9e6dc]/70 hover:text-[#e9e6dc]'
                }`}
              >
                Field Notes (rtecn)
              </button>
            </div>

            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="sensory-btn px-5 py-1.5 bg-[#12151b] hover:bg-[#f0562b] hover:text-[#0a0c10] border border-[#f0562b] text-xs tracking-wide rounded transition-colors"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Narrative Chapters (Acts 0 to 10) */}
        {activeTab === 'chapters' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Chapter Selector Sidebar */}
            <div className="w-full md:w-64 bg-[#0f1217] border-b md:border-b-0 md:border-r border-[#e9e6dc]/15 overflow-y-auto p-4 space-y-2 shrink-0">
              <div className="text-xs uppercase tracking-wider text-[#f0562b] px-3 py-1.5 font-bold">
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
                    className={`sensory-btn w-full text-left px-5 py-3 rounded-lg text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f0562b] text-[#0a0c10] font-bold shadow'
                        : isUnlocked
                        ? 'hover:bg-[#e9e6dc]/10 text-[#e9e6dc]/90'
                        : 'text-[#e9e6dc]/30 cursor-not-allowed bg-transparent'
                    }`}
                  >
                    <div className="truncate pr-1.5">
                      <span className="opacity-75 font-semibold">Stop {stopIdx}: </span>
                      <span>{item.locationName.split(' ')[0]}</span>
                    </div>
                    <span className="text-xs">
                      {isUnlocked ? (isSelected ? '●' : '✓') : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Chapter Body View (mdxcn style) */}
            <div className="flex-1 p-8 md:p-7 overflow-y-auto space-y-8 bg-[#12151b]">
              {entry ? (
                <div className="space-y-8">
                  {/* Chapter Title & Location Info */}
                  <div className="border-b border-[#e9e6dc]/20 pb-6">
                    <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold mb-1">
                      Stop {entry.stopIndex} • {entry.realDistance}
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#e9e6dc]">
                      {entry.chapterTitle}
                    </h3>
                    <div className="text-sm text-[#e9e6dc] mt-1">
                      {entry.locationName}
                    </div>
                  </div>

                  {/* Epigraph */}
                  <blockquote className="p-6 bg-[#0a0c10] border-l-4 border-[#f0562b] rounded-r-lg font-serif italic text-base md:text-lg text-[#e9e6dc]/90 leading-relaxed">
                    {entry.epigraph}
                  </blockquote>

                  {/* Specialist's Personal Journal */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-base text-[#f0562b] flex items-center gap-3"> Specialist {callsign}’s Personal Journal
                    </h4>
                    <p className="font-serif text-sm md:text-base text-[#e9e6dc] leading-relaxed pl-5 border-l-2 border-[#e9e6dc]/20">
                      {entry.specialistJournal.replaceAll('Wren', callsign)}
                    </p>
                  </div>

                  {/* Droid Nori's Sensor Telemetry Log (agentcn style) */}
                  <div className="p-6 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase font-bold text-[#e9e6dc] flex items-center gap-3"> Droid Nori • Autonomous Sensor Telemetry
                      </h4>
                      <span className="text-xs text-[#e9e6dc]/70 bg-[#e9e6dc]/10 px-2 py-0.5 rounded">
                        AUTONOMY: NOMINAL
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-[#e9e6dc]/90 leading-relaxed italic">
                      {entry.noriLog.replaceAll('Wren', callsign)}
                    </p>
                  </div>

                  {/* Real NASA Archival Context (mdxcn callout style) */}
                  <div className="p-6 bg-[#0f1217] border-l-4 border-[#e9e6dc] border-y border-r border-[#e9e6dc]/15 rounded-r-lg space-y-2 text-xs font-sans">
                    <div className="text-xs font-bold text-[#e9e6dc] uppercase tracking-wider flex items-center gap-2">
                      <span>NASA Planetary Heritage & Science Archive</span>
                    </div>
                    <p className="text-[#e9e6dc]/80 leading-relaxed">
                      {entry.historicalContext}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#e9e6dc]/50 text-sm">
                  Select an unlocked chapter from the sidebar.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Specialist's Field Notes (rtecn style) */}
        {activeTab === 'fieldNotes' && (
          <div className="flex-1 p-8 md:p-7 overflow-y-auto space-y-6 bg-[#12151b]">
            <div className="flex justify-between items-center border-b border-[#e9e6dc]/20 pb-5">
              <div>
                <h3 className="font-serif text-xl text-[#f0562b]">
                  Specialist’s Field Notes Pad
                </h3>
                <p className="text-xs text-[#e9e6dc]/70">
                  Interactive in-flight notepad (rtecn / mdxcn). Saved automatically to local storage.
                </p>
              </div>
              {notesSaved && (
                <span className="text-xs text-[#e9e6dc] bg-[#e9e6dc]/15 px-4 py-1.5 rounded border border-[#e9e6dc]/30 animate-pulse">
                  ✓ Autosaved locally
                </span>
              )}
            </div>

            <div className="tui-frame rounded-lg p-5 bg-[#0a0c10]">
              <div className="flex items-center justify-between text-xs text-[#e9e6dc]/50 mb-2 border-b border-[#e9e6dc]/10 pb-1.5">
                <span>TERMINAL: NOTEPAD.TXT</span>
                <span>CHARS: {fieldNotes.length} | LINES: {fieldNotes.split('\n').length}</span>
              </div>
              <textarea
                value={fieldNotes}
                onChange={handleNotesChange}
                placeholder="Type your flight notes, observations on Droid Nori, or thoughts on the exoplanet corridor..."
                className="w-full h-80 bg-transparent text-[#e9e6dc] text-xs md:text-sm leading-relaxed focus:outline-none resize-none selection:bg-[#f0562b] selection:text-[#0a0c10]"
              />
            </div>

            <div className="p-5 bg-[#0f1217] border border-[#e9e6dc]/15 rounded text-xs text-[#e9e6dc]/70 flex items-center gap-3">
              <span>All notes remain on this machine under local key <code>tenth-light-field-notes-v1</code>.</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#0a0c10] px-8 py-4 border-t border-[#e9e6dc]/15 flex justify-between items-center text-xs text-[#e9e6dc]/60">
          <span>Chapters unlock as you journey toward Harbor.</span>
          <span>Stops 0 through 10</span>
        </div>
      </div>
    </div>
  );
}
