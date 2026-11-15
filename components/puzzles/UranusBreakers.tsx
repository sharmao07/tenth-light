'use client';
import React, { useState } from 'react';
import { ShipDesign } from '@/lib/gameTypes';
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
  const solarAtUranus = solarCount * (160 / (19.2 * 19.2));
  const rtgPower = hasRtg ? 100 : 0;
  const totalSupply = rtgPower + solarAtUranus;

  // Breakers state
  const [breakerComputer, setBreakerComputer] = useState(true);
  const [breakerRadio, setBreakerRadio] = useState(true);
  const [breakerHeater, setBreakerHeater] = useState(true);
  const [breakerImager, setBreakerImager] = useState(hasImager);
  const [breakerSpec, setBreakerSpec] = useState(hasSpec);
  const [breakerDrill, setBreakerDrill] = useState(hasDrill);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const uranusPlate = NASA_IMAGE_PLATES[6];

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

    sound.playSuccess();
    setStatusMsg(
      `✓ Thermal and power bus balanced: ${currentLoad} W draw within ${totalSupply.toFixed(1)} W supply. Uranus corridor cleared!`
    );
    setTimeout(onSuccess, 800);
  };

  return (
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: Balance breakers at 19.2 AU. Keep heater, computer, and radio on. Switch off imager if overloaded.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Uranus Plate + 1/r^2 Physics Card */}
        <div className="space-y-3">
          <div className="bg-void p-3 border border-paper/20">
            <div className="w-full h-28 relative overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uranusPlate.url}
                alt="Uranus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full mt-1.5 text-xs text-paper-muted text-left leading-relaxed font-mono">
              <span className="text-signal font-bold block">{uranusPlate.credit}</span>
              <div className="truncate">{uranusPlate.caption}</div>
            </div>
          </div>

          {/* 1/r^2 Inverse-square box */}
          <div className="p-3 bg-void border border-paper/20 text-xs space-y-1 font-mono">
            <div className="text-signal font-bold">Physics: Inverse-Square Law (1/r²)</div>
            <div className="text-paper-muted">
              Distance: <span className="font-bold text-paper tabular-nums">19.2 AU</span> (r² = 368.6)
            </div>
            <div className="text-paper-muted">
              Solar at 19.2 AU: <span className="font-bold text-signal tabular-nums">~0.43 W</span> per array
            </div>
            <div className="text-paper-muted">
              RTG Supply: <span className="font-bold text-paper">{hasRtg ? '100 W (Flat)' : '0 W (Missing!)'}</span>
            </div>
          </div>
        </div>

        {/* Breaker Switches Console */}
        <div className="space-y-3 text-xs md:text-sm font-mono">
          <div className="flex justify-between items-center border-b border-paper/15 pb-1.5">
            <span className="text-signal font-bold text-xs sm:text-sm">Bus Power Breakers</span>
            <span className={`font-bold tabular-nums ${currentLoad <= totalSupply ? 'text-paper' : 'text-signal'}`}>
              {currentLoad} W / {totalSupply.toFixed(1)} W
            </span>
          </div>

          {/* Essential Switches */}
          <div className="space-y-1.5">
            <label className="flex justify-between items-center bg-void p-2 border border-paper/20 cursor-pointer">
              <span className="text-paper text-xs">Computer / Command (20W)</span>
              <input
                type="checkbox"
                checked={breakerComputer}
                onChange={(e) => setBreakerComputer(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-void p-2 border border-paper/20 cursor-pointer">
              <span className="text-paper text-xs">High-Gain Radio (15W)</span>
              <input
                type="checkbox"
                checked={breakerRadio}
                onChange={(e) => setBreakerRadio(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-void p-2 border border-paper/20 cursor-pointer">
              <span className="text-paper text-xs">Bus Thermal Heater (+20W)</span>
              <input
                type="checkbox"
                checked={breakerHeater}
                onChange={(e) => setBreakerHeater(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Optional Breakers */}
          <div className="space-y-1.5 border-t border-paper/15 pt-1.5">
            {hasImager && (
              <label className="flex justify-between items-center bg-void p-2 border border-paper/20 cursor-pointer">
                <span className="text-paper-muted text-xs">Imager Camera (5W)</span>
                <input
                  type="checkbox"
                  checked={breakerImager}
                  onChange={(e) => setBreakerImager(e.target.checked)}
                  className="accent-[#f0562b] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasSpec && (
              <label className="flex justify-between items-center bg-void p-2 border border-paper/20 cursor-pointer">
                <span className="text-paper-muted text-xs">Mass Spectrometer (20W)</span>
                <input
                  type="checkbox"
                  checked={breakerSpec}
                  onChange={(e) => setBreakerSpec(e.target.checked)}
                  className="accent-[#f0562b] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasDrill && (
              <label className="flex justify-between items-center bg-[#0a0c10] p-3 border border-[#e9e6dc]/25 rounded-lg cursor-pointer">
                <span className="text-[#e9e6dc]/80">Sample Drill (25W)</span>
                <input
                  type="checkbox"
                  checked={breakerDrill}
                  onChange={(e) => setBreakerDrill(e.target.checked)}
                  className="accent-[#f0562b] w-4 h-4 cursor-pointer"
                />
              </label>
            )}
          </div>

          <button
            onClick={handleTestBus}
            className="w-full mt-2.5 py-4 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] font-bold uppercase tracking-wider rounded-lg transition-colors shadow text-xs md:text-sm"
          >
            Verify Power Stability
          </button>

          {statusMsg && (
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg text-xs leading-relaxed">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
