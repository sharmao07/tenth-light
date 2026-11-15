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

  // Auto-build: builds the certifying stack
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

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 md:p-4 bg-[#100e0c] text-[#efe6d6] select-none overflow-hidden max-h-[calc(100vh-160px)]">
      {/* Top Header Row: Launcher Selector & Auto-build */}
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
                  className={`px-3.5 py-1.5 text-xs md:text-sm font-mono border rounded transition-all text-left ${
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

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#efe6d6]/70 font-sans hidden lg:inline">
            Teaching budget: 140. Not an official NASA price.
          </span>
          <button
            onClick={handleAutoBuild}
            className="px-4 py-2 bg-[#1a1714] hover:bg-[#efe6d6]/10 border border-[#e39b12] text-[#e39b12] rounded text-xs md:text-sm font-mono uppercase tracking-wider transition-colors font-bold shadow"
            title="Equips the Keel certifying stack: 3 tanks, RTG, spectrometer, drill"
          >
            ⚡ Auto-Build Certifying Stack
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: 3D Stage + Telemetry Meters */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 my-2.5 min-h-0">
        {/* Left/Center: 3D Stage (Kerbal-like side view with Orbit) */}
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
          {/* Overlay info */}
          <div className="absolute top-2.5 left-3.5 z-10 text-xs font-mono text-[#efe6d6]/70 pointer-events-none">
            VERTICAL STACK • DRAG PARTS HERE OR CLICK CARDS BELOW • ORBIT CAM WITH MOUSE
          </div>

          <div className="w-full h-full min-h-[240px]">
            <Ship3DView design={design} interactive={true} />
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

        {/* Right: 4 Meters + Uranus Check + Launch Button */}
        <div className="md:col-span-5 lg:col-span-4 bg-[#1a1714] border border-[#efe6d6]/20 p-3.5 rounded-lg flex flex-col justify-between overflow-y-auto space-y-3">
          <div>
            <div className="text-sm font-serif font-bold text-[#e39b12] uppercase tracking-wider mb-2.5 border-b border-[#efe6d6]/10 pb-1.5">
              Flight Certification Telemetry
            </div>

            {/* Meter 1: Mass */}
            <div className="mb-2.5">
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
            <div className="mb-2.5">
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
            <div className="mb-2.5">
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
            <div className="mb-2.5">
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
              <div className="text-xs text-[#efe6d6]/70 font-mono mt-1 leading-relaxed">
                Requires: 6,700 m/s to Jupiter, 7,100 m/s outer rim. 3 tanks (7,200 m/s) minimum.
              </div>
            </div>

            {/* Uranus Check: 55 W Heater Bus Requirement */}
            <div className="p-2.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded mb-2.5 text-xs font-mono space-y-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#efe6d6]/90 font-bold">Uranus 19.2 AU Bus:</span>
                <span
                  className={`font-bold ${
                    metrics.uranusSurvives ? 'text-[#5bc0be]' : 'text-[#c4452d]'
                  }`}
                >
                  {Math.round(metrics.uranusSupplyWatts)} W / 55 W
                </span>
              </div>
              <div className="text-xs text-[#efe6d6]/70 leading-relaxed font-sans">
                Command (20W) + Antenna (15W) + Heater (20W) = 55 W. Solar gives ~0.4 W (1/r²). RTG gives flat 100 W.
              </div>
            </div>

            {/* Warnings and Hard Errors */}
            {metrics.hardErrors.length > 0 && (
              <div className="p-2 bg-[#c4452d]/20 border border-[#c4452d] rounded text-xs font-mono text-[#c4452d] mb-1.5 leading-relaxed">
                ❌ {metrics.hardErrors[0]}
              </div>
            )}
            {metrics.hardErrors.length === 0 && metrics.warnings.length > 0 && (
              <div className="p-2 bg-[#e39b12]/15 border border-[#e39b12]/40 rounded text-xs font-mono text-[#e39b12] mb-1.5 leading-relaxed">
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
              disabled={!metrics.isLaunchLegal}
              className={`w-full py-3 rounded font-mono font-bold uppercase tracking-wider text-sm md:text-base transition-all shadow-md ${
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

      {/* Bottom Row: Optional Parts Palette (Relaxed, comfortable typography) */}
      <div className="border-t border-[#efe6d6]/20 pt-2.5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#e39b12] font-bold">
            2. Optional Modular Parts (Click or drag to equip):
          </span>
          <span className="text-xs font-mono text-[#efe6d6]/60">
            Patched-conic teaching table, not a GMAT run.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {OPTIONAL_PARTS.map((part) => {
            const currentCount = design.parts[part.id] || 0;
            const max = part.maxCount || 1;
            const isMaxed = currentCount >= max;

            return (
              <div
                key={part.id}
                draggable={!isMaxed}
                onDragStart={(e) => handleDragStart(e, part.id)}
                onClick={() => addPart(part.id)}
                className={`bg-[#1a1714] border p-2.5 rounded cursor-pointer transition-all flex flex-col justify-between hover:border-[#e39b12] ${
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
