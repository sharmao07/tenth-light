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
    <div className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-[#0a0c10] text-[#e9e6dc] select-none flex flex-col items-center">
      {/* Title / Outcome Banner */}
      <div className="text-center mb-6 space-y-3">
        <div className="text-xs md:text-sm text-[#f0562b] uppercase tracking-widest font-bold">
          Mission Complete • Atmospheric Re-entry Confirmed
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wide">
          {isCertified && <span className="text-[#e9e6dc]">FULL CERTIFICATION GRANTED</span>}
          {isUncertified && <span className="text-[#f0562b]">UNCERTIFIED RETURN</span>}
          {isThin && <span className="text-[#f0562b]">THIN MISSION RETURN</span>}
        </h1>
        <p className="text-sm md:text-base text-[#e9e6dc]/70">
          Deep Space Vessel Tenth Light • Specialist {callsign} & Droid Nori
        </p>
      </div>

      {/* Main Grid: NASA Earth Plate in a window + Mission Ledger */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-8">
        {/* Unaltered NASA Earth Image in a Window */}
        <div className="bg-[#12151b] p-6 border border-[#f0562b] rounded-lg shadow-2xl flex flex-col items-center">
          <div className="w-full h-64 relative overflow-hidden rounded-md bg-[#0a0c10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={earthPlate.url}
              alt="Earth observed from space"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2.5 text-xs text-[#e9e6dc]/80 flex justify-between items-center leading-relaxed">
            <span className="text-[#f0562b] font-bold">{earthPlate.credit}</span>
            <span className="truncate max-w-[220px]">{earthPlate.caption}</span>
          </div>
        </div>

        {/* Earth's Reaction & Certification Breakdown */}
        <div className="bg-[#12151b] border border-[#e9e6dc]/20 p-8 rounded-lg space-y-6 font-sans shadow-md">
          <div className="text-sm font-serif text-[#f0562b] border-b border-[#e9e6dc]/15 pb-3 uppercase tracking-tight">
            Planetary Science Directorate Review
          </div>

          <div className="space-y-3 text-xs md:text-sm ">
            <div className="flex justify-between items-center py-0.5">
              <span>Mass Spectrometer (Water):</span>
              <span className={`font-bold ${hasWaterCertifier ? 'text-[#e9e6dc]' : 'text-[#f0562b]'}`}>
                {hasWaterCertifier ? 'ABOARD' : 'MISSING'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Sample Drill (Soil):</span>
              <span className={`font-bold ${hasSoilCertifier ? 'text-[#e9e6dc]' : 'text-[#f0562b]'}`}>
                {hasSoilCertifier ? 'ABOARD' : 'MISSING'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Uranus Thermal Survival:</span>
              <span className={`font-bold ${uranusPassed ? 'text-[#e9e6dc]' : 'text-[#f0562b]'}`}>
                {uranusPassed ? 'HEAT MAINTAINED' : 'FROZEN'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Harbor Water Canisters:</span>
              <span className={`font-bold ${collectedWater ? 'text-[#e9e6dc]' : 'text-[#f0562b]'}`}>
                {collectedWater ? 'RETRIEVED' : 'NOT COLLECTED'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span>Harbor Soil Canisters:</span>
              <span className={`font-bold ${collectedSoil ? 'text-[#e9e6dc]' : 'text-[#f0562b]'}`}>
                {collectedSoil ? 'RETRIEVED' : 'NOT COLLECTED'}
              </span>
            </div>
          </div>

          {/* Narrative Verdict: Spacious & Relaxed */}
          <div className="p-6 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg text-sm md:text-base leading-relaxed font-serif">
            {isCertified && (
              <p className="text-[#e9e6dc]">
                Earth erupts in thunderous celebration! Both the spectrometer and drill survived the deep freeze,
                and Nori’s retrieval of pristine Harbor core samples provided indisputable isotopic proof of surface
                water and organic minerals on TOI-700 e. The mission is officially certified as humankind’s greatest
                interstellar expedition.
              </p>
            )}
            {isUncertified && (
              <p className="text-[#e9e6dc]">
                The scientific assembly gives polite, respectful applause. You crossed the heliopause and returned,
                but because {instrumentsSurvive ? 'surface sample canisters were incomplete' : 'proper certifying instruments were missing or frozen'},
                the findings remain tentative and uncertified. The voyage will need to be repeated.
              </p>
            )}
            {isThin && (
              <p className="text-[#e9e6dc]">
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
      <div className="no-print flex flex-col sm:flex-row gap-6 mt-4">
        <button
          onClick={() => {
            sound.playUiClick();
            onRestart();
          }}
          onMouseEnter={() => sound.playHoverBlip()}
          className="sensory-btn px-7 py-5 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] tracking-wide text-xs md:text-sm rounded transition-colors shadow-lg"
        >
          Begin New Mission (Return to Hangar)
        </button>

        <a
          href="/data"
          onMouseEnter={() => sound.playHoverBlip()}
          className="sensory-btn px-7 py-5 bg-[#12151b] hover:bg-[#e9e6dc]/10 border border-[#e9e6dc]/30 text-[#e9e6dc] text-xs md:text-sm tracking-wide rounded transition-colors flex items-center justify-center"
        >
          View Scientific Data & Citations (/data)
        </a>
      </div>
    </div>
  );
}
