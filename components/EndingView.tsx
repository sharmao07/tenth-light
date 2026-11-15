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
        colors: ['#e39b12', '#efe6d6', '#5bc0be', '#c4452d'],
      });
    }
  }, [isCertified, isUncertified]);

  return (
    <div className="w-full max-w-4xl mx-auto p-5 md:p-8 bg-[#100e0c] text-[#efe6d6] select-none flex flex-col items-center">
      {/* Title / Outcome Banner */}
      <div className="text-center mb-6 space-y-2">
        <div className="text-xs md:text-sm font-mono text-[#e39b12] uppercase tracking-widest font-bold">
          Mission Complete • Atmospheric Re-entry Confirmed
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
          {isCertified && <span className="text-[#5bc0be]">FULL CERTIFICATION GRANTED</span>}
          {isUncertified && <span className="text-[#e39b12]">UNCERTIFIED RETURN</span>}
          {isThin && <span className="text-[#c4452d]">THIN MISSION RETURN</span>}
        </h1>
        <p className="text-sm md:text-base font-mono text-[#efe6d6]/70">
          Deep Space Vessel Tenth Light • Specialist {callsign} & Droid Nori
        </p>
      </div>

      {/* Main Grid: NASA Earth Plate in a window + Mission Ledger */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
        {/* Unaltered NASA Earth Image in a Window */}
        <div className="bg-[#1a1714] p-4 border-2 border-[#e39b12] rounded-lg shadow-2xl flex flex-col items-center">
          <div className="w-full h-64 relative overflow-hidden rounded-md bg-[#100e0c]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={earthPlate.url}
              alt="Earth observed from space"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2.5 text-xs font-mono text-[#efe6d6]/80 flex justify-between items-center leading-relaxed">
            <span className="text-[#e39b12] font-bold">{earthPlate.credit}</span>
            <span className="truncate max-w-[220px]">{earthPlate.caption}</span>
          </div>
        </div>

        {/* Earth's Reaction & Certification Breakdown */}
        <div className="bg-[#1a1714] border border-[#efe6d6]/20 p-5 rounded-lg space-y-4 font-sans shadow-md">
          <div className="text-sm font-serif font-bold text-[#e39b12] border-b border-[#efe6d6]/15 pb-2 uppercase tracking-wider">
            Planetary Science Directorate Review
          </div>

          <div className="space-y-2 text-xs md:text-sm font-mono">
            <div className="flex justify-between items-center py-0.5">
              <span>Mass Spectrometer (Water):</span>
              <span className={`font-bold ${hasWaterCertifier ? 'text-[#5bc0be]' : 'text-[#c4452d]'}`}>
                {hasWaterCertifier ? 'ABOARD' : 'MISSING'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Sample Drill (Soil):</span>
              <span className={`font-bold ${hasSoilCertifier ? 'text-[#5bc0be]' : 'text-[#c4452d]'}`}>
                {hasSoilCertifier ? 'ABOARD' : 'MISSING'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Uranus Thermal Survival:</span>
              <span className={`font-bold ${uranusPassed ? 'text-[#5bc0be]' : 'text-[#c4452d]'}`}>
                {uranusPassed ? 'HEAT MAINTAINED' : 'FROZEN'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Harbor Water Canisters:</span>
              <span className={`font-bold ${collectedWater ? 'text-[#5bc0be]' : 'text-[#c4452d]'}`}>
                {collectedWater ? 'RETRIEVED' : 'NOT COLLECTED'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Harbor Soil Canisters:</span>
              <span className={`font-bold ${collectedSoil ? 'text-[#5bc0be]' : 'text-[#c4452d]'}`}>
                {collectedSoil ? 'RETRIEVED' : 'NOT COLLECTED'}
              </span>
            </div>
          </div>

          {/* Narrative Verdict: Spacious & Relaxed */}
          <div className="p-4 bg-[#100e0c] border border-[#efe6d6]/20 rounded-lg text-sm md:text-base leading-relaxed font-serif">
            {isCertified && (
              <p className="text-[#efe6d6]">
                Earth erupts in thunderous celebration! Both the spectrometer and drill survived the deep freeze,
                and Nori’s retrieval of pristine Harbor core samples provided indisputable isotopic proof of surface
                water and organic minerals on TOI-700 e. The mission is officially certified as humankind’s greatest
                interstellar expedition.
              </p>
            )}
            {isUncertified && (
              <p className="text-[#efe6d6]">
                The scientific assembly gives polite, respectful applause. You crossed the heliopause and returned,
                but because {instrumentsSurvive ? 'surface sample canisters were incomplete' : 'proper certifying instruments were missing or frozen'},
                the findings remain tentative and uncertified. The voyage will need to be repeated.
              </p>
            )}
            {isThin && (
              <p className="text-[#efe6d6]">
                The control room falls silent. The vessel coasted back with neither the certifying instrumentation nor
                the physical soil and water canisters. While survival across 100 light-years is a telemetry feat,
                the scientific return is thin.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Printable Flight Certificate & Manifest Export (pdfcn / snapcn) */}
      <PrintableCertificate
        design={design}
        collectedWater={collectedWater}
        collectedSoil={collectedSoil}
        uranusPassed={uranusPassed}
        callsign={callsign}
      />

      {/* Buttons (Hidden when printing official document) */}
      <div className="no-print flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={() => {
            sound.playUiClick();
            onRestart();
          }}
          onMouseEnter={() => sound.playHoverBlip()}
          className="sensory-btn px-7 py-3 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] font-mono font-bold uppercase tracking-wider text-xs md:text-sm rounded transition-colors shadow-lg"
        >
          Begin New Mission (Return to Hangar)
        </button>

        <a
          href="/data"
          onMouseEnter={() => sound.playHoverBlip()}
          className="sensory-btn px-7 py-3 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-[#efe6d6] font-mono text-xs md:text-sm uppercase tracking-wider rounded transition-colors flex items-center justify-center font-bold"
        >
          View Scientific Data & Citations (/data)
        </a>
      </div>
    </div>
  );
}
