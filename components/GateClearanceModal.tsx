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
    title: 'Enceladus Cryovolcanic Plume Sampling',
    destination: 'Stop 5 • Enceladus (Keeper: Spray)',
    distance: '9.58 AU',
    objective: 'Locate the south-pole cryovolcanic vapor plumes on authentic Cassini spacecraft imagery.',
    steps: [
      'Analyze the thermal-composite surface photograph of Saturn’s moon Enceladus.',
      'Target the active fractures (Tiger Stripes) situated across the south polar terrain.',
      'Click directly into the south polar plume geyser zone to confirm hydro-chemical vapor sampling.',
    ],
    controls: 'Click inside the south pole region on the Cassini radar plate',
    notes: 'Cassini flew through Enceladus’ plumes in 2008, tasting salt, simple organics, and water vapor.',
  },
  6: {
    title: 'Uranus 1/r² Thermal Margin & Breakers',
    destination: 'Stop 6 • Uranus (Keeper: Tilt)',
    distance: '19.2 AU',
    objective: 'Balance electrical bus load under severe solar dropoff ($1/r^2$) to protect avionics heaters.',
    steps: [
      'Solar irradiance drops to ~0.43 W per array at 19.2 AU; a 100 W RTG is mandatory for survival.',
      'The critical survival bus requires 55 W (Computer 20W + Antenna 15W + Heater 20W).',
      'Toggle circuit breakers so total active power draw remains at or below available generator watts.',
      'Commit bus state once thermal stability is achieved.',
    ],
    controls: 'Click checkboxes to open/close appliance circuit breakers • Click [Commit Breaker Configuration]',
    notes: 'If your vessel lacks an RTG, the bus will freeze and Tilt will scrub you back to the VAB hangar.',
  },
  7: {
    title: 'Neptune Light-Lag Buffering',
    destination: 'Stop 7 • Neptune (Keeper: Lag)',
    distance: '30.1 AU',
    objective: 'Buffer command packets across the 4.17-hour one-way speed-of-light propagation delay.',
    steps: [
      'Initiate orbital burn handshake across the deep-space communications channel.',
      'Wait out the 7-second simulated telemetry buffer countdown.',
      'Transmit burn completion packet once the radio carrier lock synchronizes.',
    ],
    controls: 'Click [Initiate Light-Lag Handshake] • Await timer countdown • Click [Transmit Burn Packet]',
    notes: 'At 30 AU, radio signals take 4 hours and 10 minutes each way. Patience is an astrodynamics reality.',
  },
  8: {
    title: 'Kuiper Belt Visual Identification',
    destination: 'Stop 8 • Pluto (Keeper: Heart)',
    distance: '39.5 AU',
    objective: 'Select the authentic New Horizons high-resolution photograph of Tombaugh Regio.',
    steps: [
      'Compare three visual reconnaissance plates of dwarf planets and icy satellites.',
      'Locate Tombaugh Regio, the famous nitrogen-ice heart discovered by New Horizons in 2015.',
      'Confirm the visual target to obtain Kuiper belt flyby clearance.',
    ],
    controls: 'Click the photographic plate displaying Pluto’s bright nitrogen heart (Tombaugh Regio)',
    notes: '“A photograph is not a soil sample, but it proves we arrived.”',
  },
  9: {
    title: 'Interstellar Boundary Packet Ordering',
    destination: 'Stop 9 • Heliopause (Keeper: Whisper)',
    distance: '122 AU',
    objective: 'Reconstruct fragmented Voyager telemetry packets scrambled across the interstellar magnetic shear.',
    steps: [
      'Review the 4 corrupted data packets from the interstellar plasma boundary.',
      'Drag or click sequence buttons to arrange packets in chronological chronological order [1, 2, 3, 4].',
      'Verify the telemetry stream to clear the final solar system threshold.',
    ],
    controls: 'Click [▲ Up / Down ▼] or click packets in correct numerical order',
    notes: 'Voyager 1 crossed the heliopause in August 2012 at 121.6 AU, recording a jump in galactic cosmic rays.',
  },
  10: {
    title: 'Harbor Surface Sample Extraction',
    destination: 'Stop 10 • Harbor (TOI-700 e)',
    distance: '101.5 light-years (31.13 parsecs)',
    objective: 'Deploy Droid Nori across the cryogenic exoplanet surface to extract water and soil canisters.',
    steps: [
      'The ship stays in orbit; the cabin hatch stays shut. Nori walks the cold surface sleeve.',
      'Navigate Nori through the 2D maze using WASD or Arrow Keys.',
      'Collect the Amber Key to unlock the Red Laser Gate barrier.',
      'Collect 2 Water Canisters (Hydro-chemical vapor) and 2 Soil Canisters (Regolith cores).',
      'Reach the recovery airlock exit once all 4 samples are secured.',
    ],
    controls: '[W / A / S / D] or [Arrow Keys] to move Nori • On-screen directional buttons available',
    notes: 'Avoid patrolling alien security drones (1 Life heart per collision). SCIENCE DISCLOSURE: Interstellar travel across 101.5 ly is a speculative educational scenario (~1,015-year journey at 0.1c in Earth reference frame; no demonstrated propulsion system achieves 0.1c). Water and soil canisters are candidate biosignature simulants within an educational simulation; true surface conditions remain unconfirmed by current astronomical instruments.',
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
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="clearance-directive-title"
      className="fixed inset-0 z-50 bg-void/90 flex items-center justify-center p-4 md:p-6 backdrop-blur-none animate-fadeIn select-none"
    >
      <div className="w-full max-w-xl bg-void border border-signal text-paper flex flex-col max-h-[90vh]">
        {/* Dossier Modal Header */}
        <div className="border-b border-paper/15 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-signal" aria-hidden="true" />
            <span className="label text-signal">
              HOW THIS WORKS &middot; PROTOCOL #<span className="tabular-nums">{stopIndex}</span>
            </span>
          </div>
          <span className="label text-paper-muted">
            [ESC / SPACE TO DISMISS]
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-5 overflow-y-auto leading-relaxed text-sm">
          {/* Destination & Title */}
          <div>
            <p className="label">{info.destination}</p>
            <h2 id="clearance-directive-title" className="font-serif font-extralight text-2xl md:text-3xl text-paper mt-1 tracking-tight">
              {info.title}
            </h2>
            <div className="label text-paper-muted mt-1 tabular-nums">
              Mission Distance: <span className="text-signal font-bold">{info.distance}</span>
            </div>
          </div>

          {/* Objective Box */}
          <div className="border border-paper/15 p-4 bg-void">
            <span className="label text-signal block mb-1">
              Primary Directive
            </span>
            <p className="font-serif text-base text-paper m-0">
              {info.objective}
            </p>
          </div>

          {/* Step-by-Step Procedure */}
          <div>
            <span className="label block mb-2">
              Clearance Sequence
            </span>
            <ol className="space-y-1.5 list-decimal list-inside font-mono text-xs text-paper-muted pl-1">
              {info.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="font-sans text-sm text-paper">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Controls Bar */}
          <div className="border border-paper/15 p-3.5 bg-void font-mono text-xs">
            <span className="label text-paper block mb-1">
              Workstation Controls:
            </span>
            <span className="text-paper-muted">{info.controls}</span>
          </div>

          {/* Technical Note */}
          <div className="font-serif text-xs text-paper-muted italic border-l border-signal pl-4 py-1 leading-relaxed">
            Note: {info.notes}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-paper/15 px-6 py-4 flex items-center justify-between gap-4">
          <div className="font-mono text-xs text-paper-muted hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 border border-paper/30">Space</kbd> to engage
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn w-full sm:w-auto"
          >
            <span>Acknowledge &amp; engage protocol</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
