'use client';
import React, { useState } from 'react';
import {
  ShipDesign,
  LAUNCHERS,
  OPTIONAL_PARTS,
  CORE_PARTS,
  MAX_TEACHING_BUDGET,
  URANUS_HEATER_BUS_WATTS,
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
    <div className="w-full h-full flex flex-col justify-between p-3 md:p-4 bg-[#100e0c] text-[#efe6d6] select-none overflow-hidden max-h-[calc(100vh-160px)]">
      {/* Top Header Row: Launcher Selector & Step 0 Auto-build */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efe6d6]/20 pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#e39b12] font-bold">
            1. Select Launcher:
          </span>
          <div className="flex gap-2.5">
            {(['kite', 'keel'] as const).map((id) => {
              const l = LAUNCHERS[id];
              const isSelected = design.launcherId === id;
              return (
                <button
                  key={id}
                  onClick={() => setLauncher(id)}
                  onMouseEnter={() => sound.playHoverBlip()}
                  className={`sensory-btn px-3.5 py-1.5 text-xs md:text-sm font-mono border rounded transition-all text-left ${
                    isSelected
                      ? 'bg-[#e39b12] text-[#100e0c] border-[#e39b12] font-bold shadow'
                      : 'bg-[#1a1714] text-[#efe6d6] border-[#efe6d6]/30 hover:border-[#e39b12]'
                  }`}
                >
                  <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#efe6d6]/70 font-sans hidden lg:inline">
            Teaching budget: 140. Not an official NASA price.
          </span>
          <button
            onClick={handleAutoBuild}
            onMouseEnter={() => sound.playHoverBlip()}
            className="sensory-btn px-4 py-2 bg-[#e39b12]/15 hover:bg-[#e39b12]/25 border-2 border-[#e39b12] text-[#e39b12] rounded text-xs md:text-sm font-mono uppercase tracking-wider transition-all font-bold shadow-md flex items-center gap-2"
            title="Step 0 Auto-Build: Instantly equips the Keel certifying stack (3 tanks, RTG, spectrometer, drill)"
          >
            <span>⚡</span>
            <span>Step 0 Auto-Build (Certifying Ship)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: 3D Stage + KSP Staging & Telemetry Panel */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 my-2.5 min-h-0">
        {/* Left/Center: 3D Stage (Kerbal VAB Assembly Bay with Grid & CoM/CoT/CoL toggles) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverStage(true);
          }}
          onDragLeave={() => setIsDragOverStage(false)}
          onDrop={handleDropOnStage}
          className={`md:col-span-7 lg:col-span-8 bg-[#1a1714]/70 border-2 rounded-lg relative flex flex-col items-center justify-center overflow-hidden transition-all ${
            isDragOverStage ? 'border-[#e39b12] bg-[#e39b12]/10' : 'border-[#efe6d6]/20'
          }`}
        >
          {/* Top Stage Bar: VAB Header & KSP Overlay Toggles */}
          <div className="absolute top-2.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
            <div className="text-xs font-mono text-[#efe6d6]/70 uppercase tracking-wider">
              VAB ASSEMBLY BAY • ORBIT CAM WITH MOUSE
            </div>

            {/* KSP CoM, CoT, CoL Toggles */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setShowCoM(!showCoM);
                }}
                className={`px-2 py-0.5 text-[11px] font-mono border rounded transition-colors ${
                  showCoM
                    ? 'bg-[#e39b12] text-[#100e0c] border-[#e39b12] font-bold'
                    : 'bg-[#100e0c]/80 text-[#efe6d6]/70 border-[#efe6d6]/30 hover:border-[#e39b12]'
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
                className={`px-2 py-0.5 text-[11px] font-mono border rounded transition-colors ${
                  showCoT
                    ? 'bg-[#c4452d] text-[#efe6d6] border-[#c4452d] font-bold'
                    : 'bg-[#100e0c]/80 text-[#efe6d6]/70 border-[#efe6d6]/30 hover:border-[#c4452d]'
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
                className={`px-2 py-0.5 text-[11px] font-mono border rounded transition-colors ${
                  showCoL
                    ? 'bg-[#5bc0be] text-[#100e0c] border-[#5bc0be] font-bold'
                    : 'bg-[#100e0c]/80 text-[#efe6d6]/70 border-[#efe6d6]/30 hover:border-[#5bc0be]'
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
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-wrap gap-1.5 pointer-events-auto">
            {CORE_PARTS.map((cp) => (
              <span
                key={cp.id}
                className="text-xs font-mono px-2.5 py-1 bg-[#100e0c]/85 border border-[#efe6d6]/30 text-[#efe6d6]/80 rounded"
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
                  className="text-xs font-mono px-2.5 py-1 bg-[#e39b12]/20 border border-[#e39b12] text-[#e39b12] rounded hover:bg-[#c4452d]/30 hover:border-[#c4452d] hover:text-[#c4452d] transition-colors"
                  title="Click to remove"
                >
                  {p.name} {count > 1 ? `×${count}` : ''} ✕
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: KSP Tabbed Panel (Telemetry / Staging Sequence / Engineer's Report) + Launch */}
        <div className="md:col-span-5 lg:col-span-4 bg-[#1a1714] border border-[#efe6d6]/20 p-3.5 rounded-lg flex flex-col justify-between overflow-y-auto space-y-3">
          <div>
            {/* Panel Mode Tabs */}
            <div className="flex border-b border-[#efe6d6]/20 pb-2 mb-2.5 gap-1.5 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('telemetry');
                }}
                className={`px-2.5 py-1 rounded transition-colors font-bold ${
                  rightPanelTab === 'telemetry'
                    ? 'bg-[#e39b12] text-[#100e0c]'
                    : 'text-[#efe6d6]/70 hover:text-[#efe6d6]'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('staging');
                }}
                className={`px-2.5 py-1 rounded transition-colors font-bold ${
                  rightPanelTab === 'staging'
                    ? 'bg-[#e39b12] text-[#100e0c]'
                    : 'text-[#efe6d6]/70 hover:text-[#efe6d6]'
                }`}
              >
                KSP Staging
              </button>
              <button
                onClick={() => {
                  sound.playUiClick();
                  setRightPanelTab('engineer');
                }}
                className={`px-2.5 py-1 rounded transition-colors font-bold ${
                  rightPanelTab === 'engineer'
                    ? 'bg-[#e39b12] text-[#100e0c]'
                    : 'text-[#efe6d6]/70 hover:text-[#efe6d6]'
                }`}
              >
                Engineer’s Report
              </button>
            </div>

            {/* TAB 1: Telemetry Meters */}
            {rightPanelTab === 'telemetry' && (
              <div className="space-y-2.5">
                {/* Meter 1: Mass */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-mono mb-1">
                    <span>Mass:</span>
                    <span className={metrics.isMassLegal ? 'text-[#efe6d6]' : 'text-[#c4452d] font-bold'}>
                      {metrics.totalMass} / {metrics.massCap} kg
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#100e0c] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.isMassLegal ? 'bg-[#e39b12]' : 'bg-[#c4452d]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalMass / metrics.massCap) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meter 2: Cost */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-mono mb-1">
                    <span>Teaching Cost:</span>
                    <span className={metrics.isCostLegal ? 'text-[#efe6d6]' : 'text-[#c4452d] font-bold'}>
                      {metrics.totalCost} / {MAX_TEACHING_BUDGET}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#100e0c] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.isCostLegal ? 'bg-[#e39b12]' : 'bg-[#c4452d]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalCost / MAX_TEACHING_BUDGET) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meter 3: Watts at Earth */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-mono mb-1">
                    <span>Power @ 1 AU:</span>
                    <span className="text-[#efe6d6]">
                      Draw {metrics.powerDrawEarth} W | Gen {Math.round(metrics.powerGenEarth)} W
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#100e0c] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.powerGenEarth >= metrics.powerDrawEarth ? 'bg-[#5bc0be]' : 'bg-[#c4452d]'
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
                  <div className="flex justify-between text-xs md:text-sm font-mono mb-1">
                    <span>Delta-v (Patched-Conic):</span>
                    <span className={metrics.canReachJupiter ? 'text-[#efe6d6]' : 'text-[#c4452d] font-bold'}>
                      {metrics.totalDeltaV} m/s
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#100e0c] rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        metrics.canReachJupiter ? 'bg-[#e39b12]' : 'bg-[#c4452d]'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.totalDeltaV / 7200) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#efe6d6]/70 font-mono mt-1 leading-relaxed">
                    6,700 m/s to Jupiter, 7,100 m/s outer rim. 3 tanks (7,200 m/s) minimum.
                  </div>
                </div>

                {/* Uranus Check: 55 W Heater Bus */}
                <div className="p-2.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-xs font-mono space-y-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[#efe6d6]/90 font-bold">Uranus 19.2 AU Bus:</span>
                    <span
                      className={`font-bold ${
                        metrics.uranusSurvives ? 'text-[#5bc0be]' : 'text-[#c4452d]'
                      }`}
                    >
                      {Math.round(metrics.uranusSupplyWatts)} W / 55 W
                    </span>
                  </div>
                  <div className="text-[11px] text-[#efe6d6]/70 leading-relaxed font-sans">
                    Command (20W) + Antenna (15W) + Heater (20W) = 55 W. Solar gives ~0.4 W. RTG gives flat 100 W.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KSP Staging Stack Sequence */}
            {rightPanelTab === 'staging' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="text-xs text-[#efe6d6]/70 font-sans mb-1.5">
                  Kerbal-style staging breakdown from payload to ignition:
                </div>

                {/* Stage 3: Payload & Science Bay */}
                <div className="p-2.5 bg-[#100e0c] border-l-4 border-[#5bc0be] rounded-r">
                  <div className="flex justify-between font-bold text-[#5bc0be]">
                    <span>[STAGE 3] Payload & Science</span>
                    <span>Active</span>
                  </div>
                  <div className="text-[#efe6d6]/80 text-[11px] mt-1 space-y-0.5">
                    <div>• Command Module (Wren Pod, 90 kg, 20W)</div>
                    <div>• High-Gain Dish Antenna (25 kg, 15W)</div>
                    {hasSpectrometer && <div>• Mass Spectrometer (Water Certifier, 35 kg)</div>}
                    {hasDrill && <div>• Sample Drill (Soil Certifier, 40 kg)</div>}
                    {hasImager && <div>• Science Imager (8 kg, 5W)</div>}
                  </div>
                </div>

                {/* Stage 2: Power & Thermal Bus */}
                <div className="p-2.5 bg-[#100e0c] border-l-4 border-[#e39b12] rounded-r">
                  <div className="flex justify-between font-bold text-[#e39b12]">
                    <span>[STAGE 2] Power & Thermal Bus</span>
                    <span>Active</span>
                  </div>
                  <div className="text-[#efe6d6]/80 text-[11px] mt-1 space-y-0.5">
                    {hasRTG && <div>• Radioisotope Unit (RTG, 100 W flat, 50 kg)</div>}
                    {solarCount > 0 && <div>• Solar Arrays (×{solarCount}, 160W/ea @ 1 AU, 30 kg/ea)</div>}
                    {!hasRTG && solarCount === 0 && <div className="text-[#c4452d]">⚠️ No primary power source equipped!</div>}
                    <div>• Deep Space Survival Bus: 55 W heater active at 19.2 AU</div>
                  </div>
                </div>

                {/* Stage 1: Propellant Core */}
                <div className="p-2.5 bg-[#100e0c] border-l-4 border-[#e39b12] rounded-r">
                  <div className="flex justify-between font-bold text-[#e39b12]">
                    <span>[STAGE 1] Interplanetary Reaction Core</span>
                    <span>{metrics.totalDeltaV} m/s</span>
                  </div>
                  <div className="text-[#efe6d6]/80 text-[11px] mt-1">
                    <div>• Propellant Tanks: {tankCount} equipped ({tankCount * 2400} m/s total)</div>
                    <div>• Transfer capability: {metrics.canReachJupiter ? 'Reaches Jupiter Depot' : 'Delta-v short for Jupiter'}</div>
                  </div>
                </div>

                {/* Stage 0: Main Chemical Engine */}
                <div className="p-2.5 bg-[#100e0c] border-l-4 border-[#c4452d] rounded-r">
                  <div className="flex justify-between font-bold text-[#c4452d]">
                    <span>[STAGE 0] Earth Departure Ignition</span>
                    <span>900 m/s</span>
                  </div>
                  <div className="text-[#efe6d6]/80 text-[11px] mt-1">
                    <div>• Chemical Engine (60 kg, Isp 310s)</div>
                    <div>• Spends first 900 m/s on Trans-Lunar Injection (TLI)</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: KSP Engineer's Report Checklist */}
            {rightPanelTab === 'engineer' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="text-xs text-[#efe6d6]/70 font-sans mb-1.5">
                  Pre-flight certification checklist & flight readiness:
                </div>

                {/* Delta-v check */}
                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Delta-v (≥ 7,200 m/s total):</span>
                  <span className={metrics.canReachJupiter ? 'text-[#5bc0be] font-bold' : 'text-[#c4452d] font-bold'}>
                    {metrics.canReachJupiter ? 'PASS' : 'FAIL (Need 3 Tanks)'}
                  </span>
                </div>

                {/* Mass cap check */}
                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Mass (≤ {metrics.massCap} kg):</span>
                  <span className={metrics.isMassLegal ? 'text-[#5bc0be] font-bold' : 'text-[#c4452d] font-bold'}>
                    {metrics.isMassLegal ? 'PASS' : 'OVERWEIGHT'}
                  </span>
                </div>

                {/* Cost check */}
                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Budget (≤ 140 Credits):</span>
                  <span className={metrics.isCostLegal ? 'text-[#5bc0be] font-bold' : 'text-[#c4452d] font-bold'}>
                    {metrics.isCostLegal ? 'PASS' : 'OVER BUDGET'}
                  </span>
                </div>

                {/* Thermal bus check */}
                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Deep Space Thermal (55 W Bus):</span>
                  <span className={metrics.uranusSurvives ? 'text-[#5bc0be] font-bold' : 'text-[#c4452d] font-bold'}>
                    {metrics.uranusSurvives ? 'PASS (RTG)' : 'FAIL (Freezes at Uranus)'}
                  </span>
                </div>

                {/* Science certifiers */}
                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Water Certifier (Spectrometer):</span>
                  <span className={hasSpectrometer ? 'text-[#5bc0be] font-bold' : 'text-[#e39b12]'}>
                    {hasSpectrometer ? 'EQUIPPED' : 'MISSING'}
                  </span>
                </div>

                <div className="p-2 bg-[#100e0c] border rounded flex justify-between items-center">
                  <span>Soil Certifier (Sample Drill):</span>
                  <span className={hasDrill ? 'text-[#5bc0be] font-bold' : 'text-[#e39b12]'}>
                    {hasDrill ? 'EQUIPPED' : 'MISSING'}
                  </span>
                </div>

                <div className="text-[11px] text-[#efe6d6]/60 italic pt-1">
                  Certification conforms to 2026 Space Apps Space Agency Partner Planetary Standards.
                </div>
              </div>
            )}

            {/* Warnings and Hard Errors */}
            {metrics.hardErrors.length > 0 && (
              <div className="mt-2 p-2 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs font-mono text-[#c4452d] leading-relaxed">
                ❌ {metrics.hardErrors[0]}
              </div>
            )}
            {metrics.hardErrors.length === 0 && metrics.warnings.length > 0 && (
              <div className="mt-2 p-2 bg-[#e39b12]/15 border border-[#e39b12]/40 rounded text-xs font-mono text-[#e39b12] leading-relaxed">
                ⚠️ {metrics.warnings[0]}
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (metrics.isLaunchLegal) {
                  sound.playLaunch();
                  onLaunch();
                }
              }}
              onMouseEnter={() => metrics.isLaunchLegal && sound.playHoverBlip()}
              disabled={!metrics.isLaunchLegal}
              className={`sensory-btn w-full py-3 rounded font-mono font-bold uppercase tracking-wider text-sm md:text-base transition-all shadow-md ${
                metrics.isLaunchLegal
                  ? 'bg-[#e39b12] hover:bg-[#c9820a] text-[#100e0c] cursor-pointer'
                  : 'bg-[#100e0c] text-[#efe6d6]/30 border border-[#efe6d6]/20 cursor-not-allowed'
              }`}
            >
              {metrics.isLaunchLegal ? '🚀 Launch Mission (Spends 900 m/s)' : '⚠️ Resolve Hard Errors To Launch'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Optional Parts Palette with Category Filtering */}
      <div className="border-t border-[#efe6d6]/20 pt-2.5">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#e39b12] font-bold">
              2. Modular Parts Catalog:
            </span>
            {/* Category Filter Tabs */}
            <div className="flex gap-1 font-mono text-xs">
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
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#efe6d6] text-[#100e0c] font-bold'
                      : 'text-[#efe6d6]/60 hover:text-[#efe6d6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-[#efe6d6]/60 hidden sm:inline">
            Patched-conic teaching table, not a GMAT run.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
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
                className={`sensory-btn bg-[#1a1714] border p-2.5 rounded cursor-pointer transition-all flex flex-col justify-between hover:border-[#e39b12] ${
                  currentCount > 0 ? 'border-[#e39b12]/80 bg-[#1a1714]' : 'border-[#efe6d6]/25'
                }`}
                title={`Click or drag onto ship to add ${part.name}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-serif font-bold text-xs md:text-sm text-[#efe6d6] leading-snug">
                      {part.name}
                    </span>
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        currentCount > 0 ? 'bg-[#e39b12] text-[#100e0c] font-bold' : 'text-[#efe6d6]/50'
                      }`}
                    >
                      {currentCount}/{max}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#e39b12] mb-1.5">
                    {part.mass}kg • {part.cost}c {part.powerDraw > 0 ? `• ${part.powerDraw}W` : ''}
                  </div>
                  <p className="text-xs font-sans text-[#efe6d6]/80 leading-relaxed">
                    {part.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#efe6d6]/10">
                  <span className="text-xs font-mono text-[#efe6d6]/50">
                    {isMaxed ? 'Max Cap' : '+ Add'}
                  </span>
                  {currentCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePart(part.id);
                      }}
                      className="text-xs font-mono text-[#c4452d] hover:underline font-bold"
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
