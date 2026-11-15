'use client';
import React from 'react';
import { SpeakerId } from '@/lib/gameTypes';

interface PixelPortraitProps {
  speaker: SpeakerId;
  size?: number;
  className?: string;
}

/**
 * Tenth Light - Character Pixel Portrait Family
 * Designed according to create-game-assets specifications:
 * - 16x16 integer pixel art grid with crispEdges rendering
 * - Invariant palette roles: --void (#0a0c10), --surface (#12151b), --paper-muted (#7d8591),
 *   --paper (#e9e6dc), and single accent --signal (#f0562b)
 * - Cohesive line weight, framing, and high-contrast silhouette read
 */
export function PixelPortrait({ speaker, size = 64, className = '' }: PixelPortraitProps) {
  // If speaker is heart: "The heart is the heart emoji ♥, on the map and as the speaker’s portrait."
  if (speaker === 'heart') {
    return (
      <div
        className={`flex items-center justify-center bg-surface border border-signal text-signal ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        title="Plutonian Spirit ♥"
      >
        ♥
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block bg-void border border-paper/40 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        className="block"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {speaker === 'wren' && (
          // Wren: Specialist in flight helmet with visor and amber comms mic
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            {/* Helmet outer shell */}
            <rect x="3" y="2" width="10" height="12" fill="#e9e6dc" />
            <rect x="4" y="1" width="8" height="1" fill="#e9e6dc" />
            <rect x="4" y="14" width="8" height="1" fill="#e9e6dc" />
            {/* Dark inner gasket */}
            <rect x="4" y="3" width="8" height="9" fill="#12151b" />
            {/* Visor - amber reflection */}
            <rect x="5" y="4" width="6" height="5" fill="#f0562b" />
            <rect x="6" y="5" width="2" height="1" fill="#e9e6dc" />
            <rect x="5" y="7" width="6" height="2" fill="#12151b" />
            {/* Comms mic */}
            <rect x="11" y="9" width="2" height="2" fill="#f0562b" />
            <rect x="9" y="10" width="2" height="1" fill="#e9e6dc" />
            {/* Pressure collar */}
            <rect x="3" y="13" width="10" height="2" fill="#2a3039" />
          </g>
        )}

        {speaker === 'nori' && (
          // Nori: Astromech-style droid companion (cohesive with NoriPixelToken)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            {/* Cylindrical dome top */}
            <rect x="5" y="1" width="6" height="1" fill="#e9e6dc" />
            <rect x="4" y="2" width="8" height="4" fill="#e9e6dc" />
            {/* Chassis framing */}
            <rect x="3" y="6" width="10" height="7" fill="#7d8591" />
            <rect x="4" y="6" width="8" height="6" fill="#e9e6dc" />
            {/* Center optical sensor eye */}
            <rect x="6" y="3" width="4" height="2" fill="#12151b" />
            <rect x="6" y="3" width="3" height="2" fill="#f0562b" />
            <rect x="6" y="3" width="1" height="1" fill="#e9e6dc" />
            {/* Status diode */}
            <rect x="10" y="3" width="1" height="1" fill="#e9e6dc" />
            {/* Chassis vent / data port */}
            <rect x="5" y="8" width="6" height="1" fill="#12151b" />
            <rect x="5" y="10" width="6" height="1" fill="#12151b" />
            {/* Tread / foot skids */}
            <rect x="2" y="12" width="3" height="3" fill="#2a3039" />
            <rect x="11" y="12" width="3" height="3" fill="#2a3039" />
            <rect x="6" y="13" width="4" height="2" fill="#7d8591" />
          </g>
        )}

        {speaker === 'lumen' && (
          // Lumen: Moon gatekeeper (crystalline antenna face)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="5" y="2" width="6" height="11" fill="#7d8591" />
            <rect x="6" y="1" width="4" height="1" fill="#e9e6dc" />
            <rect x="4" y="5" width="8" height="5" fill="#e9e6dc" />
            <rect x="6" y="6" width="4" height="2" fill="#f0562b" />
            <rect x="7" y="0" width="2" height="2" fill="#e9e6dc" />
            <rect x="3" y="13" width="10" height="2" fill="#2a3039" />
          </g>
        )}

        {speaker === 'redline' && (
          // Redline: Mars gatekeeper (crimson-rock face)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="3" y="3" width="10" height="10" fill="#f0562b" />
            <rect x="4" y="2" width="8" height="1" fill="#e9e6dc" />
            <rect x="5" y="6" width="6" height="2" fill="#12151b" />
            <rect x="6" y="6" width="2" height="2" fill="#e9e6dc" />
            <rect x="9" y="6" width="1" height="2" fill="#12151b" />
            <rect x="4" y="10" width="8" height="2" fill="#12151b" />
          </g>
        )}

        {speaker === 'pebble' && (
          // Pebble: Ceres gatekeeper (dwarf planet craggy asteroid)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="3" y="3" width="10" height="9" fill="#7d8591" />
            <rect x="4" y="2" width="7" height="1" fill="#e9e6dc" />
            <rect x="2" y="5" width="1" height="5" fill="#2a3039" />
            <rect x="13" y="4" width="1" height="6" fill="#2a3039" />
            <rect x="5" y="5" width="3" height="3" fill="#e9e6dc" />
            <rect x="6" y="6" width="1" height="1" fill="#f0562b" />
            <rect x="9" y="8" width="3" height="2" fill="#12151b" />
          </g>
        )}

        {speaker === 'bolt' && (
          // Bolt: Jupiter depot stationmaster
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="3" y="3" width="10" height="10" fill="#f0562b" />
            <rect x="4" y="2" width="8" height="1" fill="#e9e6dc" />
            <rect x="4" y="5" width="8" height="3" fill="#12151b" />
            <rect x="5" y="6" width="2" height="1" fill="#e9e6dc" />
            <rect x="9" y="6" width="2" height="1" fill="#e9e6dc" />
            <rect x="6" y="10" width="4" height="2" fill="#12151b" />
          </g>
        )}

        {speaker === 'spray' && (
          // Spray: Enceladus cryovolcano spirit (crystalline ice facets)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="5" y="2" width="6" height="11" fill="#7d8591" />
            <rect x="4" y="4" width="8" height="7" fill="#e9e6dc" />
            <rect x="6" y="5" width="1" height="2" fill="#0a0c10" />
            <rect x="9" y="5" width="1" height="2" fill="#0a0c10" />
            <rect x="7" y="1" width="2" height="2" fill="#f0562b" />
            <rect x="4" y="12" width="8" height="2" fill="#2a3039" />
          </g>
        )}

        {speaker === 'tilt' && (
          // Tilt: Uranus gatekeeper (sideways angled face)
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="3" y="4" width="10" height="8" fill="#e9e6dc" />
            <rect x="5" y="3" width="2" height="10" fill="#7d8591" />
            <rect x="8" y="5" width="2" height="2" fill="#0a0c10" />
            <rect x="8" y="9" width="2" height="2" fill="#0a0c10" />
            <rect x="11" y="6" width="1" height="4" fill="#f0562b" />
          </g>
        )}

        {speaker === 'lag' && (
          // Lag: Neptune gatekeeper
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="3" y="3" width="10" height="10" fill="#2a3039" />
            <rect x="5" y="5" width="6" height="2" fill="#7d8591" />
            <rect x="7" y="5" width="2" height="2" fill="#f0562b" />
            <rect x="4" y="9" width="8" height="2" fill="#12151b" />
          </g>
        )}

        {speaker === 'whisper' && (
          // Whisper: Heliopause gatekeeper
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="4" y="2" width="8" height="12" fill="#7d8591" />
            <rect x="2" y="6" width="12" height="4" fill="#e9e6dc" />
            <rect x="6" y="6" width="1" height="2" fill="#0a0c10" />
            <rect x="9" y="6" width="1" height="2" fill="#0a0c10" />
            <rect x="6" y="10" width="4" height="1" fill="#f0562b" />
          </g>
        )}

        {speaker === 'narrator' && (
          // Narrator / Telemetry terminal
          <g>
            <rect width="16" height="16" fill="#0a0c10" />
            <rect x="2" y="2" width="12" height="12" fill="#181c24" />
            <rect x="3" y="3" width="10" height="10" fill="#0a0c10" />
            {/* Oscilloscope telemetry trace */}
            <rect x="4" y="8" width="2" height="1" fill="#f0562b" />
            <rect x="6" y="5" width="2" height="1" fill="#f0562b" />
            <rect x="8" y="10" width="2" height="1" fill="#f0562b" />
            <rect x="10" y="7" width="2" height="1" fill="#e9e6dc" />
          </g>
        )}
      </svg>
    </div>
  );
}
