'use client';
import React, { useState } from 'react';
import {
  ShipDesign,
  LAUNCHERS,
  OPTIONAL_PARTS,
  CORE_PARTS,
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
  const [isDragOverStage, setIsDragOverStage] = useState(false);
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

  const handleDragStart = (e: React.DragEvent, partId: string) => {
    e.dataTransfer.setData('text/plain', partId);
  };

  const handleDropOnStage = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverStage(false);
    const partId = e.dataTransfer.getData('text/plain');
    if (partId) {
      addPart(partId);
    }
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
  const hasImager = (design.parts['imager'] || 0) > 0;

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 md:p-6 bg-[#0a0c10] text-[#e9e6dc] select-none overflow-hidden max-h-[calc(100vh-160px)]">
      {/* Top Header Row: Launcher Selector & Step 0 Auto-build */}
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#e9e6dc]/20 pb-5">
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-xs md:text-sm uppercase tracking-widest text-[#f0562b] font-bold">
            1. Select Launcher:
          </span>
          <div className="flex gap-4">
            {(['kite', 'keel'] as const).map((id) => {
              const l = LAUNCHERS[id];
              const isSelected = design.launcherId === id;
              return (
                <button
                  key={id}
                  onClick={() => setLauncher(id)}
                  onMouseEnter={() => sound.playHoverBlip()}
                  className={`sensory-btn px-5 py-2 text-xs md:text-sm border rounded transition-all text-left ${
                    isSelected
                      ? 'bg-[#f0562b] text-[#0a0c10] border-[#f0562b] font-bold shadow'
                      : 'bg-[#12151b] text-[#e9e6dc] border-[#e9e6dc]/30 hover:border-[#f0562b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{l.name}</span>
                    <span className="opacity-90 text-xs">
                      (Cost {l.cost} | Cap {l.massCap} kg)
                    </span>
                  </div>
                  <div className="text-xs opacity-90 truncate max-w-[220px] font-sans">{l.tagline}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 0 Prominent Auto-Build */}
        <div className="flex items-center gap-5">
          <span className="text-xs text-[#e9e6dc]/70 font-sans hidden lg:inline">
            Teaching budget: 140. Not an official NASA price.
          </span>
          <button
            onClick={handleAutoBuild}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-6 py-3 bg-[#f0562b]/15 hover:bg-[#f0562b]/25 border border-[#f0562b] text-[#f0562b] rounded text-xs md:text-sm tracking-wide transition-all shadow-md flex items-center gap-3"
            title="Step 0 Auto-Build: Instantly equips the Keel certifying stack (3 tanks, RTG, spectrometer, drill)"
          >
            <span>Step 0 Auto-Build (Certifying Ship)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: 3D Stage + KSP Staging & Telemetry Panel */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 my-2.5 min-h-0">
        {/* Left/Center: 3D Stage (Kerbal VAB Assembly Bay with Grid & CoM/CoT/CoL toggles) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverStage(true);
          }}
          onDragLeave={() => setIsDragOverStage(false)}
          onDrop={handleDropOnStage}
          className={`md:col-span-7 lg:col-span-8 bg-[#12151b]/70 border rounded-lg relative flex flex-col items-center justify-center overflow-hidden transition-all ${
            isDragOverStage ? 'border-[#f0562b] bg-[#f0562b]/10' : 'border-[#e9e6dc]/20'
          }`}
        >
          {/* Top Stage Bar: VAB Header & KSP Overlay Toggles */}
          <div className="absolute top-2.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
            <div className="text-xs text-[#e9e6dc]/70 uppercase tracking-wider">
              VAB ASSEMBLY BAY • ORBIT CAM WITH MOUSE
            </div>

            {/* KSP CoM, CoT, CoL Toggles */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoM(!showCoM);
                }}
                className={`px-3 py-0.5 text-xs border rounded transition-colors ${
                  showCoM
                    ? 'bg-[#f0562b] text-[#0a0c10] border-[#f0562b] font-bold'
                    : 'bg-[#0a0c10]/80 text-[#e9e6dc]/70 border-[#e9e6dc]/30 hover:border-[#f0562b]'
                }`}
                title="Toggle Center of Mass (CoM)"
              >
                CoM
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoT(!showCoT);
                }}
                className={`px-3 py-0.5 text-xs border rounded transition-colors ${
                  showCoT
                    ? 'bg-[#f0562b] text-[#e9e6dc] border-[#f0562b] font-bold'
                    : 'bg-[#0a0c10]/80 text-[#e9e6dc]/70 border-[#e9e6dc]/30 hover:border-[#f0562b]'
                }`}
                title="Toggle Center of Thrust (CoT)"
              >
                CoT
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoL(!showCoL);
                }}
                className={`px-3 py-0.5 text-xs border rounded transition-colors ${
                  showCoL
                    ? 'bg-[#e9e6dc] text-[#0a0c10] border-[#e9e6dc] font-bold'
                    : 'bg-[#0a0c10]/80 text-[#e9e6dc]/70 border-[#e9e6dc]/30 hover:border-[#e9e6dc]'
                }`}
                title="Toggle Aerodynamic Center (CoL)"
              >
                CoL
              </button>
            </div>
          </div>

          <div className="w-full h-full min-h-[240px]">
            <Ship3DView
              design={design}
              interactive={true}
              showCoM={showCoM}
              showCoT={showCoT}
              showCoL={showCoL}
            />
          </div>

          {/* Active Stack Part Pills */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-wrap gap-2 pointer-events-auto">
            {CORE_PARTS.map((cp) => (
              <span
                key={cp.id}
                className="text-xs px-4 py-1.5 bg-[#0a0c10]/85 border border-[#e9e6dc]/30 text-[#e9e6dc]/80 rounded"
              >
                {cp.name} (Core)
              </span>
            ))}
            {OPTIONAL_PARTS.map((p) => {
              const count = design.parts[p.id] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={p.id}
                  onClick={() => removePart(p.id)}
                  className="text-xs px-4 py-1.5 bg-[#f0562b]/20 border border-[#f0562b] text-[#f0562b] rounded hover:bg-[#f0562b]/30 hover:border-[#f0562b] hover:text-[#f0562b] transition-colors"
                  title="Click to remove"
                >
                  {p.name} {count > 1 ? `×${count}` : ''} ✕
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: KSP Tabbed Panel (Telemetry / Staging Sequence / Engineer's Report) + Launch */}
        <div className="md:col-span-5 lg:col-span-4 bg-[#12151b] border border-[#e9e6dc]/20 p-5 rounded-lg flex flex-col justify-between overflow-y-auto space-y-5">
          <div>
            {/* Panel Mode Tabs */}
            <div className="flex border-b border-[#e9e6dc]/20 pb-3 mb-2.5 gap-2 text-xs">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('telemetry');
                }}
                className={`px-4 py-1.5 rounded transition-colors font-bold ${
                  rightPanelTab === 'telemetry'
                    ? 'bg-[#f0562b] text-[#0a0c10]'
                    : 'text-[#e9e6dc]/70 hover:text-[#e9e6dc]'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('staging');
                }}
                className={`px-4 py-1.5 rounded transition-colors font-bold ${
                  rightPanelTab === 'staging'
                    ? 'bg-[#f0562b] text-[#0a0c10]'
                    : 'text-[#e9e6dc]/70 hover:text-[#e9e6dc]'
                }`}
              >
                KSP Staging
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('engineer');
                }}
                className={`px-4 py-1.5 rounded transition-colors font-bold ${
                  rightPanelTab === 'engineer'
                    ? 'bg-[#f0562b] text-[#0a0c10]'
                    : 'text-[#e9e6dc]/70 hover:text-[#e9e6dc]'
                }`}
              >
                Engineer’s Report
              </button>
            </div>

            {/* TAB 1: Telemetry Meters */}
            {rightPanelTab === 'telemetry' && (
              <div className="space-y-4">
                {/* Meter 1: Mass */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Mass:</span>
                    <span className={metrics.isMassLegal ? 'text-[#e9e6dc]' : 'text-[#f0562b] font-bold'}>
                      {metrics.totalMass} / {metrics.massCap} kg
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0a0c10] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.isMassLegal ? 'bg-[#f0562b]' : 'bg-[#f0562b]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalMass / metrics.massCap) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meter 2: Cost */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Teaching Cost:</span>
                    <span className={metrics.isCostLegal ? 'text-[#e9e6dc]' : 'text-[#f0562b] font-bold'}>
                      {metrics.totalCost} / {MAX_TEACHING_BUDGET}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0a0c10] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.isCostLegal ? 'bg-[#f0562b]' : 'bg-[#f0562b]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalCost / MAX_TEACHING_BUDGET) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meter 3: Watts at Earth */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Power @ 1 AU:</span>
                    <span className="text-[#e9e6dc]">
                      Draw {metrics.powerDrawEarth} W | Gen {Math.round(metrics.powerGenEarth)} W
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0a0c10] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.powerGenEarth >= metrics.powerDrawEarth ? 'bg-[#e9e6dc]' : 'bg-[#f0562b]'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          metrics.powerDrawEarth > 0
                            ? (metrics.powerGenEarth / metrics.powerDrawEarth) * 100
                            : 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Meter 4: Delta-v */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Delta-v (Patched-Conic):</span>
                    <span className={metrics.canReachJupiter ? 'text-[#e9e6dc]' : 'text-[#f0562b] font-bold'}>
                      {metrics.totalDeltaV} m/s
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0a0c10] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.canReachJupiter ? 'bg-[#f0562b]' : 'bg-[#f0562b]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalDeltaV / 7200) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#e9e6dc]/70 mt-1 leading-relaxed">
                    6,700 m/s to Jupiter, 7,100 m/s outer rim. 3 tanks (7,200 m/s) minimum.
                  </div>
                </div>

                {/* Uranus Check: 55 W Heater Bus */}
                <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded text-xs space-y-1.5">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[#e9e6dc]/90 font-bold">Uranus 19.2 AU Bus:</span>
                    <span
                      className={`font-bold ${
                        metrics.uranusSurvives ? 'text-[#e9e6dc]' : 'text-[#f0562b]'
                      }`}
                    >
                      {Math.round(metrics.uranusSupplyWatts)} W / 55 W
                    </span>
                  </div>
                  <div className="text-xs text-[#e9e6dc]/70 leading-relaxed font-sans">
                    Command (20W) + Antenna (15W) + Heater (20W) = 55 W. Solar gives ~0.4 W. RTG gives flat 100 W.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KSP Staging Stack Sequence */}
            {rightPanelTab === 'staging' && (
              <div className="space-y-3 text-xs ">
                <div className="text-xs text-[#e9e6dc]/70 font-sans mb-1.5">
                  Kerbal-style staging breakdown from payload to ignition:
                </div>

                {/* Stage 3: Payload & Science Bay */}
                <div className="p-4 bg-[#0a0c10] border-l-4 border-[#e9e6dc] rounded-r">
                  <div className="flex justify-between font-bold text-[#e9e6dc]">
                    <span>[STAGE 3] Payload & Science</span>
                    <span>Active</span>
                  </div>
                  <div className="text-[#e9e6dc]/80 text-xs mt-1 space-y-0.5">
                    <div>• Command Module (Wren Pod, 90 kg, 20W)</div>
                    <div>• High-Gain Dish Antenna (25 kg, 15W)</div>
                    {hasSpectrometer && <div>• Mass Spectrometer (Water Certifier, 35 kg)</div>}
                    {hasDrill && <div>• Sample Drill (Soil Certifier, 40 kg)</div>}
                    {hasImager && <div>• Science Imager (8 kg, 5W)</div>}
                  </div>
                </div>

                {/* Stage 2: Power & Thermal Bus */}
                <div className="p-4 bg-[#0a0c10] border-l-4 border-[#f0562b] rounded-r">
                  <div className="flex justify-between font-bold text-[#f0562b]">
                    <span>[STAGE 2] Power & Thermal Bus</span>
                    <span>Active</span>
                  </div>
                  <div className="text-[#e9e6dc]/80 text-xs mt-1 space-y-0.5">
                    {hasRTG && <div>• Radioisotope Unit (RTG, 100 W flat, 50 kg)</div>}
                    {solarCount > 0 && <div>• Solar Arrays (×{solarCount}, 160W/ea @ 1 AU, 30 kg/ea)</div>}
                    {!hasRTG && solarCount === 0 && <div className="text-[#f0562b]">⚠ No primary power source equipped!</div>}
                    <div>• Deep Space Survival Bus: 55 W heater active at 19.2 AU</div>
                  </div>
                </div>

                {/* Stage 1: Propellant Core */}
                <div className="p-4 bg-[#0a0c10] border-l-4 border-[#f0562b] rounded-r">
                  <div className="flex justify-between font-bold text-[#f0562b]">
                    <span>[STAGE 1] Interplanetary Reaction Core</span>
                    <span>{metrics.totalDeltaV} m/s</span>
                  </div>
                  <div className="text-[#e9e6dc]/80 text-xs mt-1">
                    <div>• Propellant Tanks: {tankCount} equipped ({tankCount * 2400} m/s total)</div>
                    <div>• Transfer capability: {metrics.canReachJupiter ? 'Reaches Jupiter Depot' : 'Delta-v short for Jupiter'}</div>
                  </div>
                </div>

                {/* Stage 0: Main Chemical Engine */}
                <div className="p-4 bg-[#0a0c10] border-l-4 border-[#f0562b] rounded-r">
                  <div className="flex justify-between font-bold text-[#f0562b]">
                    <span>[STAGE 0] Earth Departure Ignition</span>
                    <span>900 m/s</span>
                  </div>
                  <div className="text-[#e9e6dc]/80 text-xs mt-1">
                    <div>• Chemical Engine (60 kg, Isp 310s)</div>
                    <div>• Spends first 900 m/s on Trans-Lunar Injection (TLI)</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: KSP Engineer's Report Checklist */}
            {rightPanelTab === 'engineer' && (
              <div className="space-y-3 text-xs ">
                <div className="text-xs text-[#e9e6dc]/70 font-sans mb-1.5">
                  Pre-flight certification checklist & flight readiness:
                </div>

                {/* Delta-v check */}
                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Delta-v (≥ 7,200 m/s total):</span>
                  <span className={metrics.canReachJupiter ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.canReachJupiter ? 'PASS' : 'FAIL (Need 3 Tanks)'}
                  </span>
                </div>

                {/* Mass cap check */}
                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Mass (≤ {metrics.massCap} kg):</span>
                  <span className={metrics.isMassLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.isMassLegal ? 'PASS' : 'OVERWEIGHT'}
                  </span>
                </div>

                {/* Cost check */}
                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Budget (≤ 140 Credits):</span>
                  <span className={metrics.isCostLegal ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.isCostLegal ? 'PASS' : 'OVER BUDGET'}
                  </span>
                </div>

                {/* Thermal bus check */}
                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Deep Space Thermal (55 W Bus):</span>
                  <span className={metrics.uranusSurvives ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b] font-bold'}>
                    {metrics.uranusSurvives ? 'PASS (RTG)' : 'FAIL (Freezes at Uranus)'}
                  </span>
                </div>

                {/* Science certifiers */}
                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Water Certifier (Spectrometer):</span>
                  <span className={hasSpectrometer ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b]'}>
                    {hasSpectrometer ? 'EQUIPPED' : 'MISSING'}
                  </span>
                </div>

                <div className="p-3 bg-[#0a0c10] border rounded flex justify-between items-center">
                  <span>Soil Certifier (Sample Drill):</span>
                  <span className={hasDrill ? 'text-[#e9e6dc] font-bold' : 'text-[#f0562b]'}>
                    {hasDrill ? 'EQUIPPED' : 'MISSING'}
                  </span>
                </div>

                {/* NASA JPL Concept Maturity Level (CML) Assessment */}
                <div className="p-4 bg-[#0a0c10] border border-[#f0562b]/40 rounded mt-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#f0562b] font-bold">NASA JPL Concept Maturity Level:</span>
                    <span className="font-bold text-[#e9e6dc]">
                      {metrics.isLaunchLegal
                        ? (hasSpectrometer && hasDrill ? 'CML 4: Flight Point Design' : 'CML 3: Subsystem Feasible')
                        : 'CML 2: Concept Trade Study'}
                    </span>
                  </div>
                  <div className="text-xs text-[#e9e6dc]/70 mt-1 leading-snug font-sans">
                    Aligned with NASA Systems Engineering 4 Segments: Launch, Space, Ground, and User.
                  </div>
                </div>

                <div className="text-xs text-[#e9e6dc]/60 italic pt-1.5">
                  Certification conforms to 2026 Space Apps Space Agency Partner Planetary Standards.
                </div>
              </div>
            )}

            {/* Warnings and Hard Errors */}
            {metrics.hardErrors.length > 0 && (
              <div className="mt-2 p-3 bg-[#f0562b]/20 border border-[#f0562b] rounded text-xs text-[#f0562b] leading-relaxed">
                ✕ {metrics.hardErrors[0]}
              </div>
            )}
            {metrics.hardErrors.length === 0 && metrics.warnings.length > 0 && (
              <div className="mt-2 p-3 bg-[#f0562b]/15 border border-[#f0562b]/40 rounded text-xs text-[#f0562b] leading-relaxed">
                ⚠ {metrics.warnings[0]}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="pt-3">
            <button
              onClick={() => {
                if (metrics.isLaunchLegal) {
                  sound.playLaunch();
                  onLaunch();
                }
              }}
              onMouseEnter={() => metrics.isLaunchLegal && sound.playHoverBlip()}
              disabled={!metrics.isLaunchLegal}
              className={`sensory-btn w-full py-5 rounded tracking-wide text-sm md:text-base transition-all shadow-md ${
                metrics.isLaunchLegal
                  ? 'bg-[#f0562b] hover:bg-[#cf4520] text-[#0a0c10] cursor-pointer'
                  : 'bg-[#0a0c10] text-[#e9e6dc]/30 border border-[#e9e6dc]/20 cursor-not-allowed'
              }`}
            >
              {metrics.isLaunchLegal ? 'Launch Mission (Spends 900 m/s)' : '⚠ Resolve Hard Errors To Launch'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Optional Parts Palette with Category Filtering */}
      <div className="border-t border-[#e9e6dc]/20 pt-4">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm uppercase tracking-widest text-[#f0562b] font-bold">
              2. Modular Parts Catalog:
            </span>
            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 text-xs">
              {(
                [
                  { id: 'all', label: 'All Parts' },
                  { id: 'propulsion', label: 'Propulsion' },
                  { id: 'power', label: 'Power & Thermal' },
                  { id: 'instrument', label: 'Science Instruments' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playUiClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-0.5 rounded text-xs transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#e9e6dc] text-[#0a0c10] font-bold'
                      : 'text-[#e9e6dc]/60 hover:text-[#e9e6dc]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-[#e9e6dc]/60 hidden sm:inline">
            Patched-conic teaching table, not a GMAT run.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {filteredParts.map((part) => {
            const currentCount = design.parts[part.id] || 0;
            const max = part.maxCount || 1;
            const isMaxed = currentCount >= max;

            return (
              <div
                key={part.id}
                draggable={!isMaxed}
                onDragStart={(e) => handleDragStart(e, part.id)}
                onClick={() => addPart(part.id)}
                onMouseEnter={() => !isMaxed && sound.playHoverBlip()}
                className={`sensory-btn bg-[#12151b] border p-4 rounded cursor-pointer transition-all flex flex-col justify-between hover:border-[#f0562b] ${
                  currentCount > 0 ? 'border-[#f0562b]/80 bg-[#12151b]' : 'border-[#e9e6dc]/25'
                }`}
                title={`Click or drag onto ship to add ${part.name}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-serif text-xs md:text-sm text-[#e9e6dc] leading-snug">
                      {part.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        currentCount > 0 ? 'bg-[#f0562b] text-[#0a0c10] font-bold' : 'text-[#e9e6dc]/50'
                      }`}
                    >
                      {currentCount}/{max}
                    </span>
                  </div>
                  <div className="text-xs text-[#f0562b] mb-1.5">
                    {part.mass}kg • {part.cost}c {part.powerDraw > 0 ? `• ${part.powerDraw}W` : ''}
                  </div>
                  <p className="text-xs font-sans text-[#e9e6dc]/80 leading-relaxed">
                    {part.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#e9e6dc]/10">
                  <span className="text-xs text-[#e9e6dc]/50">
                    {isMaxed ? 'Max Cap' : '+ Add'}
                  </span>
                  {currentCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePart(part.id);
                      }}
                      className="text-xs text-[#f0562b] hover:underline font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
