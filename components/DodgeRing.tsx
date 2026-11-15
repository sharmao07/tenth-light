'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { NeoObject } from '@/lib/nasaSnapshots';
import { sound } from './AudioController';

interface DodgeRingProps {
  isPaused: boolean;
  onSuccess: () => void;
  onMiss: () => void;
  dodgeIndex: number;
  totalDodges: number;
}

export function DodgeRing({
  isPaused,
  onSuccess,
  onMiss,
  dodgeIndex,
  totalDodges,
}: DodgeRingProps) {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [neoData, setNeoData] = useState<NeoObject | null>(null);
  const [isSnapshot, setIsSnapshot] = useState(true);
  const [resolved, setResolved] = useState<'success' | 'miss' | null>(null);

  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Fetch NeoWs object
  useEffect(() => {
    let active = true;
    fetch('/api/nasa/neows')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setIsSnapshot(data.source === 'snapshot');
        const list: NeoObject[] = data.data || [];
        if (list.length > 0) {
          const item = list[dodgeIndex % list.length];
          setNeoData(item);
        }
      })
      .catch(() => {
        // Handled by snapshot fallback
      });
    return () => {
      active = false;
    };
  }, [dodgeIndex]);

  // Amber arc is 208 to 278 degrees
  const ARC_START = 208;
  const ARC_END = 278;

  const handleAction = useCallback(() => {
    if (isPaused || resolved !== null) return;
    const angle = angleRef.current;
    if (angle >= ARC_START && angle <= ARC_END) {
      setResolved('success');
      sound.playSuccess();
      setTimeout(onSuccess, 450);
    } else {
      setResolved('miss');
      sound.playMiss();
      setTimeout(onMiss, 450);
    }
  }, [isPaused, resolved, onSuccess, onMiss]);

  // Key listener for Space / Enter (capture phase on window)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleAction();
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [handleAction, isPaused]);

  // Animation loop for sweeping needle
  useEffect(() => {
    if (resolved !== null) return;

    const sweepSpeed = 160; // degrees per second

    const update = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!isPaused) {
        angleRef.current = (angleRef.current + sweepSpeed * dt) % 360;
        setCurrentAngle(angleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [isPaused, resolved]);

  // SVG coordinate calculations for circular arc
  const cx = 80;
  const cy = 80;
  const r = 58;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const startPt = polarToCartesian(cx, cy, r, ARC_START);
  const endPt = polarToCartesian(cx, cy, r, ARC_END);
  const arcSweep = ARC_END - ARC_START;
  const largeArcFlag = arcSweep <= 180 ? '0' : '1';
  const arcPath = `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPt.x} ${endPt.y}`;

  const needlePt = polarToCartesian(cx, cy, r, currentAngle);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 p-4 select-none">
      <div
        className={`flex flex-col md:flex-row items-center gap-6 bg-[#0a0c10]/90 border rounded-lg p-5 shadow-2xl pointer-events-auto transition-all ${
          resolved === 'miss'
            ? 'animate-shake border-[#f0562b] bg-[#f0562b]/10'
            : resolved === 'success'
            ? 'border-[#e9e6dc] bg-[#e9e6dc]/10'
            : 'border-[#f0562b]'
        }`}
      >
        {/* Ring Stage */}
        <div
          onClick={handleAction}
          onMouseEnter={() => resolved === null && sound.playHoverBlip()}
          className="sensory-btn flex flex-col items-center cursor-pointer group"
          title="Click, Space, or Enter while needle is on amber arc"
        >
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              {/* Outer boundary circle */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1b1f26" strokeWidth="12" />

              {/* Amber Target Arc (208° to 278°) */}
              <path
                d={arcPath}
                fill="none"
                stroke="#f0562b"
                strokeWidth="12"
                strokeLinecap="round"
                className="transition-colors"
              />

              {/* Target zone indicator tick marks */}
              <circle cx={startPt.x} cy={startPt.y} r="2" fill="#e9e6dc" />
              <circle cx={endPt.x} cy={endPt.y} r="2" fill="#e9e6dc" />

              {/* Sweeping Needle (White mark sweeps) */}
              <line
                x1={cx}
                y1={cy}
                x2={needlePt.x}
                y2={needlePt.y}
                stroke={resolved === 'success' ? '#e9e6dc' : resolved === 'miss' ? '#f0562b' : '#e9e6dc'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx={needlePt.x} cy={needlePt.y} r="4" fill="#ffffff" />

              {/* Hub */}
              <circle cx={cx} cy={cy} r="6" fill="#12151b" stroke="#f0562b" strokeWidth="2" />
            </svg>

            {/* Resolved overlay effect */}
            {resolved === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#e9e6dc] bg-[#0a0c10] px-2 py-0.5 rounded border border-[#e9e6dc]">
                  EVADED!
                </span>
              </div>
            )}
            {resolved === 'miss' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#f0562b] bg-[#0a0c10] px-2 py-0.5 rounded border border-[#f0562b]">
                  HULL HIT!
                </span>
              </div>
            )}
          </div>

          {/* The label sits UNDER the ring, not on it */}
          <div className="text-center mt-3">
            <div className="text-sm font-bold text-[#f0562b] uppercase tracking-wider">
              Collision Avoidance Lock
            </div>
            <div className="text-xs text-[#e9e6dc]/80 mt-1">
              Click or press <kbd className="px-1.5 py-0.5 bg-[#12151b] border border-[#e9e6dc]/40 rounded text-[#e9e6dc] font-bold">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-[#12151b] border border-[#e9e6dc]/40 rounded text-[#e9e6dc] font-bold">Enter</kbd>
            </div>
          </div>
        </div>

        {/* Real Near-Earth Object Card from NASA NeoWs */}
        <div className="w-72 md:w-80 bg-[#12151b] border border-[#e9e6dc]/30 p-4 rounded-lg text-left font-sans shadow-lg">
          <div className="flex justify-between items-center border-b border-[#e9e6dc]/15 pb-2 mb-2.5">
            <span className="text-xs uppercase text-[#f0562b] font-bold tracking-wider">
              Radar Return [{dodgeIndex + 1}/{totalDodges}]
            </span>
            {isSnapshot ? (
              <span className="text-xs text-[#f0562b] bg-[#f0562b]/15 px-2 py-0.5 rounded border border-[#f0562b]/30">
                15 Nov 2026 Snapshot
              </span>
            ) : (
              <span className="text-xs text-[#e9e6dc] bg-[#e9e6dc]/15 px-2 py-0.5 rounded border border-[#e9e6dc]/30">
                NASA NeoWs Live
              </span>
            )}
          </div>

          {neoData ? (
            <div className="space-y-2 text-xs md:text-sm">
              <div className="font-serif text-base md:text-lg text-[#e9e6dc] truncate">
                {neoData.name}
              </div>
              <div className="flex justify-between text-[#e9e6dc]/90 py-0.5">
                <span>Est. Diameter:</span>
                <span className="font-bold text-[#e9e6dc]">{neoData.estimatedDiameterMeters} m</span>
              </div>
              <div className="flex justify-between text-[#e9e6dc]/90 py-0.5">
                <span>Velocity:</span>
                <span className="font-bold text-[#e9e6dc]">{neoData.relativeVelocityKps} km/s</span>
              </div>
              <div className="flex justify-between text-[#e9e6dc]/90 py-0.5">
                <span>Hazard Flag:</span>
                <span
                  className={`font-bold uppercase ${
                    neoData.isPotentiallyHazardous ? 'text-[#f0562b]' : 'text-[#e9e6dc]'
                  }`}
                >
                  {neoData.isPotentiallyHazardous ? 'Hazardous' : 'Non-Hazardous'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs md:text-sm text-[#e9e6dc]/60 py-4 text-center ">
              Interpreting radar echoes...
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-[#e9e6dc]/15 text-xs text-[#e9e6dc]/70 italic leading-relaxed">
            A missed dodge spends 1 hull heart. Retries on stop gates are free.
          </div>
        </div>
      </div>
    </div>
  );
}
