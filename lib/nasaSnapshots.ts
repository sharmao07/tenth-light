// NASA Dated Archival Snapshots - 15 November 2026
// Tenth Light mission simulation data

export const ARCHIVE_SNAPSHOT_DATE = "15 November 2026";

export interface ExoplanetData {
  name: string;
  designation: string;
  radiusEarth: number;
  massEarth: number;
  orbitalPeriodDays: number;
  insolationFlux: number;
  equilibriumTempK: number;
  distanceParsecs: number;
  distanceLightYears: number;
  discoveryYear: number;
  discoveryMethod: string;
  notes: string;
}

export const EXOPLANET_SNAPSHOT: Record<string, ExoplanetData> = {
  e: {
    name: "TOI-700 e",
    designation: "Harbor",
    radiusEarth: 0.919,
    massEarth: 0.718,
    orbitalPeriodDays: 27.81,
    insolationFlux: 1.27,
    equilibriumTempK: 272.9,
    distanceParsecs: 31.13,
    distanceLightYears: 101.5,
    discoveryYear: 2023,
    discoveryMethod: "Transit",
    notes: "Equilibrium temperature is not weather. Located in the optimistic habitable zone.",
  },
  d: {
    name: "TOI-700 d",
    designation: "Twin",
    radiusEarth: 1.145,
    massEarth: 1.580,
    orbitalPeriodDays: 37.42,
    insolationFlux: 0.85,
    equilibriumTempK: 268.8,
    distanceParsecs: 31.13,
    distanceLightYears: 101.5,
    discoveryYear: 2020,
    discoveryMethod: "Transit",
    notes: "The outer temperate twin you do not fly. In conservative habitable zone.",
  },
};

export interface HorizonsMoonData {
  target: string;
  observer: string;
  azimuthDeg: number;
  elevationDeg: number;
  targetToleranceDeg: number;
  epoch: string;
}

export const HORIZONS_MOON_SNAPSHOT: HorizonsMoonData = {
  target: "Earth (399)",
  observer: "South Polar Lunar Site (coord@301)",
  azimuthDeg: 124,
  elevationDeg: 18,
  targetToleranceDeg: 14,
  epoch: "2026-Nov-15 00:00:00 UT",
};

export interface SmallBodyData {
  name: string;
  designation: string;
  class: string;
  diameterKm: number;
  notes: string;
}

export const SMALL_BODIES_SNAPSHOT: SmallBodyData[] = [
  {
    name: "1 Ceres",
    designation: "Ceres",
    class: "Dwarf Planet",
    diameterKm: 939.4,
    notes: "Largest object in the asteroid belt. Orbited by NASA Dawn spacecraft in 2015.",
  },
  {
    name: "4 Vesta",
    designation: "Vesta",
    class: "Asteroid",
    diameterKm: 525.4,
    notes: "Second most massive asteroid. Orbited by Dawn in 2011–2012.",
  },
  {
    name: "2 Pallas",
    designation: "Pallas",
    class: "Asteroid",
    diameterKm: 512.0,
    notes: "Third largest asteroid, high orbital inclination.",
  },
];

export interface NeoObject {
  id: string;
  name: string;
  estimatedDiameterMeters: number;
  relativeVelocityKmh: number;
  relativeVelocityKps: number;
  isPotentiallyHazardous: boolean;
  missDistanceKm: number;
}

