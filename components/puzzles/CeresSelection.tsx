'use client';
import React, { useState, useEffect } from 'react';
import { SMALL_BODIES_SNAPSHOT, SmallBodyData } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface CeresSelectionProps {
  onSuccess: () => void;
}

export function CeresSelection({ onSuccess }: CeresSelectionProps) {
  const [bodies, setBodies] = useState<SmallBodyData[]>(SMALL_BODIES_SNAPSHOT);
  const [sourceType, setSourceType] = useState<'snapshot' | 'live-verification' | 'live'>('snapshot');
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/nasa/small-bodies')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.data) {
          setBodies(data.data);
          setSourceType(data.source === 'live-verification' ? 'live-verification' : data.source === 'live' ? 'live' : 'snapshot');
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSelect = (name: string) => {
    sound.playUiClick();
    setSelectedBody(name);
    if (name.includes('Ceres')) {
      sound.playSuccess();
      setErrorMsg(null);
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setErrorMsg('Incorrect. That body is smaller. Select the largest diameter, orbited by NASA Dawn.');
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: Identify the largest small body orbited by NASA Dawn. Ceres and Pluto are dwarf planets.
      </div>

      {/* Small-Body Selection List */}
      <div className="space-y-4 font-sans">
        <div className="flex flex-wrap justify-between items-center border-b border-paper/15 pb-3 gap-2">
          <span className="text-sm md:text-base text-signal font-bold font-mono">
            JPL Small-Body Database
          </span>
          {sourceType === 'live-verification' ? (
            <span className="text-xs font-mono text-paper bg-surface border border-paper/30 px-3 py-1" title="Verified against live JPL Small-Body Database API">
              Live Verification Check
            </span>
          ) : sourceType === 'live' ? (
            <span className="text-xs font-mono text-paper bg-surface border border-paper/30 px-3 py-1">
              Live Data Ingestion
            </span>
          ) : (
            <span className="text-xs font-mono text-signal bg-signal/15 border border-signal/30 px-3 py-1">
              15 Nov 2026 Archive Snapshot
            </span>
          )}
        </div>

        <div className="space-y-3 my-4">
          {bodies.map((b) => {
            const isSelected = selectedBody === b.name;
            const isCorrect = isSelected && b.name.includes('Ceres');

            return (
              <button
                key={b.name}
                onClick={() => handleSelect(b.name)}
                className={`w-full py-3.5 px-4 text-left text-xs sm:text-sm border transition-colors flex justify-between items-center ${
                  isCorrect
                    ? 'bg-paper text-void border-paper font-bold'
                    : isSelected
                    ? 'bg-signal/20 text-signal border-signal'
                    : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm">{b.name}</div>
                  <div className="text-[11px] sm:text-xs opacity-80 mt-0.5">{b.class} &middot; {b.notes.split('.')[0]}</div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-signal tabular-nums font-mono pl-3 whitespace-nowrap">
                  {b.diameterKm} km
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-sans text-paper-muted italic border-t border-paper/15 pt-3 leading-relaxed">
          Note: Ceres and Pluto are dwarf planets, not mere asteroids. Dawn orbited Vesta in 2011 and Ceres in 2015.
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-signal/20 border border-signal text-xs sm:text-sm text-signal leading-relaxed font-mono mt-3">
            {errorMsg}
          </div>
        )}

        {selectedBody?.includes('Ceres') && (
          <div className="p-3.5 bg-surface border border-paper/30 text-xs sm:text-sm text-paper leading-relaxed font-mono mt-3">
            ✓ 1 Ceres confirmed (939.4 km mean diameter). Dawn’s destination. Pebble grants passage!
          </div>
        )}
      </div>
    </div>
  );
}
