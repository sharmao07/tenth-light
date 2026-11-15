'use client';
import React, { useState } from 'react';
import { ShipDesign, URANUS_HEATER_BUS_WATTS } from '@/lib/gameTypes';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface UranusBreakersProps {
  design: ShipDesign;
  onSuccess: () => void;
  onScrubToHangar: () => void;
}

export function UranusBreakers({ design, onSuccess, onScrubToHangar }: UranusBreakersProps) {
  const parts = design.parts || {};
  const hasRtg = (parts['rtg'] || 0) > 0;
  const solarCount = parts['solar_array'] || 0;
  const hasImager = (parts['imager'] || 0) > 0;
  const hasSpec = (parts['spectrometer'] || 0) > 0;
  const hasDrill = (parts['sample_drill'] || 0) > 0;

  // Real 1/r^2 calculation at Uranus (19.2 AU)
  // Solar at 1 AU is 160 W. At 19.2 AU: 160 / (19.2^2) = ~0.434 W per array.
  const solarAtUranus = solarCount * (160 / (19.2 * 19.2));
  const rtgPower = hasRtg ? 100 : 0;
  const totalSupply = rtgPower + solarAtUranus;

  // Breakers state
  // Heater, computer, and radio MUST stay on
  const [breakerComputer, setBreakerComputer] = useState(true);
  const [breakerRadio, setBreakerRadio] = useState(true);
  const [breakerHeater, setBreakerHeater] = useState(true);
  const [breakerImager, setBreakerImager] = useState(hasImager);
  const [breakerSpec, setBreakerSpec] = useState(hasSpec);
  const [breakerDrill, setBreakerDrill] = useState(hasDrill);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const uranusPlate = NASA_IMAGE_PLATES[6];

  // Calculate current load
  let currentLoad = 0;
  if (breakerComputer) currentLoad += 20;
  if (breakerRadio) currentLoad += 15;
  if (breakerHeater) currentLoad += 20;
  if (hasImager && breakerImager) currentLoad += 5;
  if (hasSpec && breakerSpec) currentLoad += 20;
  if (hasDrill && breakerDrill) currentLoad += 25;

  const aliveBusOn = breakerComputer && breakerRadio && breakerHeater;

  const handleTestBus = () => {
    sound.playUiClick();

    // Check if player has NO RTG
    if (!hasRtg) {
      sound.playMiss();
      setStatusMsg(
        'FATAL: Solar power at 19.2 AU yields only 0.43 W (1/r² law). Alive bus requires 55 W. Deep freeze blackout! Mission scrubbed to hangar.'
      );
      setTimeout(onScrubToHangar, 2000);
      return;
    }

    if (!aliveBusOn) {
      sound.playMiss();
      setStatusMsg('WARNING: Heater (+20W), Computer (20W), and Radio (15W) MUST remain powered on!');
      return;
    }

    if (currentLoad > totalSupply) {
      sound.playMiss();
      setStatusMsg(
        `OVERLOAD: Total draw is ${currentLoad} W exceeding supply (${totalSupply.toFixed(1)} W). Open non-essential breakers (e.g. switch off Imager)!`
      );
      return;
    }

    // Success!
    sound.playSuccess();
    setStatusMsg(
      `✓ Thermal and power bus balanced: ${currentLoad} W draw within ${totalSupply.toFixed(1)} W supply. Uranus corridor cleared!`
    );
    setTimeout(onSuccess, 800);
  };

  return (
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded max-w-xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-3 py-1.5 rounded border border-[#e39b12]/50 text-xs font-mono text-[#e39b12] mb-3 text-center">
        HOW-TO: Balance breakers at 19.2 AU. Keep heater, computer, and radio on. Switch off imager if overloaded.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Uranus Plate + 1/r^2 Physics Card */}
        <div className="space-y-2">
          <div className="bg-[#100e0c] p-2 border border-[#efe6d6]/20 rounded">
            <div className="w-full h-32 relative overflow-hidden rounded bg-[#1a1714]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uranusPlate.url}
                alt="Uranus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full mt-1.5 text-[10px] font-mono text-[#efe6d6]/60 text-left">
              <span className="text-[#e39b12] font-semibold">{uranusPlate.credit}</span>
              <div className="truncate">{uranusPlate.caption}</div>
            </div>
          </div>

          {/* 1/r^2 Inverse-square box */}
          <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-[11px] font-mono">
            <div className="text-[#e39b12] font-bold">Physics: Inverse-Square Law (1/r²)</div>
            <div className="text-[#efe6d6]/80 mt-0.5">
              Distance: <span className="font-bold">19.2 AU</span> (r² = 368.6)
            </div>
            <div className="text-[#efe6d6]/80">
              Solar at 19.2 AU: <span className="font-bold text-[#c4452d]">0.43 W</span> per array
            </div>
            <div className="text-[#efe6d6]/80">
              RTG Supply: <span className="font-bold text-[#5bc0be]">{hasRtg ? '100 W (Flat)' : '0 W (Missing!)'}</span>
            </div>
          </div>
        </div>

        {/* Breaker Switches Console */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-[#efe6d6]/10 pb-1">
            <span className="text-[#e39b12] font-bold">Bus Power Breakers</span>
            <span className={currentLoad <= totalSupply ? 'text-[#5bc0be]' : 'text-[#c4452d] font-bold'}>
              {currentLoad} W / {totalSupply.toFixed(1)} W
            </span>
          </div>

          {/* Essential Switches */}
          <div className="space-y-1">
            <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
              <span className="text-[#efe6d6]">Computer / Command (20W)</span>
              <input
                type="checkbox"
                checked={breakerComputer}
                onChange={(e) => setBreakerComputer(e.target.checked)}
                className="accent-[#e39b12] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
              <span className="text-[#efe6d6]">High-Gain Radio (15W)</span>
              <input
                type="checkbox"
                checked={breakerRadio}
                onChange={(e) => setBreakerRadio(e.target.checked)}
                className="accent-[#e39b12] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
              <span className="text-[#efe6d6]">Bus Thermal Heater (+20W)</span>
              <input
                type="checkbox"
                checked={breakerHeater}
                onChange={(e) => setBreakerHeater(e.target.checked)}
                className="accent-[#e39b12] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Optional Breakers */}
          <div className="space-y-1 border-t border-[#efe6d6]/10 pt-1">
            {hasImager && (
              <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
                <span className="text-[#efe6d6]/80">Imager Camera (5W)</span>
                <input
                  type="checkbox"
                  checked={breakerImager}
                  onChange={(e) => setBreakerImager(e.target.checked)}
                  className="accent-[#e39b12] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasSpec && (
              <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
                <span className="text-[#efe6d6]/80">Mass Spectrometer (20W)</span>
                <input
                  type="checkbox"
                  checked={breakerSpec}
                  onChange={(e) => setBreakerSpec(e.target.checked)}
                  className="accent-[#e39b12] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasDrill && (
              <label className="flex justify-between items-center bg-[#100e0c] p-1.5 border border-[#efe6d6]/20 rounded">
                <span className="text-[#efe6d6]/80">Sample Drill (25W)</span>
                <input
                  type="checkbox"
                  checked={breakerDrill}
                  onChange={(e) => setBreakerDrill(e.target.checked)}
                  className="accent-[#e39b12] w-4 h-4 cursor-pointer"
                />
              </label>
            )}
          </div>

          <button
            onClick={handleTestBus}
            className="w-full mt-2 py-2 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-bold uppercase tracking-wider rounded transition-colors"
          >
            Verify Power Stability
          </button>

          {statusMsg && (
            <div className="p-1.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-[11px] leading-tight">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
