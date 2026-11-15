'use client';
import React, { useState, useEffect } from 'react';
import { HORIZONS_MOON_SNAPSHOT, HorizonsMoonData } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface MoonHorizonsProps {
  onSuccess: () => void;
}

export function MoonHorizons({ onSuccess }: MoonHorizonsProps) {
  // Snapshot immediately shown, replaced if live query arrives
  const [horizonsData, setHorizonsData] = useState<HorizonsMoonData>(HORIZONS_MOON_SNAPSHOT);
  const [isSnapshot, setIsSnapshot] = useState(true);
  const [userAzimuth, setUserAzimuth] = useState(90);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Fetch Horizons live ephemeris in background
  useEffect(() => {
    let active = true;
    fetch('/api/nasa/horizons')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.data) {
          setHorizonsData(data.data);
          setIsSnapshot(data.source === 'snapshot');
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleLockDish = () => {
    sound.playUiClick();
    const diff = Math.abs(userAzimuth - horizonsData.azimuthDeg);
    const tolerance = horizonsData.targetToleranceDeg || 14;

    if (diff <= tolerance || 360 - diff <= tolerance) {
      sound.playSuccess();
      setStatusMsg(`✓ Telemetry locked! Offset is ${diff.toFixed(1)}° (within ±${tolerance}° tolerance). Passage granted.`);
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setStatusMsg(
        `Signal missed: ${diff.toFixed(1)}° error. Target Earth azimuth is near ${horizonsData.azimuthDeg}°. Try again!`
      );
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to banner */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: Adjust the high-gain dish azimuth to match Earth’s position within 14 degrees.
      </div>

      {/* Horizons Telemetry Console & Antenna Aim Controls */}
      <div className="space-y-5 font-sans">
        <div className="border-b border-paper/15 pb-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm md:text-base text-signal font-bold font-mono tracking-wide">
              JPL Horizons Ephemeris
            </span>
            {isSnapshot ? (
              <span className="text-xs font-mono bg-signal/15 border border-signal/30 px-3 py-1 text-signal">
                15 Nov 2026 Snapshot
              </span>
            ) : (
              <span className="text-xs font-mono bg-surface border border-paper/30 px-3 py-1 text-paper">
                Live Query
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-paper-muted mt-2 leading-relaxed">
            COMMAND: 399 (Earth) | CENTER: coord@301 (Lunar South Pole)
          </div>
          <div className="text-sm font-mono text-paper mt-1 leading-relaxed">
            Target Earth Azimuth: <span className="font-bold text-signal tabular-nums">{horizonsData.azimuthDeg}°</span> &middot; Elevation: <span className="font-bold text-signal tabular-nums">{horizonsData.elevationDeg}°</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
            <span>High-Gain Dish Azimuth:</span>
            <span className="font-bold text-signal text-base tabular-nums">{userAzimuth}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="359"
            value={userAzimuth}
            onChange={(e) => setUserAzimuth(parseInt(e.target.value))}
            className="w-full h-3 accent-[#f0562b] cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-paper-muted pt-1">
            <span>0° (N)</span>
            <span>90° (E)</span>
            <span>180° (S)</span>
            <span>270° (W)</span>
          </div>
        </div>

        <button
          onClick={handleLockDish}
          className="w-full py-3.5 bg-signal hover:bg-signal-hover text-void font-bold text-xs sm:text-sm uppercase tracking-wider font-mono transition-colors"
        >
          Transmit Telemetry Ping (Lock Dish)
        </button>

        {statusMsg && (
          <div className="text-xs sm:text-sm p-3.5 bg-surface border border-paper/20 leading-relaxed font-mono">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
