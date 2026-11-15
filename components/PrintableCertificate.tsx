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
    <section aria-labelledby="certificate-heading" className="w-full max-w-4xl mx-auto my-8">
      {/* Interactive Controls Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-6 p-6 bg-surface-raised border border-signal/40">
        <div className="flex items-center gap-3">
          <span className="label text-signal">
            Official Mission Flight Manifest & Printable Certificate
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/presentation"
            className="sensory-btn px-5 py-2.5 bg-void hover:bg-paper/20 border border-paper text-xs uppercase font-mono tracking-wider text-paper flex items-center gap-2"
            title="View 7-Slide Space Apps Demonstration Deck"
          >
            <span>7-Slide Demo</span>
          </a>

          <button
            onClick={handleCopyManifest}
            className="sensory-btn px-5 py-2.5 bg-void hover:bg-paper/10 border border-paper/30 text-xs uppercase font-mono tracking-wider text-paper flex items-center gap-2"
            title="Copy plain-text manifest to clipboard"
          >
            <span className="tabular-nums">{copiedToast ? 'Copied to Clipboard' : 'Copy Manifest'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="sensory-btn px-6 py-2.5 bg-signal hover:bg-signal-hover text-void text-xs uppercase font-mono font-bold tracking-wider flex items-center gap-2"
            title="Open browser print dialog to save as PDF"
          >
            <span>Print / Save PDF &rarr;</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Sheet (Optimized for Screen & Print) */}
      <div className="printable-document p-8 md:p-12 bg-paper text-void border border-paper font-sans relative select-text">
        <div className="certificate-inner border-2 border-void/30 p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 border-b border-void/20 pb-6">
            <span className="label text-void/80 font-bold">
              Planetary Exploration Directorate &middot; Mission Reconnaissance Office
            </span>
            <h2 id="certificate-heading" className="text-3xl md:text-5xl font-serif font-extrabold tracking-tight text-void">
              Certificate of Mission Completion
            </h2>
            <div className="text-sm font-sans italic text-void/80 pt-1">
              Deep Space Exploration Vessel: <span className="font-bold text-void">Tenth Light</span> (<span className="font-mono tabular-nums">TL-2026-TOI700E</span>)
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 text-center border font-mono font-bold text-xs md:text-sm tracking-wider uppercase ${
            isFullyCertified
              ? 'bg-signal/15 border-signal text-void'
              : isPartiallyCertified
              ? 'bg-void/10 border-void/40 text-void'
              : 'bg-signal/20 border-signal text-signal'
          }`}>
            Verdict: {statusLabel}
          </div>

          {/* Personnel & Mission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm pt-2">
            <div className="p-5 bg-void/5 border border-void/15 space-y-2.5">
              <h3 className="label text-void border-b border-void/20 pb-1.5">
                Flight Personnel
              </h3>
              <div className="text-void/90">&bull; Command Specialist: <span className="font-bold text-void">{callsign}</span> (Never Left Seat)</div>
              <div className="text-void/90">&bull; Sample Recovery Droid: <span className="font-bold text-void">Nori</span> (Astromech Sleeve Probe)</div>
              <div className="text-void/90">&bull; Target Exoplanet: <span className="font-bold text-void">TOI-700 e</span> (Nicknamed Harbor)</div>
              <div className="text-void/90">&bull; Real Astrometric Distance: <span className="font-bold font-mono tabular-nums text-void">31.13 parsecs (101.5 ly)</span></div>
            </div>

            <div className="p-5 bg-void/5 border border-void/15 space-y-2.5">
              <h3 className="label text-void border-b border-void/20 pb-1.5">
                Vessel Engineering Specs
              </h3>
              <div className="text-void/90">&bull; Launcher Architecture: <span className="font-bold font-mono text-void">{design.launcherId.toUpperCase()}</span> (Cap: <span className="font-mono tabular-nums">{metrics.massCap} kg</span>)</div>
              <div className="text-void/90">&bull; Total Vessel Dry Mass: <span className="font-bold font-mono tabular-nums text-void">{metrics.totalMass} kg</span></div>
              <div className="text-void/90">&bull; Patched-Conic Delta-v: <span className="font-bold font-mono tabular-nums text-void">{metrics.totalDeltaV} m/s</span></div>
              <div className="text-void/90">&bull; Uranus Thermal Supply (19.2 AU): <span className="font-bold font-mono tabular-nums text-void">{metrics.uranusSupplyWatts.toFixed(1)} W</span> (Req: 55 W)</div>
            </div>
          </div>

          {/* Scientific Sample Verification */}
          <div className="p-5 bg-void/5 border border-void/15 space-y-4 text-xs md:text-sm">
            <h3 className="label text-void border-b border-void/20 pb-1.5">
              Physical Science Payload Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-paper/60 border border-void/15">
                <div>
                  <div className="font-bold text-void">Hydro-Chemical (Mass Spectrometer)</div>
                  <div className="text-xs text-void/75">Water vapor/ice certification node</div>
                </div>
                <span className={`px-2.5 py-1 font-mono text-xs font-bold ${
                  hasWaterCert ? 'bg-void text-paper' : 'bg-signal/20 text-signal border border-signal'
                }`}>
                  {hasWaterCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-paper/60 border border-void/15">
                <div>
                  <div className="font-bold text-void">Litho-Core (Regolith Drill)</div>
                  <div className="text-xs text-void/75">Physical surface regolith canister</div>
                </div>
                <span className={`px-2.5 py-1 font-mono text-xs font-bold ${
                  hasSoilCert ? 'bg-void text-paper' : 'bg-signal/20 text-signal border border-signal'
                }`}>
                  {hasSoilCert ? '✓ CERTIFIED' : '✕ UNCONFIRMED'}
                </span>
              </div>
            </div>
          </div>

          {/* The Required Honesty Statement */}
          <blockquote className="text-center text-xs font-serif italic text-void/85 p-4 bg-void/5 border border-void/10 leading-relaxed m-0">
            &ldquo;Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive. The voyage past the heliopause is a mission simulation that uses the archive&rsquo;s numbers. The aliens, the depot fight, and the droid are the story.&rdquo;
          </blockquote>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-void/20 flex justify-between items-end text-xs">
            <div>
              <div className="border-b border-void w-44 mb-1" />
              <div className="font-bold text-void">Directorate Field Seal</div>
              <div className="label text-void/70 font-mono">NASA Space Apps 2026</div>
            </div>
            <div className="text-right">
              <div className="border-b border-void w-44 mb-1" />
              <div className="font-bold text-void">Specialist {callsign}</div>
              <div className="label text-void/70 font-mono">Flight Specialist In Command</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
