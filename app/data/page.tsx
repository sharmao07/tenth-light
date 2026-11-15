import Link from "next/link";
import { BUDGET, PARTS, VEHICLES } from "@/lib/game/catalog";
import { HONESTY } from "@/lib/game/snapshot";

export default function DataPage() {
  return (
    <main className="data-page screen-in">
      <header>
        <p className="eyebrow">Tenth Light</p>
        <h1>Data and credits</h1>
        <p className="lede">{HONESTY}</p>
      </header>
      <div className="data-grid">
        <section>
          <h2>What can change a decision</h2>
          <ul>
            <li>
              <a href="https://exoplanetarchive.ipac.caltech.edu/">NASA Exoplanet Archive</a> composite
              parameters for TOI-700 d and TOI-700 e. If the archive is down, the game uses a snapshot
              retrieved 15 November 2026.
            </li>
            <li>
              <a href="https://ssd.jpl.nasa.gov/api/horizons.api">JPL Horizons</a> for Earth&apos;s azimuth
              and elevation from a south-polar lunar site.
            </li>
            <li>
              <a href="https://ssd-api.jpl.nasa.gov/doc/sbdb.html">JPL Small-Body Database</a> for Ceres,
              Vesta, and Pallas.
            </li>
            <li>
              <a href="https://api.nasa.gov/">NASA NeoWs</a> for the named asteroid in each dodge. The
              API key stays on the server.
            </li>
            <li>
              <a href="https://api.nasa.gov/">NASA EPIC</a> for the Earth frame at the end, with the{" "}
              <a href="https://images-api.nasa.gov/">image library</a> as the fallback. Photographs are
              shown unaltered.
            </li>
          </ul>
          <h2>Teaching ship</h2>
          <p>Budget {BUDGET}. Not an official NASA solicitation cap. Equilibrium temperature is the archive value, not weather. Delta-v is a teaching table, not a GMAT run.</p>
          <ul>
            {Object.values(VEHICLES).map((vehicle) => (
              <li key={vehicle.id}>
                {vehicle.name}: cost {vehicle.cost}, payload cap {vehicle.massCap} kg. {vehicle.blurb}
              </li>
            ))}
            {Object.values(PARTS).map((part) => (
              <li key={part.id}>
                {part.name}: {part.mass} kg, {part.cost} cost. {part.cite}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>One loadout that certifies</h2>
          <p>
            Keel, three tanks, the radioisotope unit, the spectrometer, and the drill. Leave the imager
            off, or open its breaker at Uranus. Kite can carry the instruments on solar power and still
            be legal at Earth. It cannot heat the bus at Uranus, and mission control scrubs that flight.
          </p>
          <h2>Space agency partners</h2>
          <p>
            This build uses sources that can change a decision on screen. Partner agencies named for 2026,
            and not claimed as a live feed, are the Angola National Space Programme Management Office,
            Bahrain Space Agency, Brazilian Space Agency, the Canadian Space Agency, ESA, ISRO, the Italian
            Space Agency, JAXA, KASA, the Mohammed Bin Rashid Space Centre, Argentina&apos;s National Space
            Activities Commission, Nigeria&apos;s National Space Research and Development Agency, the
            Paraguayan Space Agency, the Senegalese Space Studies Agency, the Spanish Space Agency, the
            Turkish Space Agency, and the UK Space Agency. Photographs are credited to NASA. Nothing here
            implies NASA endorsement.
          </p>
          <h2>What is original</h2>
          <p>
            Dialogue, portraits, and the low-poly ship are original. Nori&apos;s lines are written. She
            does not call a model during play. No NASA logo is drawn into the game. Cursor with Grok
            was used to plan and write code. There are no AI-generated images in this build.
          </p>
          <p><Link href="/">Back to the chair</Link></p>
        </section>
      </div>
    </main>
  );
}
