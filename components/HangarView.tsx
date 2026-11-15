'use client';
import React, { useState } from 'react';
import {
  ShipDesign,
  LAUNCHERS,
  OPTIONAL_PARTS,
  MAX_TEACHING_BUDGET,
} from '@/lib/gameTypes';
import { calculateShipMetrics } from '@/lib/gameStore';
import { Ship3DView } from './Ship3DView';
import { sound } from './AudioController';

interface HangarViewProps {
  design: ShipDesign;
  onUpdateDesign: (newDesign: ShipDesign) => void;
  onLaunch: () => void;
}

export function HangarView({ design, onUpdateDesign, onLaunch }: HangarViewProps) {
  const [showCoM, setShowCoM] = useState(false);
  const [showCoT, setShowCoT] = useState(false);
  const [showCoL, setShowCoL] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'propulsion' | 'power' | 'instrument'>('all');
  const [rightPanelTab, setRightPanelTab] = useState<'telemetry' | 'staging' | 'engineer'>('telemetry');

  const metrics = calculateShipMetrics(design);

  const setLauncher = (launcherId: 'kite' | 'keel') => {
    sound.playUiClick();
    onUpdateDesign({
      ...design,
      launcherId,
    });
  };

  const addPart = (partId: string) => {
    const partDef = OPTIONAL_PARTS.find((p) => p.id === partId);
    if (!partDef) return;
    const currentCount = design.parts[partId] || 0;
    const max = partDef.maxCount || 1;
    if (currentCount >= max) return;

    sound.playUiClick();
    onUpdateDesign({
      ...design,
      parts: {
        ...design.parts,
        [partId]: currentCount + 1,
      },
    });
  };

  const removePart = (partId: string) => {
    const currentCount = design.parts[partId] || 0;
    if (currentCount <= 0) return;

    sound.playUiClick();
    const newParts = { ...design.parts };
    if (currentCount === 1) {
      delete newParts[partId];
    } else {
      newParts[partId] = currentCount - 1;
    }
    onUpdateDesign({
      ...design,
      parts: newParts,
    });
  };

  // Step 0 Auto-build: builds the perfect certifying stack
  const handleAutoBuild = () => {
    sound.playSuccess();
    onUpdateDesign({
      launcherId: 'keel',
      parts: {
        command_module: 1,
        chemical_engine: 1,
        high_gain_antenna: 1,
        propellant_tank: 3,
        rtg: 1,
        spectrometer: 1,
        sample_drill: 1,
      },
    });
  };

  const filteredParts = OPTIONAL_PARTS.filter((part) => {
    if (activeCategory === 'all') return true;
    return part.category === activeCategory;
  });

  const tankCount = design.parts['propellant_tank'] || 0;
  const hasRTG = (design.parts['rtg'] || 0) > 0;
  const solarCount = design.parts['solar_array'] || 0;
  const hasSpectrometer = (design.parts['spectrometer'] || 0) > 0;
  const hasDrill = (design.parts['sample_drill'] || 0) > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-10 md:py-16 select-none animate-fadeIn flex flex-col gap-10">
      {/* Top Dossier Ledger Bar */}
      <div className="flex flex-wrap items-baseline justify-between border-b border-[#e9e6dc]/15 pb-4 gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#f0562b] font-bold">
            DOSSIER // STOP 00
          </span>
          <span className="text-[#e9e6dc]/40 text-xs font-mono">/</span>
          <span className="font-mono text-xs uppercase tracking-wider text-[#e9e6dc]/70">
            VEHICLE ASSEMBLY BUILDING &middot; CAPE CANAVERAL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAutoBuild}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn-quiet !border-[#f0562b] !text-[#f0562b]"
            title="Auto-build the optimal certifying spacecraft configuration"
          >
            Auto-build certifying stack &rarr;
          </button>
        </div>
      </div>

      {/* Monumental Type-Led Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e9e6dc]/15 pb-8">
        <div>
          <p className="label">Step 0 &middot; Spacecraft Engineering</p>
          <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-7xl tracking-tight text-[#e9e6dc] mt-2">
            Vehicle <span className="font-extrabold text-[#e9e6dc]">Integration</span>
          </h1>
          <p className="font-serif italic text-lg text-[#e9e6dc]/70 mt-2 max-w-xl">
            Bolt the stack. Balance the thermal bus at 19.2 AU. Meet delta-v burn minimums.
          </p>
        </div>

        {/* Launcher selector tabs */}
        <div className="flex flex-col gap-2">
          <span className="label">Primary Launch Vehicle</span>
          <div className="flex gap-2">
            {(['kite', 'keel'] as const).map((id) => {
              const l = LAUNCHERS[id];
              const isSelected = design.launcherId === id;
              return (
                <button
                  key={id}
                  onClick={() => setLauncher(id)}
                  onMouseEnter={() => sound.playHoverBlip()}
                  className={isSelected ? 'btn !text-xs !py-2.5 !px-4' : 'btn-quiet !text-xs !py-2.5 !px-4'}
                >
                  <span className="font-bold">{l.name}</span>
                  <span className="opacity-70 ml-2 font-mono">({l.cost}c &middot; {l.massCap}kg)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main 3-Column Dossier Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Catalog): Optional Parts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between border-b border-[#e9e6dc]/15 pb-3">
            <span className="label text-[#f0562b]">Modular Parts Catalog</span>
            <div className="flex gap-1">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'propulsion', label: 'Prop' },
                  { id: 'power', label: 'Power' },
                  { id: 'instrument', label: 'Science' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playUiClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    activeCategory === cat.id
                      ? 'text-[#f0562b] font-bold border-b border-[#f0562b]'
                      : 'text-[#e9e6dc]/50 hover:text-[#e9e6dc]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
            {filteredParts.map((part) => {
              const currentCount = design.parts[part.id] || 0;
              const max = part.maxCount || 1;
              const isMaxed = currentCount >= max;

              return (
                <div
                  key={part.id}
                  className={`border p-4 transition-all ${
                    currentCount > 0 ? 'border-[#f0562b]/80 bg-[#0a0c10]' : 'border-[#e9e6dc]/15 bg-[#0a0c10]'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-serif text-sm font-bold text-[#e9e6dc]">
                      {part.name}
                    </span>
                    <span className="font-mono text-xs text-[#f0562b]">
                      {part.mass}kg &middot; {part.cost}c
                    </span>
                  </div>
                  <p className="text-xs text-[#e9e6dc]/70 font-sans leading-relaxed mb-3">
                    {part.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e9e6dc]/10">
                    <span className="font-mono text-xs text-[#e9e6dc]/50">
                      Equipped: {currentCount}/{max}
                    </span>
                    <div className="flex gap-2">
                      {currentCount > 0 && (
                        <button
                          onClick={() => removePart(part.id)}
                          className="font-mono text-xs text-[#f0562b] hover:underline"
                        >
                          Remove
                        </button>
                      )}
                      {!isMaxed && (
                        <button
                          onClick={() => addPart(part.id)}
                          className="font-mono text-xs text-[#e9e6dc] hover:text-[#f0562b] font-bold"
                        >
                          + Add Part
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column (3D VAB Stage): 4 cols */}
        <div className="lg:col-span-4 border border-[#e9e6dc]/15 relative flex flex-col items-center justify-between h-[580px] bg-[#0a0c10]">
          {/* Top Stage Bar: VAB Header & KSP Overlay Toggles */}
          <div className="w-full flex items-center justify-between p-4 border-b border-[#e9e6dc]/10 z-10">
            <span className="label text-[11px]">VAB 3D Stage &middot; Calm Drift</span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoM(!showCoM);
                }}
                className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                  showCoM ? 'border-[#f0562b] text-[#f0562b] font-bold' : 'border-[#e9e6dc]/20 text-[#e9e6dc]/50'
                }`}
                title="Center of Mass"
              >
                CoM
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoT(!showCoT);
                }}
                className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                  showCoT ? 'border-[#f0562b] text-[#f0562b] font-bold' : 'border-[#e9e6dc]/20 text-[#e9e6dc]/50'
                }`}
                title="Center of Thrust"
              >
                CoT
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoL(!showCoL);
                }}
                className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                  showCoL ? 'border-[#e9e6dc] text-[#e9e6dc] font-bold' : 'border-[#e9e6dc]/20 text-[#e9e6dc]/50'
                }`}
                title="Center of Lift"
              >
                CoL
              </button>
            </div>
          </div>

          {/* 3D View Container */}
          <div className="w-full flex-1 relative">
            <Ship3DView
              design={design}
              interactive={true}
              showCoM={showCoM}
              showCoT={showCoT}
              showCoL={showCoL}
            />
          </div>

          {/* Core parts list footer */}
          <div className="w-full p-3 border-t border-[#e9e6dc]/10 text-center font-mono text-[11px] text-[#e9e6dc]/50">
            Core Module &middot; Chemical Thruster &middot; High-Gain Antenna &middot; Orbit drag active
          </div>
        </div>

        {/* Right Column (Staging & Readiness): 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel mode navigation */}
          <div className="flex border-b border-[#e9e6dc]/15 pb-2 gap-4">
            {(
              [
                { id: 'telemetry', label: 'Telemetry' },
                { id: 'staging', label: 'KSP Staging' },
                { id: 'engineer', label: 'Engineer’s Report' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab(t.id);
                }}
                className={`font-mono text-xs uppercase tracking-wider pb-1 transition-colors ${
                  rightPanelTab === t.id
                    ? 'text-[#f0562b] border-b-2 border-[#f0562b] font-bold'
                    : 'text-[#e9e6dc]/50 hover:text-[#e9e6dc]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Telemetry */}
          {rightPanelTab === 'telemetry' && (
            <div className="border border-[#e9e6dc]/15 p-5 space-y-5 bg-[#0a0c10]">
              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5">
                  <span className="text-[#e9e6dc]/70">Launch Mass:</span>
                  <span className={metrics.isMassLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.totalMass} / {metrics.massCap} kg
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e9e6dc]/10">
                  <div
                    className="h-full bg-[#f0562b] transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalMass / metrics.massCap) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5">
                  <span className="text-[#e9e6dc]/70">Teaching Budget:</span>
                  <span className={metrics.isCostLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.totalCost} / {MAX_TEACHING_BUDGET} c
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e9e6dc]/10">
                  <div
                    className="h-full bg-[#f0562b] transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalCost / MAX_TEACHING_BUDGET) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5">
                  <span className="text-[#e9e6dc]/70">Delta-V (Patched-Conic):</span>
                  <span className={metrics.canReachJupiter ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.totalDeltaV} m/s
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e9e6dc]/10">
                  <div
                    className="h-full bg-[#f0562b] transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalDeltaV / 7200) * 100)}%` }}
                  />
                </div>
                <p className="font-mono text-[11px] text-[#e9e6dc]/50 mt-1">
                  6,700 m/s minimum to reach Jupiter Depot. 3 tanks recommended.
                </p>
              </div>

              <div className="pt-2 border-t border-[#e9e6dc]/10">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#e9e6dc]/70">Uranus 19.2 AU Thermal Bus:</span>
                  <span className={metrics.uranusSurvives ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {Math.round(metrics.uranusSupplyWatts)}W / 55W
                  </span>
                </div>
                <p className="font-sans text-xs text-[#e9e6dc]/60 mt-1 leading-relaxed">
                  Solar drops by 1/r² to ~0.43W. RTG provides flat 100W to maintain 55W heater &amp; life support.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Staging */}
          {rightPanelTab === 'staging' && (
            <div className="border border-[#e9e6dc]/15 p-5 space-y-4 bg-[#0a0c10] font-mono text-xs">
              <div className="border-l-2 border-[#e9e6dc] pl-3 py-1">
                <span className="font-bold text-[#e9e6dc]">[STAGE 3] Payload &amp; Science</span>
                <p className="text-[#e9e6dc]/60 text-[11px] mt-0.5">
                  Command Pod &middot; High-Gain Antenna &middot; Science Instrumentation
                </p>
              </div>
              <div className="border-l-2 border-[#f0562b] pl-3 py-1">
                <span className="font-bold text-[#f0562b]">[STAGE 2] Power &amp; Thermal Bus</span>
                <p className="text-[#e9e6dc]/60 text-[11px] mt-0.5">
                  {hasRTG ? 'RTG (100W flat)' : solarCount > 0 ? `Solar Arrays (${solarCount * 160}W @ 1 AU)` : 'No power equipped!'}
                </p>
              </div>
              <div className="border-l-2 border-[#f0562b] pl-3 py-1">
                <span className="font-bold text-[#f0562b]">[STAGE 1] Interplanetary Fuel Core</span>
                <p className="text-[#e9e6dc]/60 text-[11px] mt-0.5">
                  {tankCount} Propellant Tanks ({tankCount * 2400} m/s)
                </p>
              </div>
              <div className="border-l-2 border-[#e9e6dc] pl-3 py-1">
                <span className="font-bold text-[#e9e6dc]">[STAGE 0] Earth Departure Ignition</span>
                <p className="text-[#e9e6dc]/60 text-[11px] mt-0.5">
                  Chemical Thruster (900 m/s Trans-Lunar Injection)
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Engineer’s Report */}
          {rightPanelTab === 'engineer' && (
            <div className="border border-[#e9e6dc]/15 p-5 space-y-3 bg-[#0a0c10] font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                <span>Delta-V Threshold:</span>
                <span className={metrics.canReachJupiter ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {metrics.canReachJupiter ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                <span>Mass Allowance:</span>
                <span className={metrics.isMassLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {metrics.isMassLegal ? 'PASS' : 'OVERWEIGHT'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                <span>Budget Cap:</span>
                <span className={metrics.isCostLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {metrics.isCostLegal ? 'PASS' : 'OVER BUDGET'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                <span>Uranus Thermal Bus:</span>
                <span className={metrics.uranusSurvives ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                  {metrics.uranusSurvives ? 'PASS' : 'FREEZE SCRUB'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e9e6dc]/10">
                <span>Spectrometer (Water):</span>
                <span className={hasSpectrometer ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b]'}>
                  {hasSpectrometer ? 'EQUIPPED' : 'MISSING'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sample Drill (Soil):</span>
                <span className={hasDrill ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b]'}>
                  {hasDrill ? 'EQUIPPED' : 'MISSING'}
                </span>
              </div>
            </div>
          )}

          {/* Hard errors / Warnings */}
          {metrics.hardErrors.length > 0 && (
            <div className="border border-[#f0562b] p-3 text-xs font-mono text-[#f0562b] leading-relaxed">
              &times; {metrics.hardErrors[0]}
            </div>
          )}
          {metrics.hardErrors.length === 0 && metrics.warnings.length > 0 && (
            <div className="border border-[#e9e6dc]/30 p-3 text-xs font-mono text-[#e9e6dc]/80 leading-relaxed">
              ! {metrics.warnings[0]}
            </div>
          )}

          {/* Launch Button */}
          <button
            onClick={() => {
              if (metrics.isLaunchLegal) {
                sound.playLaunch();
                onLaunch();
              }
            }}
            onMouseEnter={() => metrics.isLaunchLegal && sound.playHoverBlip()}
            disabled={!metrics.isLaunchLegal}
            className={`btn w-full ${!metrics.isLaunchLegal ? '!opacity-30 !cursor-not-allowed' : ''}`}
          >
            {metrics.isLaunchLegal ? 'Ignition & Launch (Spends 900 m/s) →' : 'Resolve Hard Errors to Launch'}
          </button>
        </div>
      </div>
    </div>
  );
}
