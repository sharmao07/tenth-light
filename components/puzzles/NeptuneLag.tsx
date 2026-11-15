'use client';
import React, { useState, useEffect, useRef } from 'react';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface NeptuneLagProps {
  isPaused: boolean;
  onSuccess: () => void;
}

export function NeptuneLag({ isPaused, onSuccess }: NeptuneLagProps) {
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const neptunePlate = NASA_IMAGE_PLATES[7];
  const lastTimeRef = useRef<number | null>(null);

  const handleSendCommand = () => {
    sound.playUiClick();

    if (isTransmitting) {
      sound.playMiss();
      setIsTransmitting(false);
      setTimerSeconds(null);
      setStatusMsg('COLLISION RESET: You sent a second command while signal was in flight! Resetting buffer.');
      return;
    }

    sound.playLaserShot();
    setIsTransmitting(true);
    setTimerSeconds(7.0);
    setStatusMsg('Signal transmitted. Packet in transit across the outer void... Hold for acknowledgment.');
  };

  useEffect(() => {
    if (!isTransmitting || timerSeconds === null || hasSucceeded) return;

    let animId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!isPaused) {
        setTimerSeconds((prev) => {
          if (prev === null) return null;
          const nextVal = prev - dt;
          if (nextVal <= 0) {
            setIsTransmitting(false);
            setHasSucceeded(true);
            sound.playSuccess();
            setStatusMsg('✓ ACKNOWLEDGED! Downlink packet verified after 7-second simulation delay.');
            setTimeout(onSuccess, 800);
            return 0;
          }
          return nextVal;
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = null;
    };
  }, [isTransmitting, isPaused, hasSucceeded, onSuccess, timerSeconds]);

  return (
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-5 rounded-lg max-w-2xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-4 py-2.5 rounded border border-[#e39b12]/50 text-sm font-mono text-[#e39b12] mb-4 text-center leading-relaxed">
        HOW-TO: Send exactly one command and wait 7 seconds. A second command during transit resets the buffer.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        {/* NASA Neptune Plate */}
        <div className="bg-[#100e0c] p-2.5 border border-[#efe6d6]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#1a1714]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={neptunePlate.url}
              alt="Neptune"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs font-mono text-[#efe6d6]/80 text-left leading-relaxed">
            <span className="text-[#e39b12] font-bold block">{neptunePlate.credit}</span>
            <div className="truncate">{neptunePlate.caption}</div>
          </div>
        </div>

        {/* Telemetry Delay Console */}
        <div className="space-y-3.5 font-sans">
          <div className="border-b border-[#efe6d6]/15 pb-2">
            <div className="text-sm font-mono text-[#e39b12] font-bold">
              Deep Space Light Travel Delay
            </div>
            <div className="text-xs md:text-sm font-mono text-[#efe6d6]/80 mt-1.5 leading-relaxed">
              Distance: <span className="font-bold text-[#efe6d6]">30.1 AU</span> (4.5 billion km)
            </div>
            <div className="text-xs md:text-sm font-mono text-[#efe6d6] mt-1 leading-relaxed">
              One-Way Light Time: <span className="font-bold text-[#e39b12]">4.17 hours</span> (~15,020 s)
            </div>
          </div>

          {/* 7-Second Simulation Timer Bar */}
          <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg space-y-1.5">
            <div className="flex justify-between items-center text-xs md:text-sm font-mono mb-1">
              <span>Simulation Delay:</span>
              <span className="font-bold text-[#e39b12]">
                {timerSeconds !== null ? `${timerSeconds.toFixed(1)}s` : '7.0s'} / 4.17h real
              </span>
            </div>
            <div className="w-full h-3 bg-[#1a1714] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e39b12] transition-all duration-75"
                style={{
                  width: timerSeconds !== null ? `${((7 - timerSeconds) / 7) * 100}%` : '0%',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSendCommand}
            disabled={hasSucceeded}
            className={`w-full py-3 font-mono text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow ${
              isTransmitting
                ? 'bg-[#c4452d] text-[#efe6d6] hover:bg-[#8f2a17]'
                : 'bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c]'
            }`}
          >
            {isTransmitting ? '⚠️ Sending 2nd Command Will Reset Buffer!' : 'Send Uplink Command'}
          </button>

          {statusMsg && (
            <div className="p-2.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg text-xs md:text-sm font-mono leading-relaxed">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
