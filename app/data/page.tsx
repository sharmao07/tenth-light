import React from 'react';
import Link from 'next/link';

export default function DataPage() {
  return (
    <main className="min-h-screen bg-[#100e0c] text-[#efe6d6] p-6 md:p-12 font-sans selection:bg-[#e39b12] selection:text-[#100e0c]">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#efe6d6]/20 pb-5">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#e39b12] tracking-wide">
              TENTH LIGHT • DATA & CITATIONS
            </h1>
            <p className="text-sm font-mono text-[#efe6d6]/70 mt-1.5 leading-relaxed">
              NASA Space Apps Challenge 2026: Space Mission Design Game
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="px-4 py-2 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] text-xs md:text-sm font-mono uppercase tracking-wider rounded-lg transition-colors font-bold shadow"
            >
              ← Return to Game
            </Link>
          </div>
        </div>

        {/* The Honesty Line */}
        <section className="bg-[#1a1714] border-l-4 border-[#e39b12] p-6 rounded-r-lg shadow-md">
          <h2 className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#e39b12] mb-2 font-bold">
            The Honesty Line
          </h2>
          <p className="font-serif text-lg md:text-xl italic text-[#efe6d6] leading-relaxed">
            “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
            The voyage past the heliopause is a mission simulation that uses the archive’s numbers.
            The aliens, the depot fight, and the droid are the story.”
          </p>
        </section>

        {/* Exoplanet Archive Snapshot */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-4 shadow-md">
          <h2 className="font-serif text-2xl font-bold text-[#e39b12]">
            NASA Exoplanet Archive Composite Parameters
          </h2>
          <div className="text-sm font-mono text-[#efe6d6]/80 leading-relaxed">
            Archive Snapshot Date: <span className="font-bold text-[#efe6d6]">15 November 2026</span>. “Equilibrium temperature is not weather.”
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* TOI-700 e (Harbor) */}
            <div className="p-4 bg-[#100e0c] border border-[#5bc0be]/50 rounded-lg font-mono text-xs md:text-sm space-y-2 leading-relaxed">
              <div className="font-bold text-[#5bc0be] text-base md:text-lg">TOI-700 e (Nicknamed Harbor)</div>
              <div>• Radius: 0.919 Earth radii (0.919 R⊕)</div>
              <div>• Mass: 0.718 Earth masses (0.718 M⊕)</div>
              <div>• Orbital Period: 27.81 days</div>
              <div>• Insolation Flux: 1.27 Earth insolation</div>
              <div>• Equilibrium Temperature: 272.9 K</div>
              <div>• Distance: 31.13 parsecs (~101.5 light years)</div>
              <div>• Discovery: 2023 by transit method</div>
              <div className="text-xs text-[#efe6d6]/70 italic pt-1 leading-relaxed">
                The target world of Tenth Light. In the optimistic habitable zone.
              </div>
            </div>

            {/* TOI-700 d (The Twin) */}
            <div className="p-4 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg font-mono text-xs md:text-sm space-y-2 leading-relaxed">
              <div className="font-bold text-[#efe6d6] text-base md:text-lg">TOI-700 d (The Twin You Do Not Fly)</div>
              <div>• Radius: 1.145 Earth radii (1.145 R⊕)</div>
              <div>• Mass: 1.580 Earth masses (1.580 M⊕)</div>
              <div>• Orbital Period: 37.42 days</div>
              <div>• Insolation Flux: 0.85 Earth insolation</div>
              <div>• Equilibrium Temperature: 268.8 K</div>
              <div>• Distance: 31.13 parsecs (~101.5 light years)</div>
              <div>• Discovery: 2020 by transit method</div>
              <div className="text-xs text-[#efe6d6]/70 italic pt-1 leading-relaxed">
                The outer temperate twin in the conservative habitable zone.
              </div>
            </div>
          </div>
        </section>

        {/* Teaching Numbers & Delta-v Budget */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-5 shadow-md">
          <h2 className="font-serif text-2xl font-bold text-[#e39b12]">
            Teaching Numbers & Delta-v Budgets
          </h2>

          <div className="p-4 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg text-xs md:text-sm font-mono space-y-1.5 leading-relaxed">
            <div className="text-[#e39b12] font-bold text-sm">
              Teaching Budget: 140 credits. (This is NOT an official NASA price.)
            </div>
            <div className="text-[#efe6d6]/80">
              Delta-v Calculation: Labeled as a patched-conic teaching table, not a GMAT numerical integration run.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm font-mono text-left border-collapse border border-[#efe6d6]/20">
              <thead className="bg-[#100e0c] text-[#e39b12]">
                <tr>
                  <th className="border border-[#efe6d6]/20 p-3">Leg</th>
                  <th className="border border-[#efe6d6]/20 p-3">From → To</th>
                  <th className="border border-[#efe6d6]/20 p-3">Delta-v (m/s)</th>
                  <th className="border border-[#efe6d6]/20 p-3">Distance</th>
                  <th className="border border-[#efe6d6]/20 p-3">Dodges</th>
                </tr>
              </thead>
              <tbody className="leading-relaxed">
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">0 → 1</td>
                  <td className="border border-[#efe6d6]/20 p-3">Earth → Moon</td>
                  <td className="border border-[#efe6d6]/20 p-3">900 m/s (spent on launch)</td>
                  <td className="border border-[#efe6d6]/20 p-3">0.00257 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">1 → 2</td>
                  <td className="border border-[#efe6d6]/20 p-3">Moon → Mars</td>
                  <td className="border border-[#efe6d6]/20 p-3">2,100 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">1.52 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">2 → 3</td>
                  <td className="border border-[#efe6d6]/20 p-3">Mars → Ceres</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">2.77 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">2</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">3 → 4</td>
                  <td className="border border-[#efe6d6]/20 p-3">Ceres → Jupiter Depot</td>
                  <td className="border border-[#efe6d6]/20 p-3">2,200 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">5.20 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr className="bg-[#100e0c]/80 font-bold text-[#e39b12]">
                  <td colSpan={2} className="border border-[#efe6d6]/20 p-3">Sum to Jupiter Depot</td>
                  <td colSpan={3} className="border border-[#efe6d6]/20 p-3">
                    6,700 m/s (2 tanks = 4,800 m/s CANNOT reach. 3 tanks = 7,200 m/s is required)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">4 → 5</td>
                  <td className="border border-[#efe6d6]/20 p-3">Jupiter Depot → Enceladus</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,600 m/s (after refuel)</td>
                  <td className="border border-[#efe6d6]/20 p-3">9.58 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">5 → 6</td>
                  <td className="border border-[#efe6d6]/20 p-3">Enceladus → Uranus</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">19.2 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">6 → 7</td>
                  <td className="border border-[#efe6d6]/20 p-3">Uranus → Neptune</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,400 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">30.1 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">7 → 8</td>
                  <td className="border border-[#efe6d6]/20 p-3">Neptune → Pluto</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,100 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">39.5 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">8 → 9</td>
                  <td className="border border-[#efe6d6]/20 p-3">Pluto → Heliopause</td>
                  <td className="border border-[#efe6d6]/20 p-3">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-3">122 AU</td>
                  <td className="border border-[#efe6d6]/20 p-3">2</td>
                </tr>
                <tr className="bg-[#100e0c]/80 font-bold text-[#e39b12]">
                  <td colSpan={2} className="border border-[#efe6d6]/20 p-3">Sum after Jupiter Depot</td>
                  <td colSpan={3} className="border border-[#efe6d6]/20 p-3">
                    7,100 m/s (Refueled 3 tanks = 7,200 m/s carries ship to Heliopause)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-3">9 → 10</td>
                  <td className="border border-[#efe6d6]/20 p-3">Heliopause → Harbor & Return</td>
                  <td className="border border-[#efe6d6]/20 p-3">0 m/s (Interstellar coast simulation)</td>
                  <td className="border border-[#efe6d6]/20 p-3">101.5 light-years</td>
                  <td className="border border-[#efe6d6]/20 p-3">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Certifying Loadout */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-4 font-mono text-xs md:text-sm shadow-md">
          <h2 className="font-serif text-2xl font-bold text-[#e39b12]">
            The Certifying Loadout
          </h2>
          <p className="text-sm text-[#efe6d6]/80 font-sans leading-relaxed">
            The canonical stack produced by the Auto-Build function in the hangar:
          </p>
          <div className="p-4 bg-[#100e0c] border border-[#5bc0be]/40 rounded-lg space-y-2 leading-relaxed">
            <div>• Launcher: <span className="font-bold text-[#efe6d6]">Keel</span> (cost 36, mass cap 560 kg)</div>
            <div>• Core: Command Module (12c, 90kg, 20W), Chemical Engine (10c, 60kg, 5W), High-Gain Antenna (8c, 25kg, 15W)</div>
            <div>• Propellant: 3 Tanks (18c, 120kg, 7,200 m/s flat delta-v)</div>
            <div>• Power: Radioisotope Unit (RTG) (22c, 50kg, 100 W flat)</div>
            <div>• Science: Mass Spectrometer (14c, 35kg, 20W) + Sample Drill (12c, 40kg, 25W)</div>
            <div className="pt-2.5 border-t border-[#efe6d6]/15 text-[#5bc0be] font-bold text-sm">
              Total Mass: 420 / 560 kg | Total Cost: 132 / 140 | Draw at Earth: 85 W | Power at Uranus: 100 W vs 55 W Alive Bus.
            </div>
            <div className="text-xs text-[#efe6d6]/70 italic leading-relaxed">
              Note: If an imager (3c, 8kg, 5W) is bolted on, total draw at Uranus exceeds 100 W and the imager breaker must open.
            </div>
          </div>
        </section>

        {/* Challenge Resources & Systems Engineering Methodology */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-5 shadow-md font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#efe6d6]/10 pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#e39b12]">
              Challenge Resources & Systems Engineering Architecture
            </h2>
            <span className="font-mono text-xs text-[#e39b12] bg-[#e39b12]/10 px-2.5 py-1 rounded border border-[#e39b12]/30 font-bold">
              NASA Technical Standards
            </span>
          </div>

          <p className="text-sm text-[#efe6d6]/85 leading-relaxed">
            In direct alignment with the official Resources for the 2026 NASA Space Apps Challenge <em>“Space Mission Design Game”</em>, Tenth Light translates professional aerospace systems engineering frameworks into an interactive educational simulation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm font-mono">
            {/* Resource 1: Systems Engineering Segments */}
            <div className="p-4 bg-[#100e0c] border border-[#5bc0be]/30 rounded-lg space-y-2">
              <span className="text-[#5bc0be] font-bold text-base block font-serif">
                1. Four Mission Segments (NASA Systems Engineering)
              </span>
              <p className="text-xs text-[#efe6d6]/80 font-sans leading-relaxed">
                Derived from NASA’s <em>Design and Develop Science Missions</em>:
              </p>
              <ul className="text-xs text-[#efe6d6]/90 space-y-1">
                <li>• <strong>Launch Segment:</strong> Kite vs Keel launcher selection, structural mass caps (400 vs 560 kg), and launch services cost.</li>
                <li>• <strong>Space Segment:</strong> Spacecraft bus, propellant tanks, RTG nuclear power, and science instruments.</li>
                <li>• <strong>Ground Segment:</strong> JPL Horizons lunar ephemeris lock and light-lag command buffering at Neptune.</li>
                <li>• <strong>User Segment:</strong> Scientific certification review on Earth based on Water & Soil return proof.</li>
              </ul>
            </div>

            {/* Resource 2: Concept Maturity Levels */}
            <div className="p-4 bg-[#100e0c] border border-[#e39b12]/30 rounded-lg space-y-2">
              <span className="text-[#e39b12] font-bold text-base block font-serif">
                2. Concept Maturity Levels (CMLs 1–4, NASA JPL)
              </span>
              <p className="text-xs text-[#efe6d6]/80 font-sans leading-relaxed">
                Applies NASA JPL’s pre-formulation maturity framework:
              </p>
              <ul className="text-xs text-[#efe6d6]/90 space-y-1">
                <li>• <strong>CML 1 (Concept):</strong> Initial objective to sample TOI-700 e.</li>
                <li>• <strong>CML 2 (Feasibility):</strong> Mass, budget, and delta-v trade space.</li>
                <li>• <strong>CML 3 (Trade Studies):</strong> RTG vs Solar inverse-square falloff and instrument power balancing.</li>
                <li>• <strong>CML 4 (Point Design):</strong> 420 kg / 132 Credit certifying stack verified in the Engineer’s Report.</li>
              </ul>
            </div>

            {/* Resource 3: GMAT & Patched-Conic Trajectories */}
            <div className="p-4 bg-[#100e0c] border border-[#e39b12]/30 rounded-lg space-y-2">
              <span className="text-[#e39b12] font-bold text-base block font-serif">
                3. GMAT & Astrodynamics Modeling
              </span>
              <p className="text-xs text-[#efe6d6]/80 font-sans leading-relaxed">
                Grounded in the principles of NASA’s <em>General Mission Analysis Tool (GMAT)</em>. While enterprise mission design utilizes numerical integration, Tenth Light models transfers via an explicit patched-conic teaching table with strict delta-v accounting across 9 planetary legs.
              </p>
            </div>

            {/* Resource 4: Mission Design Lab */}
            <div className="p-4 bg-[#100e0c] border border-[#5bc0be]/30 rounded-lg space-y-2">
              <span className="text-[#5bc0be] font-bold text-base block font-serif">
                4. Mission Design Lab (NASA Goddard IDC)
              </span>
              <p className="text-xs text-[#efe6d6]/80 font-sans leading-relaxed">
                Mirrors Goddard’s rapid collaborative design methodology, evaluating concurrent disciplines: power generation, propulsion delta-v, thermal bus stability, avionics mass, and science instrumentation returns under tight constraints.
              </p>
            </div>
          </div>
        </section>

        {/* 2026 Space Apps Challenge Space Agency Partners */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#efe6d6]/10 pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#e39b12]">
              2026 Space Apps Space Agency Partners
            </h2>
            <span className="font-mono text-xs text-[#5bc0be] bg-[#5bc0be]/10 px-2.5 py-1 rounded border border-[#5bc0be]/30 font-bold">
              17 International Agencies
            </span>
          </div>
          <p className="text-sm font-sans text-[#efe6d6]/80 leading-relaxed">
            Many contributed to the scientific archives and resources found across the 2026 NASA Space Apps Challenge “Space Mission Design Game”. The official global agency partners for this year’s challenge are:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs md:text-sm font-mono">
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Angola National Space Programme Management Office (GGPEN)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Bahrain Space Agency (NSSA)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Brazilian Space Agency (AEB)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• CSA (Canadian Space Agency)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• ESA (European Space Agency)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• ISRO (Indian Space Research Organisation)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Italian Space Agency (ASI)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• JAXA (Japan Aerospace Exploration Agency)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• KASA (Korea AeroSpace Administration)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Mohammed Bin Rashid Space Center of the UAE (MBRSC)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• National Space Activities Commission of Argentina (CONAE)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Nigeria’s National Space Research & Development Agency (NASRDA)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Paraguayan Space Agency (AEP)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Senegalese Space Studies Agency (ASES)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Spanish Space Agency (AEE)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• Turkish Space Agency (TUA)</div>
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/15 rounded-lg">• UK Space Agency (UKSA)</div>
          </div>
        </section>

        {/* Development, Image Use & Endorsement Disclaimer */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-6 md:p-7 rounded-lg space-y-3.5 text-xs md:text-sm font-mono text-[#efe6d6]/85 shadow-md leading-relaxed">
          <h2 className="font-serif text-xl font-bold text-[#e39b12]">
            Engineering, Image Guidelines & Attribution Disclaimers
          </h2>
          <div>
            • <strong>NASA Media Guidelines Compliance:</strong> Photographs from NASA (Apollo 11, Cassini, New Horizons, Viking, Voyager) are displayed whole and unaltered with full attribution to NASA and respective mission teams (e.g. NASA/JPL-Caltech). In accordance with NASA Media Guidelines (<a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener noreferrer" className="text-[#e39b12] underline">nasa.gov/nasa-brand-center/images-and-media/</a>), educational and non-commercial usage is observed, with zero implied endorsement. No NASA insignia, agency logo, national flag, or mission patch is used as game assets.
          </div>
          <div>
            • <strong>Original Art & Procedural Audio:</strong> 100% original 16×16 pixel art portraits, custom SVG pixel tokens, procedural WebGL Three.js spacecraft meshes, and procedural Web Audio API synthesizers. Zero copyrighted game clips, meme audio, or Golden Record audio.
          </div>
          <div>
            • <strong>Code Generation & Authorship:</strong> Written from scratch in Next.js, React, and TypeScript.
          </div>
          <div>
            • <strong>Non-Endorsement Statement:</strong> Nothing in this simulation implies official NASA endorsement or the endorsement of any international partner space agency.
          </div>
        </section>
      </div>
    </main>
  );
}
