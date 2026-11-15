import type { ScriptId, Who } from "./types";

export type Line = { who: Who; name: string; text: string };

const NAMES: Record<Who, string> = {
  wren: "Wren",
  nori: "Nori",
  lumen: "Lumen",
  redline: "Redline",
  pebble: "Pebble",
  bolt: "Bolt",
  spray: "Spray",
  tilt: "Tilt",
  lag: "Lag",
  heart: "❤️",
  whisper: "Whisper",
  shore: "Shore",
  control: "Mission control",
  scientist: "Dr. Iyer",
};

export function speakerName(who: Who, callsign: string): string {
  if (who === "wren") return callsign;
  return NAMES[who];
}

export function briefingLines(callsign: string): Line[] {
  return [
    {
      who: "control",
      name: "Mission control",
      text: `Specialist ${callsign}. One budget. One chair. You do not open the hatch.`,
    },
    {
      who: "nori",
      name: "Nori",
      text: "I open a sleeve. It is smaller than a hatch. Try to stop me.",
    },
    {
      who: "control",
      name: "Mission control",
      text: "TESS found two worlds on one star. The archive is on the table. You can fly one.",
    },
    {
      who: "wren",
      name: callsign,
      text: "The smaller one. Closer to Earth's size. We call it Harbor.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "They named a shore they have never touched. I will go and see if it is wet.",
    },
    {
      who: "control",
      name: "Mission control",
      text: "There is no one there. Bring water and soil the instruments can swear to, or bring home an honest empty file.",
    },
  ];
}

export const SCRIPTS: Record<ScriptId, (callsign: string) => Line[]> = {
  moon: (callsign) => [
    {
      who: "lumen",
      name: "Lumen",
      text: "The dish is lazy. Earth is a direction, not a feeling.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "It wants a number. I respect that.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Then we give it the bearing Horizons has.",
    },
  ],
  mars: (callsign) => [
    {
      who: "redline",
      name: "Redline",
      text: "Mass is a door. You are heavier than you think, by one souvenir.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "If they drop my harness, I end this mission myself.",
    },
    {
      who: "wren",
      name: callsign,
      text: "The gift goes. The harness stays.",
    },
  ],
  ceres: (callsign) => [
    {
      who: "pebble",
      name: "Pebble",
      text: "Three rocks. Dawn lived at one of them. The small-body catalog knows. Do you?",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Look at the diameter. Nicknames are a hobby.",
    },
    {
      who: "wren",
      name: callsign,
      text: "We came here to tell them apart.",
    },
  ],
  ambush: (callsign) => [
    {
      who: "nori",
      name: "Nori",
      text: "The depot lights are out.",
    },
    {
      who: "wren",
      name: callsign,
      text: "That is not a welcome.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Then we shoot, and then we take the fuel. In that order.",
    },
  ],
  refuel: (callsign) => [
    {
      who: "bolt",
      name: "Bolt",
      text: "Ambush is over. Tanks are full. I do not refill spectrometers.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Propellant is back. The mistakes are still bolted on.",
    },
    {
      who: "wren",
      name: callsign,
      text: "We fly the ship we built.",
    },
  ],
  enceladus: (callsign) => [
    {
      who: "spray",
      name: "Spray",
      text: "The plume is the ocean, briefly, in space. Cassini flew through it. You will point.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Water, and we are not even at the shore yet.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Show me the jets.",
    },
  ],
  uranus: (callsign) => [
    {
      who: "tilt",
      name: "Tilt",
      text: "The Sun is a rumor here. Your arrays heard it. Your heater did not.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "If the bus goes cold I am writing it in the log, personally.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Breakers. Heater and radio first.",
    },
  ],
  neptune: (callsign) => [
    {
      who: "lag",
      name: "Lag",
      text: "I already answered you. You have not heard it yet.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "One command. Then we wait. A second command trips over the first.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Send once.",
    },
  ],
  pluto: (callsign) => [
    {
      who: "heart",
      name: "❤️",
      text: "The heart is a place, not a mood. New Horizons saw it. A picture is not a soil sample.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Pretty. Still not dirt in a jar.",
    },
    {
      who: "wren",
      name: callsign,
      text: "We mark the heart, and we remember the difference.",
    },
  ],
  whisper: (callsign) => [
    {
      who: "whisper",
      name: "Whisper",
      text: "You are at the edge Voyager crossed. Choose what is allowed to matter on the way home.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Samples, then the log, then the postcard. I will not negotiate the postcard.",
    },
    {
      who: "wren",
      name: callsign,
      text: "The postcard is last. The samples are the mission.",
    },
  ],
  harbor: (callsign) => [
    {
      who: "shore",
      name: "Shore",
      text: "I do not speak for a people. There is no people.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Nori.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "Hatch stays shut. Open the sleeve.",
    },
    {
      who: "shore",
      name: "Shore",
      text: "I will watch the sleeve. That is all I am for.",
    },
  ],
  shortfall: (callsign) => [
    {
      who: "nori",
      name: "Nori",
      text: "The tanks are a math problem, and the math lost.",
    },
    {
      who: "control",
      name: "Mission control",
      text: "Scrub. The design stays on the floor. The corridor does not.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Then we build a ship that can actually leave.",
    },
  ],
};

export function endingLines(ending: "certified" | "uncertified" | "thin", callsign: string): Line[] {
  if (ending === "certified") {
    return [
      {
        who: "control",
        name: "Mission control",
        text: "Harbor is on the line. The files are real.",
      },
      {
        who: "scientist",
        name: "Dr. Iyer",
        text: "Water, certified. Soil, certified. This is not a colony. It is the first honest reason to design the next ship.",
      },
      {
        who: "nori",
        name: "Nori",
        text: "They are cheering at a file. I am taking the window.",
      },
      {
        who: "wren",
        name: callsign,
        text: "Let them cheer. The samples are already downstairs.",
      },
    ];
  }
  if (ending === "uncertified") {
    return [
      {
        who: "scientist",
        name: "Dr. Iyer",
        text: "You came home with material the instruments cannot swear to. We can be glad you are alive. We cannot enter it in the record.",
      },
      {
        who: "nori",
        name: "Nori",
        text: "Next time, bolt the right boxes on.",
      },
      {
        who: "wren",
        name: callsign,
        text: "Then the next design starts tonight.",
      },
    ];
  }
  return [
    {
      who: "scientist",
      name: "Dr. Iyer",
      text: "The file is thin. You brought the crew home. That is a kind of success. It is not the one we flew for.",
    },
    {
      who: "nori",
      name: "Nori",
      text: "I am still loud. The file is not.",
    },
    {
      who: "wren",
      name: callsign,
      text: "Then we do not pretend it is.",
    },
  ];
}

export const TALK_CTA: Record<ScriptId, string> = {
  moon: "Aim the dish",
  mars: "Open the scale",
  ceres: "Name the rock",
  ambush: "They are here",
  refuel: "Leave Jupiter",
  enceladus: "Point at the plume",
  uranus: "Open the breakers",
  neptune: "Send the command",
  pluto: "Find the heart",
  whisper: "Set the manifest",
  harbor: "Open the sleeve",
  shortfall: "Scrub to the hangar",
};
