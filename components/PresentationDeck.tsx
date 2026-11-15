'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sound } from './AudioController';

interface Slide {
  id: number;
  subtitle: string;
  title: string;
  eyebrow: string;
  content: React.ReactNode;
  notes: string;
}

export function PresentationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // SLIDE 1: TITLE SLIDE
    {
      id: 1,
      eyebrow: 'NASA Space Apps Challenge 2026 • Universal Event',
      subtitle: 'Space Mission Design Game Challenge',
      title: 'TENTH LIGHT',
      notes: 'Demonstration Slide 1 of 7: Title, challenge classification, and core narrative premise.',
      content: (
        <div className="flex flex-col justify-center items-center h-full text-center space-y-10">
          <div className="inline-block px-5 py-2 bg-[#f0562b]/15 border border-[#f0562b] text-[#f0562b] text-xs uppercase tracking-widest rounded-full font-bold">
            Project Demonstration Deck • 7 Slides
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-[#e9e6dc]">
              TENTH LIGHT
            </h1>
            <p className="font-serif text-xl md:text-3xl text-[#f0562b] italic max-w-2xl mx-auto">
              “Design the ship. Stay in the seat. Send the droid.”
            </p>
          </div>

          <p className="max-w-xl mx-auto text-sm md:text-base text-[#e9e6dc]/80 font-sans leading-relaxed">
            An interactive educational space mission design game uniting rigorous NASA systems engineering, genuine archive astrodynamics, and emotionally grounded human-droid storytelling.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 w-full max-w-3xl text-xs ">
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded text-left">
              <span className="text-[#f0562b] font-bold block">TARGET WORLD</span>
              <span>TOI-700 e (Harbor, 101.5 ly)</span>
            </div>
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded text-left">
              <span className="text-[#e9e6dc] font-bold block">NASA DATA</span>
              <span>Exoplanet Archive + Horizons</span>
            </div>
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded text-left">
              <span className="text-[#f0562b] font-bold block">ENGINEERING</span>
              <span>KSP VAB + CML 1–4 Levels</span>
            </div>
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded text-left">
              <span className="text-[#e9e6dc] font-bold block">STORYTELLING</span>
              <span>11-Act Specialist Journal</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: CHALLENGE & CONCEPT
    {
      id: 2,
      eyebrow: 'Challenge Problem Statement & Core Concept',
      subtitle: 'Space Mission Planning with Real Consequences',
      title: 'The Engineering Trade Space',
      notes: 'Demonstration Slide 2 of 7: Demonstrating the engineering trade-offs required by real space agencies.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full items-center">
          <div className="space-y-6 text-left">
            <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold">
              The Systems Problem
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#e9e6dc]">
              Real Space Missions Forgive No Excess
            </h3>
            <p className="text-sm md:text-base text-[#e9e6dc]/85 font-sans leading-relaxed">
              Designing deep-space missions is an exercise in ruthless optimization. Every kilogram bolted to the airframe demands exponential launch fuel; every watt drawn in deep space requires nuclear isotopes or fragile arrays; every instrument choice determines whether Earth certifies life or returns empty-handed.
            </p>
            <div className="p-5 bg-[#0a0c10] border-l-4 border-[#f0562b] text-xs text-[#e9e6dc]/90 space-y-1.5">
              <div>• <strong>Mass Cap:</strong> Kite (400 kg) leaves budget; Keel (560 kg) carries full science.</div>
              <div>• <strong>Delta-V Budget:</strong> 7,200 m/s minimum across 9 legs (Patched-Conic table).</div>
              <div>• <strong>Thermal Survival:</strong> Inverse-square law ($1/r^2$) drops solar to 0.4 W at Uranus.</div>
              <div>• <strong>Science Integrity:</strong> Spectrometer (Water) + Drill (Soil) required for certification.</div>
            </div>
          </div>

          <div className="p-8 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg space-y-5 text-xs text-left">
            <div className="text-sm font-serif text-[#f0562b] border-b border-[#e9e6dc]/15 pb-3">
              Mission Planning Architecture
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#12151b] border border-[#e9e6dc]/30 rounded">
                <span className="font-bold text-[#e9e6dc] block">1. Launch Segment Formulation</span>
                <span className="text-[#e9e6dc]/70">Balancing structural vehicle mass, launcher capacity, and financial teaching credits.</span>
              </div>
              <div className="p-4 bg-[#12151b] border border-[#f0562b]/30 rounded">
                <span className="font-bold text-[#f0562b] block">2. Astrodynamics & Transit Navigation</span>
                <span className="text-[#e9e6dc]/70">Near-Earth Object flyby collision avoidance (NASA NeoWs) and TLI burns.</span>
              </div>
              <div className="p-4 bg-[#12151b] border border-[#e9e6dc]/30 rounded">
                <span className="font-bold text-[#e9e6dc] block">3. In-Situ Surface Reconnaissance</span>
                <span className="text-[#e9e6dc]/70">Nori’s 2D surface sleeve probe extracting regolith cores and hydrothermal water vapor.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: NASA DATA & RESOURCES
    {
      id: 3,
      eyebrow: 'Challenge Resource Alignment & Scientific Validity',
      subtitle: 'Meaningful Engagement with NASA Data Sources',
      title: 'Real NASA Data & Engineering Frameworks',
      notes: 'Demonstration Slide 3 of 7: Concrete proof of incorporating required NASA challenge resources.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-stretch text-left">
          {/* Box 1: Systems Engineering & CMLs */}
          <div className="p-6 bg-[#0a0c10] border border-[#f0562b]/40 rounded-lg flex flex-col justify-between space-y-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold">
                Challenge Resource #1
              </div>
              <h4 className="font-serif text-lg text-[#e9e6dc] mt-1">
                NASA Systems Engineering & CMLs
              </h4>
              <p className="text-xs text-[#e9e6dc]/80 mt-2 leading-relaxed">
                Adheres to NASA’s <strong>Design and Develop Science Missions</strong> methodology, structuring the mission across 4 segments: Launch, Space, Ground, and User. Incorporates NASA JPL <strong>Concept Maturity Levels (CML 1–4)</strong> to govern point-design feasibility.
              </p>
            </div>
            <div className="text-xs text-[#e9e6dc] border-t border-[#e9e6dc]/10 pt-3">
              ✓ Grounded in JPL CML & Goddard MDL frameworks
            </div>
          </div>

          {/* Box 2: Exoplanet Archive & JPL Horizons */}
          <div className="p-6 bg-[#0a0c10] border border-[#e9e6dc]/40 rounded-lg flex flex-col justify-between space-y-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#e9e6dc] font-bold">
                Challenge Resource #2
              </div>
              <h4 className="font-serif text-lg text-[#e9e6dc] mt-1">
                Exoplanet Archive & JPL Horizons
              </h4>
              <p className="text-xs text-[#e9e6dc]/80 mt-2 leading-relaxed">
                Direct integration of <strong>NASA Exoplanet Archive</strong> composite parameters for TOI-700 e (0.919 R⊕, 0.718 M⊕, 272.9 K, 101.5 ly) and d. Uses <strong>JPL Horizons Ephemeris</strong> for live lunar South Pole Earth-azimuth targeting (COMMAND 399, coord@301).
              </p>
            </div>
            <div className="text-xs text-[#f0562b] border-t border-[#e9e6dc]/10 pt-3">
              ✓ Live local server routes with 15 Nov 2026 snapshots
            </div>
          </div>

          {/* Box 3: GMAT & Small-Body Database */}
          <div className="p-6 bg-[#0a0c10] border border-[#f0562b]/40 rounded-lg flex flex-col justify-between space-y-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold">
                Challenge Resource #3
              </div>
              <h4 className="font-serif text-lg text-[#e9e6dc] mt-1">
                GMAT & Small-Body Database
              </h4>
              <p className="text-xs text-[#e9e6dc]/80 mt-2 leading-relaxed">
                Astrodynamic legs modeled on <strong>NASA General Mission Analysis Tool (GMAT)</strong> patched-conic transfers. Leverages <strong>JPL Small-Body Database</strong> for Dawn asteroid rendezvous (1 Ceres, 939.4 km) and <strong>NASA NeoWs</strong> for real NEO collision telemetry.
              </p>
            </div>
            <div className="text-xs text-[#e9e6dc] border-t border-[#e9e6dc]/10 pt-3">
              ✓ Educational patched-conic trajectory simulation
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: VEHICLE ASSEMBLY BUILDING & KSP INSPIRATION
    {
      id: 4,
      eyebrow: 'Spacecraft Design Mechanics',
      subtitle: 'Vehicle Assembly Building Inspired by Kerbal Space Program',
      title: 'Interactive 3D Spacecraft Engineering',
      notes: 'Demonstration Slide 4 of 7: Kerbal-style staging, physical CoM/CoT/CoL balance, and pre-flight certification.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full items-center text-left">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold">
              VAB Engineering Features
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#e9e6dc]">
              Modular Staging & Physics Overlays
            </h3>
            <p className="text-sm text-[#e9e6dc]/85 font-sans leading-relaxed">
              Players construct a vertical rocket stack in a full Three.js 3D assembly bay. The interface mirrors authentic aerospace engineering and beloved PC simulations like Kerbal Space Program:
            </p>
            <ul className="space-y-3 text-xs text-[#e9e6dc]/90">
              <li className="flex items-start gap-3">
                <span className="text-[#f0562b] font-bold">▶</span>
                <span><strong>Physical Overlays:</strong> Toggleable Center of Mass (CoM), Center of Thrust (CoT), and Aerodynamic Center (CoL).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#e9e6dc] font-bold">▶</span>
                <span><strong>KSP Staging Tower:</strong> Sequenced Stages 0 through 3 (Ignition, Core Reaction, Power Bus, Payload Bay).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#f0562b] font-bold">▶</span>
                <span><strong>Engineer’s Report:</strong> Automatic pre-flight pass/fail checklist checking mass caps, delta-v, and CML rating.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#e9e6dc] font-bold">▶</span>
                <span><strong>Step 0 Auto-Build:</strong> One-click certifying stack for immediate teaching accessibility (420 kg / 132 Credits).</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg space-y-4 text-xs">
            <div className="text-xs uppercase text-[#f0562b] font-bold border-b border-[#e9e6dc]/10 pb-2">
              Certifying Stack Specification
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#12151b] rounded border border-[#e9e6dc]/15">
                <span className="text-[#f0562b] block font-bold">LAUNCHER</span>
                <span>Keel (Cap 560 kg)</span>
              </div>
              <div className="p-3 bg-[#12151b] rounded border border-[#e9e6dc]/15">
                <span className="text-[#e9e6dc] block font-bold">MASS</span>
                <span>420 / 560 kg</span>
              </div>
              <div className="p-3 bg-[#12151b] rounded border border-[#e9e6dc]/15">
                <span className="text-[#f0562b] block font-bold">DELTA-V</span>
                <span>7,200 m/s (3 Tanks)</span>
              </div>
              <div className="p-3 bg-[#12151b] rounded border border-[#e9e6dc]/15">
                <span className="text-[#e9e6dc] block font-bold">URANUS BUS</span>
                <span>100 W vs 55 W Alive Bus</span>
              </div>
            </div>
            <div className="p-4 bg-[#12151b] border border-[#e9e6dc]/30 rounded text-xs leading-relaxed">
              <span className="text-[#e9e6dc] font-bold block mb-0.5">Payload Instrumentation:</span>
              Command Module (20W) • High-Gain Antenna (15W) • Mass Spectrometer (Water Certifier) • Sample Drill (Soil Certifier).
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: THE FLIGHT CORRIDOR & GAMEPLAY
    {
      id: 5,
      eyebrow: 'Mission Gameplay Progression',
      subtitle: 'From Low Earth Orbit to the Outer Heliopause',
      title: '11 Astrodynamics Checkpoints',
      notes: 'Demonstration Slide 5 of 7: Demonstrating the full flight corridor from Stop 0 to Stop 10.',
      content: (
        <div className="space-y-6 text-left">
          <p className="text-xs md:text-sm text-[#e9e6dc]/80 font-sans leading-relaxed">
            Players navigate an authentic 11-stop corridor where destination-specific puzzles, real historical milestones, and orbital obstacles must be overcome to maintain mission certification:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs ">
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#f0562b] font-bold block">STOP 1 • MOON</span>
              <span className="text-xs text-[#e9e6dc]/80">JPL Horizons azimuth alignment (124° ± 14°).</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#e9e6dc] font-bold block">STOP 2 • MARS</span>
              <span className="text-xs text-[#e9e6dc]/80">Jettison 9 kg souvenir crate to meet orbital cap.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#f0562b] font-bold block">STOP 3 • CERES</span>
              <span className="text-xs text-[#e9e6dc]/80">JPL Small-Body DB: identify 1 Ceres (939.4 km).</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#e9e6dc] font-bold block">STOP 4 • JUPITER</span>
              <span className="text-xs text-[#e9e6dc]/80">3-Wave gallery shooter ambush; Bolt refuels tanks.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#f0562b] font-bold block">STOP 5 • ENCELADUS</span>
              <span className="text-xs text-[#e9e6dc]/80">Target Cassini south-polar cryovolcanic plume.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#e9e6dc] font-bold block">STOP 6 • URANUS</span>
              <span className="text-xs text-[#e9e6dc]/80">Inverse-square 1/r² thermal breaker management.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#f0562b] font-bold block">STOP 7 • NEPTUNE</span>
              <span className="text-xs text-[#e9e6dc]/80">One-way light time latency test (7s pause-safe).</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#e9e6dc] font-bold block">STOP 8 • PLUTO</span>
              <span className="text-xs text-[#e9e6dc]/80">Locate Tombaugh Regio ♥ on New Horizons plate.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded">
              <span className="text-[#f0562b] font-bold block">STOP 9 • HELIOPAUSE</span>
              <span className="text-xs text-[#e9e6dc]/80">Voyager 1 122 AU boundary; transmit sequence.</span>
            </div>
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/50 rounded col-span-2 sm:col-span-3">
              <span className="text-[#e9e6dc] font-bold block">STOP 10 • TOI-700 e (HARBOR)</span>
              <span className="text-xs text-[#e9e6dc]/90">Top-down 2D surface sleeve probe: Droid Nori extracts 2 water & 2 soil canisters, opens red gate, and exits to orbit.</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: BEST STORYTELLING & HUMAN-DROID CONNECTION
    {
      id: 6,
      eyebrow: 'Narrative Excellence & Emotional Resonance',
      subtitle: 'In the Winning Tradition of HerCode Space’s “A Solar Tale”',
      title: 'Best Storytelling: The Specialist & The Droid',
      notes: 'Demonstration Slide 6 of 7: Demonstrating deep narrative craft, literary prose, and the human-machine emotional core.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full items-center text-left">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#f0562b] font-bold">
              The Emotional Spine
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#e9e6dc]">
              “The Specialist Stays in the Seat; The Droid Walks the Cold Ground.”
            </h3>
            <p className="text-sm text-[#e9e6dc]/85 font-sans leading-relaxed">
              Tenth Light bridges hard engineering with a deeply literary narrative. Like <em>A Solar Tale</em>, science is not a detached series of equations—it is human yearning cast into the cold void:
            </p>
            <div className="space-y-3 text-xs text-[#e9e6dc]/90">
              <div>• <strong>The Solitary Specialist (Wren):</strong> Bound to the flight couch, experiencing the universe through portholes, radio hiss, and sensor telemetry.</div>
              <div>• <strong>The Loyal Astromech (Nori):</strong> A physical companion who steps onto freezing regolith, braving alien mazes and cryovolcanic plumes.</div>
              <div>• <strong>11-Act Mission Logbook:</strong> Personal journal entries, Nori’s telemetry logs, and historical context for every stop.</div>
            </div>
          </div>

          <div className="p-8 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg space-y-5 font-serif italic text-sm text-[#e9e6dc]/90 leading-relaxed text-left shadow-lg">
            <div className="text-xs not-italic text-[#f0562b] uppercase tracking-wider font-bold border-b border-[#e9e6dc]/15 pb-1.5">
              From Act XI: Harbor in the Silence
            </div>
            <p>
              “One hundred and one point five light-years from Cape Canaveral. Harbor is completely, reverently silent. The hatch stayed shut. I watched through the panoramic camera as the airlock lights went green. Nori rolled down the ramp onto the regolith. A small metal droid carrying humankind’s curiosity. When she climbed back into the airlock with frost clinging to her optical turret, I felt tears in my visor. We did it.”
            </p>
            <div className="text-xs not-italic text-[#e9e6dc] pt-1.5">
              — Specialist Wren, Flight Journal Entry, TOI-700 e Orbit
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: GLOBAL IMPACT, OPEN SCIENCE & PARTNERS
    {
      id: 7,
      eyebrow: 'Open Science, Standards & International Collaboration',
      subtitle: 'Accessible Educational Simulation for Global Learners',
      title: 'Impact, Open Science & 17 Space Agency Partners',
      notes: 'Demonstration Slide 7 of 7: Closing slide, open source repository, Vercel deployment, and Space Agency Partners.',
      content: (
        <div className="flex flex-col justify-between h-full text-left space-y-6">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#e9e6dc]">
              Open-Source Simulation for the Next Generation of Space Explorers
            </h3>
            <p className="text-xs md:text-sm text-[#e9e6dc]/80 font-sans mt-2 leading-relaxed max-w-3xl">
              Tenth Light proves that complex aerospace systems engineering—orbital mechanics, thermal power balance, and planetary payload integration—can be taught through an intuitive, accessible, and emotionally resonant browser simulation.
            </p>
          </div>

          {/* 17 International Partners Grid */}
          <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg text-xs ">
            <span className="text-[#f0562b] font-bold block mb-1.5 uppercase tracking-wider">
              Aligned with 17 Global 2026 Space Apps Space Agency Partners:
            </span>
            <div className="text-xs text-[#e9e6dc]/75 leading-relaxed">
              NASA (US) • ESA (Europe) • JAXA (Japan) • CSA (Canada) • ISRO (India) • ASI (Italy) • KASA (Korea) • UKSA (UK) • AEB (Brazil) • CONAE (Argentina) • MBRSC (UAE) • GGPEN (Angola) • NSSA (Bahrain) • NASRDA (Nigeria) • AEP (Paraguay) • ASES (Senegal) • AEE (Spain) • TUA (Türkiye).
            </div>
          </div>

          {/* Project Manifest & Verification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs pt-1.5">
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/30 rounded">
              <span className="text-[#e9e6dc] font-bold block">LIVE VERCEL SITE</span>
              <a href="https://tenth-light.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#e9e6dc]">
                tenth-light.vercel.app
              </a>
            </div>
            <div className="p-5 bg-[#0a0c10] border border-[#f0562b]/30 rounded">
              <span className="text-[#f0562b] font-bold block">OPEN GITHUB REPO</span>
              <a href="https://github.com/sharmao07/tenth-light" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#e9e6dc]">
                github.com/sharmao07/tenth-light
              </a>
            </div>
            <div className="p-5 bg-[#0a0c10] border border-[#e9e6dc]/30 rounded">
              <span className="text-[#e9e6dc] font-bold block">MEDIA COMPLIANCE</span>
              <span className="text-[#e9e6dc]/80">Zero AI images • 100% Original SVG Art</span>
            </div>
          </div>

          <div className="text-center font-serif italic text-sm text-[#f0562b] border-t border-[#e9e6dc]/15 pt-5">
            “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.”
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  // Hotkey navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        sound.playUiClick();
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sound.playUiClick();
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e9e6dc] flex flex-col justify-between p-6 md:p-12 select-none font-sans">
      {/* Top Deck Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[#e9e6dc]/20 pb-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="sensory-btn px-5 py-2 bg-[#12151b] hover:bg-[#f0562b] hover:text-[#0a0c10] border border-[#f0562b] rounded text-xs tracking-wide transition-colors"
          >
            ← Return to Game
          </Link>
          <div className="text-xs text-[#e9e6dc]/70 hidden sm:inline">
            NASA Space Apps 2026: Official 7-Slide Demonstration
          </div>
        </div>

        {/* Slide Selector Pills */}
        <div className="flex items-center gap-2 text-xs">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                sound.playUiClick();
                setCurrentSlide(idx);
              }}
              className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                idx === currentSlide
                  ? 'bg-[#f0562b] text-[#0a0c10] border-[#f0562b] font-bold shadow'
                  : 'bg-[#12151b] text-[#e9e6dc]/60 border-[#e9e6dc]/20 hover:border-[#f0562b]'
              }`}
              title={`Slide ${idx + 1}: ${s.subtitle}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="sensory-btn px-5 py-2 bg-[#12151b] hover:bg-[#e9e6dc]/10 border border-[#e9e6dc]/30 rounded text-xs tracking-wide transition-colors"
            title="Print or export deck as PDF"
          >
            Print / PDF
          </button>
          <span className="text-xs text-[#f0562b] font-bold">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </header>

      {/* Main Slide Card */}
      <main className="max-w-6xl mx-auto w-full my-auto py-10">
        <div className="bg-[#12151b] border border-[#f0562b]/60 rounded-xl p-10 md:p-10 shadow-2xl min-h-[520px] flex flex-col justify-between relative overflow-hidden">
          {/* Slide Eyebrow & Subtitle Header */}
          <div className="border-b border-[#e9e6dc]/15 pb-6 mb-6 flex flex-wrap justify-between items-end gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#e9e6dc] font-bold block">
                {current.eyebrow}
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-[#e9e6dc] mt-0.5">
                {current.subtitle}
              </h2>
            </div>
            <span className="text-xs text-[#f0562b] bg-[#f0562b]/10 px-4 py-1.5 rounded border border-[#f0562b]/30 font-bold">
              SLIDE {current.id} OF 7
            </span>
          </div>

          {/* Slide Content */}
          <div className="flex-1 my-auto">
            {current.content}
          </div>

          {/* Slide Footer with Speaker Notes */}
          <div className="border-t border-[#e9e6dc]/10 pt-6 mt-6 flex flex-wrap justify-between items-center text-xs text-[#e9e6dc]/60">
            <div className="italic text-xs max-w-xl">
              Speaker Note: {current.notes}
            </div>
            <div className="hidden sm:block">
              Navigate via <kbd className="px-2 py-0.5 bg-[#0a0c10] border border-[#e9e6dc]/30 rounded text-[#f0562b]">◀</kbd> / <kbd className="px-2 py-0.5 bg-[#0a0c10] border border-[#e9e6dc]/30 rounded text-[#f0562b]">▶</kbd> or Spacebar
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="max-w-6xl mx-auto w-full flex items-center justify-between border-t border-[#e9e6dc]/20 pt-6 text-xs">
        <button
          onClick={() => {
            sound.playUiClick();
            setCurrentSlide((prev) => Math.max(0, prev - 1));
          }}
          disabled={currentSlide === 0}
          className={`sensory-btn px-6 py-3 border rounded transition-colors ${
            currentSlide === 0
              ? 'bg-[#0a0c10] text-[#e9e6dc]/20 border-[#e9e6dc]/10 cursor-not-allowed'
              : 'bg-[#12151b] text-[#e9e6dc] border-[#e9e6dc]/30 hover:border-[#f0562b]'
          }`}
        >
          ◀ Previous Slide
        </button>

        <div className="text-[#e9e6dc]/60 text-center hidden sm:block">
          NASA Space Apps Challenge 2026 Submission Demonstration
        </div>

        <button
          onClick={() => {
            sound.playUiClick();
            setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
          }}
          disabled={currentSlide === slides.length - 1}
          className={`sensory-btn px-6 py-3 border rounded transition-colors ${
            currentSlide === slides.length - 1
              ? 'bg-[#0a0c10] text-[#e9e6dc]/20 border-[#e9e6dc]/10 cursor-not-allowed'
              : 'bg-[#f0562b] text-[#0a0c10] border-[#f0562b] font-bold hover:bg-[#cf4520]'
          }`}
        >
          Next Slide ▶
        </button>
      </footer>
    </div>
  );
}
