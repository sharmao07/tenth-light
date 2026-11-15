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
    <div className="bg-[#12151b]/95 border border-[#f0562b] p-8 rounded-lg max-w-2xl mx-auto text-[#e9e6dc] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#0a0c10] px-6 py-4 rounded border border-[#f0562b]/50 text-sm text-[#f0562b] mb-4 text-center leading-relaxed">
        HOW-TO: Identify the largest small body orbited by NASA Dawn. Ceres and Pluto are dwarf planets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* NASA Ceres Plate */}
        <div className="bg-[#0a0c10] p-4 border border-[#e9e6dc]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#12151b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ceresPlate.url}
              alt="Ceres"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-[#e9e6dc]/80 text-left leading-relaxed">
            <span className="text-[#f0562b] font-bold block">{ceresPlate.credit}</span>
            <div className="truncate">{ceresPlate.caption}</div>
          </div>
        </div>

        {/* Small-Body Selection List */}
        <div className="space-y-5 font-sans">
          <div className="flex justify-between items-center border-b border-[#e9e6dc]/15 pb-2">
            <span className="text-xs md:text-sm text-[#f0562b] font-bold">JPL Small-Body Database</span>
            {isSnapshot ? (
              <span className="text-xs text-[#f0562b] bg-[#f0562b]/20 px-3 py-0.5 rounded">
                15 Nov 2026 Snapshot
              </span>
            ) : (
              <span className="text-xs text-[#e9e6dc] bg-[#e9e6dc]/20 px-3 py-0.5 rounded">
                Live Query
              </span>
            )}
          </div>

          <div className="space-y-3">
            {bodies.map((b) => {
              const isSelected = selectedBody === b.name;
              const isCorrect = isSelected && b.name.includes('Ceres');

              return (
                <button
                  key={b.name}
                  onClick={() => handleSelect(b.name)}
                  className={`w-full py-4 px-5 text-left text-xs md:text-sm border rounded-lg transition-colors flex justify-between items-center shadow-sm ${
                    isCorrect
                      ? 'bg-[#e9e6dc] text-[#0a0c10] border-[#e9e6dc] font-bold'
                      : isSelected
                      ? 'bg-[#f0562b]/20 text-[#f0562b] border-[#f0562b]'
                      : 'bg-[#0a0c10] hover:bg-[#f0562b] hover:text-[#0a0c10] border-[#e9e6dc]/30 text-[#e9e6dc]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm md:text-base">{b.name}</div>
                    <div className="text-xs opacity-80 mt-0.5">{b.class}</div>
                  </div>
                  <div className="text-sm md:text-base font-bold text-[#f0562b]">{b.diameterKm} km</div>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-sans text-[#e9e6dc]/80 italic border-t border-[#e9e6dc]/15 pt-3 leading-relaxed">
            Note: Ceres and Pluto are dwarf planets, not mere asteroids.
          </div>

          {errorMsg && (
            <div className="p-4 bg-[#f0562b]/20 border border-[#f0562b] rounded text-xs md:text-sm text-[#f0562b] leading-relaxed">
              {errorMsg}
            </div>
          )}

          {selectedBody?.includes('Ceres') && (
            <div className="p-4 bg-[#e9e6dc]/20 border border-[#e9e6dc] rounded text-xs md:text-sm text-[#e9e6dc] leading-relaxed">
              ✓ 1 Ceres confirmed (939.4 km). Dawn’s destination. Pebble grants passage!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
