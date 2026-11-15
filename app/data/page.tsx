import React from 'react';
import Link from 'next/link';
import { NASA_IMAGE_PLATES, EXOPLANET_SNAPSHOT } from '@/lib/nasaSnapshots';
import { CORE_PARTS, OPTIONAL_PARTS, LAUNCHERS } from '@/lib/gameTypes';

export default function DataPage() {
  const plates = Object.values(NASA_IMAGE_PLATES).sort((a, b) => a.stopIndex - b.stopIndex);
  const allParts = [...CORE_PARTS, ...OPTIONAL_PARTS];

  return (
    <main className="min-h-screen bg-void text-paper p-6 sm:p-10 md:p-16 font-sans selection:bg-signal selection:text-void">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header navigation & dossier masthead */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-paper/15 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-signal" aria-hidden="true" />
              <span className="label text-signal">NASA Space Apps Challenge 2026</span>
              <span className="text-paper/40 text-xs font-mono">/</span>
              <span className="label text-paper-muted">ARCHIVAL REFERENCE DOSSIER</span>
            </div>
            <h1 className="font-serif font-extralight text-4xl sm:text-5xl md:text-6xl text-paper tracking-tight">
              Data Sources <span className="font-extrabold text-paper">&amp; Citations</span>
            </h1>
            <p className="text-sm font-serif italic text-paper-muted mt-2 max-w-2xl leading-relaxed">
              Official NASA APIs, archival datasets, patched-conic astrodynamics, and mission photographic plates utilized throughout Tenth Light.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/presentation"
              className="btn-quiet !text-xs !py-2.5 !px-4 font-mono uppercase"
            >
              Demo Deck (7 slides)
            </Link>
            <Link
              href="/"
              className="btn !text-xs !py-2.5 !px-5"
            >
              &larr; Return to Game
            </Link>
          </div>
        </div>

        {/* 1. The Honesty Statement (Prominent Dossier Callout) */}
        <section aria-labelledby="honesty-heading" className="border-l-2 border-signal pl-6 md:pl-8 py-2 space-y-4 bg-void">
          <span id="honesty-heading" className="label text-signal">
            The Honesty Line &middot; Mission Disclosure
          </span>
          <blockquote className="font-serif text-xl sm:text-2xl italic text-paper leading-relaxed m-0 max-w-4xl">
            &ldquo;Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
            The voyage past the heliopause is a mission simulation that uses the archive&rsquo;s numbers.
            The aliens, the depot fight, and the droid are the story.&rdquo;
          </blockquote>
          <p className="font-mono text-xs text-paper-muted">
            All orbital distances, planetary parameters, ephemeris data, and photographic reconnaissance plates are sourced directly from NASA and JPL archives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border border-paper/15 p-4 bg-surface space-y-1.5 font-mono text-xs">
              <span className="label text-signal block">
                Speculative Interstellar Propulsion Disclosure
              </span>
              <p className="text-paper-muted leading-relaxed text-[11px]">
                Stops 1 through 9 depict active and historical Solar System exploration governed by demonstrated spaceflight engineering. Chemical and electric propulsion, as well as solar-sail technology, have been demonstrated in space (e.g. Dawn, Deep Space 1, ACS3). However, no demonstrated propulsion system can accelerate a practical spacecraft to 0.1c (~30,000 km/s). The proposed interstellar transit to TOI-700 e (101.5 light-years out) is therefore a speculative educational scenario, entailing an approximate 1,015-year journey in Earth&rsquo;s reference frame at 0.1c.
              </p>
            </div>

            <div className="border border-paper/15 p-4 bg-surface space-y-1.5 font-mono text-xs">
              <span className="label text-signal block">
                TOI-700 e Surface Environment Disclosure
              </span>
              <p className="text-paper-muted leading-relaxed text-[11px]">
                While NASA TESS transit photometry empirically confirms TOI-700 e&rsquo;s 27.8-day orbit, 0.919 R&oplus; radius, and optimistic habitable zone placement, current astronomical instrumentation has not confirmed whether the planet possesses an atmosphere, surface liquid oceans, or regolith soil. In Act 10, the in-situ collection nodes represent candidate biosignature simulants within an educational mission simulation, not confirmed empirical conditions.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Official NASA APIs & Datasets Directory */}
        <section aria-labelledby="apis-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="apis-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              NASA APIs <span className="font-extrabold text-paper">&amp; Scientific Endpoints</span>
            </h2>
            <span className="label text-paper-muted font-mono">LIVE + SNAPSHOT ARCHIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Exoplanet Archive */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Planetary Science &middot; Target World</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA Exoplanet Archive</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                Table: <code className="text-paper">pscomppars</code> (Composite Parameters). TAP Sync API querying TOI-700 e radius (0.919 R&oplus;), mass (0.718 M&oplus;), insolation (1.27), and equilibrium temperature (272.9 K).
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://exoplanetarchive.ipac.caltech.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  exoplanetarchive.ipac.caltech.edu &rarr;
                </a>
              </div>
            </div>

            {/* JPL Horizons */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Astrometry &middot; Lunar Alignment</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA JPL Horizons On-Line Ephemeris</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                REST API querying Earth&rsquo;s apparent azimuth and elevation via a rolling 24-hour observer table. Observer site is defined under JPL&rsquo;s Geodetic coordinate standard (East Longitude 0&deg;, Latitude -89&deg; South, Altitude 0 km on the lunar IAU reference ellipsoid, <code className="text-paper">coord@301</code>) targeting Earth (<code className="text-paper">399</code>). Used in Stop 1 antenna alignment.
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://ssd.jpl.nasa.gov/horizons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  ssd.jpl.nasa.gov/horizons &rarr;
                </a>
              </div>
            </div>

            {/* JPL Small-Body Database */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Asteroid Dynamics &middot; Live Verification Check</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA JPL Small-Body Database (SBDB)</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                Live verification check against <code className="text-paper">ssd-api.jpl.nasa.gov/sbdb.api</code> confirming endpoint connectivity. Serves curated NASA Dawn spacecraft comparative mission benchmark measurements for 1 Ceres (939.4 km diameter dwarf planet), 4 Vesta (525.4 km), and 2 Pallas (512.0 km). Used in Stop 3.
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  ssd.jpl.nasa.gov/tools/sbdb_lookup.html &rarr;
                </a>
              </div>
            </div>

            {/* NASA Images & Video Library */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Imagery &middot; Visual Reconnaissance</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA Images &amp; Video Library</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                Images API (<code className="text-paper">images-api.nasa.gov</code>) providing authentic public domain photographs from Apollo 11, Cassini, Dawn, Voyager 2, and New Horizons.
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://images.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  images.nasa.gov &rarr;
                </a>
              </div>
            </div>

            {/* NASA NeoWs */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Orbital Hazards &middot; Transit Dodge</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA NeoWs (Near Earth Object Web Service)</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                Daily close-approach asteroid telemetry for radar tracking and transit hazard modeling (including 99942 Apophis, 101955 Bennu, and 2024 YR4). Used in transit flight legs.
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://api.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  api.nasa.gov &rarr;
                </a>
              </div>
            </div>

            {/* NASA DSCOVR EPIC */}
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <span className="label text-signal">Earth Observation &middot; Origin &amp; Return</span>
              <h3 className="font-serif text-lg font-bold text-paper">NASA DSCOVR EPIC Camera</h3>
              <p className="font-mono text-xs text-paper-muted leading-relaxed">
                Direct endpoint (<code className="text-paper">epic.gsfc.nasa.gov/api/natural</code>) capturing 10-channel full-disc Earth portraits from the Sun-Earth L1 Lagrange point 1.5 million km away.
              </p>
              <div className="pt-2 border-t border-paper/10">
                <a
                  href="https://epic.gsfc.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-signal hover:underline"
                >
                  epic.gsfc.nasa.gov &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Authentic NASA Photographic Plates (Stops 00–10) */}
        <section aria-labelledby="plates-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="plates-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              Photographic Plates <span className="font-extrabold text-paper">&amp; Credits</span>
            </h2>
            <span className="label text-paper-muted font-mono">11 UNALTERED NASA ASSETS</span>
          </div>

          <p className="font-serif text-sm text-paper-muted leading-relaxed">
            In compliance with NASA Media Guidelines, all spaceflight photographs are displayed unaltered with original attribution, historical spacecraft credit, and direct archival asset links:
          </p>

          <div className="overflow-x-auto border border-paper/15">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead className="bg-void border-b border-paper/15 text-signal uppercase text-[11px]">
                <tr>
                  <th className="p-3.5 border-r border-paper/10">Plate</th>
                  <th className="p-3.5 border-r border-paper/10">Target / Location</th>
                  <th className="p-3.5 border-r border-paper/10">Spacecraft / Mission</th>
                  <th className="p-3.5 border-r border-paper/10">Caption</th>
                  <th className="p-3.5 border-r border-paper/10">Credit</th>
                  <th className="p-3.5">Asset Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/10 leading-relaxed tabular-nums">
                {plates.map((plate) => (
                  <tr key={plate.stopIndex} className="hover:bg-paper/[0.02] transition-colors">
                    <td className="p-3.5 border-r border-paper/10 font-bold text-signal">
                      PLATE 0{plate.stopIndex}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 font-bold text-paper">
                      {plate.locationName}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper-muted">
                      {plate.stopIndex === 1 && 'Apollo 11 (Surveyor)'}
                      {plate.stopIndex === 2 && 'Mars Global Surveyor'}
                      {plate.stopIndex === 3 && 'Dawn Spacecraft'}
                      {plate.stopIndex === 4 && 'Cassini-Huygens'}
                      {plate.stopIndex === 5 && 'Cassini-Huygens'}
                      {plate.stopIndex === 6 && 'Voyager 2 (1986)'}
                      {plate.stopIndex === 7 && 'Voyager 2 (1989)'}
                      {plate.stopIndex === 8 && 'New Horizons (2015)'}
                      {plate.stopIndex === 9 && 'Voyager 1 (2012)'}
                      {plate.stopIndex === 10 && 'Goddard Space Flight Center'}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper font-sans text-xs">
                      {plate.caption}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper-muted text-[11px]">
                      {plate.credit}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={plate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-signal underline hover:text-signal-hover text-[11px]"
                      >
                        Inspect asset &rarr;
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. NASA Exoplanet Archive Composite Parameters Comparison */}
        <section aria-labelledby="exoplanet-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="exoplanet-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              Exoplanet Science <span className="font-extrabold text-paper">&middot; TOI-700 e vs TOI-700 d</span>
            </h2>
            <span className="label text-paper-muted font-mono">15 NOVEMBER 2026 ARCHIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            {/* TOI-700 e */}
            <div className="border border-paper/15 p-6 space-y-4 bg-void">
              <div className="flex justify-between items-baseline border-b border-paper/10 pb-2">
                <span className="font-serif text-lg font-bold text-paper">TOI-700 e (Harbor)</span>
                <span className="label text-signal">Target World &middot; Optimistic HZ</span>
              </div>
              <ul className="space-y-2 text-paper leading-relaxed tabular-nums">
                <li className="flex justify-between">
                  <span className="text-paper-muted">Radius:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.radiusEarth} R&oplus; (91.9% Earth radius)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Mass:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.massEarth} M&oplus; (71.8% Earth mass)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Orbital Period:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.orbitalPeriodDays} days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Insolation Flux:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.insolationFlux} S&oplus;</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Equilibrium Temp:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.equilibriumTempK} K (272.9 K)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Distance:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.distanceLightYears} ly ({EXOPLANET_SNAPSHOT.e.distanceParsecs} pc)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-paper-muted">Discovery Year:</span>
                  <span className="font-bold">{EXOPLANET_SNAPSHOT.e.discoveryYear} (Transit Photometry)</span>
                </li>
              </ul>
              <div className="border-t border-paper/10 pt-3 text-xs font-sans italic text-paper-muted">
                {EXOPLANET_SNAPSHOT.e.notes}
              </div>
            </div>

            {/* TOI-700 d */}
            <div className="border border-paper/15 p-6 space-y-4 bg-void">
              <div className="flex justify-between items-baseline border-b border-paper/10 pb-2">
                <span className="font-serif text-lg font-bold text-paper">TOI-700 d (The Outer Twin)</span>
                <span className="label text-paper-muted">Twin You Do Not Fly &middot; Conservative HZ</span>
              </div>
              <ul className="space-y-2 text-paper-muted leading-relaxed tabular-nums">
                <li className="flex justify-between">
                  <span>Radius:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.radiusEarth} R&oplus;</span>
                </li>
                <li className="flex justify-between">
                  <span>Mass:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.massEarth} M&oplus;</span>
                </li>
                <li className="flex justify-between">
                  <span>Orbital Period:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.orbitalPeriodDays} days</span>
                </li>
                <li className="flex justify-between">
                  <span>Insolation Flux:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.insolationFlux} S&oplus;</span>
                </li>
                <li className="flex justify-between">
                  <span>Equilibrium Temp:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.equilibriumTempK} K (268.8 K)</span>
                </li>
                <li className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.distanceLightYears} ly</span>
                </li>
                <li className="flex justify-between">
                  <span>Discovery Year:</span>
                  <span className="font-bold text-paper">{EXOPLANET_SNAPSHOT.d.discoveryYear} (Transit Photometry)</span>
                </li>
              </ul>
              <div className="border-t border-paper/10 pt-3 text-xs font-sans italic text-paper-muted">
                {EXOPLANET_SNAPSHOT.d.notes}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Spacecraft Subsystem Specifications & Flight Heritage */}
        <section aria-labelledby="subsystems-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="subsystems-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              Spacecraft Subsystems <span className="font-extrabold text-paper">&amp; NASA Flight Heritage</span>
            </h2>
            <span className="label text-paper-muted font-mono">SIMULATION SCALING &middot; CML 4</span>
          </div>

          <p className="font-serif text-sm text-paper-muted leading-relaxed">
            All spacecraft components available in the Vehicle Assembly Building (VAB) are modeled upon historical and active deep-space flight hardware. Component masses, costs, and power budgets are scaled for systems engineering trade studies:
          </p>

          <div className="overflow-x-auto border border-paper/15">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead className="bg-void border-b border-paper/15 text-signal uppercase text-[11px]">
                <tr>
                  <th className="p-3.5 border-r border-paper/10">Subsystem</th>
                  <th className="p-3.5 border-r border-paper/10">Category</th>
                  <th className="p-3.5 border-r border-paper/10">Mass / Cost</th>
                  <th className="p-3.5 border-r border-paper/10">Power (W)</th>
                  <th className="p-3.5 border-r border-paper/10">NASA Flight Precedent &amp; Heritage</th>
                  <th className="p-3.5">Simulation Model Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/10 leading-relaxed tabular-nums">
                {allParts.map((part) => (
                  <tr key={part.id} className="hover:bg-paper/[0.02] transition-colors">
                    <td className="p-3.5 border-r border-paper/10 font-bold text-paper">
                      {part.name}
                      {part.isCore && <span className="ml-2 text-signal text-[10px] uppercase font-bold">[Core]</span>}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 uppercase text-paper-muted text-[11px]">
                      {part.category}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper font-semibold">
                      {part.mass} kg &middot; {part.cost} c
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper-muted">
                      {part.powerGen ? `+${part.powerGen} W (Gen)` : `-${part.powerDraw} W (Draw)`}
                    </td>
                    <td className="p-3.5 border-r border-paper/10 text-paper text-[11px]">
                      {part.heritage || 'NASA Deep-Space Flight Standard'}
                    </td>
                    <td className="p-3.5 text-paper-muted text-[11px]">
                      {part.modelLabel || part.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {Object.values(LAUNCHERS).map((l) => (
              <div key={l.id} className="border border-paper/15 p-4 bg-void space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-baseline border-b border-paper/10 pb-1.5">
                  <span className="font-bold text-paper text-sm">Launcher {l.name}</span>
                  <span className="text-signal font-bold">{l.cost} c &middot; {l.massCap} kg limit</span>
                </div>
                <div className="text-paper-muted text-[11px] pt-1">
                  <span className="text-paper font-semibold">Precedent:</span> {l.heritage}
                </div>
                <div className="text-paper-muted text-[11px]">
                  <span className="text-paper font-semibold">Model:</span> {l.modelLabel}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Patched-Conic Delta-v Budget & Space Systems Engineering Architecture */}
        <section aria-labelledby="systems-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="systems-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              Systems Engineering Architecture <span className="font-extrabold text-paper">&middot; NASA Standards</span>
            </h2>
            <span className="label text-signal font-mono">SP-2016-6105 REV 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <h3 className="font-serif text-base font-bold text-paper">
                1. Four Mission Segments (NASA Systems Engineering Handbook)
              </h3>
              <p className="text-paper-muted leading-relaxed">
                Tenth Light implements the canonical four-segment framework outlined in NASA systems engineering training:
              </p>
              <ul className="space-y-1.5 text-paper font-mono text-[11px]">
                <li>&bull; <strong className="text-signal">Launch Segment:</strong> Kite (400 kg / 18c) vs Keel (560 kg / 36c) launcher trade-off.</li>
                <li>&bull; <strong className="text-signal">Space Segment:</strong> Bus avionics, RTG vs solar arrays (1/r&sup2; dropoff), and mass spectrometer/drill instrumentation.</li>
                <li>&bull; <strong className="text-signal">Ground Segment:</strong> JPL Horizons ephemeris antenna lock and light-lag command buffering at Neptune.</li>
                <li>&bull; <strong className="text-signal">User Segment:</strong> Scientific peer certification upon Earth return based on empirical Water and Soil sample proof.</li>
              </ul>
            </div>

            <div className="border border-paper/15 p-6 bg-void space-y-3">
              <h3 className="font-serif text-base font-bold text-paper">
                2. Concept Maturity Levels (CMLs 1–4, NASA JPL)
              </h3>
              <p className="text-paper-muted leading-relaxed">
                Adopts the Pre-Formulation Concept Maturity Levels developed by NASA JPL:
              </p>
              <ul className="space-y-1.5 text-paper font-mono text-[11px]">
                <li>&bull; <strong>CML 1 (Cocktail):</strong> High-level mission objective to sample TOI-700 e surface.</li>
                <li>&bull; <strong>CML 2 (Initial Feasibility):</strong> Mass budget, teaching credit caps, and delta-v burn boundaries.</li>
                <li>&bull; <strong>CML 3 (Trade Studies):</strong> Solar array 1/r&sup2; freeze scrub vs 100W RTG power margin at 19.2 AU.</li>
                <li>&bull; <strong>CML 4 (Point Design):</strong> 420 kg / 132 Credit certifying stack verified in the Engineer&rsquo;s Report.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. 2026 Space Apps Challenge 17 Space Agency Partners */}
        <section aria-labelledby="partners-heading" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-paper/15 pb-3">
            <h2 id="partners-heading" className="font-serif font-extralight text-2xl md:text-3xl text-paper">
              Global Space Agency Partners <span className="font-extrabold text-paper">&middot; 2026 Challenge</span>
            </h2>
            <span className="label text-paper-muted font-mono">17 INTERNATIONAL AGENCIES</span>
          </div>

          <p className="font-serif text-sm text-paper-muted leading-relaxed">
            Tenth Light honors the collaborative spirit of the 2026 NASA Space Apps Challenge and recognizes the global space agency partners:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-[11px]">
            {[
              'Angola Space (GGPEN)',
              'Bahrain Agency (NSSA)',
              'Brazilian Agency (AEB)',
              'Canadian Agency (CSA)',
              'European Agency (ESA)',
              'Indian Research (ISRO)',
              'Italian Agency (ASI)',
              'Japan Aerospace (JAXA)',
              'Korea AeroSpace (KASA)',
              'UAE Center (MBRSC)',
              'Argentina (CONAE)',
              'Nigeria (NASRDA)',
              'Paraguay (AEP)',
              'Senegal (ASES)',
              'Spain (AEE)',
              'Turkey (TUA)',
              'UK Space Agency (UKSA)',
              'NASA (Host Agency)',
            ].map((agency) => (
              <div key={agency} className="border border-paper/15 p-3 bg-void text-paper">
                &bull; {agency}
              </div>
            ))}
          </div>
        </section>

        {/* 7. Attributions, Non-Endorsement & Licensing */}
        <section aria-labelledby="disclaimer-heading" className="border-t border-paper/15 pt-8 space-y-4 font-mono text-xs text-paper-muted leading-relaxed">
          <h2 id="disclaimer-heading" className="label text-signal">
            Engineering &amp; Compliance Disclaimers
          </h2>
          <div>
            &bull; <strong>NASA Media Guidelines Compliance:</strong> Photographs from NASA are displayed whole and unaltered with full attribution to NASA and respective mission teams. In accordance with NASA Media Guidelines (<a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener noreferrer" className="text-signal underline hover:text-signal-hover">nasa.gov/nasa-brand-center/images-and-media/</a>), strictly non-commercial and educational use is observed. Zero implied endorsement. No NASA insignia, agency logo, national flag, or mission patch is used as game assets.
          </div>
          <div>
            &bull; <strong>Original Pixel Art &amp; Procedural Synthesizers:</strong> 100% original pixel portraits, custom SVG tokens, procedural WebGL Three.js spacecraft meshes, and procedural Web Audio API sound synthesizers. Zero copyrighted game clips or meme audio.
          </div>
          <div>
            &bull; <strong>Non-Endorsement Statement:</strong> Nothing in this simulation implies official endorsement by NASA or any international partner space agency.
          </div>
        </section>
      </div>
    </main>
  );
}
