'use client';
import React, { useEffect } from 'react';
import { sound } from './AudioController';

interface GateClearanceModalProps {
  stopIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

interface ClearanceInfo {
  title: string;
  destination: string;
  distance: string;
  objective: string;
  steps: string[];
  controls: string;
  notes: string;
}

const GATE_CLEARANCE_DATA: Record<number, ClearanceInfo> = {
  1: {
    title: 'Lunar Earth-Lock Clearance',
    destination: 'Stop 1 • The Moon (Keeper: Lumen)',
    distance: '0.00257 AU (~384,400 km)',
    objective: 'Align the high-gain parabolic antenna with Earth’s exact azimuth coordinates.',
    steps: [
      'Query JPL Horizons ephemeris for Earth’s position viewed from the lunar south pole (COMMAND 399, coord@301).',
      'Use the azimuth slider or directional buttons to lock within ±14° of true azimuth (Snapshot: 124° Azimuth, 18° Elevation).',
      'Lock signal when the alignment crosshair turns mint green.',
    ],
    controls: 'Slider or [◀ Left / Right ▶] buttons • [Lock Alignment] button',
    notes: 'Free retries on alignment. Snapshot telemetry is used if live JPL Horizons feed is delayed.',
  },
  2: {
    title: 'Orbital Mass Jettison Protocol',
    destination: 'Stop 2 • Mars (Keeper: Redline)',
    distance: '1.52 AU',
    objective: 'Reduce ship mass by exactly 9 kg to meet orbital capture thresholds.',
    steps: [
      'Inspect the cargo manifest items in the airlock chute.',
      'Jettison the souvenir geological ballast crate (exactly 9 kg).',
      'CRITICAL: Do NOT drop Nori’s spare optical sensor or flight telemetry modules.',
    ],
    controls: 'Click [Jettison] on the 9 kg Souvenir Crate',
    notes: 'Redline strictly rejects overweight spacecraft entering Martian insertion orbit.',
  },
  3: {
    title: 'Main Belt Asteroid Triangulation',
    destination: 'Stop 3 • Ceres (Keeper: Pebble)',
    distance: '2.77 AU',
    objective: 'Identify the largest body in the asteroid belt visited by NASA’s Dawn mission.',
    steps: [
      'Compare diameters from the JPL Small-Body Database for 1 Ceres, 4 Vesta, and 2 Pallas.',
      'Select 1 Ceres (mean diameter 939.4 km, dwarf planet).',
      'Confirm orbital rendezvous trajectory.',
    ],
    controls: 'Click the card corresponding to the largest diameter body (1 Ceres)',
    notes: 'Dawn orbited Vesta in 2011 and Ceres in 2015. Ceres is the largest and a certified dwarf planet.',
  },
  4: {
    title: 'Jovian Orbital Defense & Refuel Intercept',
    destination: 'Stop 4 • Jupiter Depot (Keeper: Bolt)',
    distance: '5.20 AU',
    objective: 'Repel the 3-wave saucer ambush outside the depot, then dock for propellant refuel.',
    steps: [
      'Slide your ship horizontally at the bottom of the engagement grid.',
      'Fire defense pulses upward to neutralize incoming alien saucers before they descend.',
      'Survive and eliminate all 3 waves. A hit spends 1 Life heart.',
      'Bolt will refuel your propellant tanks back to 7,200 m/s upon docking.',
    ],
    controls: '[A / D] or [Arrow Keys] to slide • [Space] or [W] to fire cannon',
    notes: 'Keep your eyes on descending alien formation patterns. Muzzle flashes and trauma shake are active.',
  },
  5: {
    title: 'Cryovolcanic Plume Sampling Target',
    destination: 'Stop 5 • Enceladus (Keeper: Spray)',
    distance: '9.58 AU',
    objective: 'Target the south-polar cryovolcanic geyser jets photographed by NASA’s Cassini spacecraft.',
    steps: [
      'Examine the high-resolution Cassini photographic plate of Saturn’s ice moon Enceladus.',
      'Identify the bright eruptive vapor plume venting from the south-pole tiger stripes.',
      'Click directly on the south-polar plume to capture particulate flyby telemetry.',
    ],
    controls: 'Click on the south-pole vapor plume region at the bottom of the planetary disc',
    notes: 'Cassini flew directly through these water vapor and organic macromolecule plumes in 2008.',
  },
  6: {
    title: 'Deep-Space Thermal Breaker Management',
    destination: 'Stop 6 • Uranus (Keeper: Tilt)',
    distance: '19.2 AU',
    objective: 'Keep the 55 W Alive Bus heated while surviving extreme solar irradiance dropoff.',
    steps: [
      'At 19.2 AU, solar flux drops to 1/r² (~0.4 W). The +20 W heater activates for a 55 W survival bus.',
      'Ensure the Radioisotope Thermoelectric Generator (RTG, 100 W flat) is powering the bus.',
      'Keep Command Module (20W), High-Gain Antenna (15W), and Thermal Heater (20W) breakers CLOSED.',
      'If total draw exceeds RTG supply, open the breaker for non-essential instruments (such as the Imager).',
    ],
    controls: 'Click circuit breaker toggle switches to Open / Close electrical lines',
    notes: 'Without an RTG, a solar-only ship freezes at Uranus and is scrubbed to the hangar.',
  },
  7: {
    title: 'Light-Speed Command Latency Test',
    destination: 'Stop 7 • Neptune (Keeper: Lag)',
    distance: '30.1 AU',
    objective: 'Demonstrate patience under true interplanetary communication delay.',
    steps: [
      'At 30.1 AU, radio signals take 4.17 hours each way. The simulation tests this with a 7-second cooldown.',
      'Send a single gate clearance command by pressing [Transmit Clearance Signal].',
      'Wait the full 7 seconds without sending a second command or spamming inputs.',
      'A second command while the line is pending causes buffer overload and resets the timer.',
    ],
    controls: 'Click [Transmit Clearance Signal] ONCE • Wait 7.0 seconds uninterrupted',
    notes: 'Pausing the game via [Esc] freezes the countdown safely without penalty.',
  },
  8: {
    title: 'Tombaugh Regio Feature Identification',
    destination: 'Stop 8 • Pluto (Keeper: Heart ♥)',
    distance: '39.5 AU',
    objective: 'Identify the iconic nitrogen-ice heart feature discovered by NASA’s New Horizons.',
    steps: [
      'Examine the New Horizons flyby photograph of dwarf planet Pluto.',
      'Locate Tombaugh Regio, the bright heart-shaped nitrogen ice plain.',
      'Click the heart region ♥. Do not select the dark equatorial tholin plains (Cthulhu Macula).',
    ],
    controls: 'Click on the bright heart-shaped plain (Tombaugh Regio ♥)',
    notes: '“A photograph is not a soil sample.” The heart emoji ♥ is the official speaker portrait and map icon.',
  },
  9: {
    title: 'Interstellar Science Return Sequence',
    destination: 'Stop 9 • Heliopause (Keeper: Whisper)',
    distance: '122 AU (Voyager 1 Crossing Boundary)',
    objective: 'Transmit scientific packets in exact priority order before crossing into the interstellar medium.',
    steps: [
      'Voyager 1 crossed the solar heliopause in August 2012 at ~121.6 AU.',
      'Arrange packets in strict scientific sequence:',
      '1. Water & Soil Sample Readings (Highest scientific value)',
      '2. Power & Navigation Engineering Log',
      '3. Specialist Postcard / Crew Sign-off',
    ],
    controls: 'Click packets in the correct numerical order (1 → 2 → 3)',
    notes: 'Selecting an out-of-order packet resets the sequence buffer without penalty.',
  },
  10: {
    title: 'Harbor Surface Sleeve Deployment',
    destination: 'Stop 10 • TOI-700 e (Harbor)',
    distance: '101.5 Light Years (Exoplanet Archive Transit Target)',
    objective: 'Deploy Droid Nori across the alien sample sleeve to gather Water and Soil canisters.',
    steps: [
      'The ship stays in orbit; the hatch stays shut. Nori walks the cold surface sleeve.',
      'Navigate Nori through the 2D maze using WASD or Arrow Keys.',
      'Collect the Amber Key to unlock the Red Laser Gate barrier.',
      'Collect 2 Water Canisters (Hydro-chemical vapor) and 2 Soil Canisters (Regolith cores).',
      'Reach the recovery airlock exit once all 4 samples are secured.',
    ],
    controls: '[W / A / S / D] or [Arrow Keys] to move Nori • On-screen directional buttons available',
    notes: 'Avoid patrolling alien security drones. Collisions spend 1 Life heart with brief invulnerability.',
  },
};

export function GateClearanceModal({ stopIndex, isOpen, onClose }: GateClearanceModalProps) {
  const info = GATE_CLEARANCE_DATA[stopIndex];

  // Hotkey [Space] or [Enter] or [Escape] to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        sound.playUiClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0c10]/90 flex items-center justify-center p-6 backdrop-blur-none animate-fadeIn select-none">
      <div className="w-full max-w-xl bg-[#0a0c10] border border-[#f0562b] text-[#e9e6dc] flex flex-col max-h-[90vh]">
        {/* Dossier Modal Header */}
        <div className="border-b border-[#e9e6dc]/15 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#f0562b]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
              CLEARANCE DIRECTIVE // PROTOCOL #{stopIndex}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#e9e6dc]/40">
            [ESC / SPACE TO DISMISS]
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-8 md:p-10 space-y-6 overflow-y-auto leading-relaxed text-sm">
          {/* Destination & Title */}
          <div>
            <p className="label">{info.destination}</p>
            <h2 className="font-serif font-extralight text-3xl md:text-4xl text-[#e9e6dc] mt-1 tracking-tight">
              {info.title}
            </h2>
            <div className="font-mono text-xs text-[#e9e6dc]/60 mt-1">
              Mission Distance: <span className="text-[#f0562b] font-bold">{info.distance}</span>
            </div>
          </div>

          {/* Objective Box */}
          <div className="border border-[#e9e6dc]/15 p-5 bg-[#0a0c10]">
            <span className="label text-[#f0562b] block mb-1">
              Primary Directive
            </span>
            <p className="font-serif text-base text-[#e9e6dc]">
              {info.objective}
            </p>
          </div>

          {/* Step-by-Step Procedure */}
          <div>
            <span className="label block mb-2">
              Clearance Sequence
            </span>
            <ol className="space-y-2 list-decimal list-inside font-mono text-xs text-[#e9e6dc]/80 pl-1">
              {info.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="font-sans text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Controls Bar */}
          <div className="border border-[#e9e6dc]/15 p-4 bg-[#0a0c10] font-mono text-xs">
            <span className="text-[#e9e6dc] font-bold block mb-1 uppercase tracking-wider">
              Workstation Controls:
            </span>
            <span className="text-[#e9e6dc]/80">{info.controls}</span>
          </div>

          {/* Technical Note */}
          <div className="font-serif text-xs text-[#e9e6dc]/60 italic border-l border-[#f0562b] pl-4 py-1 leading-relaxed">
            Note: {info.notes}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-[#e9e6dc]/15 px-8 py-5 flex items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#e9e6dc]/50 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 border border-[#e9e6dc]/20">Space</kbd> to engage
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn w-full sm:w-auto"
          >
            Acknowledge &amp; engage protocol &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
