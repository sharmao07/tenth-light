'use client';
import React from 'react';
import { SpeakerId } from '@/lib/gameTypes';

interface PixelPortraitProps {
  speaker: SpeakerId;
  size?: number;
  className?: string;
}

export function PixelPortrait({ speaker, size = 64, className = '' }: PixelPortraitProps) {
  // If speaker is heart: "The heart is the heart emoji ❤️, on the map and as the speaker’s portrait."
  if (speaker === 'heart') {
    return (
      <div
        className={`flex items-center justify-center bg-[#1a1714] border-2 border-[#e39b12] rounded ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        title="Plutonian Spirit ❤️"
      >
        ❤️
      </div>
    );
  }

  // Pure SVG pixel grids with shapeRendering="crispEdges"
  return (
    <div
      className={`relative inline-block bg-[#100e0c] border-2 border-[#efe6d6]/40 overflow-hidden ${className}`}
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
            <rect width="16" height="16" fill="#100e0c" />
            {/* Helmet outer */}
            <rect x="3" y="2" width="10" height="12" fill="#efe6d6" />
            <rect x="4" y="1" width="8" height="1" fill="#efe6d6" />
            <rect x="4" y="14" width="8" height="1" fill="#efe6d6" />
            {/* Dark inner rim */}
            <rect x="4" y="3" width="8" height="9" fill="#1a1714" />
            {/* Visor - amber reflection */}
            <rect x="5" y="4" width="6" height="5" fill="#e39b12" />
            <rect x="6" y="5" width="2" height="1" fill="#efe6d6" />
            <rect x="5" y="6" width="6" height="2" fill="#c9820a" />
            {/* Comms mic */}
            <rect x="11" y="9" width="2" height="2" fill="#c4452d" />
            <rect x="9" y="10" width="2" height="1" fill="#efe6d6" />
            {/* Collar */}
            <rect x="3" y="13" width="10" height="2" fill="#3a342c" />
          </g>
        )}

        {speaker === 'nori' && (
          // Nori: Astromech-style droid companion (not a cat, not a passenger)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            {/* Cylindrical dome top */}
            <rect x="4" y="2" width="8" height="4" fill="#efe6d6" />
            <rect x="5" y="1" width="6" height="1" fill="#efe6d6" />
            {/* Body */}
            <rect x="3" y="6" width="10" height="7" fill="#8c8273" />
            <rect x="4" y="6" width="8" height="6" fill="#efe6d6" />
            {/* Center optical sensor eye */}
            <rect x="6" y="3" width="4" height="2" fill="#1a1714" />
            <rect x="7" y="3" width="2" height="2" fill="#e39b12" />
            <rect x="7" y="3" width="1" height="1" fill="#efe6d6" />
            {/* Secondary blue sensor & status diode */}
            <rect x="11" y="3" width="1" height="1" fill="#3a86ff" />
            <rect x="4" y="4" width="1" height="1" fill="#c4452d" />
            {/* Chassis vent / data port */}
            <rect x="5" y="8" width="6" height="1" fill="#1a1714" />
            <rect x="5" y="10" width="6" height="1" fill="#1a1714" />
            {/* Tread / foot skids */}
            <rect x="2" y="12" width="2" height="3" fill="#544c42" />
            <rect x="12" y="12" width="2" height="3" fill="#544c42" />
            <rect x="6" y="13" width="4" height="2" fill="#544c42" />
          </g>
        )}

        {speaker === 'lumen' && (
          // Lumen: Moon gatekeeper (crystalline antenna face)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="5" y="2" width="6" height="11" fill="#c8c0b4" />
            <rect x="6" y="1" width="4" height="1" fill="#efe6d6" />
            <rect x="4" y="5" width="8" height="5" fill="#efe6d6" />
            <rect x="6" y="6" width="4" height="2" fill="#e39b12" />
            <rect x="7" y="0" width="2" height="2" fill="#efe6d6" />
            <rect x="3" y="13" width="10" height="2" fill="#443c32" />
          </g>
        )}

        {speaker === 'redline' && (
          // Redline: Mars gatekeeper (crimson-rock face)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="3" y="3" width="10" height="10" fill="#c4452d" />
            <rect x="4" y="2" width="8" height="1" fill="#8f2a17" />
            <rect x="5" y="6" width="6" height="2" fill="#1a1714" />
            <rect x="6" y="6" width="2" height="2" fill="#e39b12" />
            <rect x="9" y="6" width="1" height="2" fill="#efe6d6" />
            <rect x="4" y="10" width="8" height="2" fill="#541a10" />
          </g>
        )}

        {speaker === 'pebble' && (
          // Pebble: Ceres gatekeeper (dwarf planet craggy asteroid)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="3" y="3" width="10" height="9" fill="#756b5d" />
            <rect x="4" y="2" width="7" height="1" fill="#918574" />
            <rect x="2" y="5" width="1" height="5" fill="#574e42" />
            <rect x="13" y="4" width="1" height="6" fill="#574e42" />
            <rect x="5" y="5" width="3" height="3" fill="#efe6d6" />
            <rect x="6" y="6" width="1" height="1" fill="#e39b12" />
            <rect x="9" y="8" width="3" height="2" fill="#3b342b" />
          </g>
        )}

        {speaker === 'bolt' && (
          // Bolt: Jupiter depot stationmaster
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="3" y="3" width="10" height="10" fill="#e39b12" />
            <rect x="4" y="2" width="8" height="1" fill="#b87807" />
            <rect x="4" y="5" width="8" height="3" fill="#1a1714" />
            <rect x="5" y="6" width="2" height="1" fill="#efe6d6" />
            <rect x="9" y="6" width="2" height="1" fill="#efe6d6" />
            <rect x="6" y="10" width="4" height="2" fill="#704400" />
          </g>
        )}

        {speaker === 'spray' && (
          // Spray: Enceladus gatekeeper (cryo-plume spirit)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="5" y="2" width="6" height="11" fill="#a0c4ff" />
            <rect x="4" y="4" width="8" height="7" fill="#d0e1fd" />
            <rect x="6" y="5" width="1" height="2" fill="#100e0c" />
            <rect x="9" y="5" width="1" height="2" fill="#100e0c" />
            <rect x="7" y="1" width="2" height="2" fill="#efe6d6" />
            <rect x="4" y="12" width="8" height="2" fill="#6998d3" />
          </g>
        )}

        {speaker === 'tilt' && (
          // Tilt: Uranus gatekeeper (sideways angled face)
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="3" y="4" width="10" height="8" fill="#5bc0be" />
            <rect x="5" y="3" width="2" height="10" fill="#3a8e8c" />
            <rect x="8" y="5" width="2" height="2" fill="#100e0c" />
            <rect x="8" y="9" width="2" height="2" fill="#100e0c" />
            <rect x="11" y="6" width="1" height="4" fill="#e39b12" />
          </g>
        )}

        {speaker === 'lag' && (
          // Lag: Neptune gatekeeper
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="3" y="3" width="10" height="10" fill="#293241" />
            <rect x="5" y="5" width="6" height="2" fill="#3d5a80" />
            <rect x="7" y="5" width="2" height="2" fill="#e39b12" />
            <rect x="4" y="9" width="8" height="2" fill="#1d2d44" />
          </g>
        )}

        {speaker === 'whisper' && (
          // Whisper: Heliopause gatekeeper
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="4" y="2" width="8" height="12" fill="#d6ccc2" />
            <rect x="2" y="6" width="12" height="4" fill="#ede0d4" />
            <rect x="6" y="6" width="1" height="2" fill="#100e0c" />
            <rect x="9" y="6" width="1" height="2" fill="#100e0c" />
            <rect x="6" y="10" width="4" height="1" fill="#7f5539" />
          </g>
        )}

        {speaker === 'narrator' && (
          // Narrator / Telemetry terminal
          <g>
            <rect width="16" height="16" fill="#100e0c" />
            <rect x="2" y="2" width="12" height="12" fill="#2a2520" />
            <rect x="3" y="3" width="10" height="10" fill="#100e0c" />
            {/* Sine / oscilloscope line */}
            <rect x="4" y="8" width="2" height="1" fill="#e39b12" />
            <rect x="6" y="5" width="2" height="1" fill="#e39b12" />
            <rect x="8" y="10" width="2" height="1" fill="#e39b12" />
            <rect x="10" y="7" width="2" height="1" fill="#e39b12" />
          </g>
        )}
      </svg>
    </div>
  );
}
