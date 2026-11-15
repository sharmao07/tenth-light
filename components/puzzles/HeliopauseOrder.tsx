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

    // Check correctness of current step
    const item = PROTOCOL_ITEMS.find((it) => it.id === id);
    if (!item || item.correctStep !== currentStep) {
      sound.playMiss();
      setSelectedItems([]);
      setStatusMsg('SEQUENCE MISMATCH! Priority order violated. Buffer reset. Re-enter sequence.');
      return;
    }

    // Step correct
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
    <div className="bg-[#1a1714]/95 border-2 border-[#e39b12] p-4 rounded max-w-xl mx-auto text-[#efe6d6] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#100e0c] px-3 py-1.5 rounded border border-[#e39b12]/50 text-xs font-mono text-[#e39b12] mb-3 text-center">
        HOW-TO: Order return packets: 1. water & soil readings, 2. power & nav log, 3. postcard. Wrong order resets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* NASA Voyager / Heliopause Plate */}
        <div className="bg-[#100e0c] p-2 border border-[#efe6d6]/20 rounded flex flex-col items-center">
          <div className="w-full h-36 relative overflow-hidden rounded bg-[#1a1714]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heliopausePlate.url}
              alt="Heliopause"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-1.5 text-[10px] font-mono text-[#efe6d6]/60 text-left">
            <span className="text-[#e39b12] font-semibold">{heliopausePlate.credit}</span>
            <div className="truncate">{heliopausePlate.caption}</div>
          </div>
        </div>

        {/* Protocol Priority List */}
        <div className="space-y-2 font-sans">
          <div className="border-b border-[#efe6d6]/10 pb-1">
            <div className="text-xs font-mono text-[#e39b12] font-bold">
              122 AU Heliopause Boundary (Simulation)
            </div>
            <div className="text-[11px] text-[#efe6d6]/70 mt-0.5">
              Voyager 1 crossed in August 2012. Click packets in scientific priority order:
            </div>
          </div>

          <div className="space-y-1.5">
            {PROTOCOL_ITEMS.map((item) => {
              const isPicked = selectedItems.includes(item.id);
              const orderIndex = selectedItems.indexOf(item.id) + 1;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`w-full py-2 px-2.5 text-left font-mono text-xs border rounded transition-colors flex justify-between items-center ${
                    isPicked
                      ? 'bg-[#5bc0be] text-[#100e0c] border-[#5bc0be] font-bold'
                      : 'bg-[#100e0c] hover:bg-[#e39b12] hover:text-[#100e0c] border-[#efe6d6]/30 text-[#efe6d6]'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  {isPicked && (
                    <span className="text-[10px] bg-[#100e0c] text-[#5bc0be] px-1.5 py-0.5 rounded ml-2">
                      Queue #{orderIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {statusMsg && (
            <div className="p-1.5 bg-[#100e0c] border border-[#efe6d6]/20 rounded text-xs font-mono leading-tight">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
