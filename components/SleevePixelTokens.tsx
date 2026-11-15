'use client';
import React from 'react';

interface TokenProps {
  size?: number;
  className?: string;
  isUnlocked?: boolean;
  isGrace?: boolean;
}

/**
 * Tenth Light - Act 10 Sleeve Maze 2D Pixel Asset Family
 * Designed according to create-game-assets specifications:
 * - Strict 16x16 integer pixel grid with crispEdges rendering
 * - Locked project palette: --void (#0a0c10), --surface (#12151b), --paper-muted (#7d8591),
 *   --paper (#e9e6dc), and single accent --signal (#f0562b)
 * - Clear silhouette differentiation at native 20px-28px resolution
 */

// 1. Astromech Droid Nori Token (Family-consistent with PixelPortraits)
export function NoriPixelToken({ size = 24, isGrace = false, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center transition-all ${
        isGrace ? 'opacity-50 animate-pulse' : 'opacity-100'
      } ${className}`}
      style={{ width: size, height: size }}
      title="Nori Astromech Droid"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Dome Crown */}
        <rect x="5" y="1" width="6" height="1" fill="#e9e6dc" />
        <rect x="4" y="2" width="8" height="4" fill="#e9e6dc" />
        {/* Horizontal Visor Inset */}
        <rect x="4" y="3" width="8" height="2" fill="#12151b" />
        {/* Optical Sensor Eye (Signal focal point) */}
        <rect x="6" y="3" width="3" height="2" fill="#f0562b" />
        <rect x="6" y="3" width="1" height="1" fill="#e9e6dc" />
        {/* Status Diode */}
        <rect x="10" y="3" width="1" height="1" fill="#e9e6dc" />
        {/* Chassis Body */}
        <rect x="3" y="6" width="10" height="6" fill="#e9e6dc" />
        <rect x="4" y="7" width="8" height="1" fill="#7d8591" />
        <rect x="5" y="9" width="6" height="2" fill="#12151b" />
        <rect x="6" y="9" width="4" height="1" fill="#f0562b" />
        {/* Tripod Tread Foot Skids */}
        <rect x="2" y="12" width="3" height="3" fill="#2a3039" />
        <rect x="11" y="12" width="3" height="3" fill="#2a3039" />
        <rect x="6" y="13" width="4" height="2" fill="#7d8591" />
      </svg>
    </div>
  );
}

// 2. Patrolling Alien Drone Token
export function AlienPixelToken({ size = 24, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
      title="Patrolling Alien Drone"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Top Antenna / Sensor Prow */}
        <rect x="7" y="1" width="2" height="2" fill="#f0562b" />
        {/* Aerodynamic Stealth Disc Wings */}
        <rect x="4" y="3" width="8" height="2" fill="#e9e6dc" />
        <rect x="2" y="5" width="12" height="3" fill="#e9e6dc" />
        <rect x="1" y="6" width="14" height="2" fill="#e9e6dc" />
        {/* Recessed Sensor Slit */}
        <rect x="4" y="6" width="8" height="2" fill="#12151b" />
        <rect x="6" y="6" width="4" height="1" fill="#f0562b" />
        {/* Ventral Hull Plating */}
        <rect x="3" y="8" width="10" height="2" fill="#7d8591" />
        {/* Ventral Ion Thruster Emitter */}
        <rect x="6" y="10" width="4" height="2" fill="#f0562b" />
        <rect x="7" y="12" width="2" height="2" fill="#e9e6dc" />
      </svg>
    </div>
  );
}

// 3. Amber Cryptographic Gate Key Token
export function KeyPixelToken({ size = 20, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-bounce ${className}`}
      style={{ width: size, height: size }}
      title="Amber Cryptographic Gate Key"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Key Head Loop */}
        <rect x="2" y="4" width="6" height="6" fill="#f0562b" />
        <rect x="3" y="5" width="4" height="4" fill="#0a0c10" />
        {/* Center Circuit Spark */}
        <rect x="4" y="6" width="2" height="2" fill="#e9e6dc" />
        {/* Key Shaft */}
        <rect x="8" y="6" width="6" height="2" fill="#f0562b" />
        {/* Cryptographic Teeth */}
        <rect x="10" y="8" width="2" height="2" fill="#f0562b" />
        <rect x="13" y="8" width="2" height="3" fill="#f0562b" />
      </svg>
    </div>
  );
}

// 4. Red Security Gate Token
export function GatePixelToken({ isUnlocked = false, size = 24, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title={isUnlocked ? 'Gate Open' : 'Gate Locked (Requires Amber Key)'}
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {isUnlocked ? (
          // Unlocked Gate: Pylons retracted, clear corridor
          <g>
            <rect x="1" y="1" width="3" height="14" fill="#2a3039" />
            <rect x="12" y="1" width="3" height="14" fill="#2a3039" />
            <rect x="2" y="2" width="1" height="12" fill="#7d8591" />
            <rect x="13" y="2" width="1" height="12" fill="#7d8591" />
            {/* Open traversal field */}
            <rect x="4" y="7" width="8" height="2" fill="#e9e6dc" opacity="0.25" />
          </g>
        ) : (
          // Locked Gate: Heavy emitter pylons + 3 high-energy laser barrier beams
          <g>
            {/* Left Emitter Pylon */}
            <rect x="1" y="1" width="3" height="14" fill="#7d8591" />
            <rect x="2" y="2" width="1" height="12" fill="#12151b" />
            <rect x="2" y="3" width="1" height="2" fill="#f0562b" />
            <rect x="2" y="7" width="1" height="2" fill="#f0562b" />
            <rect x="2" y="11" width="1" height="2" fill="#f0562b" />
            {/* Right Emitter Pylon */}
            <rect x="12" y="1" width="3" height="14" fill="#7d8591" />
            <rect x="13" y="2" width="1" height="12" fill="#12151b" />
            <rect x="13" y="3" width="1" height="2" fill="#f0562b" />
            <rect x="13" y="7" width="1" height="2" fill="#f0562b" />
            <rect x="13" y="11" width="1" height="2" fill="#f0562b" />
            {/* 3 Laser Beams */}
            <rect x="4" y="3" width="8" height="2" fill="#f0562b" />
            <rect x="4" y="7" width="8" height="2" fill="#f0562b" />
            <rect x="4" y="11" width="8" height="2" fill="#f0562b" />
            {/* Core Energy Glints */}
            <rect x="7" y="3" width="2" height="2" fill="#e9e6dc" />
            <rect x="7" y="7" width="2" height="2" fill="#e9e6dc" />
            <rect x="7" y="11" width="2" height="2" fill="#e9e6dc" />
          </g>
        )}
      </svg>
    </div>
  );
}

