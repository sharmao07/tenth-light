'use client';
import React, { useState, useEffect } from 'react';
import { SMALL_BODIES_SNAPSHOT, SmallBodyData, NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface CeresSelectionProps {
  onSuccess: () => void;
}

export function CeresSelection({ onSuccess }: CeresSelectionProps) {
  const [bodies, setBodies] = useState<SmallBodyData[]>(SMALL_BODIES_SNAPSHOT);
  const [sourceType, setSourceType] = useState<'snapshot' | 'live-verification' | 'live'>('snapshot');
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ceresPlate = NASA_IMAGE_PLATES[3];

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
      setErrorMsg('Incorrect. That body is smaller. Select the largest diameter, orbited by Dawn.');
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: Identify the largest small body orbited by NASA Dawn. Ceres and Pluto are dwarf planets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Ceres Plate */}
        <div className="bg-void p-3 border border-paper/20 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ceresPlate.url}
              alt="Ceres"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-paper-muted text-left leading-relaxed">
            <span className="text-signal font-bold block">{ceresPlate.credit}</span>
            <div className="truncate">{ceresPlate.caption}</div>
          </div>
        </div>

        {/* Small-Body Selection List */}
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center border-b border-paper/15 pb-1.5">
            <span className="text-xs md:text-sm text-signal font-bold font-mono">JPL Small-Body Database</span>
            {sourceType === 'live-verification' ? (
              <span className="text-xs font-mono text-paper bg-surface border border-paper/30 px-2.5 py-0.5" title="Verified against live JPL Small-Body Database API">
                Live Verification Check
              </span>
            ) : sourceType === 'live' ? (
              <span className="text-xs font-mono text-paper bg-surface border border-paper/30 px-2.5 py-0.5">
                Live Data Ingestion
              </span>
            ) : (
              <span className="text-xs font-mono text-signal bg-signal/15 border border-signal/30 px-2.5 py-0.5">
                15 Nov 2026 Archive Snapshot
              </span>
            )}
          </div>

          <div className="space-y-2">
            {bodies.map((b) => {
              const isSelected = selectedBody === b.name;
              const isCorrect = isSelected && b.name.includes('Ceres');

              return (
                <button
                  key={b.name}
                  onClick={() => handleSelect(b.name)}
                  className={`w-full py-2.5 px-3.5 text-left text-xs md:text-sm border transition-colors flex justify-between items-center ${
                    isCorrect
                      ? 'bg-paper text-void border-paper font-bold'
                      : isSelected
                      ? 'bg-signal/20 text-signal border-signal'
                      : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs md:text-sm">{b.name}</div>
                    <div className="text-[11px] opacity-80">{b.class}</div>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-signal tabular-nums">{b.diameterKm} km</div>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-sans text-paper-muted italic border-t border-paper/15 pt-2 leading-relaxed">
            Note: Ceres and Pluto are dwarf planets, not mere asteroids.
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-signal/20 border border-signal text-xs text-signal leading-relaxed">
              {errorMsg}
            </div>
          )}

          {selectedBody?.includes('Ceres') && (
            <div className="p-2.5 bg-surface border border-paper/30 text-xs text-paper leading-relaxed">
              ✓ 1 Ceres confirmed (939.4 km). Dawn’s destination. Pebble grants passage!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
