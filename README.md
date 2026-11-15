# Tenth Light

A browser game for the 2026 NASA Space Apps challenge, Space Mission Design Game.

You are the specialist. You never leave the chair. You spend one teaching budget on a ship, fly a corridor of real places, and send Nori, the ship droid, into the sample sleeve at TOI-700 e. The files Earth receives depend on the instruments you actually bolted on.

Stops 1 through 9 are real places. Harbor is TOI-700 e from the NASA Exoplanet Archive. The leg past the heliopause is a labeled simulation. The aliens, the depot fight, and the droid are the story.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local site the dev script prints. The NASA API key is optional. `DEMO_KEY` works and is rate-limited. A personal key from [api.nasa.gov](https://api.nasa.gov/) belongs in `.env.local` as `NASA_API_KEY`. It is read on the server and is not written into the client.

```bash
npm run check
npm run lint
npm run build
```

## Play

1. Read the briefing. The archive cards are TOI-700 e and TOI-700 d.
2. In the hangar, pick a launcher and drag parts onto the ship. Mass, cost, power, and delta-v have to close. The forecast tells you if Uranus will scrub the flight.
3. Between gates, click when the white mark sits on the amber arc. The asteroid has a NASA name.
4. Each gate is a short control. Jupiter is a fight, then a refuel. Harbor is a top-down sleeve: Nori finds a key, opens the gate, and brings back the samples.
5. Earth cheers in proportion to what the instruments can swear to.

A miss and a hit spend from one pool of three lives. A failed puzzle does not. Running out of lives restores the last gate and the three lives. A ship that cannot finish is scrubbed back to the hangar with the design still on the floor.

## Data

The data page inside the game lists every source. Photographs from NASA are shown unaltered and credited. Part numbers are teaching values with the real reference named on that page.

The full design notes are in `MISSION.md`.
