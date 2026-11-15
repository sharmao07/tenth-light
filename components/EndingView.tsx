'use client';
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShipDesign } from '@/lib/gameTypes';
import { calculateShipMetrics } from '@/lib/gameStore';
import { sound } from './AudioController';
import { PrintableCertificate } from './PrintableCertificate';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';

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
  const metrics = calculateShipMetrics(design);
  const earthPlate = NASA_IMAGE_PLATES[10];

  const hasWaterCertifier = metrics.hasWaterCertifier;
  const hasSoilCertifier = metrics.hasSoilCertifier;

  const isCertified = hasWaterCertifier && hasSoilCertifier && collectedWater && collectedSoil && uranusPassed;
  const isUncertified = (!hasWaterCertifier || !hasSoilCertifier || !collectedWater || !collectedSoil) && uranusPassed;
  const isThin = !uranusPassed;

  useEffect(() => {
    if (isCertified) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f0562b', '#e9e6dc', '#2a3039'],
        });
      } catch {}
    } else if (isUncertified) {
      sound.playUiClick();
    }
  }, [isCertified, isUncertified]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 select-none animate-fadeIn">
      {/* Top Dossier Ledger Bar */}
      <div className="flex items-baseline justify-between border-b border-paper/15 pb-4 mb-8">
        <div className="flex items-baseline gap-4">
          <span className="label text-signal">
            DOSSIER &middot; EXPEDITION DEBRIEFING
          </span>
          <span className="text-paper/40 text-xs font-mono">/</span>
          <span className="label text-paper-muted">
            ATMOSPHERIC RE-ENTRY CONFIRMED
          </span>
        </div>
        <div className="label text-paper-muted font-mono">
          VESSEL: TENTH LIGHT &middot; REF: TOI-700-E
        </div>
      </div>

      {/* Monumental Type-Led Headline */}
      <div className="mb-10">
        <p className="label">Mission Outcome &middot; Directorate Certification</p>
        <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-8xl tracking-tight text-paper mt-2">
          {isCertified && (
            <>
              Full <span className="font-extrabold text-paper">Certification</span>
            </>
          )}
          {isUncertified && (
            <>
              Uncertified <span className="font-extrabold text-signal">Return</span>
            </>
          )}
          {isThin && (
            <>
              Thin Mission <span className="font-extrabold text-signal">Archive</span>
            </>
          )}
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-paper-muted mt-3 max-w-2xl leading-relaxed">
          Deep Space Expedition Tenth Light &middot; Specialist {callsign} &amp; Astromech Droid Nori
        </p>
      </div>

      {/* Ruled Asymmetrical Columns: Large Uncropped NASA Photo + Science Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-14 border-b border-paper/15">
        {/* Left Column: Large Uncropped NASA Image Plate */}
        <div className="lg:col-span-7">
          <figure className="w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={earthPlate.url}
              alt={earthPlate.caption}
              loading="eager"
              decoding="async"
              className="w-full max-h-[500px] object-contain border border-paper/15 bg-void"
            />
            <figcaption className="mt-4 font-mono text-xs text-paper-muted leading-relaxed">
              <span className="text-signal font-bold">PLATE 10 &middot;</span> {earthPlate.caption}
              <span className="block mt-1 text-paper-muted font-mono text-[11px]">
                Credit: {earthPlate.credit}
              </span>
            </figcaption>
          </figure>

          <blockquote className="mt-8 border-l border-signal pl-6 text-sm text-paper-muted italic font-serif leading-relaxed m-0">
            &ldquo;The hatch stayed shut. Nori walked the sample sleeve across the frozen regolith of Harbor.
            A photograph is not a soil sample, but tonight the archive has both.&rdquo;
          </blockquote>
        </div>

        {/* Right Column: Directorate Audit & Certification Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-paper/15 p-6 bg-void">
            <h2 className="label text-signal pb-3 border-b border-paper/15">
              Planetary Science Directorate Review
            </h2>

            <dl className="mt-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-baseline py-1 border-b border-paper/10">
                <dt className="text-paper-muted">Mass Spectrometer</dt>
                <dd className={hasWaterCertifier ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {hasWaterCertifier ? 'ABOARD // FUNCTIONAL' : 'MISSING'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-paper/10">
                <dt className="text-paper-muted">Sample Drill Auger</dt>
                <dd className={hasSoilCertifier ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {hasSoilCertifier ? 'ABOARD // INTACT' : 'MISSING'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-paper/10">
                <dt className="text-paper-muted">Uranus 1/r&sup2; Thermal Bus</dt>
                <dd className={uranusPassed ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {uranusPassed ? 'HEATER BUS SURVIVED' : 'FROZEN'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-paper/10">
                <dt className="text-paper-muted">Harbor Water Canisters</dt>
                <dd className={collectedWater ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {collectedWater ? 'RETRIEVED (CANISTER 1 & 2)' : 'UNRECOVERED'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline py-1 border-b border-paper/10">
                <dt className="text-paper-muted">Harbor Soil Canisters</dt>
                <dd className={collectedSoil ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {collectedSoil ? 'RETRIEVED (MINERAL SLEEVE)' : 'UNRECOVERED'}
                </dd>
              </div>
            </dl>

            <div className="mt-4 pt-3 border-t border-paper/10 font-mono text-[10px] text-paper-muted leading-relaxed">
              <span className="text-signal font-bold">SCIENCE NOTE:</span> In accordance with NASA Exoplanet Archive parameters, TOI-700 e surface conditions remain unconfirmed by direct transmission spectroscopy. In-situ sampling is evaluated as an educational mission scenario.
            </div>
          </div>

          {/* Verdict Narrative */}
          <div className="space-y-3">
            <h3 className="label text-paper">Directorate Verdict</h3>
            {isCertified && (
              <p className="text-sm text-paper leading-relaxed font-sans">
                Mission fully certified. The Mass Spectrometer tasted Harbor’s vapor plumes and verified
                isotopic H2O signatures; the sample drill retrieved pristine exoplanetary regolith.
                Earth erupts in celebration. The Exoplanet Archive enshrines the numbers as empirical reality.
              </p>
            )}
            {isUncertified && (
              <p className="text-sm text-paper leading-relaxed font-sans">
                Partial return. The vessel touched the optimistic habitable zone of TOI-700 e, but either
                instrumentation was incomplete or samples were left unsealed. Scientists debate the telemetry,
                relying on inference rather than physical proof.
              </p>
            )}
            {isThin && (
              <p className="text-sm text-paper leading-relaxed font-sans">
                A thin voyage. The ship survived the 122 AU crossing of the heliopause, but arrived without
                the science payloads needed to answer Earth’s questions.
              </p>
            )}
          </div>

          {/* Restart Voyage Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRestart}
              onMouseEnter={() => sound.playHoverBlip()}
              className="btn flex-1 text-center"
            >
              <span>Design new voyage (Cape)</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
            <a
              href="/data"
              onMouseEnter={() => sound.playHoverBlip()}
              className="btn-quiet text-center font-mono text-xs uppercase"
            >
              Data (/data)
            </a>
          </div>
        </div>
      </div>

      {/* Printable Certificate & Manifest Section */}
      <div className="pt-10 w-full">
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
