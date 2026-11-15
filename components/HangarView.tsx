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
  lives?: number;
}

export function HangarView({ design, onUpdateDesign, onLaunch, lives = 3 }: HangarViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'propulsion' | 'power' | 'instrument'>('all');
  const [showCoM, setShowCoM] = useState<boolean>(false);
  const [showCoT, setShowCoT] = useState<boolean>(false);
  const [showCoL, setShowCoL] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<'telemetry' | 'staging' | 'engineer'>('telemetry');

  const metrics = calculateShipMetrics(design);

  // Auto-build canonical certifying loadout: Keel, 3 propellant tanks, RTG, Spectrometer, Drill
  const handleAutoBuild = () => {
    sound.playUiClick();
    const optimalDesign: ShipDesign = {
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
    };
    onUpdateDesign(optimalDesign);
  };

  const setLauncher = (launcherId: 'kite' | 'keel') => {
    sound.playSwitchClick();
    onUpdateDesign({
      ...design,
      launcherId,
    });
  };

  const addPart = (partId: string) => {
    const current = design.parts[partId] || 0;
    const part = OPTIONAL_PARTS.find((p) => p.id === partId);
    const max = part?.maxCount || 1;
    if (current < max) {
      sound.playUiClick();
      onUpdateDesign({
        ...design,
        parts: {
          ...design.parts,
          [partId]: current + 1,
        },
      });
    }
  };

  const removePart = (partId: string) => {
    const current = design.parts[partId] || 0;
    if (current > 0) {
      sound.playSwitchClick();
      const updated = { ...design.parts };
      if (current === 1) {
        delete updated[partId];
      } else {
        updated[partId] = current - 1;
      }
      onUpdateDesign({
        ...design,
        parts: updated,
      });
    }
  };

  const filteredParts = OPTIONAL_PARTS.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const tankCount = design.parts['propellant_tank'] || 0;
  const solarCount = design.parts['solar_array'] || 0;
  const hasRTG = (design.parts['rtg'] || 0) > 0;
  const hasSpectrometer = (design.parts['spectrometer'] || 0) > 0;
  const hasDrill = (design.parts['sample_drill'] || 0) > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 select-none animate-fadeIn flex flex-col gap-8">
      {/* Top Dossier Ledger Bar */}
      <div className="flex flex-wrap items-baseline justify-between border-b border-paper/15 pb-4 gap-4">
        <div className="flex items-baseline gap-4">
          <span className="label text-signal">
            DOSSIER &middot; STOP 00
          </span>
          <span className="text-paper/40 text-xs font-mono">/</span>
          <span className="label text-paper-muted">
            VEHICLE ASSEMBLY BUILDING &middot; CAPE CANAVERAL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAutoBuild}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn-quiet !border-signal !text-signal font-mono text-xs uppercase"
            title="Auto-build the optimal certifying spacecraft configuration"
          >
            Auto-build certifying stack &rarr;
          </button>
        </div>
      </div>

      {/* Monumental Type-Led Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-paper/15 pb-6">
        <div>
          <p className="label">Step 0 &middot; Spacecraft Engineering</p>
          <h1 className="font-serif font-extralight text-5xl sm:text-6xl md:text-7xl tracking-tight text-paper mt-1">
            Vehicle <span className="font-extrabold text-paper">Integration</span>
          </h1>
          <p className="font-serif italic text-lg text-paper-muted mt-2 max-w-xl">
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
                  className={isSelected ? 'btn !text-xs !py-2 !px-4' : 'btn-quiet !text-xs !py-2 !px-4 font-mono'}
                >
                  <span className="font-bold">{l.name}</span>
                  <span className="opacity-80 ml-2 font-mono tabular-nums">({l.cost}c &middot; {l.massCap}kg)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Persistent Hull & Budget Readout Bar (Always Visible inside Hangar) */}
      <div 
        role="region" 
        aria-label="Hangar telemetry readouts"
        className="w-full bg-void border border-paper/15 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center select-none"
      >
        {/* Hull Integrity Readout */}
        <div className="flex flex-col gap-1.5 sm:border-r sm:border-paper/10 sm:pr-4">
          <div className="flex items-baseline justify-between">
            <span className="label text-paper-muted">Hull Integrity</span>
            <span className="font-mono text-xs font-bold tabular-nums text-paper">{lives}/3</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex gap-1.5" aria-label={`Hull integrity ${lives} of 3`}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`block h-3 w-7 transition-colors duration-500 ${
                    i < lives ? 'bg-signal' : 'bg-paper/20'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] text-paper-muted">
              {lives === 3 ? 'Max Nominal' : lives === 2 ? 'Sub-optimal' : 'Critical'}
            </span>
          </div>
        </div>

        {/* Teaching Budget Readout */}
        <div className="flex flex-col gap-1.5 sm:border-r sm:border-paper/10 sm:pr-4">
          <div className="flex items-baseline justify-between">
            <span className="label text-paper-muted">Teaching Budget</span>
            <span className={`font-mono text-xs font-bold tabular-nums ${metrics.isCostLegal ? 'text-signal' : 'text-signal font-extrabold'}`}>
              {metrics.totalCost} / {MAX_TEACHING_BUDGET} c
            </span>
          </div>
          <div className="w-full h-2 bg-paper/10">
            <div
              className="h-full bg-signal transition-all"
              style={{ width: `${Math.min(100, (metrics.totalCost / MAX_TEACHING_BUDGET) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-paper-muted tabular-nums">
            <span>{metrics.isCostLegal ? `${MAX_TEACHING_BUDGET - metrics.totalCost} c remaining` : `Exceeded by ${metrics.totalCost - MAX_TEACHING_BUDGET} c`}</span>
            <span className={metrics.isCostLegal ? 'text-paper font-semibold' : 'text-signal font-bold'}>
              {metrics.isCostLegal ? 'OK' : 'OVER BUDGET'}
            </span>
          </div>
        </div>

        {/* Launch Mass Readout */}
        <div className="flex flex-col gap-1.5 sm:border-r sm:border-paper/10 sm:pr-4">
          <div className="flex items-baseline justify-between">
            <span className="label text-paper-muted">Payload Mass</span>
            <span className={`font-mono text-xs font-bold tabular-nums ${metrics.isMassLegal ? 'text-paper' : 'text-signal font-extrabold'}`}>
              {metrics.totalMass} / {metrics.massCap} kg
            </span>
          </div>
          <div className="w-full h-2 bg-paper/10">
            <div
              className={`h-full transition-all ${metrics.isMassLegal ? 'bg-paper' : 'bg-signal'}`}
              style={{ width: `${Math.min(100, (metrics.totalMass / metrics.massCap) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-paper-muted tabular-nums">
            <span>{design.launcherId.toUpperCase()} launcher limit</span>
            <span className={metrics.isMassLegal ? 'text-paper font-semibold' : 'text-signal font-bold'}>
              {metrics.isMassLegal ? 'OK' : 'OVERWEIGHT'}
            </span>
          </div>
        </div>

        {/* Delta-V Patched-Conic Readout */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="label text-paper-muted">Delta-V (Jupiter Leg)</span>
            <span className={`font-mono text-xs font-bold tabular-nums ${metrics.canReachJupiter ? 'text-paper font-bold' : 'text-signal font-extrabold'}`}>
              {metrics.totalDeltaV} m/s
            </span>
          </div>
          <div className="w-full h-2 bg-paper/10">
            <div
              className={`h-full transition-all ${metrics.canReachJupiter ? 'bg-signal' : 'bg-signal/50'}`}
              style={{ width: `${Math.min(100, (metrics.totalDeltaV / 7200) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[11px] text-paper-muted tabular-nums">
            <span>6,700 m/s burn req.</span>
            <span className={metrics.canReachJupiter ? 'text-signal font-semibold' : 'text-signal font-bold'}>
              {metrics.canReachJupiter ? 'REACHES DEPOT' : 'SHORTAGE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Dossier Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Catalog): Optional Parts (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center justify-between border-b border-paper/15 pb-3">
            <h2 className="label text-signal">Modular Parts Catalog</h2>
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
                      ? 'text-signal font-bold border-b border-signal'
                      : 'text-paper-muted hover:text-paper'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Part Cards */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
            {filteredParts.map((part) => {
              const currentCount = design.parts[part.id] || 0;
              const max = part.maxCount || 1;
              const isMaxed = currentCount >= max;

              return (
                <div
                  key={part.id}
                  className={`border p-4 transition-all ${
                    currentCount > 0 ? 'border-signal bg-void' : 'border-paper/15 bg-void'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-serif text-sm font-bold text-paper">
                      {part.name}
                    </span>
                    <span className="font-mono text-xs text-signal tabular-nums">
                      {part.mass}kg &middot; {part.cost}c
                    </span>
                  </div>
                  <p className="text-xs text-paper-muted font-sans leading-relaxed mb-3">
                    {part.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-paper/10">
                    <span className="font-mono text-xs text-paper-muted tabular-nums">
                      Equipped: {currentCount}/{max}
                    </span>
                    <div className="flex gap-3">
                      {currentCount > 0 && (
                        <button
                          onClick={() => removePart(part.id)}
                          className="font-mono text-xs text-signal hover:underline"
                        >
                          Remove
                        </button>
                      )}
                      {!isMaxed && (
                        <button
                          onClick={() => addPart(part.id)}
                          className="font-mono text-xs text-paper hover:text-signal font-bold"
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
        <div className="lg:col-span-4 border border-paper/15 relative flex flex-col items-center justify-between h-[580px] bg-void">
          {/* Top Stage Bar: VAB Header & KSP Overlay Toggles */}
          <div className="w-full flex items-center justify-between p-3.5 border-b border-paper/10 z-10">
            <h2 className="label text-[11px]">VAB 3D Stage &middot; Calm Drift</h2>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoM(!showCoM);
                }}
                className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                  showCoM ? 'border-signal text-signal font-bold' : 'border-paper/20 text-paper-muted'
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
                  showCoT ? 'border-signal text-signal font-bold' : 'border-paper/20 text-paper-muted'
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
                  showCoL ? 'border-paper text-paper font-bold' : 'border-paper/20 text-paper-muted'
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
          <div className="w-full p-2.5 border-t border-paper/10 text-center font-mono text-[11px] text-paper-muted">
            Core Module &middot; Chemical Thruster &middot; High-Gain Antenna &middot; Orbit drag active
          </div>
        </div>

        {/* Right Column (Staging & Readiness): 4 cols */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel mode navigation */}
          <div className="flex border-b border-paper/15 pb-2 gap-4">
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
                    ? 'text-signal border-b-2 border-signal font-bold'
                    : 'text-paper-muted hover:text-paper'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Telemetry */}
          {rightPanelTab === 'telemetry' && (
            <div className="border border-paper/15 p-5 space-y-4 bg-void">
              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5 tabular-nums">
                  <span className="text-paper-muted">Launch Mass:</span>
                  <span className={metrics.isMassLegal ? 'text-paper font-bold' : 'text-signal font-bold'}>
                    {metrics.totalMass} / {metrics.massCap} kg
                  </span>
                </div>
                <div className="w-full h-1.5 bg-paper/10">
                  <div
                    className="h-full bg-signal transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalMass / metrics.massCap) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5 tabular-nums">
                  <span className="text-paper-muted">Teaching Budget:</span>
                  <span className={metrics.isCostLegal ? 'text-paper font-bold' : 'text-signal font-bold'}>
                    {metrics.totalCost} / {MAX_TEACHING_BUDGET} c
                  </span>
                </div>
                <div className="w-full h-1.5 bg-paper/10">
                  <div
                    className="h-full bg-signal transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalCost / MAX_TEACHING_BUDGET) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-xs mb-1.5 tabular-nums">
                  <span className="text-paper-muted">Delta-V (Patched-Conic):</span>
                  <span className={metrics.canReachJupiter ? 'text-paper font-bold' : 'text-signal font-bold'}>
                    {metrics.totalDeltaV} m/s
                  </span>
                </div>
                <div className="w-full h-1.5 bg-paper/10">
                  <div
                    className="h-full bg-signal transition-all"
                    style={{ width: `${Math.min(100, (metrics.totalDeltaV / 7200) * 100)}%` }}
                  />
                </div>
                <p className="font-mono text-[11px] text-paper-muted mt-1 tabular-nums">
                  6,700 m/s minimum to reach Jupiter Depot. 3 tanks recommended.
                </p>
              </div>

              <div className="pt-2 border-t border-paper/10">
                <div className="flex justify-between font-mono text-xs tabular-nums">
                  <span className="text-paper-muted">Uranus 19.2 AU Thermal Bus:</span>
                  <span className={metrics.uranusSurvives ? 'text-paper font-bold' : 'text-signal font-bold'}>
                    {Math.round(metrics.uranusSupplyWatts)}W / 55W
                  </span>
                </div>
                <p className="font-sans text-xs text-paper-muted mt-1 leading-relaxed">
                  Solar drops by 1/r&sup2; to ~0.43W. RTG provides flat 100W to maintain 55W heater &amp; life support.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Staging */}
          {rightPanelTab === 'staging' && (
            <div className="border border-paper/15 p-5 space-y-4 bg-void font-mono text-xs">
              <div className="border-l-2 border-paper pl-3 py-1">
                <span className="font-bold text-paper">[STAGE 3] Payload &amp; Science</span>
                <p className="text-paper-muted text-[11px] mt-0.5">
                  Command Pod &middot; High-Gain Antenna &middot; Science Instrumentation
                </p>
              </div>
              <div className="border-l-2 border-signal pl-3 py-1">
                <span className="font-bold text-signal">[STAGE 2] Power &amp; Thermal Bus</span>
                <p className="text-paper-muted text-[11px] mt-0.5 tabular-nums">
                  {hasRTG ? 'RTG (100W flat)' : solarCount > 0 ? `Solar Arrays (${solarCount * 160}W @ 1 AU)` : 'No power equipped!'}
                </p>
              </div>
              <div className="border-l-2 border-signal pl-3 py-1">
                <span className="font-bold text-signal">[STAGE 1] Interplanetary Fuel Core</span>
                <p className="text-paper-muted text-[11px] mt-0.5 tabular-nums">
                  {tankCount} Propellant Tanks ({tankCount * 2400} m/s)
                </p>
              </div>
              <div className="border-l-2 border-paper pl-3 py-1">
                <span className="font-bold text-paper">[STAGE 0] Earth Departure Ignition</span>
                <p className="text-paper-muted text-[11px] mt-0.5 tabular-nums">
                  Chemical Thruster (900 m/s Trans-Lunar Injection)
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Engineer’s Report */}
          {rightPanelTab === 'engineer' && (
            <div className="border border-paper/15 p-5 space-y-3 bg-void font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span>Delta-V Threshold:</span>
                <span className={metrics.canReachJupiter ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {metrics.canReachJupiter ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span>Mass Allowance:</span>
                <span className={metrics.isMassLegal ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {metrics.isMassLegal ? 'PASS' : 'OVERWEIGHT'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span>Budget Cap:</span>
                <span className={metrics.isCostLegal ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {metrics.isCostLegal ? 'PASS' : 'OVER BUDGET'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span>Uranus Thermal Bus:</span>
                <span className={metrics.uranusSurvives ? 'text-paper font-bold' : 'text-signal font-bold'}>
                  {metrics.uranusSurvives ? 'PASS' : 'FREEZE SCRUB'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-paper/10">
                <span>Spectrometer (Water):</span>
                <span className={hasSpectrometer ? 'text-paper font-bold' : 'text-signal'}>
                  {hasSpectrometer ? 'EQUIPPED' : 'MISSING'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sample Drill (Soil):</span>
                <span className={hasDrill ? 'text-paper font-bold' : 'text-signal'}>
                  {hasDrill ? 'EQUIPPED' : 'MISSING'}
                </span>
              </div>
            </div>
          )}

          {/* Hard errors / Warnings */}
          {metrics.hardErrors.length > 0 && (
            <div className="border border-signal p-3 text-xs font-mono text-signal leading-relaxed">
              &times; {metrics.hardErrors[0]}
            </div>
          )}
          {metrics.hardErrors.length === 0 && metrics.warnings.length > 0 && (
            <div className="border border-paper/30 p-3 text-xs font-mono text-paper-muted leading-relaxed">
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
            <span>{metrics.isLaunchLegal ? 'Ignition & Launch (Spends 900 m/s)' : 'Resolve Hard Errors to Launch'}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
