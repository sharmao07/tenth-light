# Tenth Light

Mission plan for the 2026 NASA Space Apps challenge **Space Mission Design Game**.

This is the plan. The game is not started.

Tagline: **Design the ship. Stay in the seat. Send the cat.**

One sentence for a judge: Tenth Light puts a student in the chair of a mission designer, with one budget, a corridor of real NASA worlds, and a cat who walks out to sample an Earth-sized planet that has nobody on it.

## Who it is for

Students, and anyone who has never been shown why a spacecraft is mostly the things you could not afford. It should be playable in a browser, in a classroom, with no install. That is the impact case: the challenge is marked Beginner/Youth and Intermediate, and the 2025 storytelling winner (A Solar Tale, by HerCode Space) won by making real heliophysics feel personal for a named audience.

## The story

You are the specialist. Your callsign defaults to Wren, and the player can type another. You never leave the spacecraft. You appear only in the dialogue panels.

Nori is the ship cat. She is the companion. Every line she speaks is written ahead of time. She is not a live chatbot. She notices concrete things: a meter, a smell, a hatch. She does not explain the theme.

Scientists have a confirmed Earth-sized world and no sign of anyone on it. The catalog name is **TOI-700 e**. The crew calls it **Harbor**. You are sent to bring back water and soil readings so Earth can decide whether a second shore is even worth planning.

There are nine stops between Earth and Harbor. Earth is stop 0. Harbor is stop 10. An alien waits at each stop and will not open the next gate until you solve their puzzle. They speak in fixed lines. At stop 4 they do not talk. They ambush the ship. After the fight you refuel, and the corridor continues.

Harbor is silent. That is the turn. Every world before it had a voice. This one does not. The hatch stays shut. Nori goes into the maze in the sample sleeve, because she is small and you are not leaving the chair. She collects the readings. You fly straight home.

Earth cheers. The files go to the scientists. How loud the room is depends on what the ship you designed was actually able to bring.

### What is real, and what is the story

A line in the mission log stays visible for the whole game:

> Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive's numbers. The aliens, the depot fight, and the cat are the story.

That line is how the game can keep the ambush, the cat, and the maze without pretending you can fly 101 light years and back before dinner.

Snapshot retrieved from the NASA Exoplanet Archive composite table on 15 November 2026. The game fetches this live and falls back to these numbers if the archive is down. Equilibrium temperature is not a weather report.

| | TOI-700 e, Harbor, the destination | TOI-700 d, the world you do not fly |
| --- | --- | --- |
| Radius | 0.919 Earth radii | 1.145 Earth radii |
| Mass | 0.718 Earth masses | 1.580 Earth masses |
| Period | 27.81 days | 37.42 days |
| Insolation | 1.27 Earth | 0.85 Earth |
| Equilibrium temperature | 272.9 K | 268.8 K |
| Distance | 31.13 parsecs, about 101.5 light years | same star |
| Discovery | 2023, transit | 2020, transit |

The briefing shows both worlds. You have one budget, so you fly e, the closer match in size. d stays on the rejected card. That is the first tradeoff, and it uses the archive rather than a fictional tenth planet. There is no ninth planet of the solar system to stand in this corridor. Ceres and Pluto are dwarf planets. The ninth stop is the heliopause, the boundary Voyager 1 crossed in 2012. Nori is allowed to correct anyone who calls all nine of them planets.

## How a run works

1. Briefing. Two archive worlds. One budget. You meet Nori.
2. Hangar. Build the ship in 3D by dragging parts onto nodes. Pick a launch vehicle. You cannot launch over mass, over cost, or without a command module and a way to talk to Earth.
3. The ship flies itself. Between stops, asteroids appear. A white marker sweeps a circle. You click when it sits on the yellow arc. The asteroid has a real name, size, and speed from NASA.
4. You arrive. The stop is saved. A large dialogue panel opens. You solve the puzzle. The alien lets you through.
5. Stop 4 is the ambush, then the refuel. The fight is the only shooting in the game.
6. Stop 10 is the maze. You control Nori. You still do not step outside.
7. Direct return to Earth. The ending depends on the ship.

Lives: one pool of three for the whole run. A missed dodge costs one. A hit in the fight costs one. A failed puzzle does not. Reaching a stop saves the game, including the life count you arrived with. If you hit zero, you reload that stop and the pool is filled back to three, so a hard fight cannot trap you on one life. There are no extra lives to pick up.

Controls:

