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
      .catch(() => {
        // Already using snapshot
      });

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
        // Do not say it failed until the request has actually failed
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
      setStatusMsg(`Telemetry locked! Offset is ${diff.toFixed(1)}° (within ±${tolerance}° tolerance).`);
      setTimeout(onSuccess, 800);
    } else {
      sound.playMiss();
      setStatusMsg(
        `Signal missed: ${diff.toFixed(1)}° error. Target Earth azimuth is near ${horizonsData.azimuthDeg}°. Try again!`
      );
    }
  };

  return (
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded max-w-xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-3 py-1.5 rounded border border-[#e39b12]/50 text-xs font-mono text-[#e39b12] mb-3 text-center">
        HOW-TO: Adjust the high-gain dish azimuth to match Earth’s position within 14 degrees.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Image Plate */}
        <div className="bg-[#100e0c] p-2 border border-[#efe6d6]/20 rounded flex flex-col items-center">
          <div className="w-full h-36 relative overflow-hidden rounded bg-[#1a1714] flex items-center justify-center">
            {imageState.status === 'loading' ? (
              <div className="text-xs font-mono text-[#efe6d6]/60 animate-pulse">
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
          <div className="w-full mt-1.5 text-[10px] font-mono text-[#efe6d6]/60 text-left">
            <span className="text-[#e39b12] font-semibold">{imageState.credit}</span>
            <div className="truncate">{imageState.caption}</div>
          </div>
        </div>

        {/* Horizons Telemetry & Controls */}
        <div className="space-y-3 font-sans">
          <div className="border-b border-[#efe6d6]/10 pb-1.5">
            <div className="flex justify-between items-center text-xs font-mono text-[#e39b12]">
              <span>JPL Horizons Ephemeris</span>
              {isSnapshot ? (
                <span className="text-[9px] bg-[#e39b12]/20 px-1 rounded text-[#e39b12]">
                  15 Nov 2026 Snapshot
                </span>
              ) : (
                <span className="text-[9px] bg-[#5bc0be]/20 px-1 rounded text-[#5bc0be]">
                  Live Query
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#efe6d6]/70 mt-1 font-mono">
              COMMAND: 399 (Earth) | CENTER: coord@301
            </div>
            <div className="text-xs text-[#efe6d6] font-mono mt-1">
              Earth Azimuth: <span className="font-bold text-[#e39b12]">{horizonsData.azimuthDeg}°</span> |
              Elevation: <span className="font-bold text-[#e39b12]">{horizonsData.elevationDeg}°</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Dish Aim Azimuth:</span>
              <span className="font-bold text-[#efe6d6]">{userAzimuth}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={userAzimuth}
              onChange={(e) => setUserAzimuth(parseInt(e.target.value))}
              className="w-full accent-[#e39b12] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#efe6d6]/40 mt-0.5">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
            </div>
          </div>

          <button
            onClick={handleLockDish}
            className="w-full py-2 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
          >
            Transmit Telemetry Ping (Lock Dish)
          </button>

          {statusMsg && (
            <div className="text-xs font-mono p-1.5 rounded bg-[#100e0c] border border-[#efe6d6]/20">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
