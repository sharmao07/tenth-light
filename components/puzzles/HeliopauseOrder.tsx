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
    <div className="bg-[#12151b]/95 border border-[#f0562b] p-8 rounded-lg max-w-2xl mx-auto text-[#e9e6dc] shadow-2xl select-none">
      {/* One-line how-to */}
      <div className="bg-[#0a0c10] px-6 py-4 rounded border border-[#f0562b]/50 text-sm text-[#f0562b] mb-4 text-center leading-relaxed">
        HOW-TO: Order return packets: 1. water & soil readings, 2. power & nav log, 3. postcard. Wrong order resets.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* NASA Voyager / Heliopause Plate */}
        <div className="bg-[#0a0c10] p-4 border border-[#e9e6dc]/20 rounded-lg flex flex-col items-center">
          <div className="w-full h-40 relative overflow-hidden rounded bg-[#12151b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heliopausePlate.url}
              alt="Heliopause"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full mt-2 text-xs text-[#e9e6dc]/80 text-left leading-relaxed">
            <span className="text-[#f0562b] font-bold block">{heliopausePlate.credit}</span>
            <div className="truncate">{heliopausePlate.caption}</div>
          </div>
        </div>

        {/* Protocol Priority List */}
        <div className="space-y-5 font-sans">
          <div className="border-b border-[#e9e6dc]/15 pb-3">
            <div className="text-sm text-[#f0562b] font-bold">
              122 AU Heliopause Boundary (Simulation)
            </div>
            <div className="text-xs md:text-sm text-[#e9e6dc]/80 mt-1 leading-relaxed">
              Voyager 1 crossed in August 2012. Click packets in scientific priority order:
            </div>
          </div>

          <div className="space-y-3">
            {PROTOCOL_ITEMS.map((item) => {
              const isPicked = selectedItems.includes(item.id);
              const orderIndex = selectedItems.indexOf(item.id) + 1;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={`w-full py-4 px-5 text-left text-xs md:text-sm border rounded-lg transition-colors flex justify-between items-center shadow-sm ${
                    isPicked
                      ? 'bg-[#e9e6dc] text-[#0a0c10] border-[#e9e6dc] font-bold'
                      : 'bg-[#0a0c10] hover:bg-[#f0562b] hover:text-[#0a0c10] border-[#e9e6dc]/30 text-[#e9e6dc]'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  {isPicked && (
                    <span className="text-xs font-bold bg-[#0a0c10] text-[#e9e6dc] px-3 py-0.5 rounded ml-2">
                      Queue #{orderIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {statusMsg && (
            <div className="p-4 bg-[#0a0c10] border border-[#e9e6dc]/20 rounded-lg text-xs md:text-sm leading-relaxed">
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