- Hangar, dialogue, and puzzles: mouse.
- Asteroid dodge: one click.
- Ambush: move and shoot.
- Maze: move Nori.

The ship is never steered.

## The ship is the challenge

The 2026 challenge asks for a game where the player designs and operates a mission inside limits of budget, power, mass, and communications, then experiments with the outcome. The corridor is the story. The four meters are the game.

Every part shows mass in kilograms, power in watts (draw or supply), cost, and what it unlocks. Numbers are design values cited from a public NASA source at build time (NTRS, a mission fact sheet, CubeSat 101, or the part's own NASA page). Nothing on a card is presented as an official current NASA price unless the citation says so. The budget cap is labeled as a teaching cap in the spirit of a NASA Discovery-class mission, with the citation beside it.

Launch vehicle is a real choice. A smaller rocket leaves more money and less mass. A larger rocket eats the budget and lets you carry the RTG and the drill.

Power from solar panels falls with the square of distance from the Sun. At Uranus that is roughly 1/370 of the power those same panels made at Earth. An RTG does not care. This is the moment a pretty ship fails.

Delta-v uses the rocket equation and a small table of leg costs. The table is labeled as a simplified patched-conic estimate, not a GMAT run. GMAT is named in the challenge resources and is cited as the reference method. We do not claim the browser ran GMAT. Jupiter restores propellant. It does not let you bolt on new instruments. If a leg is short on delta-v, mission control sends you back to the hangar with the design loaded, and the log records the failed departure.

### Parts

| Part | Role |
| --- | --- |
| Command module | Required. Wren and Nori live here. Draws power. |
| Fuel tank | Propellant mass. More tanks, more delta-v, less mass left for science. |
| Engine | Sets Isp. Chemical, so the Jupiter refuel means something. |
| Solar array | Power falls as 1/r². |
| RTG | Flat power, heavy, expensive. The outer planets. |
| High-gain antenna | Required to leave Earth. Required again when the Neptune delay puzzle asks the ship to hold a link. |
| Spectrometer | Certifies a water reading. |
| Drill and sample head | Certifies a soil reading. This is the tool on Nori's sleeve. |
| Imager | Cheap science. Easy to delete when mass is tight. The log notices. |

### Three endings, one maze

You can always come home if you stay alive. The room you come home to changes.

| Ending | Condition | What Earth does |
| --- | --- | --- |
| Certified | Spectrometer and drill were aboard, and Nori collected both samples | Full celebration. The files go to the scientists. |
| Uncertified | You came home with samples the ship cannot certify | A smaller room. The scientist asks you to fly the design again. |
| Thin | You shut science down to survive the outer leg | Nori is fine. The files are thin. The cheer is polite. |

That is "experiment with the outcome." A legal ship can still be the wrong ship.

## The corridor

| Stop | Place | In the science log | What you play | Data that can change the scene |
| --- | --- | --- | --- | --- |
| 0 | Earth | Departure | Briefing and the hangar | Archive cards for TOI-700 d and e. A NASA EPIC frame of Earth on the return. |
| 1 | Moon | Moon | Turn a dish until Earth is above the horizon | JPL Horizons azimuth and elevation from a lunar site |
| 2 | Mars | Mars | A mass puzzle that uses the ship you built | Mars rover photo from api.nasa.gov, shown unaltered |
| 3 | Ceres | Dwarf planet, Dawn | Pick the real body out of three passing rocks | JPL Small-Body Database |
| 4 | Jupiter | Jupiter | Ambush, then refuel | Distance and solar fraction on the HUD. The fight itself is story. |
| 5 | Enceladus | Moon of Saturn, Cassini | Trace the plume and catch ice | An unaltered NASA image of the plume |
| 6 | Uranus | Uranus | Shed loads, or coast on the RTG | Solar power from the 1/r² law at the Horizons range |
| 7 | Neptune | Neptune | Send one command and wait out a scaled light-time. A second command collides. | One-way light time from range. Show the real hours and the drill seconds together. |
| 8 | Pluto | Dwarf planet, New Horizons | Find the heart on an unaltered image, then name what a soil sample can and cannot say | NASA image. A caption that a photo is not a laboratory. |
| 9 | Heliopause | Boundary Voyager 1 crossed in 2012, about 122 AU | Choose the three things the return manifest can carry | Voyager mission facts, cited. No Golden Record audio. |
| 10 | Harbor | TOI-700 e, arrival simulation | 3D maze, you control Nori, collect water and soil, leave | Archive radius, insolation, and equilibrium temperature tint the maze and the sample card |

Dialogue is a full panel: large portrait, name, written line. It sits on top of whatever 3D scene is behind it. Dispatch is the reference for the feeling (a person, a situation, a tactile task), not for any of its art or text.

Puzzle failure is a retry and a shorter hint from Nori. It does not spend a life.

## Asteroids and the ambush

On a transit, one asteroid appears, or two on the longer outer legs. It is a real near-Earth object from NASA's NeoWs feed: name, estimated diameter, relative velocity, hazard flag. If the feed fails, the game uses a snapshot shipped in the repo and labels the snapshot date.

The dodge is the ring. A white marker sweeps the circle at a constant speed. The yellow arc is about one eighth of the circle. Click while the marker is on the yellow. A hit logs the object's name. A miss costs a life and Nori says something short.

The ambush is stop 4 only. Your ship and their craft are 3D models on a flat plane, camera locked, so it reads like a shooter and still looks solid. A few waves, then the depot. Refuel fills propellant and nothing else. Keyboard to move and shoot.

## What is 3D, and what is 2D

3D:

- The hangar, with parts you drag onto nodes.
- Transit, the ship in a starfield, rocks in the distance.
- The ambush craft.
- The maze, third person on Nori.

2D, on top:

- Every dialogue panel.
- The dodge ring.
- Puzzle widgets.
- The mission log and the four meters.

Nori in the maze is a simple original model. Wren, Nori, and the gatekeepers in dialogue are original vector portraits. NASA photographs are used whole, with a credit on the plate. No NASA logo, flag, or mission patch is drawn into anything we make.

## NASA data the game actually needs

Citing a fact is not enough for Global Awards. Each source below has to be able to change what the player does. All of them ship with a cached snapshot so judging still works if a feed is down. The screen says when it is showing the snapshot.

| Source | Use | Needs the api.nasa.gov key |
| --- | --- | --- |
| NASA Exoplanet Archive TAP | Harbor and the rejected twin. Maze tint and sample card. | No |
| JPL Horizons | Lunar Earth window. Ranges for power and light time. | No |
| JPL Small-Body Database | The Ceres identification puzzle | No |
| NASA NeoWs (api.nasa.gov) | Named asteroids in the dodge | Yes, server-side |
| NASA Image and Video Library, plus Mars rover photos and EPIC | Unaltered plates for Mars, Enceladus, Pluto, and Earth | Mars and EPIC yes; the image library no |
| NTRS and mission fact sheets | The citation printed on each part card | No |
| GMAT, as a reference | Named in the method note for the delta-v table. Not executed in the browser. | No |

The api.nasa.gov key stays in an environment variable on the server. It is not written into the client, this file, or a commit. `DEMO_KEY` is the local fallback when no key is set.

Concept Maturity Levels and the Mission Design Lab are the language of the briefing: this flight is a concept being tested, and the simulation past the heliopause is the point where the concept meets the archive. CubeSat 101 supplies the phase language (design, then fly, then the users who read the data). Those documents are cited. They are not a substitute for the live queries above.

## Art, tools, and the look

Browser game. Next.js, TypeScript, React Three Fiber, Tailwind, and screens we design ourselves. Judges get a link that opens with no login and no engine.

Summer Engine needs its desktop app, which this build environment does not have, and judges would need it too. The Claude Code Game Studios repository is an agent workflow for a different tool. Unity is the wrong judging target here: a site is easier to open than a WebGL build, and the editor is not what we have.

The long list of React UI kits (Material, Ant, Chakra, Base Web, and the rest) is a set of enterprise design systems. They would make a mission story look like an admin tool. We are not installing them. The bar from the design references is the opposite: one type system, few colors, big type for speech, NASA photographs full bleed, and no generic space-purple page. A Solar Tale won storytelling by being a designed story.

Color: paper for the log, black for space, one amber for the yellow arc and the warnings, one red for a lost life. No nebula gradients, no glass panels, no NASA worm or meatball.

Sound is original or CC0, credited. The Voyager Golden Record greetings stay out. Availability on a NASA page is not the same as a license.

Models: original low-poly parts, because NASA's 3D models are whole vehicles and will not snap together. A NASA 3D model may sit in the hangar as a reference vehicle, credited, if the license on that file allows it. Kenney or Quaternius only where the specific file is CC0, and only if we still need it after the original parts exist. No AI-generated images, portraits, or models unless a required asset has no usable source, and then it is watermarked and disclosed. The plan does not expect that case.

## Submission rules that change the project

From the 2026 Project Submission Guide, the Judging and Awards Guide as published, and the clarifications already gathered:

- Demo is a slide deck of at most 7 slides, including the title slide, made after the game is playable. A video over 30 seconds, or a deck over 7 slides, is not eligible as the demo. A longer film can be linked as extra material only.
- The project page and the deck are in English.
- Links on the page have to open with no login. Test them in a private window.
- Global Awards need at least one NASA data source used for real. This plan uses several, on purpose.
- AI assistance is allowed. The project form gets an honest SI answer: Cursor with Grok was used to plan and to write code. That form field is not shown to judges. A credits line in the game still says so, because judges do see what is inside the project. AI-generated images and video need a visible watermark. We are not planning to make any.
- The submission checkbox says the team has permission for every copyrighted thing it used. The John Cena entrance is copyrighted, and a green-screen meme does not grant that permission. The celebration stays: confetti, mission control, the scientist taking the files, Nori in the window, an unaltered NASA view of Earth. The joy is the ending. The clip is not in the build.
- No likeness of anyone under 18 anywhere in the demo or the project.
- Team size for Global Judging at the Universal Event is 2 to 6 people, all registered for that same event. A person working alone can still submit and earn a participant certificate. They are not eligible for Global Judging through the Universal Event. Local event rules are the ones that apply if the team is on a Local Event instead.
- Submission closes Sunday, 15 November 2026, at 11:59 p.m. in the Local Event's time zone. For a Universal Event team, that clock is the Team Owner's local time. For a Team Owner in Asia/Kolkata, that is 11:59 p.m. IST on 15 November 2026.

Judging is five scores, each from 1 to 5: Impact, Creativity, Validity, Relevance, Presentation. A 5 on Relevance means NASA data is the reason the project works. A 5 on Validity means the science is sound and someone can actually use it. The log line, the citations, and the three endings are what those two scores are for. Presentation is the page, the 7 slides, and a game a stranger can finish.

Awards this is built toward: Best Use of Storytelling, and Best Mission Concept. One project should be aimed at one award first. Storytelling is first. Mission concept is what the ship math is there to carry.

### Seven slides, later

1. Title. Team name, names, challenge, tagline.
2. The chair. One student, one budget, a world with no one on it.
3. The ship. The four meters, and a design that fails them.
4. One live gate. A NASA number changes the puzzle while the judge watches.
5. The silent stop. Nori in the maze. The archive numbers on the sample card.
6. Who it is for. A classroom. The three endings.
7. Honesty. Sources, what is simulated, what is story, the credits.

## Build order

Do this in order. Stop when a step is playable before starting the next. The first playable cut is steps 1 through 5 plus the Earth return with one ending. The other gates reuse the dialogue panel and can follow.

1. App shell, the stop machine, the life pool, checkpoints, the mission log.
2. Briefing with the live archive query and the snapshot fallback.
3. 3D hangar, part cards with citations, launch-vehicle choice, launch lock.
4. Transit scene and the dodge ring, with a named asteroid.
5. The large dialogue panel, Wren and Nori, and three gates that read the ship: Moon, Uranus, Neptune.
6. Jupiter ambush and refuel.
7. Harbor maze, Nori, sample certification, three endings, Earth.
8. The remaining gates: Mars, Ceres, Enceladus, Pluto, heliopause.
9. Credits, data page, portrait pass, sound.
10. Only then, the 7 slides and the project-page text.

## Locked decisions

- The game is a website. Next.js, TypeScript, React Three Fiber, Tailwind. Our own screens.
- Harbor is TOI-700 e. The twin on the rejected card is TOI-700 d.
- The player never leaves the ship. The maze is Nori.
- Dialogue is written, large, and fixed. Nori is not a chatbot.
- One life pool. Puzzle retries are free. Dodges and the ambush spend lives.
- Checkpoints are the stops. A game over refills the three lives at that stop.
- Three endings, driven by the ship.
- NASA photographs stay unaltered and credited. Part meshes and portraits are original.
- No NASA logo. No John Cena clip. No Golden Record audio. No AI images in the plan.
- The API key never enters the repository.
- The deck is 7 slides, and it waits until the game can be played.
- Git commits for this project use the GitHub account sharmao07 and the noreply GitHub email.