export const NEOWS_SNAPSHOT: NeoObject[] = [
  {
    id: "99942",
    name: "(99942) Apophis",
    estimatedDiameterMeters: 340,
    relativeVelocityKmh: 110520,
    relativeVelocityKps: 30.7,
    isPotentiallyHazardous: true,
    missDistanceKm: 31600,
  },
  {
    id: "101955",
    name: "(101955) Bennu",
    estimatedDiameterMeters: 490,
    relativeVelocityKmh: 100080,
    relativeVelocityKps: 27.8,
    isPotentiallyHazardous: true,
    missDistanceKm: 480000,
  },
  {
    id: "162173",
    name: "(162173) Ryugu",
    estimatedDiameterMeters: 900,
    relativeVelocityKmh: 84240,
    relativeVelocityKps: 23.4,
    isPotentiallyHazardous: false,
    missDistanceKm: 1450000,
  },
  {
    id: "2024YR4",
    name: "2024 YR4",
    estimatedDiameterMeters: 54,
    relativeVelocityKmh: 61920,
    relativeVelocityKps: 17.2,
    isPotentiallyHazardous: true,
    missDistanceKm: 850000,
  },
  {
    id: "4179",
    name: "(4179) Toutatis",
    estimatedDiameterMeters: 4500,
    relativeVelocityKmh: 135000,
    relativeVelocityKps: 37.5,
    isPotentiallyHazardous: true,
    missDistanceKm: 6900000,
  },
  {
    id: "3200",
    name: "(3200) Phaethon",
    estimatedDiameterMeters: 5800,
    relativeVelocityKmh: 115560,
    relativeVelocityKps: 32.1,
    isPotentiallyHazardous: true,
    missDistanceKm: 10300000,
  },
  {
    id: "2023DW",
    name: "2023 DW",
    estimatedDiameterMeters: 50,
    relativeVelocityKmh: 88560,
    relativeVelocityKps: 24.6,
    isPotentiallyHazardous: false,
    missDistanceKm: 1820000,
  },
  {
    id: "25143",
    name: "(25143) Itokawa",
    estimatedDiameterMeters: 330,
    relativeVelocityKmh: 91080,
    relativeVelocityKps: 25.3,
    isPotentiallyHazardous: false,
    missDistanceKm: 5200000,
  },
];

export interface NASAImagePlate {
  stopIndex: number;
  locationName: string;
  url: string;
  caption: string;
  credit: string;
}

export const NASA_IMAGE_PLATES: Record<number, NASAImagePlate> = {
  1: {
    stopIndex: 1,
    locationName: "Moon",
    url: "https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg",
    caption: "Apollo 11 Lunar surface view at Tranquility Base.",
    credit: "NASA. Unaltered.",
  },
  2: {
    stopIndex: 2,
    locationName: "Mars",
    url: "https://images-assets.nasa.gov/image/PIA04304/PIA04304~medium.jpg",
    caption: "Mars Global Surveyor wide-angle view of the red planet.",
    credit: "NASA/JPL/Malin Space Science Systems. Unaltered.",
  },
  3: {
    stopIndex: 3,
    locationName: "Ceres",
    url: "https://images-assets.nasa.gov/image/PIA21079/PIA21079~orig.jpg",
    caption: "Dawn spacecraft full view of dwarf planet Ceres and Occator bright spots.",
    credit: "NASA/JPL-Caltech/UCLA/MPS/DLR/IDA. Unaltered.",
  },
  4: {
    stopIndex: 4,
    locationName: "Jupiter",
    url: "https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg",
    caption: "Cassini spacecraft true-color cylindrical map view of Jupiter.",
    credit: "NASA/JPL/Space Science Institute. Unaltered.",
  },
  5: {
    stopIndex: 5,
    locationName: "Enceladus",
    url: "https://images-assets.nasa.gov/image/PIA07758/PIA07758~orig.jpg",
    caption: "Cassini spacecraft backlit view of South Polar cryovolcanic water vapor jets.",
    credit: "NASA/JPL/Space Science Institute. Unaltered.",
  },
  6: {
    stopIndex: 6,
    locationName: "Uranus",
    url: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg",
    caption: "Voyager 2 true-color image of Uranus at 19.2 AU.",
    credit: "NASA/JPL-Caltech. Unaltered.",
  },
  7: {
    stopIndex: 7,
    locationName: "Neptune",
    url: "https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg",
    caption: "Voyager 2 narrow-angle image of Neptune and the Great Dark Spot at 30.1 AU.",
    credit: "NASA/JPL. Unaltered.",
  },
  8: {
    stopIndex: 8,
    locationName: "Pluto",
    url: "https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg",
    caption: "New Horizons high-resolution color portrait featuring Tombaugh Regio (the heart).",
    credit: "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute. Unaltered.",
  },
  9: {
    stopIndex: 9,
    locationName: "Heliopause",
    url: "https://images-assets.nasa.gov/image/PIA17046/PIA17046~medium.jpg",
    caption: "Voyager 1 enters interstellar space at 122 AU, crossing the heliopause in August 2012.",
    credit: "NASA/JPL-Caltech. Unaltered.",
  },
  10: {
    stopIndex: 10,
    locationName: "Earth",
    url: "https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~large.jpg",
    caption: "The Blue Marble (Apollo 17) - Earth viewed from deep space.",
    credit: "NASA. Unaltered.",
  },
};
