'use client';
import React, { useState } from 'react';
import { NASA_IMAGE_PLATES } from '@/lib/nasaSnapshots';
import { sound } from '../AudioController';

interface HeliopauseOrderProps {
  onSuccess: () => void;
}

interface ProtocolItem {
  id: string;
  name: string;
  correctStep: number;
}

const PROTOCOL_ITEMS: ProtocolItem[] = [
  { id: 'postcard', name: '3. Digital Postcard from Deep Space', correctStep: 3 },
  { id: 'water_soil', name: '1. Water and Soil Instrument Readings', correctStep: 1 },
  { id: 'log', name: '2. Power and Navigation Telemetry Log', correctStep: 2 },
];

export function HeliopauseOrder({ onSuccess }: HeliopauseOrderProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const heliopausePlate = NASA_IMAGE_PLATES[9];

  const handleSelectItem = (id: string) => {
    sound.playUiClick();
    if (selectedItems.includes(id)) return;

    const nextSelected = [...selectedItems, id];
    const currentStep = nextSelected.length;

    const item = PROTOCOL_ITEMS.find((it) => it.id === id);
    if (!item || item.correctStep !== currentStep) {
      sound.playMiss();
      setSelectedItems([]);
      setStatusMsg('SEQUENCE MISMATCH! Priority order violated. Buffer reset. Re-enter sequence.');
      return;
    }

    setSelectedItems(nextSelected);

    if (nextSelected.length === 3) {
      sound.playSuccess();
      setStatusMsg('✓ Return protocol sealed! 1: Samples → 2: Log → 3: Postcard. Whisper opens Harbor jump.');
      setTimeout(onSuccess, 800);
    } else {
      setStatusMsg(`Step ${currentStep} verified. Select next packet.`);
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-4 sm:p-5 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2 border border-signal/40 text-xs sm:text-sm text-signal mb-3 text-center leading-relaxed">
        HOW-TO: Order return packets: 1. water & soil readings, 2. power & nav log, 3. postcard. Wrong order resets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Voyager / Heliopause Plate */}
        <div className="bg-void p-3 border border-paper/20 flex flex-col items-center">
          <div className="w-full h-32 relative overflow-hidden bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heliopausePlate.url}
              alt="Heliopause"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-paper-muted text-left leading-relaxed font-mono">
            <span className="text-signal font-bold block">{heliopausePlate.credit}</span>
            <div className="truncate">{heliopausePlate.caption}</div>
          </div>
        </div>

        {/* Protocol Priority List */}
        <div className="space-y-3 font-sans">
          <div className="border-b border-paper/15 pb-1.5">
            <div className="text-xs sm:text-sm text-signal font-bold font-mono">
              122 AU Heliopause Boundary (Simulation)
            </div>
            <div className="text-[11px] text-paper-muted mt-0.5 leading-relaxed font-mono">
              Voyager 1 crossed in August 2012. Click packets in scientific priority order:
            </div>
          </div>

          <div className="space-y-2">
            {PROTOCOL_ITEMS.map((item) => {
              const isPicked = selectedItems.includes(item.id);
              const orderIndex = selectedItems.indexOf(item.id) + 1;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`w-full py-2.5 px-3.5 text-left text-xs md:text-sm border transition-colors flex justify-between items-center ${
                    isPicked
                      ? 'bg-paper text-void border-paper font-bold'
                      : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  {isPicked && (
                    <span className="text-xs font-mono font-bold bg-surface text-signal px-2.5 py-0.5 border border-signal/40 ml-2 tabular-nums">
                      Queue #{orderIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {statusMsg && (
            <div className="p-2.5 bg-surface border border-paper/20 text-xs leading-relaxed font-mono">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
