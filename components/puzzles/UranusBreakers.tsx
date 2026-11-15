'use client';
import React, { useState } from 'react';
import { ShipDesign } from '@/lib/gameTypes';
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
        'FATAL: Solar power at 19.2 AU yields only ~0.43 W per array (1/r² law). Alive bus requires 55 W. Deep freeze blackout! Mission scrubbed to hangar.'
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
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-3xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: Balance breakers at 19.2 AU. Keep heater, computer, and radio on. Switch off imager if overloaded.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* 1/r^2 Physics Card */}
        <div className="p-4 sm:p-5 bg-void border border-paper/20 space-y-3 font-mono text-xs sm:text-sm">
          <div className="text-signal font-bold border-b border-paper/15 pb-2">
            Physics: Inverse-Square Law (1/r²)
          </div>
          <div className="text-paper-muted leading-relaxed">
            Heliocentric Distance: <span className="font-bold text-paper tabular-nums">19.2 AU</span> (r² = 368.6)
          </div>
          <div className="text-paper-muted leading-relaxed">
            Solar Irradiance at 19.2 AU: <span className="font-bold text-signal tabular-nums">~0.43 W</span> per array
          </div>
          <div className="text-paper-muted leading-relaxed">
            RTG Generator Supply: <span className="font-bold text-paper">{hasRtg ? '100 W (Constant)' : '0 W (Missing!)'}</span>
          </div>
          <div className="text-paper-muted leading-relaxed border-t border-paper/10 pt-2">
            Survival Bus Minimum: <span className="font-bold text-paper">55 W</span> (Heat 20W + Nav 20W + Radio 15W)
          </div>
        </div>

        {/* Breaker Switches Console */}
        <div className="space-y-3 text-xs sm:text-sm font-mono">
          <div className="flex justify-between items-center border-b border-paper/15 pb-2">
            <span className="text-signal font-bold">Bus Power Breakers</span>
            <span className={`font-bold tabular-nums ${currentLoad <= totalSupply ? 'text-paper' : 'text-signal'}`}>
              {currentLoad} W / {totalSupply.toFixed(1)} W
            </span>
          </div>

          {/* Essential Switches */}
          <div className="space-y-2">
            <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
              <span className="text-paper">Computer / Command (20W)</span>
              <input
                type="checkbox"
                checked={breakerComputer}
                onChange={(e) => setBreakerComputer(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
              <span className="text-paper">High-Gain Radio (15W)</span>
              <input
                type="checkbox"
                checked={breakerRadio}
                onChange={(e) => setBreakerRadio(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
              <span className="text-paper">Bus Thermal Heater (+20W)</span>
              <input
                type="checkbox"
                checked={breakerHeater}
                onChange={(e) => setBreakerHeater(e.target.checked)}
                className="accent-[#f0562b] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Optional Breakers */}
          <div className="space-y-2 border-t border-paper/15 pt-2">
            {hasImager && (
              <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
                <span className="text-paper-muted">Imager Camera (5W)</span>
                <input
                  type="checkbox"
                  checked={breakerImager}
                  onChange={(e) => setBreakerImager(e.target.checked)}
                  className="accent-[#f0562b] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasSpec && (
              <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
                <span className="text-paper-muted">Mass Spectrometer (20W)</span>
                <input
                  type="checkbox"
                  checked={breakerSpec}
                  onChange={(e) => setBreakerSpec(e.target.checked)}
                  className="accent-[#f0562b] w-4 h-4 cursor-pointer"
                />
              </label>
            )}

            {hasDrill && (
              <label className="flex justify-between items-center bg-void p-2.5 border border-paper/20 cursor-pointer hover:border-paper/40 transition-colors">
                <span className="text-paper-muted">Sample Drill (25W)</span>
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
            className="w-full mt-3 py-3.5 bg-signal hover:bg-signal-hover text-void font-bold uppercase tracking-wider transition-colors text-xs sm:text-sm font-mono"
          >
            Verify Power Stability
          </button>

          {statusMsg && (
            <div className="p-3.5 bg-surface border border-paper/20 text-xs sm:text-sm leading-relaxed font-mono mt-3">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
