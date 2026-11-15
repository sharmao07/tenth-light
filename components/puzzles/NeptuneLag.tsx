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
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: Send exactly one command and wait 7 seconds. A second command during transit resets the buffer.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Neptune Plate */}
        <div className="bg-void p-3 border border-paper/20 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={neptunePlate.url}
              alt="Neptune"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-paper-muted text-left leading-relaxed font-mono">
            <span className="text-signal font-bold block">{neptunePlate.credit}</span>
            <div className="truncate">{neptunePlate.caption}</div>
          </div>
        </div>

        {/* Telemetry Delay Console */}
        <div className="space-y-3 font-sans">
          <div className="border-b border-paper/15 pb-1.5">
            <div className="text-xs sm:text-sm text-signal font-bold font-mono">
              Deep Space Light Travel Delay
            </div>
            <div className="text-xs text-paper-muted mt-1 leading-relaxed font-mono">
              Distance: <span className="font-bold text-paper tabular-nums">30.1 AU</span> (4.5 billion km)
            </div>
            <div className="text-xs text-paper mt-0.5 leading-relaxed font-mono">
              One-Way Light Time: <span className="font-bold text-signal tabular-nums">4.17 hours</span> (~15,020 s)
            </div>
          </div>

          {/* 7-Second Simulation Timer Bar */}
          <div className="p-3 bg-void border border-paper/20 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span>Simulation Delay:</span>
              <span className="font-bold text-signal tabular-nums">
                {timerSeconds !== null ? `${timerSeconds.toFixed(1)}s` : '7.0s'} / 4.17h real
              </span>
            </div>
            <div className="w-full h-2.5 bg-surface overflow-hidden">
              <div
                className="h-full bg-signal transition-all duration-75"
                style={{
                  width: timerSeconds !== null ? `${((7 - timerSeconds) / 7) * 100}%` : '0%',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSendCommand}
            disabled={hasSucceeded}
            className={`w-full py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors font-mono ${
              isTransmitting
                ? 'bg-signal text-paper hover:bg-signal-hover'
                : 'bg-signal hover:bg-signal-hover text-void'
            }`}
          >
            {isTransmitting ? '⚠ Sending 2nd Command Will Reset Buffer!' : 'Send Uplink Command'}
          </button>

          {statusMsg && (
            <div className="p-2.5 bg-surface border border-paper/20 text-xs leading-relaxed font-mono">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
