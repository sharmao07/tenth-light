'use client';
import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from './AudioController';
import { ShipDesign } from '@/lib/gameTypes';
import { PrintableCertificate } from './PrintableCertificate';

interface EndingViewProps {
  design: ShipDesign;
  collectedWater: boolean;
  collectedSoil: boolean;
  uranusPassed: boolean;
  callsign: string;
  onRestart: () => void;
}

export function EndingView({
  design,
  collectedWater,
  collectedSoil,
  uranusPassed,
  callsign,
  onRestart,
}: EndingViewProps) {
  const parts = design.parts || {};
  const hasWaterCertifier = (parts['spectrometer'] || 0) > 0;
  const hasSoilCertifier = (parts['sample_drill'] || 0) > 0;
  const instrumentsSurvive = hasWaterCertifier && hasSoilCertifier && uranusPassed;
  const samplesGathered = collectedWater && collectedSoil;

  const isCertified = instrumentsSurvive && samplesGathered;
  const isUncertified = !isCertified && (instrumentsSurvive || samplesGathered);
  const isThin = !isCertified && !isUncertified;

  const earthPlate = NASA_IMAGE_PLATES[10];
  const confettiFired = useRef(false);

  useEffect(() => {
    sound.playSuccess();
    if (!confettiFired.current && (isCertified || isUncertified)) {
      confettiFired.current = true;
      confetti({
        particleCount: isCertified ? 90 : 50,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f0562b', '#e9e6dc', '#e9e6dc', '#f0562b'],
      });
    }
  }, [isCertified, isUncertified]);

  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-20 select-none animate-fadeIn">
      {/* Top Dossier Ledger Bar */}
      <div className="flex items-baseline justify-between border-b border-[#e9e6dc]/15 pb-4 mb-8">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
            DOSSIER // EXPEDITION DEBRIEFING
          </span>
          <span className="text-[#e9e6dc]/40 text-xs font-mono">/</span>
          <span className="font-mono text-xs uppercase tracking-wider text-[#e9e6dc]/70">
            ATMOSPHERIC RE-ENTRY CONFIRMED
          </span>
        </div>
        <div className="font-mono text-xs text-[#e9e6dc]/40">
          VESSEL: TENTH LIGHT &middot; REF: TOI-700-E
        </div>
      </div>

      {/* Monumental Type-Led Headline */}
      <div className="mb-12">
        <p className="label">Mission Outcome &middot; Directorate Certification</p>
        <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-8xl tracking-tight text-[#e9e6dc] mt-2">
          {isCertified && (
            <>
              Full <span className="font-extrabold text-[#e9e6dc]">Certification</span>
            </>
          )}
          {isUncertified && (
            <>
              Uncertified <span className="font-extrabold text-[#f0562b]">Return</span>
            </>
          )}
          {isThin && (
            <>
              Thin Mission <span className="font-extrabold text-[#f0562b]">Archive</span>
            </>
          )}
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-[#e9e6dc]/70 mt-3 max-w-2xl leading-relaxed">
          Deep Space Expedition Tenth Light &middot; Specialist {callsign} &amp; Astromech Droid Nori
        </p>
      </div>

      {/* Ruled Asymmetrical Columns: Large Uncropped NASA Photo + Science Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16 border-b border-[#e9e6dc]/15">
        {/* Left Column: Large Uncropped NASA Image Plate */}
        <div className="lg:col-span-7">
          <figure className="w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={earthPlate.url}
              alt={earthPlate.caption}
              className="w-full max-h-[500px] object-contain border border-[#e9e6dc]/15 bg-[#0a0c10]"
            />
            <figcaption className="mt-4 font-mono text-xs text-[#e9e6dc]/70 leading-relaxed">
              <span className="text-[#f0562b] font-bold">PLATE 10 &middot;</span> {earthPlate.caption}
              <span className="block mt-1 text-[#e9e6dc]/40 font-mono text-[11px]">
                Credit: {earthPlate.credit}
              </span>
            </figcaption>
          </figure>

          <blockquote className="mt-8 border-l border-[#f0562b] pl-6 text-sm text-[#e9e6dc]/70 italic font-serif leading-relaxed">
            “The hatch stayed shut. Nori walked the sample sleeve across the frozen regolith of Harbor.
            A photograph is not a soil sample, but tonight the archive has both.”
          </blockquote>
        </div>

        {/* Right Column: Directorate Audit & Certification Checklist */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[#e9e6dc]/15 p-6 bg-[#0a0c10]">
            <h2 className="label text-[#f0562b] pb-3 border-b border-[#e9e6dc]/15">
              Planetary Science Directorate Review
            </h2>

            <dl className="mt-6 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-baseline py-1 border-b border-[#e9e6dc]/10">
                <dt className="text-[#e9e6dc]/70">Mass Spectrometer</dt>
                <dd className={hasWaterCertifier ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {hasWaterCertifier ? 'ABOARD // FUNCTIONAL' : 'MISSING'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#e9e6dc]/10">
                <dt className="text-[#e9e6dc]/70">Sample Drill Auger</dt>
                <dd className={hasSoilCertifier ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {hasSoilCertifier ? 'ABOARD // INTACT' : 'MISSING'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#e9e6dc]/10">
                <dt className="text-[#e9e6dc]/70">Uranus 1/r² Thermal Bus</dt>
                <dd className={uranusPassed ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {uranusPassed ? 'HEATER BUS SURVIVED' : 'FROZEN'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#e9e6dc]/10">
                <dt className="text-[#e9e6dc]/70">Harbor Water Canisters</dt>
                <dd className={collectedWater ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {collectedWater ? 'RETRIEVED (CANISTER 1 & 2)' : 'UNRECOVERED'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-[#e9e6dc]/10">
                <dt className="text-[#e9e6dc]/70">Harbor Soil Canisters</dt>
                <dd className={collectedSoil ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {collectedSoil ? 'RETRIEVED (MINERAL SLEEVE)' : 'UNRECOVERED'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Verdict Narrative */}
          <div className="space-y-4">
            <h3 className="label">Directorate Verdict</h3>
            {isCertified && (
              <p className="text-sm text-[#e9e6dc]/85 leading-relaxed font-sans">
                Mission fully certified. The Mass Spectrometer tasted Harbor’s vapor plumes and verified
                isotopic H2O signatures; the sample drill retrieved pristine exoplanetary regolith.
                Earth erupts in celebration. The Exoplanet Archive enshrines the numbers as empirical reality.
              </p>
            )}
            {isUncertified && (
              <p className="text-sm text-[#e9e6dc]/85 leading-relaxed font-sans">
                Partial return. The vessel touched the optimistic habitable zone of TOI-700 e, but either
                instrumentation was incomplete or samples were left unsealed. Scientists debate the telemetry,
                relying on inference rather than physical proof.
              </p>
            )}
            {isThin && (
              <p className="text-sm text-[#e9e6dc]/85 leading-relaxed font-sans">
                A thin voyage. The ship survived the 122 AU crossing of the heliopause, but arrived without
                the science payloads needed to answer Earth’s questions.
              </p>
            )}
          </div>

          {/* Restart Voyage Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={onRestart}
              onMouseEnter={() => sound.playHoverBlip()}
              className="btn flex-1 text-center"
            >
              Design new voyage (Cape Canaveral) &rarr;
            </button>
            <a
              href="/data"
              onMouseEnter={() => sound.playHoverBlip()}
              className="btn-quiet text-center"
            >
              Scientific Data (/data)
            </a>
          </div>
        </div>
      </div>

      {/* Printable Certificate & Manifest Section */}
      <div className="pt-12 w-full">
        <PrintableCertificate
          design={design}
          collectedWater={collectedWater}
          collectedSoil={collectedSoil}
          uranusPassed={uranusPassed}
          callsign={callsign}
        />
      </div>
    </div>
  );
}
