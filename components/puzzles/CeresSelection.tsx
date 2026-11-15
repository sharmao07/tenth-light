'use client';
import React, { useState, useEffect } from 'react';
import { SMALL_BODIES_SNAPSHOT, SmallBodyData, NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface CeresSelectionProps {
  onSuccess: () => void;
}

export function CeresSelection({ onSuccess }: CeresSelectionProps) {
  const [bodies, setBodies] = useState<SmallBodyData[]>(SMALL_BODIES_SNAPSHOT);
  const [isSnapshot, setIsSnapshot] = useState(true);
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
          setIsSnapshot(data.source === 'snapshot');
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
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-5 rounded-lg max-w-2xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-4 py-2.5 rounded border border-[#e39b12]/50 text-sm font-mono text-[#e39b12] mb-4 text-center leading-relaxed">
        HOW-TO: Identify the largest small body orbited by NASA Dawn. Ceres and Pluto are dwarf planets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        {/* NASA Ceres Plate */}
        <div className="bg-[#100e0c] p-2.5 border border-[#efe6d6]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#1a1714]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ceresPlate.url}
              alt="Ceres"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs font-mono text-[#efe6d6]/80 text-left leading-relaxed">
            <span className="text-[#e39b12] font-bold block">{ceresPlate.credit}</span>
            <div className="truncate">{ceresPlate.caption}</div>
          </div>
        </div>

        {/* Small-Body Selection List */}
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center border-b border-[#efe6d6]/15 pb-1.5">
            <span className="text-xs md:text-sm font-mono text-[#e39b12] font-bold">JPL Small-Body Database</span>
            {isSnapshot ? (
              <span className="text-xs font-mono text-[#e39b12] bg-[#e39b12]/20 px-2 py-0.5 rounded">
                15 Nov 2026 Snapshot
              </span>
            ) : (
              <span className="text-xs font-mono text-[#5bc0be] bg-[#5bc0be]/20 px-2 py-0.5 rounded">
                Live Query
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
                  className={`w-full py-2.5 px-3.5 text-left font-mono text-xs md:text-sm border rounded-lg transition-colors flex justify-between items-center shadow-sm ${
                    isCorrect
                      ? 'bg-[#5bc0be] text-[#100e0c] border-[#5bc0be] font-bold'
                      : isSelected
                      ? 'bg-[#c4452d]/20 text-[#c4452d] border-[#c4452d]'
                      : 'bg-[#100e0c] hover:bg-[#e39b12] hover:text-[#100e0c] border-[#efe6d6]/30 text-[#efe6d6]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm md:text-base">{b.name}</div>
                    <div className="text-xs opacity-80 mt-0.5">{b.class}</div>
                  </div>
                  <div className="font-mono text-sm md:text-base font-bold text-[#e39b12]">{b.diameterKm} km</div>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-sans text-[#efe6d6]/80 italic border-t border-[#efe6d6]/15 pt-2 leading-relaxed">
            Note: Ceres and Pluto are dwarf planets, not mere asteroids.
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs md:text-sm font-mono text-[#c4452d] leading-relaxed">
              {errorMsg}
            </div>
          )}

          {selectedBody?.includes('Ceres') && (
            <div className="p-2.5 bg-[#5bc0be]/20 border border-[#5bc0be] rounded text-xs md:text-sm font-mono text-[#5bc0be] leading-relaxed">
              ✓ 1 Ceres confirmed (939.4 km). Dawn’s destination. Pebble grants passage!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