// 5. Water Vapor Simulant Canister Token (Strict palette: no foreign blue)
export function WaterNodePixelToken({ size = 22, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
      title="Water Vapor / Hydro-Chemical Simulant Canister"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Hermetic Seal Ring */}
        <rect x="6" y="1" width="4" height="2" fill="#f0562b" />
        <rect x="7" y="2" width="2" height="1" fill="#e9e6dc" />
        {/* Double-Walled Titanium Flask */}
        <rect x="4" y="3" width="8" height="11" fill="#e9e6dc" />
        <rect x="5" y="4" width="6" height="9" fill="#12151b" />
        {/* Condensed Vapor Level */}
        <rect x="5" y="7" width="6" height="6" fill="#7d8591" />
        <rect x="6" y="8" width="4" height="4" fill="#e9e6dc" />
        <rect x="5" y="6" width="6" height="1" fill="#e9e6dc" />
        {/* Graduated Scale Ticks */}
        <rect x="9" y="8" width="2" height="1" fill="#12151b" />
        <rect x="9" y="10" width="2" height="1" fill="#12151b" />
        {/* Bottom Stand */}
        <rect x="4" y="14" width="8" height="1" fill="#7d8591" />
      </svg>
    </div>
  );
}

// 6. Soil Regolith Simulant Canister Token (Perseverance core tube inspired)
export function SoilNodePixelToken({ size = 22, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
      title="Soil Regolith Core Simulant Canister"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Top Coring Bit Collar */}
        <rect x="5" y="1" width="6" height="2" fill="#7d8591" />
        <rect x="7" y="1" width="2" height="1" fill="#f0562b" />
        {/* Fluted Titanium Barrel */}
        <rect x="4" y="3" width="8" height="11" fill="#e9e6dc" />
        <rect x="5" y="4" width="6" height="9" fill="#12151b" />
        {/* Regolith Stratum Core Sample */}
        <rect x="5" y="5" width="6" height="3" fill="#f0562b" />
        <rect x="5" y="8" width="6" height="2" fill="#7d8591" />
        <rect x="5" y="10" width="6" height="3" fill="#f0562b" />
        {/* Mineral Sparkle Graticules */}
        <rect x="6" y="6" width="1" height="1" fill="#e9e6dc" />
        <rect x="8" y="11" width="1" height="1" fill="#e9e6dc" />
        {/* Bottom Hermetic Cap */}
        <rect x="4" y="14" width="8" height="1" fill="#7d8591" />
      </svg>
    </div>
  );
}

// 7. Surface Recovery Airlock Chamber Token
export function ExitPixelToken({ isUnlocked = false, size = 24, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title={isUnlocked ? 'Sample Recovery Airlock Ready' : 'Airlock Sealed'}
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Outer Heavy Bulkhead Frame */}
        <rect x="1" y="1" width="14" height="14" fill="#2a3039" />
        <rect x="2" y="2" width="12" height="12" fill="#12151b" />
        {/* 4 Corner Structural Bolts */}
        <rect x="2" y="2" width="1" height="1" fill="#7d8591" />
        <rect x="13" y="2" width="1" height="1" fill="#7d8591" />
        <rect x="2" y="13" width="1" height="1" fill="#7d8591" />
        <rect x="13" y="13" width="1" height="1" fill="#7d8591" />

        {isUnlocked ? (
          // Unlocked: Pressurized chamber with twin signal navigation arrows
          <g>
            <rect x="4" y="4" width="8" height="8" fill="#0a0c10" />
            <rect x="5" y="5" width="6" height="6" fill="#181c24" />
            <rect x="7" y="7" width="2" height="2" fill="#e9e6dc" />
            {/* Runway guide arrows into airlock */}
            <rect x="7" y="3" width="2" height="1" fill="#f0562b" />
            <rect x="7" y="12" width="2" height="1" fill="#f0562b" />
            <rect x="6" y="4" width="4" height="1" fill="#f0562b" />
            <rect x="6" y="11" width="4" height="1" fill="#f0562b" />
          </g>
        ) : (
          // Sealed: Heavy hazard door with central signal lock indicator
          <g>
            <rect x="4" y="4" width="8" height="8" fill="#2a3039" />
            <rect x="5" y="5" width="6" height="6" fill="#181c24" />
            {/* Red Lock Indicator Bar */}
            <rect x="6" y="7" width="4" height="2" fill="#f0562b" />
            <rect x="7" y="7" width="2" height="2" fill="#e9e6dc" />
          </g>
        )}
      </svg>
    </div>
  );
}
