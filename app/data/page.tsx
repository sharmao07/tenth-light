import React from 'react';
import Link from 'next/link';

export default function DataPage() {
  return (
    <main className="min-h-screen bg-void text-paper p-8 md:p-12 font-sans selection:bg-signal selection:text-void">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-paper/20 pb-6">
          <div>
            <span className="label text-signal">NASA Space Apps Challenge 2026</span>
            <h1 className="font-serif text-3xl md:text-5xl text-paper tracking-tight mt-1">
              Data &amp; Mission Citations
            </h1>
            <p className="text-sm text-paper-muted mt-1 leading-relaxed">
              Space Mission Design Game &middot; Technical reference and patched-conic astrodynamics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/presentation"
              className="px-5 py-2.5 bg-surface-raised hover:bg-paper/20 border border-paper text-xs uppercase font-mono tracking-wider font-bold transition-colors text-paper"
            >
              7-Slide Demo Deck
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-signal hover:bg-signal-hover text-void text-xs uppercase font-mono tracking-wider font-bold transition-colors"
            >
              &larr; Return to Game
            </Link>
          </div>
        </div>

        {/* The Honesty Line */}
        <section aria-labelledby="honesty-heading" className="bg-surface-raised border-l-4 border-signal p-8">
          <h2 id="honesty-heading" className="label text-signal mb-2">
            The Honesty Line
          </h2>
          <blockquote className="font-serif text-lg md:text-xl italic text-paper leading-relaxed m-0">
            &ldquo;Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
            The voyage past the heliopause is a mission simulation that uses the archive&rsquo;s numbers.
            The aliens, the depot fight, and the droid are the story.&rdquo;
          </blockquote>
        </section>

        {/* Exoplanet Archive Snapshot */}
        <section aria-labelledby="exoplanet-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-6">
          <h2 id="exoplanet-heading" className="font-serif text-2xl md:text-3xl text-paper">
            NASA Exoplanet Archive Composite Parameters
          </h2>
          <div className="text-sm text-paper-muted leading-relaxed">
            Archive Snapshot Date: <span className="font-mono tabular-nums font-bold text-paper">15 November 2026</span>. &ldquo;Equilibrium temperature is not weather.&rdquo;
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* TOI-700 e (Harbor) */}
            <div className="p-6 bg-void border border-paper/40 text-xs md:text-sm space-y-2.5 leading-relaxed">
              <h3 className="font-bold text-paper text-base md:text-lg">TOI-700 e (Nicknamed Harbor)</h3>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Radius: <span className="text-paper">0.919 Earth radii (0.919 R&oplus;)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Mass: <span className="text-paper">0.718 Earth masses (0.718 M&oplus;)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Orbital Period: <span className="text-paper">27.81 days</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Insolation Flux: <span className="text-paper">1.27 Earth insolation</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Equilibrium Temperature: <span className="text-paper">272.9 K</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Distance: <span className="text-paper">31.13 parsecs (~101.5 light years)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Discovery: <span className="text-paper">2023 by transit photometry</span></div>
              <div className="text-xs text-paper-muted italic pt-1 leading-relaxed">
                The target world of Tenth Light. Located in the optimistic habitable zone.
              </div>
            </div>

            {/* TOI-700 d (The Twin) */}
            <div className="p-6 bg-void border border-paper/20 text-xs md:text-sm space-y-2.5 leading-relaxed">
              <h3 className="font-bold text-paper text-base md:text-lg">TOI-700 d (The Twin You Do Not Fly)</h3>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Radius: <span className="text-paper">1.145 Earth radii (1.145 R&oplus;)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Mass: <span className="text-paper">1.580 Earth masses (1.580 M&oplus;)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Orbital Period: <span className="text-paper">37.42 days</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Insolation Flux: <span className="text-paper">0.85 Earth insolation</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Equilibrium Temperature: <span className="text-paper">268.8 K</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Distance: <span className="text-paper">31.13 parsecs (~101.5 light years)</span></div>
              <div className="tabular-nums font-mono text-paper-muted">&bull; Discovery: <span className="text-paper">2020 by transit photometry</span></div>
              <div className="text-xs text-paper-muted italic pt-1 leading-relaxed">
                The outer temperate twin in the conservative habitable zone.
              </div>
            </div>
          </div>
        </section>

        {/* Teaching Numbers & Delta-v Budget */}
        <section aria-labelledby="budget-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-6">
          <h2 id="budget-heading" className="font-serif text-2xl md:text-3xl text-paper">
            Teaching Numbers &amp; Patched-Conic Delta-v Budgets
          </h2>

          <div className="p-5 bg-void border border-paper/20 text-xs md:text-sm space-y-2 leading-relaxed">
            <div className="text-signal font-mono font-bold text-sm">
              Teaching Budget: 140 credits. (Educational game economy, not an official NASA launch cost.)
            </div>
            <div className="text-paper-muted">
              Delta-v Calculation: Labeled as a patched-conic educational table, not a GMAT numerical integration run.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left border-collapse border border-paper/20 tabular-nums">
              <thead className="bg-void text-signal font-mono uppercase text-xs">
                <tr>
                  <th className="border border-paper/20 p-4">Leg</th>
                  <th className="border border-paper/20 p-4">From &rarr; To</th>
                  <th className="border border-paper/20 p-4">Delta-v (m/s)</th>
                  <th className="border border-paper/20 p-4">Distance</th>
                  <th className="border border-paper/20 p-4">Dodges</th>
                </tr>
              </thead>
              <tbody className="leading-relaxed font-mono">
                <tr>
                  <td className="border border-paper/20 p-3.5">0 &rarr; 1</td>
                  <td className="border border-paper/20 p-3.5">Earth &rarr; Moon</td>
                  <td className="border border-paper/20 p-3.5">900 m/s (spent on launch)</td>
                  <td className="border border-paper/20 p-3.5">0.00257 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">1 &rarr; 2</td>
                  <td className="border border-paper/20 p-3.5">Moon &rarr; Mars</td>
                  <td className="border border-paper/20 p-3.5">2,100 m/s</td>
                  <td className="border border-paper/20 p-3.5">1.52 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">2 &rarr; 3</td>
                  <td className="border border-paper/20 p-3.5">Mars &rarr; Ceres</td>
                  <td className="border border-paper/20 p-3.5">1,500 m/s</td>
                  <td className="border border-paper/20 p-3.5">2.77 AU</td>
                  <td className="border border-paper/20 p-3.5">2</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">3 &rarr; 4</td>
                  <td className="border border-paper/20 p-3.5">Ceres &rarr; Jupiter Depot</td>
                  <td className="border border-paper/20 p-3.5">2,200 m/s</td>
                  <td className="border border-paper/20 p-3.5">5.20 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr className="bg-void font-bold text-signal">
                  <td colSpan={2} className="border border-paper/20 p-4">Sum to Jupiter Depot</td>
                  <td colSpan={3} className="border border-paper/20 p-4">
                    6,700 m/s (2 tanks = 4,800 m/s CANNOT reach. 3 tanks = 7,200 m/s required)
                  </td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">4 &rarr; 5</td>
                  <td className="border border-paper/20 p-3.5">Jupiter Depot &rarr; Enceladus</td>
                  <td className="border border-paper/20 p-3.5">1,600 m/s (after refuel)</td>
                  <td className="border border-paper/20 p-3.5">9.58 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">5 &rarr; 6</td>
                  <td className="border border-paper/20 p-3.5">Enceladus &rarr; Uranus</td>
                  <td className="border border-paper/20 p-3.5">1,500 m/s</td>
                  <td className="border border-paper/20 p-3.5">19.2 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">6 &rarr; 7</td>
                  <td className="border border-paper/20 p-3.5">Uranus &rarr; Neptune</td>
                  <td className="border border-paper/20 p-3.5">1,400 m/s</td>
                  <td className="border border-paper/20 p-3.5">30.1 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">7 &rarr; 8</td>
                  <td className="border border-paper/20 p-3.5">Neptune &rarr; Pluto</td>
                  <td className="border border-paper/20 p-3.5">1,100 m/s</td>
                  <td className="border border-paper/20 p-3.5">39.5 AU</td>
                  <td className="border border-paper/20 p-3.5">1</td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">8 &rarr; 9</td>
                  <td className="border border-paper/20 p-3.5">Pluto &rarr; Heliopause</td>
                  <td className="border border-paper/20 p-3.5">1,500 m/s</td>
                  <td className="border border-paper/20 p-3.5">122 AU</td>
                  <td className="border border-paper/20 p-3.5">2</td>
                </tr>
                <tr className="bg-void font-bold text-signal">
                  <td colSpan={2} className="border border-paper/20 p-4">Sum after Jupiter Depot</td>
                  <td colSpan={3} className="border border-paper/20 p-4">
                    7,100 m/s (Refueled 3 tanks = 7,200 m/s carries ship to Heliopause)
                  </td>
                </tr>
                <tr>
                  <td className="border border-paper/20 p-3.5">9 &rarr; 10</td>
                  <td className="border border-paper/20 p-3.5">Heliopause &rarr; Harbor &amp; Return</td>
                  <td className="border border-paper/20 p-3.5">0 m/s (Interstellar coast simulation)</td>
                  <td className="border border-paper/20 p-3.5">101.5 light-years</td>
                  <td className="border border-paper/20 p-3.5">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Certifying Loadout */}
        <section aria-labelledby="loadout-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-6 text-xs md:text-sm">
          <h2 id="loadout-heading" className="font-serif text-2xl md:text-3xl text-paper">
            The Certifying Loadout
          </h2>
          <p className="text-sm text-paper-muted font-sans leading-relaxed">
            The canonical stack produced by the Auto-Build function in the VAB Hangar:
          </p>
          <div className="p-6 bg-void border border-paper/30 space-y-3 leading-relaxed font-mono tabular-nums">
            <div>&bull; Launcher: <span className="font-bold text-paper">Keel</span> (cost 36 credits, mass cap 560 kg)</div>
            <div>&bull; Core: Command Module (12c, 90kg, 20W), Chemical Engine (10c, 60kg, 5W), High-Gain Antenna (8c, 25kg, 15W)</div>
            <div>&bull; Propellant: 3 Tanks (18c, 120kg, 7,200 m/s flat delta-v)</div>
            <div>&bull; Power: Radioisotope Unit (RTG) (22c, 50kg, 100 W flat)</div>
            <div>&bull; Science: Mass Spectrometer (14c, 35kg, 20W) + Sample Drill (12c, 40kg, 25W)</div>
            <div className="pt-3 border-t border-paper/15 text-paper font-bold text-sm">
              Total Mass: 420 / 560 kg | Total Cost: 132 / 140 | Draw at Earth: 85 W | Power at Uranus: 100 W vs 55 W Alive Bus.
            </div>
            <div className="text-xs text-paper-muted italic leading-relaxed">
              Note: If an imager (3c, 8kg, 5W) is bolted on, total draw at Uranus exceeds 100 W and the imager breaker must open.
            </div>
          </div>
        </section>

        {/* Challenge Resources & Systems Engineering Methodology */}
        <section aria-labelledby="standards-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-paper/10 pb-4">
            <h2 id="standards-heading" className="font-serif text-2xl md:text-3xl text-paper">
              Challenge Resources &amp; Systems Engineering Architecture
            </h2>
            <span className="label text-signal bg-signal/10 px-3 py-1 border border-signal/30 font-bold">
              NASA Technical Standards
            </span>
          </div>

          <p className="text-sm text-paper-muted leading-relaxed">
            In direct alignment with the official Resources for the 2026 NASA Space Apps Challenge <em>&ldquo;Space Mission Design Game&rdquo;</em>, Tenth Light translates professional aerospace systems engineering frameworks into an interactive educational simulation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
            <div className="p-6 bg-void border border-paper/20 space-y-3">
              <h3 className="text-paper text-base block font-serif">
                1. Four Mission Segments (NASA Systems Engineering)
              </h3>
              <p className="text-xs text-paper-muted font-sans leading-relaxed">
                Derived from NASA’s <em>Design and Develop Science Missions</em>:
              </p>
              <ul className="text-xs text-paper space-y-1.5">
                <li>&bull; <strong>Launch Segment:</strong> Kite vs Keel launcher selection, structural mass caps (400 vs 560 kg), and launch services cost.</li>
                <li>&bull; <strong>Space Segment:</strong> Spacecraft bus, propellant tanks, RTG nuclear power, and science instruments.</li>
                <li>&bull; <strong>Ground Segment:</strong> JPL Horizons lunar ephemeris lock and light-lag command buffering at Neptune.</li>
                <li>&bull; <strong>User Segment:</strong> Scientific certification review on Earth based on Water &amp; Soil return proof.</li>
              </ul>
            </div>

            <div className="p-6 bg-void border border-paper/20 space-y-3">
              <h3 className="text-paper text-base block font-serif">
                2. Concept Maturity Levels (CMLs 1–4, NASA JPL)
              </h3>
              <p className="text-xs text-paper-muted font-sans leading-relaxed">
                Applies NASA JPL’s pre-formulation maturity framework:
              </p>
              <ul className="text-xs text-paper space-y-1.5">
                <li>&bull; <strong>CML 1 (Concept):</strong> Initial objective to sample TOI-700 e.</li>
                <li>&bull; <strong>CML 2 (Feasibility):</strong> Mass, budget, and delta-v trade space.</li>
                <li>&bull; <strong>CML 3 (Trade Studies):</strong> RTG vs Solar inverse-square falloff and instrument power balancing.</li>
                <li>&bull; <strong>CML 4 (Point Design):</strong> 420 kg / 132 Credit certifying stack verified in the Engineer’s Report.</li>
              </ul>
            </div>

            <div className="p-6 bg-void border border-paper/20 space-y-3">
              <h3 className="text-paper text-base block font-serif">
                3. GMAT &amp; Astrodynamics Modeling
              </h3>
              <p className="text-xs text-paper-muted font-sans leading-relaxed">
                Grounded in the principles of NASA’s <em>General Mission Analysis Tool (GMAT)</em>. While enterprise mission design utilizes numerical integration, Tenth Light models transfers via an explicit patched-conic teaching table with strict delta-v accounting across 9 planetary legs.
              </p>
            </div>

            <div className="p-6 bg-void border border-paper/20 space-y-3">
              <h3 className="text-paper text-base block font-serif">
                4. Mission Design Lab (NASA Goddard IDC)
              </h3>
              <p className="text-xs text-paper-muted font-sans leading-relaxed">
                Mirrors Goddard’s rapid collaborative design methodology, evaluating concurrent disciplines: power generation, propulsion delta-v, thermal bus stability, avionics mass, and science instrumentation returns under tight constraints.
              </p>
            </div>
          </div>
        </section>

        {/* 2026 Space Apps Challenge Space Agency Partners */}
        <section aria-labelledby="partners-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-paper/10 pb-4">
            <h2 id="partners-heading" className="font-serif text-2xl md:text-3xl text-paper">
              2026 Space Apps Space Agency Partners
            </h2>
            <span className="label text-paper bg-paper/10 px-3 py-1 border border-paper/30 font-bold">
              17 International Agencies
            </span>
          </div>
          <p className="text-sm font-sans text-paper-muted leading-relaxed">
            Many contributed to the scientific archives and resources found across the 2026 NASA Space Apps Challenge &ldquo;Space Mission Design Game&rdquo;. The official global agency partners for this year’s challenge are:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="p-4 bg-void border border-paper/15">&bull; Angola Space Programme (GGPEN)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Bahrain Space Agency (NSSA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Brazilian Space Agency (AEB)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Canadian Space Agency (CSA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; European Space Agency (ESA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Indian Space Research Organisation (ISRO)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Italian Space Agency (ASI)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Japan Aerospace Exploration Agency (JAXA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Korea AeroSpace Administration (KASA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; UAE Space Center (MBRSC)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Argentina Space Commission (CONAE)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Nigeria Space Agency (NASRDA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Paraguayan Space Agency (AEP)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Senegalese Space Studies Agency (ASES)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Spanish Space Agency (AEE)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; Turkish Space Agency (TUA)</div>
            <div className="p-4 bg-void border border-paper/15">&bull; UK Space Agency (UKSA)</div>
          </div>
        </section>

        {/* Development, Image Use & Endorsement Disclaimer */}
        <section aria-labelledby="disclaimer-heading" className="bg-surface-raised border border-paper/20 p-8 space-y-4 text-xs md:text-sm text-paper-muted leading-relaxed">
          <h2 id="disclaimer-heading" className="font-serif text-xl md:text-2xl text-paper">
            Engineering, Image Guidelines &amp; Attribution Disclaimers
          </h2>
          <div>
            &bull; <strong>NASA Media Guidelines Compliance:</strong> Photographs from NASA (Apollo 11, Cassini, New Horizons, Viking, Voyager) are displayed whole and unaltered with full attribution to NASA and respective mission teams (e.g. NASA/JPL-Caltech). In accordance with NASA Media Guidelines (<a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener noreferrer" className="text-signal underline hover:text-signal-hover">nasa.gov/nasa-brand-center/images-and-media/</a>), educational and non-commercial usage is observed, with zero implied endorsement. No NASA insignia, agency logo, national flag, or mission patch is used as game assets.
          </div>
          <div>
            &bull; <strong>Original Art &amp; Procedural Audio:</strong> 100% original 16&times;16 pixel art portraits, custom SVG pixel tokens, procedural WebGL Three.js spacecraft meshes, and procedural Web Audio API synthesizers. Zero copyrighted game clips or meme audio.
          </div>
          <div>
            &bull; <strong>Code Generation &amp; Authorship:</strong> Written in Next.js, React, and TypeScript.
          </div>
          <div>
            &bull; <strong>Non-Endorsement Statement:</strong> Nothing in this simulation implies official NASA endorsement or the endorsement of any international partner space agency.
          </div>
        </section>
      </div>
    </main>
  );
}
