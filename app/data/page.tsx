import React from 'react';
import Link from 'next/link';

export default function DataPage() {
  return (
    <main className="min-h-screen bg-[#100e0c] text-[#efe6d6] p-4 md:p-8 font-sans selection:bg-[#e39b12] selection:text-[#100e0c]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header navigation */}
        <div className="flex justify-between items-center border-b border-[#efe6d6]/20 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#e39b12] tracking-wide">
              TENTH LIGHT • DATA & CITATIONS
            </h1>
            <p className="text-xs font-mono text-[#efe6d6]/60 mt-1">
              NASA Space Apps Challenge 2026: Space Mission Design Game
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-[#1a1714] hover:bg-[#e39b12] hover:text-[#100e0c] border border-[#e39b12] text-xs font-mono uppercase tracking-wider rounded transition-colors"
          >
            ← Return to Game
          </Link>
        </div>

        {/* The Honesty Line */}
        <section className="bg-[#1a1714] border-l-4 border-[#e39b12] p-4 rounded-r">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#e39b12] mb-1 font-bold">
            The Honesty Line
          </h2>
          <p className="font-serif text-base md:text-lg italic text-[#efe6d6]">
            “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
            The voyage past the heliopause is a mission simulation that uses the archive’s numbers.
            The aliens, the depot fight, and the droid are the story.”
          </p>
        </section>

        {/* Exoplanet Archive Snapshot */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#e39b12]">
            NASA Exoplanet Archive Composite Parameters
          </h2>
          <div className="text-xs font-mono text-[#efe6d6]/70">
            Archive Snapshot Date: 15 November 2026. “Equilibrium temperature is not weather.”
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* TOI-700 e (Harbor) */}
            <div className="p-3 bg-[#100e0c] border border-[#5bc0be]/40 rounded font-mono text-xs space-y-1">
              <div className="font-bold text-[#5bc0be] text-sm">TOI-700 e (Nicknamed Harbor)</div>
              <div>• Radius: 0.919 Earth radii</div>
              <div>• Mass: 0.718 Earth masses</div>
              <div>• Orbital Period: 27.81 days</div>
              <div>• Insolation Flux: 1.27 Earth insolation</div>
              <div>• Equilibrium Temperature: 272.9 K</div>
              <div>• Distance: 31.13 parsecs (~101.5 light years)</div>
              <div>• Discovery: 2023 by transit method</div>
              <div className="text-[11px] text-[#efe6d6]/60 italic pt-1">
                The target world of Tenth Light. In the optimistic habitable zone.
              </div>
            </div>

            {/* TOI-700 d (The Twin) */}
            <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/20 rounded font-mono text-xs space-y-1">
              <div className="font-bold text-[#efe6d6] text-sm">TOI-700 d (The Twin You Do Not Fly)</div>
              <div>• Radius: 1.145 Earth radii</div>
              <div>• Mass: 1.580 Earth masses</div>
              <div>• Orbital Period: 37.42 days</div>
              <div>• Insolation Flux: 0.85 Earth insolation</div>
              <div>• Equilibrium Temperature: 268.8 K</div>
              <div>• Distance: 31.13 parsecs (~101.5 light years)</div>
              <div>• Discovery: 2020 by transit method</div>
              <div className="text-[11px] text-[#efe6d6]/60 italic pt-1">
                The outer temperate twin in the conservative habitable zone.
              </div>
            </div>
          </div>
        </section>

        {/* Teaching Numbers & Delta-v Budget */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#e39b12]">
            Teaching Numbers & Delta-v Budgets
          </h2>

          <div className="p-3 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-xs font-mono space-y-1">
            <div className="text-[#e39b12] font-bold">
              Budget: Teaching budget of 140 credits. (This is NOT an official NASA price.)
            </div>
            <div>
              Delta-v Table: Labeled as a patched-conic teaching table, not a GMAT numerical integration run.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse border border-[#efe6d6]/20">
              <thead className="bg-[#100e0c] text-[#e39b12]">
                <tr>
                  <th className="border border-[#efe6d6]/20 p-2">Leg</th>
                  <th className="border border-[#efe6d6]/20 p-2">From → To</th>
                  <th className="border border-[#efe6d6]/20 p-2">Delta-v (m/s)</th>
                  <th className="border border-[#efe6d6]/20 p-2">Distance (AU)</th>
                  <th className="border border-[#efe6d6]/20 p-2">Dodges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">0 → 1</td>
                  <td className="border border-[#efe6d6]/20 p-2">Earth → Moon</td>
                  <td className="border border-[#efe6d6]/20 p-2">900 m/s (spent on launch)</td>
                  <td className="border border-[#efe6d6]/20 p-2">0.00257 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">1 → 2</td>
                  <td className="border border-[#efe6d6]/20 p-2">Moon → Mars</td>
                  <td className="border border-[#efe6d6]/20 p-2">2,100 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">1.52 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">2 → 3</td>
                  <td className="border border-[#efe6d6]/20 p-2">Mars → Ceres</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">2.77 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">2</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">3 → 4</td>
                  <td className="border border-[#efe6d6]/20 p-2">Ceres → Jupiter Depot</td>
                  <td className="border border-[#efe6d6]/20 p-2">2,200 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">5.20 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr className="bg-[#100e0c]/60 font-bold text-[#e39b12]">
                  <td colSpan={2} className="border border-[#efe6d6]/20 p-2">Sum to Jupiter Depot</td>
                  <td colSpan={3} className="border border-[#efe6d6]/20 p-2">
                    6,700 m/s (2 tanks = 4,800 m/s CANNOT reach. 3 tanks = 7,200 m/s is required)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">4 → 5</td>
                  <td className="border border-[#efe6d6]/20 p-2">Jupiter Depot → Enceladus</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,600 m/s (after refuel)</td>
                  <td className="border border-[#efe6d6]/20 p-2">9.58 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">5 → 6</td>
                  <td className="border border-[#efe6d6]/20 p-2">Enceladus → Uranus</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">19.2 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">6 → 7</td>
                  <td className="border border-[#efe6d6]/20 p-2">Uranus → Neptune</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,400 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">30.1 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">7 → 8</td>
                  <td className="border border-[#efe6d6]/20 p-2">Neptune → Pluto</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,100 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">39.5 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">8 → 9</td>
                  <td className="border border-[#efe6d6]/20 p-2">Pluto → Heliopause</td>
                  <td className="border border-[#efe6d6]/20 p-2">1,500 m/s</td>
                  <td className="border border-[#efe6d6]/20 p-2">122 AU</td>
                  <td className="border border-[#efe6d6]/20 p-2">2</td>
                </tr>
                <tr className="bg-[#100e0c]/60 font-bold text-[#e39b12]">
                  <td colSpan={2} className="border border-[#efe6d6]/20 p-2">Sum after Jupiter Depot</td>
                  <td colSpan={3} className="border border-[#efe6d6]/20 p-2">
                    7,100 m/s (Refueled 3 tanks = 7,200 m/s carries ship to Heliopause)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#efe6d6]/20 p-2">9 → 10</td>
                  <td className="border border-[#efe6d6]/20 p-2">Heliopause → Harbor & Return</td>
                  <td className="border border-[#efe6d6]/20 p-2">0 m/s (Interstellar coast simulation)</td>
                  <td className="border border-[#efe6d6]/20 p-2">101.5 light-years</td>
                  <td className="border border-[#efe6d6]/20 p-2">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Certifying Loadout */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded space-y-3 font-mono text-xs">
          <h2 className="font-serif text-xl font-bold text-[#e39b12]">
            The Certifying Loadout
          </h2>
          <p className="text-xs text-[#efe6d6]/80 font-sans">
            The canonical stack produced by the Auto-Build function in the hangar:
          </p>
          <div className="p-3 bg-[#100e0c] border border-[#5bc0be]/30 rounded space-y-1">
            <div>• Launcher: <span className="font-bold text-[#efe6d6]">Keel</span> (cost 36, mass cap 560 kg)</div>
            <div>• Core: Command Module (12c, 90kg, 20W), Chemical Engine (10c, 60kg, 5W), High-Gain Antenna (8c, 25kg, 15W)</div>
            <div>• Propellant: 3 Tanks (18c, 120kg, 7,200 m/s flat delta-v)</div>
            <div>• Power: Radioisotope Unit (RTG) (22c, 50kg, 100 W flat)</div>
            <div>• Science: Mass Spectrometer (14c, 35kg, 20W) + Sample Drill (12c, 40kg, 25W)</div>
            <div className="pt-2 border-t border-[#efe6d6]/10 text-[#5bc0be] font-bold">
              Total Mass: 420 / 560 kg | Total Cost: 132 / 140 | Draw at Earth: 85 W | Power at Uranus: 100 W vs 55 W Alive Bus.
            </div>
            <div className="text-[11px] text-[#efe6d6]/70 italic">
              Note: If an imager (3c, 8kg, 5W) is bolted on, total draw at Uranus exceeds 100 W and the imager breaker must open.
            </div>
          </div>
        </section>

        {/* 2026 Space Agency Partners */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#e39b12]">
            Named 2026 Space Agency Partners
          </h2>
          <p className="text-xs font-sans text-[#efe6d6]/70">
            NASA Space Apps collaborates with international space agency partners around the world.
            (This game does not claim live data feeds from all listed partner agencies; feeds utilized are local local-server snapshots and specific NASA endpoints.)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• NASA (United States)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• ESA (Europe)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• JAXA (Japan)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• CSA (Canada)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• CNES (France)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• DLR (Germany)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• ASI (Italy)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• UKSA (United Kingdom)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• ISRO (India)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• AEB (Brazil)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• CONAE (Argentina)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• ASA (Australia)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• SANSA (South Africa)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• GISTDA (Thailand)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• TÜBİTAK (Türkiye)</div>
            <div className="p-2 bg-[#100e0c] border border-[#efe6d6]/10 rounded">• UAESA (United Arab Emirates)</div>
          </div>
        </section>

        {/* Development & Endorsement Disclaimer */}
        <section className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded space-y-2 text-xs font-mono text-[#efe6d6]/80">
          <h2 className="font-serif text-lg font-bold text-[#e39b12]">
            Engineering & Attribution Disclaimers
          </h2>
          <div>
            • <strong>Code generation:</strong> Cursor with Grok wrote code and there are no AI images.
          </div>
          <div>
            • <strong>Art & Sound:</strong> Original pixel portraits, original procedural WebGL 3D meshes, and procedural Web Audio API synthesizers. Unaltered NASA photographs are displayed in designated windows with direct attribution. No NASA logo, flag, mission patch, or copyrighted game audio is utilized.
          </div>
          <div>
            • <strong>Disclaimer:</strong> Nothing implies NASA endorsement or the endorsement of any partner space agency.
          </div>
        </section>
      </div>
    </main>
  );
}
