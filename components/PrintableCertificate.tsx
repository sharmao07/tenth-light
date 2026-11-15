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
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 bg-[#141210] border border-[#e39b12]/40 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <span className="font-mono text-xs md:text-sm text-[#e39b12] font-bold uppercase tracking-wider">
            Official Mission Flight Manifest & Printable Certificate (pdfcn / snapcn)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyManifest}
            className="sensory-btn px-4 py-2 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#efe6d6]/30 text-xs font-mono uppercase tracking-wider rounded text-[#efe6d6] flex items-center gap-1.5 font-bold"
            title="Copy plain-text manifest to clipboard"
          >
            <span>📋</span>
            <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Manifest'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="sensory-btn px-5 py-2 bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] text-xs font-mono font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-md"
            title="Open browser print dialog to save as PDF"
          >
            <span>🖨️</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Sheet */}
      <div className="printable-document p-8 md:p-12 bg-[#efe6d6] text-[#1a1714] border-2 border-[#e39b12] rounded-b-lg font-serif shadow-2xl relative select-text">
        {/* Subtle Watermark or Corner Framing */}
        <div className="border-4 border-double border-[#1a1714]/40 p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 border-b-2 border-[#1a1714]/20 pb-5">
            <div className="font-mono text-xs uppercase tracking-widest text-[#1a1714]/70 font-bold">
              PLANETARY EXPLORATION DIRECTORATE • MISSION RECONNAISSANCE OFFICE
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-wider text-[#1a1714]">
              CERTIFICATE OF MISSION COMPLETION
            </h2>
            <div className="text-sm font-mono italic text-[#1a1714]/80">
              Deep Space Exploration Vessel: <span className="font-bold">Tenth Light</span> (TL-2026-TOI700E)
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 text-center rounded border-2 font-mono font-bold text-sm md:text-base ${
            isFullyCertified
              ? 'bg-[#e39b12]/20 border-[#e39b12] text-[#1a1714]'
              : isPartiallyCertified
              ? 'bg-[#1a1714]/10 border-[#1a1714]/40 text-[#1a1714]'
              : 'bg-[#c4452d]/15 border-[#c4452d] text-[#c4452d]'
          }`}>
            VERDICT: {statusLabel}
          </div>

          {/* Personnel & Mission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs md:text-sm pt-2">
            <div className="p-4 bg-[#1a1714]/5 rounded border border-[#1a1714]/20 space-y-2">
              <div className="font-bold uppercase tracking-wider border-b border-[#1a1714]/20 pb-1 text-[#1a1714]">
                Flight Personnel
              </div>
              <div>• Command Specialist: <span className="font-bold">{callsign}</span> (Never Left Seat)</div>
              <div>• Sample Recovery Droid: <span className="font-bold">Nori</span> (Astromech Sleeve Probe)</div>
              <div>• Target Exoplanet: <span className="font-bold">TOI-700 e</span> (Nicknamed Harbor)</div>
              <div>• Real Distance: <span className="font-bold">31.13 parsecs (101.5 light-years)</span></div>
            </div>

            <div className="p-4 bg-[#1a1714]/5 rounded border border-[#1a1714]/20 space-y-2">
              <div className="font-bold uppercase tracking-wider border-b border-[#1a1714]/20 pb-1 text-[#1a1714]">
                Vessel Engineering Specs
              </div>
              <div>• Launcher Stack: <span className="font-bold">{design.launcherId.toUpperCase()}</span> (Cap: {metrics.massCap} kg)</div>
              <div>• Total Vessel Dry Mass: <span className="font-bold">{metrics.totalMass} kg</span></div>
              <div>• Patched-Conic Delta-v: <span className="font-bold">{metrics.totalDeltaV} m/s</span></div>
              <div>• Uranus Thermal Supply (19.2 AU): <span className="font-bold">{metrics.uranusSupplyWatts.toFixed(1)} W</span> (Req: 55 W)</div>
            </div>
          </div>

          {/* Scientific Sample Verification */}
          <div className="p-4 bg-[#1a1714]/5 rounded border border-[#1a1714]/20 space-y-3 font-mono text-xs md:text-sm">
            <div className="font-bold uppercase tracking-wider border-b border-[#1a1714]/20 pb-1 text-[#1a1714]">
              Physical Science Payload Verification
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-2.5 bg-white/60 rounded border border-[#1a1714]/15">
                <div>
                  <div className="font-bold text-[#1a1714]">Hydro-Chemical (Mass Spectrometer)</div>
                  <div className="text-[11px] text-[#1a1714]/70">Water vapor/ice certification node</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  hasWaterCert ? 'bg-[#5bc0be]/30 text-[#1a1714] border border-[#5bc0be]' : 'bg-[#c4452d]/20 text-[#c4452d]'
                }`}>
                  {hasWaterCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white/60 rounded border border-[#1a1714]/15">
                <div>
                  <div className="font-bold text-[#1a1714]">Litho-Core (Regolith Drill)</div>
                  <div className="text-[11px] text-[#1a1714]/70">Physical surface regolith canister</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  hasSoilCert ? 'bg-[#e39b12]/30 text-[#1a1714] border border-[#e39b12]' : 'bg-[#c4452d]/20 text-[#c4452d]'
                }`}>
                  {hasSoilCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>
            </div>
          </div>

          {/* The Required Honesty Statement */}
          <div className="text-center text-xs font-serif italic text-[#1a1714]/80 p-3 bg-white/40 rounded border border-[#1a1714]/10 leading-relaxed">
            “Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive’s numbers. The aliens, the depot fight, and the droid are the story.”
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t-2 border-[#1a1714]/20 flex justify-between items-end font-mono text-xs">
            <div>
              <div className="border-b border-[#1a1714] w-48 mb-1" />
              <div className="font-bold">Directorate Field Seal</div>
              <div className="text-[10px] text-[#1a1714]/60">NASA Space Apps 2026</div>
            </div>
            <div className="text-right">
              <div className="border-b border-[#1a1714] w-48 mb-1" />
              <div className="font-bold">Specialist {callsign}</div>
              <div className="text-[10px] text-[#1a1714]/60">Flight Specialist In Command</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
