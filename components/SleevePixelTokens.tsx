'use client';
import React from 'react';

interface TokenProps {
  size?: number;
  className?: string;
  isUnlocked?: boolean;
  isGrace?: boolean;
}

// 1. Astromech Droid Nori Token (Family-consistent with PixelPortraits)
export function NoriPixelToken({ size = 24, isGrace = false, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center transition-all ${
        isGrace ? 'opacity-60 animate-pulse' : 'opacity-100'
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
        {/* Dome */}
        <rect x="5" y="2" width="6" height="4" fill="#e9e6dc" />
        <rect x="6" y="1" width="4" height="1" fill="#e9e6dc" />
        {/* Chassis Body */}
        <rect x="4" y="6" width="8" height="6" fill="#e9e6dc" />
        <rect x="3" y="7" width="1" height="5" fill="#7d8591" />
        <rect x="12" y="7" width="1" height="5" fill="#7d8591" />
        {/* Central Eye Sensor */}
        <rect x="6" y="3" width="4" height="2" fill="#12151b" />
        <rect x="7" y="3" width="2" height="2" fill="#f0562b" />
        <rect x="7" y="3" width="1" height="1" fill="#ffffff" />
        {/* Status Diode */}
        <rect x="10" y="3" width="1" height="1" fill="#e9e6dc" />
        {/* Chest Plate / Sleeve Mount */}
        <rect x="5" y="7" width="6" height="1" fill="#12151b" />
        <rect x="6" y="9" width="4" height="2" fill="#f0562b" />
        {/* Foot Skids */}
        <rect x="3" y="12" width="2" height="3" fill="#2a3039" />
        <rect x="11" y="12" width="2" height="3" fill="#2a3039" />
        <rect x="6" y="13" width="4" height="2" fill="#3a414c" />
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
        {/* Dome Cockpit */}
        <rect x="6" y="2" width="4" height="3" fill="#f0562b" />
        <rect x="7" y="1" width="2" height="1" fill="#f0562b" />
        {/* Disc Hull */}
        <rect x="2" y="5" width="12" height="3" fill="#e9e6dc" />
        <rect x="1" y="6" width="14" height="2" fill="#e9e6dc" />
        <rect x="3" y="8" width="10" height="2" fill="#7d8591" />
        {/* Slit Eye & Sensor Array */}
        <rect x="5" y="3" width="6" height="2" fill="#12151b" />
        <rect x="7" y="3" width="2" height="2" fill="#f0562b" />
        {/* Underbelly Thruster Emitter */}
        <rect x="5" y="10" width="6" height="1" fill="#f0562b" />
        <rect x="6" y="11" width="4" height="2" fill="#f0562b" />
        <rect x="7" y="13" width="2" height="1" fill="#ffffff" />
      </svg>
    </div>
  );
}

// 3. Amber Key Token
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
        <rect x="3" y="4" width="5" height="5" fill="#f0562b" />
        <rect x="4" y="5" width="3" height="3" fill="#0a0c10" />
        {/* Center Spark */}
        <rect x="5" y="6" width="1" height="1" fill="#e9e6dc" />
        {/* Shaft */}
        <rect x="8" y="6" width="6" height="2" fill="#f0562b" />
        {/* Teeth */}
        <rect x="11" y="8" width="1" height="2" fill="#f0562b" />
        <rect x="13" y="8" width="1" height="3" fill="#f0562b" />
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
          // Unlocked gate: Green/mint open field
          <g>
            <rect x="1" y="1" width="2" height="14" fill="#7d8591" />
            <rect x="13" y="1" width="2" height="14" fill="#7d8591" />
            <rect x="3" y="7" width="10" height="2" fill="#e9e6dc" opacity="0.4" />
          </g>
        ) : (
          // Locked gate: Red laser barrier
          <g>
            <rect x="1" y="1" width="3" height="14" fill="#cf4520" />
            <rect x="12" y="1" width="3" height="14" fill="#cf4520" />
            {/* Laser beams */}
            <rect x="4" y="3" width="8" height="2" fill="#f0562b" />
            <rect x="4" y="7" width="8" height="2" fill="#f0562b" />
            <rect x="4" y="11" width="8" height="2" fill="#f0562b" />
            {/* Glint center */}
            <rect x="7" y="7" width="2" height="2" fill="#e9e6dc" />
          </g>
        )}
      </svg>
    </div>
  );
}

// 5. Water Node Canister Token
export function WaterNodePixelToken({ size = 22, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
      title="Water Vapor / Hydro-Chemical Canister"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Vial Frame */}
        <rect x="5" y="2" width="6" height="1" fill="#7d8591" />
        <rect x="4" y="3" width="8" height="11" fill="#e9e6dc" />
        <rect x="5" y="4" width="6" height="9" fill="#12151b" />
        {/* Liquid level */}
        <rect x="5" y="7" width="6" height="6" fill="#e9e6dc" />
        <rect x="6" y="8" width="2" height="4" fill="#a0c4ff" />
        <rect x="5" y="6" width="6" height="1" fill="#ffffff" />
        {/* Measurement tick marks */}
        <rect x="9" y="8" width="2" height="1" fill="#0a0c10" />
        <rect x="9" y="10" width="2" height="1" fill="#0a0c10" />
      </svg>
    </div>
  );
}

// 6. Soil Node Canister Token
export function SoilNodePixelToken({ size = 22, className = '' }: TokenProps) {
  return (
    <div
      className={`inline-flex items-center justify-center animate-pulse ${className}`}
      style={{ width: size, height: size }}
      title="Soil Regolith Core Sample Canister"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Core Tube */}
        <rect x="5" y="2" width="6" height="1" fill="#8a919b" />
        <rect x="4" y="3" width="8" height="11" fill="#e9e6dc" />
        <rect x="5" y="4" width="6" height="9" fill="#12151b" />
        {/* Regolith Stratum */}
        <rect x="5" y="5" width="6" height="3" fill="#f0562b" />
        <rect x="5" y="8" width="6" height="2" fill="#c24a22" />
        <rect x="5" y="10" width="6" height="3" fill="#7a2a12" />
        {/* Mineral Sparkle */}
        <rect x="7" y="6" width="1" height="1" fill="#ffffff" />
        <rect x="8" y="11" width="1" height="1" fill="#e9e6dc" />
      </svg>
    </div>
  );
}

// 7. Exit Airlock Chamber Token
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
        {/* Outer Hatch Frame */}
        <rect x="1" y="1" width="14" height="14" fill="#2a3039" />
        <rect x="2" y="2" width="12" height="12" fill={isUnlocked ? '#0a0c10' : '#12151b'} />
        {/* Airlock Door */}
        {isUnlocked ? (
          <g>
            <rect x="4" y="4" width="8" height="8" fill="#e9e6dc" opacity="0.3" />
            <rect x="5" y="5" width="6" height="6" fill="#e9e6dc" opacity="0.6" />
            <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
            {/* Runway guide arrows */}
            <rect x="7" y="3" width="2" height="1" fill="#f0562b" />
            <rect x="7" y="12" width="2" height="1" fill="#f0562b" />
          </g>
        ) : (
          <g>
            {/* Sealed Hazard Hatch */}
            <rect x="4" y="4" width="8" height="8" fill="#2a1410" />
            <rect x="5" y="5" width="6" height="6" fill="#f0562b" />
            <rect x="7" y="7" width="2" height="2" fill="#0a0c10" />
          </g>
        )}
      </svg>
    </div>
  );
}
