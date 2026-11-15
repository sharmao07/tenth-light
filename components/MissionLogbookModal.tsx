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

const CHAPTER_DESTINATIONS: Record<number, string> = {
  0: 'Earth Departure',
  1: 'The Moon',
  2: 'Mars',
  3: 'Ceres',
  4: 'Jupiter Depot',
  5: 'Enceladus',
  6: 'Uranus',
  7: 'Neptune',
  8: 'Pluto',
  9: 'The Heliopause',
  10: 'Harbor (TOI-700 e)',
};

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
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="logbook-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-none p-4 md:p-8 select-none animate-fadeIn"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-surface-raised border border-signal flex flex-col overflow-hidden text-paper">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center bg-void px-6 py-4 border-b border-paper/20 gap-4">
          <div>
            <h2 id="logbook-title" className="font-serif text-lg md:text-xl text-signal tracking-tight">
              Specialist&rsquo;s Mission Logbook &amp; Telemetry Archive
            </h2>
            <p className="text-xs text-paper-muted font-mono mt-0.5">
              Deep Space Exploration Vessel Tenth Light &middot; Specialist {callsign} &amp; Droid Nori
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tab Switcher */}
            <div className="flex bg-surface p-1 border border-paper/20 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('chapters');
                }}
                className={`sensory-btn px-4 py-1 transition-colors ${
                  activeTab === 'chapters'
                    ? 'bg-signal text-void font-bold'
                    : 'text-paper-muted hover:text-paper'
                }`}
              >
                Acts 0–10
              </button>
              <button
                onClick={() => {
                  sound.playHoverBlip();
                  setActiveTab('fieldNotes');
                }}
                className={`sensory-btn px-4 py-1 transition-colors ${
                  activeTab === 'fieldNotes'
                    ? 'bg-signal text-void font-bold'
                    : 'text-paper-muted hover:text-paper'
                }`}
              >
                Field Notes
              </button>
            </div>

            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="sensory-btn px-4 py-1.5 bg-void hover:bg-signal hover:text-void border border-signal text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Close &times;
            </button>
          </div>
        </div>

        {/* Tab 1: Narrative Chapters (Acts 0 to 10) */}
        {activeTab === 'chapters' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Chapter Selector Sidebar */}
            <div className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-paper/15 overflow-y-auto p-3 space-y-1.5 shrink-0">
              <div className="label text-signal px-2 py-1 font-bold">
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
                    className={`sensory-btn w-full text-left px-3.5 py-2.5 text-xs font-mono transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-signal text-void font-bold border-signal'
                        : isUnlocked
                        ? 'hover:bg-paper/10 text-paper border-transparent'
                        : 'text-paper/40 cursor-not-allowed bg-transparent border-transparent'
                    }`}
                  >
                    <div className="truncate pr-1.5">
                      <span className="tabular-nums">Stop {stopIdx}: </span>
                      <span>{CHAPTER_DESTINATIONS[stopIdx] || item.locationName.replace(/\s*\([^)]*\)/g, '').trim()}</span>
                    </div>
                    <span className="text-xs">
                      {isUnlocked ? (isSelected ? '●' : '✓') : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Chapter Body View */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-surface-raised">
              {entry ? (
                <div className="space-y-6">
                  {/* Chapter Title & Location Info */}
                  <div className="border-b border-paper/20 pb-4">
                    <div className="label text-signal mb-1">
                      Stop <span className="tabular-nums">{entry.stopIndex}</span> &middot; <span className="tabular-nums">{entry.realDistance}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-paper">
                      {entry.chapterTitle}
                    </h3>
                    <div className="text-sm font-sans text-paper-muted mt-1">
                      {entry.locationName}
                    </div>
                  </div>

                  {/* Epigraph */}
                  <blockquote className="p-5 bg-void border-l-4 border-signal font-serif italic text-base md:text-lg text-paper leading-relaxed m-0">
                    &ldquo;{entry.epigraph}&rdquo;
                  </blockquote>

                  {/* Specialist's Personal Journal */}
                  <div className="space-y-2">
                    <h4 className="label text-signal">Specialist {callsign}’s Personal Journal</h4>
                    <p className="font-serif text-sm md:text-base text-paper leading-relaxed pl-4 border-l-2 border-paper/20">
                      {entry.specialistJournal.replaceAll('Wren', callsign)}
                    </p>
                  </div>

                  {/* Droid Nori's Sensor Telemetry Log */}
                  <div className="p-5 bg-void border border-paper/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="label text-paper">Droid Nori &middot; Autonomous Sensor Telemetry</h4>
                      <span className="label text-signal bg-signal/10 px-2 py-0.5 border border-signal/30">
                        Autonomy: Nominal
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-paper-muted font-mono leading-relaxed italic m-0">
                      {entry.noriLog.replaceAll('Wren', callsign)}
                    </p>
                  </div>

                  {/* Real NASA Archival Context */}
                  <div className="p-5 bg-surface border-l-4 border-paper border-y border-r border-paper/15 space-y-2 text-xs font-sans">
                    <div className="label text-paper font-bold">
                      NASA Planetary Heritage &amp; Science Archive
                    </div>
                    <p className="text-paper-muted leading-relaxed m-0">
                      {entry.historicalContext}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-paper-muted text-sm font-mono">
                  Select an unlocked chapter from the sidebar.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Specialist's Field Notes */}
        {activeTab === 'fieldNotes' && (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-5 bg-surface-raised">
            <div className="flex justify-between items-center border-b border-paper/20 pb-4">
              <div>
                <h3 className="font-serif text-xl text-signal">
                  Specialist’s Field Notes Pad
                </h3>
                <p className="text-xs text-paper-muted font-mono">
                  Interactive in-flight notepad. Saved automatically to browser storage.
                </p>
              </div>
              {notesSaved && (
                <span className="label text-signal bg-signal/10 px-3 py-1 border border-signal/30">
                  &check; Autosaved locally
                </span>
              )}
            </div>

            <div className="tui-frame p-4 bg-void border border-paper/20">
              <div className="flex items-center justify-between text-xs font-mono text-paper-muted mb-2 border-b border-paper/10 pb-1.5 tabular-nums">
                <span>TERMINAL: NOTEPAD.TXT</span>
                <span>CHARS: {fieldNotes.length} | LINES: {fieldNotes.split('\n').length}</span>
              </div>
              <textarea
                value={fieldNotes}
                onChange={handleNotesChange}
                placeholder="Type your flight notes, observations on Droid Nori, or thoughts on the exoplanet corridor..."
                className="w-full h-80 bg-transparent text-paper text-xs md:text-sm font-mono leading-relaxed focus:outline-none resize-none selection:bg-signal selection:text-void"
              />
            </div>

            <div className="p-4 bg-surface border border-paper/15 text-xs text-paper-muted font-mono">
              All notes remain on this client under local key <code>tenth-light-field-notes-v1</code>.
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-void px-6 py-3 border-t border-paper/15 flex justify-between items-center text-xs text-paper-muted font-mono">
          <span>Chapters unlock as you journey toward Harbor.</span>
          <span className="tabular-nums">Stops 0 through 10</span>
        </div>
      </div>
    </div>
  );
}
