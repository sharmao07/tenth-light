'use client';
import React, { useState } from 'react';
import { ShipDesign } from '@/lib/gameTypes';
import { calculateShipMetrics } from '@/lib/gameStore';
import { sound } from './AudioController';

interface PrintableCertificateProps {
  design: ShipDesign;
  collectedWater: boolean;
  collectedSoil: boolean;
  uranusPassed: boolean;
  callsign: string;
}

export function PrintableCertificate({
  design,
  collectedWater,
  collectedSoil,
  uranusPassed,
  callsign,
}: PrintableCertificateProps) {
  const [copiedToast, setCopiedToast] = useState(false);
  const metrics = calculateShipMetrics(design);

  const hasWaterCert = metrics.hasWaterCertifier && collectedWater && uranusPassed;
  const hasSoilCert = metrics.hasSoilCertifier && collectedSoil && uranusPassed;
  const isFullyCertified = hasWaterCert && hasSoilCert;
  const isPartiallyCertified = (hasWaterCert || hasSoilCert) && !isFullyCertified;

  const statusLabel = isFullyCertified
    ? 'FULL SCIENTIFIC CERTIFICATION (CLASS 1)'
    : isPartiallyCertified
    ? 'PROVISIONAL SCIENTIFIC CERTIFICATION (CLASS 2)'
    : 'UNCONFIRMED RECONNAISSANCE RETURN (CLASS 3)';

  const handlePrint = () => {
    sound.playUiClick();
    window.print();
  };

  const handleCopyManifest = () => {
    sound.playUiClick();
    const manifestText = `========================================================================
NASA SPACE APPS 2026 // TENTH LIGHT MISSION CERTIFICATION REPORT
========================================================================
Mission: Tenth Light (Deep Space Reconnaissance to TOI-700 e)
Status: ${statusLabel}
Date of Certification: 15 November 2026
Flight Specialist: ${callsign}
Vessel Companion: Astromech Droid Nori

ENGINEERING & FLIGHT TELEMETRY:
- Launcher Architecture: ${design.launcherId.toUpperCase()} (Cap: ${metrics.massCap} kg)
- Total Dry Mass: ${metrics.totalMass} kg
- Total Patched-Conic Delta-v: ${metrics.totalDeltaV} m/s
- Earth Electrical Draw: ${metrics.powerDrawEarth} W / Supply: ${metrics.powerGenEarth} W
- Uranus Thermal Margin (19.2 AU): ${metrics.uranusSupplyWatts.toFixed(1)} W supply vs 55 W critical bus

PHYSICAL SAMPLE CERTIFICATION:
- Hydro-Chemical (Mass Spectrometer): ${hasWaterCert ? 'CERTIFIED H2O (18.015 amu)' : 'NOT CERTIFIED'}
- Litho-Core (Regolith Drill): ${hasSoilCert ? 'CERTIFIED EXOPLANET SOIL MATRIX' : 'NOT CERTIFIED'}

TRAVERSE LOG:
Earth (0) -> Moon (1) -> Mars (2) -> Ceres (3) -> Jupiter Depot (4)
-> Enceladus (5) -> Uranus (6) -> Neptune (7) -> Pluto (8) -> Heliopause (9)
-> TOI-700 e Harbor (10) -> Earth Directorate Return

HONESTY CLAUSE:
"Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet
Archive. The voyage past the heliopause is a mission simulation that uses the
archive's numbers. The aliens, the depot fight, and the droid are the story."
========================================================================`;

    navigator.clipboard.writeText(manifestText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Interactive Controls Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-6 p-6 bg-[#0f1217] border border-[#f0562b]/40 rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className="text-lg"></span>
          <span className="text-xs md:text-sm text-[#f0562b] font-bold uppercase tracking-wider">
            Official Mission Flight Manifest & Printable Certificate (pdfcn / snapcn)
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="/presentation"
            className="sensory-btn px-6 py-3 bg-[#12151b] hover:bg-[#e9e6dc]/20 border border-[#e9e6dc] text-xs tracking-wide rounded text-[#e9e6dc] flex items-center gap-2"
            title="View 7-Slide Space Apps Demonstration Deck"
          >
            <span>7-Slide Demo Deck</span>
          </a>

          <button
            onClick={handleCopyManifest}
            className="sensory-btn px-6 py-3 bg-[#12151b] hover:bg-[#e9e6dc]/10 border border-[#e9e6dc]/30 text-xs tracking-wide rounded text-[#e9e6dc] flex items-center gap-2"
            title="Copy plain-text manifest to clipboard"
          >
            <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Manifest'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="sensory-btn px-8 py-3 bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] text-xs tracking-wide rounded flex items-center gap-2 shadow-md"
            title="Open browser print dialog to save as PDF"
          >
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Sheet */}
      <div className="printable-document p-12 md:p-12 bg-[#e9e6dc] text-[#12151b] border border-[#f0562b] rounded-b-lg font-serif shadow-2xl relative select-text">
        {/* Subtle Watermark or Corner Framing */}
        <div className="border-4 border-double border-[#12151b]/40 p-10 md:p-12 space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 border-b-2 border-[#12151b]/20 pb-8">
            <div className="text-xs uppercase tracking-widest text-[#12151b]/70 font-bold">
              PLANETARY EXPLORATION DIRECTORATE • MISSION RECONNAISSANCE OFFICE
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-wider text-[#12151b]">
              CERTIFICATE OF MISSION COMPLETION
            </h2>
            <div className="text-sm italic text-[#12151b]/80">
              Deep Space Exploration Vessel: <span className="font-bold">Tenth Light</span> (TL-2026-TOI700E)
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-6 text-center rounded border font-bold text-sm md:text-base ${
            isFullyCertified
              ? 'bg-[#f0562b]/20 border-[#f0562b] text-[#12151b]'
              : isPartiallyCertified
              ? 'bg-[#12151b]/10 border-[#12151b]/40 text-[#12151b]'
              : 'bg-[#f0562b]/15 border-[#f0562b] text-[#f0562b]'
          }`}>
            VERDICT: {statusLabel}
          </div>

          {/* Personnel & Mission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs md:text-sm pt-3">
            <div className="p-6 bg-[#12151b]/5 rounded border border-[#12151b]/20 space-y-3">
              <div className="font-bold uppercase tracking-wider border-b border-[#12151b]/20 pb-1.5 text-[#12151b]">
                Flight Personnel
              </div>
              <div>• Command Specialist: <span className="font-bold">{callsign}</span> (Never Left Seat)</div>
              <div>• Sample Recovery Droid: <span className="font-bold">Nori</span> (Astromech Sleeve Probe)</div>
              <div>• Target Exoplanet: <span className="font-bold">TOI-700 e</span> (Nicknamed Harbor)</div>
              <div>• Real Distance: <span className="font-bold">31.13 parsecs (101.5 light-years)</span></div>
            </div>

            <div className="p-6 bg-[#12151b]/5 rounded border border-[#12151b]/20 space-y-3">
              <div className="font-bold uppercase tracking-wider border-b border-[#12151b]/20 pb-1.5 text-[#12151b]">
                Vessel Engineering Specs
              </div>
              <div>• Launcher Stack: <span className="font-bold">{design.launcherId.toUpperCase()}</span> (Cap: {metrics.massCap} kg)</div>
              <div>• Total Vessel Dry Mass: <span className="font-bold">{metrics.totalMass} kg</span></div>
              <div>• Patched-Conic Delta-v: <span className="font-bold">{metrics.totalDeltaV} m/s</span></div>
              <div>• Uranus Thermal Supply (19.2 AU): <span className="font-bold">{metrics.uranusSupplyWatts.toFixed(1)} W</span> (Req: 55 W)</div>
            </div>
          </div>

          {/* Scientific Sample Verification */}
          <div className="p-6 bg-[#12151b]/5 rounded border border-[#12151b]/20 space-y-5 text-xs md:text-sm">
            <div className="font-bold uppercase tracking-wider border-b border-[#12151b]/20 pb-1.5 text-[#12151b]">
              Physical Science Payload Verification
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-white/60 rounded border border-[#12151b]/15">
                <div>
                  <div className="font-bold text-[#12151b]">Hydro-Chemical (Mass Spectrometer)</div>
                  <div className="text-xs text-[#12151b]/70">Water vapor/ice certification node</div>
                </div>
                <span className={`px-3 py-1.5 rounded text-xs font-bold ${
                  hasWaterCert ? 'bg-[#e9e6dc]/30 text-[#12151b] border border-[#e9e6dc]' : 'bg-[#f0562b]/20 text-[#f0562b]'
                }`}>
                  {hasWaterCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/60 rounded border border-[#12151b]/15">
                <div>
                  <div className="font-bold text-[#12151b]">Litho-Core (Regolith Drill)</div>
                  <div className="text-xs text-[#12151b]/70">Physical surface regolith canister</div>
                </div>
                <span className={`px-3 py-1.5 rounded text-xs font-bold ${
                  hasSoilCert ? 'bg-[#f0562b]/30 text-[#12151b] border border-[#f0562b]' : 'bg-[#f0562b]/20 text-[#f0562b]'
                }`}>
                  {hasSoilCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>
            </div>
          </div>

          {/* The Required Honesty Statement */}
          <div className="text-center text-xs font-serif italic text-[#12151b]/80 p-5 bg-white/40 rounded border border-[#12151b]/10 leading-relaxed">
            “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t-2 border-[#12151b]/20 flex justify-between items-end text-xs">
            <div>
              <div className="border-b border-[#12151b] w-48 mb-1" />
              <div className="font-bold">Directorate Field Seal</div>
              <div className="text-xs text-[#12151b]/60">NASA Space Apps 2026</div>
            </div>
            <div className="text-right">
              <div className="border-b border-[#12151b] w-48 mb-1" />
              <div className="font-bold">Specialist {callsign}</div>
              <div className="text-xs text-[#12151b]/60">Flight Specialist In Command</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
