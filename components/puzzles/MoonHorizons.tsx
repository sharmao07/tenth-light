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
    <div className="bg-[#12151b]/95 border border-[#f0562b] p-8 rounded-lg max-w-2xl mx-auto text-[#e9e6dc] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#0a0c10] px-6 py-4 rounded border border-[#f0562b]/50 text-sm text-[#f0562b] mb-4 text-center leading-relaxed">
        HOW-TO: Adjust the high-gain dish azimuth to match Earth’s position within 14 degrees.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* NASA Image Plate */}
        <div className="bg-[#0a0c10] p-4 border border-[#e9e6dc]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#12151b] flex items-center justify-center">
            {imageState.status === 'loading' ? (
              <div className="text-sm text-[#e9e6dc]/60 animate-pulse">
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
          <div className="w-full mt-2 text-xs text-[#e9e6dc]/80 text-left leading-relaxed">
            <span className="text-[#f0562b] font-bold block">{imageState.credit}</span>
            <div className="truncate">{imageState.caption}</div>
          </div>
        </div>

        {/* Horizons Telemetry & Controls */}
        <div className="space-y-5 font-sans">
          <div className="border-b border-[#e9e6dc]/15 pb-3">
            <div className="flex justify-between items-center text-xs md:text-sm text-[#f0562b] font-bold">
              <span>JPL Horizons Ephemeris</span>
              {isSnapshot ? (
                <span className="text-xs bg-[#f0562b]/20 px-3 py-0.5 rounded text-[#f0562b]">
                  15 Nov 2026 Snapshot
                </span>
              ) : (
                <span className="text-xs bg-[#e9e6dc]/20 px-3 py-0.5 rounded text-[#e9e6dc]">
                  Live Query
                </span>
              )}
            </div>
            <div className="text-xs text-[#e9e6dc]/80 mt-1.5 leading-relaxed">
              COMMAND: 399 (Earth) | CENTER: coord@301
            </div>
            <div className="text-sm text-[#e9e6dc] mt-1 leading-relaxed">
              Earth Azimuth: <span className="font-bold text-[#f0562b]">{horizonsData.azimuthDeg}°</span> |
              Elevation: <span className="font-bold text-[#f0562b]">{horizonsData.elevationDeg}°</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs md:text-sm mb-1.5">
              <span>Dish Aim Azimuth:</span>
              <span className="font-bold text-[#e9e6dc]">{userAzimuth}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={userAzimuth}
              onChange={(e) => setUserAzimuth(parseInt(e.target.value))}
              className="w-full accent-[#f0562b] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#e9e6dc]/50 mt-1">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
            </div>
          </div>

          <button
            onClick={handleLockDish}
            className="w-full py-4 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] font-bold text-xs md:text-sm uppercase tracking-wider rounded transition-colors shadow"
          >
            Transmit Telemetry Ping (Lock Dish)
          </button>

          {statusMsg && (
            <div className="text-xs md:text-sm p-3 rounded bg-[#0a0c10] border border-[#e9e6dc]/20 leading-relaxed">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
