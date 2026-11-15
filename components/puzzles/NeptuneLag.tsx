'use client';
import React, { useState, useEffect, useRef } from 'react';
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
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: Send exactly one command and wait 7 seconds. A second command during transit resets the buffer.
      </div>

      {/* Telemetry Delay Console */}
      <div className="space-y-4 font-sans">
        <div className="border-b border-paper/15 pb-3">
          <div className="text-sm md:text-base text-signal font-bold font-mono">
            Deep Space Light Travel Delay
          </div>
          <div className="text-xs sm:text-sm text-paper-muted mt-2 leading-relaxed font-mono">
            Distance: <span className="font-bold text-paper tabular-nums">30.1 AU</span> (4.5 billion km) &middot; Heliocentric radius
          </div>
          <div className="text-xs sm:text-sm text-paper mt-1 leading-relaxed font-mono">
            One-Way Light Time: <span className="font-bold text-signal tabular-nums">4.17 hours</span> (~15,020 seconds in vacuum)
          </div>
        </div>

        {/* 7-Second Simulation Timer Bar */}
        <div className="p-4 bg-void border border-paper/20 space-y-2.5 my-4">
          <div className="flex justify-between items-center text-xs sm:text-sm font-mono mb-1">
            <span>Simulation Delay Buffer:</span>
            <span className="font-bold text-signal tabular-nums">
              {timerSeconds !== null ? `${timerSeconds.toFixed(1)}s` : '7.0s'} / 4.17h real
            </span>
          </div>
          <div className="w-full h-3 bg-surface overflow-hidden">
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
          className={`w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors font-mono ${
            isTransmitting
              ? 'bg-signal text-paper hover:bg-signal-hover'
              : 'bg-signal hover:bg-signal-hover text-void'
          }`}
        >
          {isTransmitting ? '⚠ Sending 2nd Command Will Reset Buffer!' : 'Send Uplink Command'}
        </button>

        {statusMsg && (
          <div className="p-3.5 bg-surface border border-paper/20 text-xs sm:text-sm leading-relaxed font-mono mt-3">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
