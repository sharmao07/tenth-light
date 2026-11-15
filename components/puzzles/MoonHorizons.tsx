'use client';
import React, { useState, useEffect } from 'react';
import { HORIZONS_MOON_SNAPSHOT, HorizonsMoonData } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface MoonHorizonsProps {
  onSuccess: () => void;
}

export function MoonHorizons({ onSuccess }: MoonHorizonsProps) {
  // Snapshot immediately shown, replaced if live arrives
  const [horizonsData, setHorizonsData] = useState<HorizonsMoonData>(HORIZONS_MOON_SNAPSHOT);
  const [isSnapshot, setIsSnapshot] = useState(true);
  const [userAzimuth, setUserAzimuth] = useState(90);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // NASA Moon image loading
  const [imageState, setImageState] = useState<{
    status: 'loading' | 'success' | 'failed';
    url: string;
    caption: string;
    credit: string;
  }>({
    status: 'loading',
    url: '',
    caption: '',
    credit: 'NASA. Unaltered.',
  });

  // Fetch Horizons
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

  // Fetch Moon Plate
  useEffect(() => {
    let active = true;
    fetch('/api/nasa/images?q=moon')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((resData) => {
        if (!active) return;
        if (resData.data && resData.data.url) {
          setImageState({
            status: 'success',
            url: resData.data.url,
            caption: resData.data.caption || 'Apollo 11 Lunar surface view at Tranquility Base.',
            credit: resData.data.credit || 'NASA. Unaltered.',
          });
        } else {
          throw new Error('No url');
        }
      })
      .catch(() => {
        if (!active) return;
        setImageState({
          status: 'failed',
          url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
          caption: 'Apollo 11 Lunar surface view at Tranquility Base (archival fallback).',
          credit: 'NASA. Unaltered.',
        });
      });

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
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: Adjust the high-gain dish azimuth to match Earth’s position within 14 degrees.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Image Plate */}
        <div className="bg-void p-3 border border-paper/20 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden bg-surface flex items-center justify-center">
            {imageState.status === 'loading' ? (
              <div className="text-xs text-paper-muted animate-pulse font-mono">
                Loading NASA Moon plate...
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageState.url}
                alt="Moon surface"
                className="w-full h-full object-cover"
                onError={() => {
                  setImageState((prev) => ({
                    ...prev,
                    status: 'failed',
                    url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
                  }));
                }}
              />
            )}
          </div>
          <div className="w-full mt-2 text-xs text-paper-muted text-left leading-relaxed">
            <span className="text-signal font-bold block">{imageState.credit}</span>
            <div className="truncate">{imageState.caption}</div>
          </div>
        </div>

        {/* Horizons Telemetry & Controls */}
        <div className="space-y-3 font-sans">
          <div className="border-b border-paper/15 pb-2">
            <div className="flex justify-between items-center text-xs md:text-sm text-signal font-bold font-mono">
              <span>JPL Horizons Ephemeris</span>
              {isSnapshot ? (
                <span className="text-xs font-mono bg-signal/15 border border-signal/30 px-2.5 py-0.5 text-signal">
                  15 Nov 2026 Snapshot
                </span>
              ) : (
                <span className="text-xs font-mono bg-surface border border-paper/30 px-2.5 py-0.5 text-paper">
                  Live Query
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-paper-muted mt-1 leading-relaxed">
              COMMAND: 399 (Earth) | CENTER: coord@301
            </div>
            <div className="text-xs font-mono text-paper mt-0.5 leading-relaxed">
              Earth Azimuth: <span className="font-bold text-signal tabular-nums">{horizonsData.azimuthDeg}°</span> |
              Elevation: <span className="font-bold text-signal tabular-nums">{horizonsData.elevationDeg}°</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span>Dish Aim Azimuth:</span>
              <span className="font-bold text-paper tabular-nums">{userAzimuth}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={userAzimuth}
              onChange={(e) => setUserAzimuth(parseInt(e.target.value))}
              className="w-full accent-[#f0562b] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-paper-dim mt-0.5">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
            </div>
          </div>

          <button
            onClick={handleLockDish}
            className="w-full py-2.5 bg-signal hover:bg-signal-hover text-void font-bold text-xs uppercase tracking-wider font-mono transition-colors"
          >
            Transmit Telemetry Ping (Lock Dish)
          </button>

          {statusMsg && (
            <div className="text-xs p-2.5 bg-surface border border-paper/20 leading-relaxed font-mono">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
