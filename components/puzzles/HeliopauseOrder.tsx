'use client';
import React, { useState } from 'react';
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
      setStatusMsg(`Step ${currentStep} verified. Select next packet in scientific order.`);
    }
  };

  return (
    <div className="bg-surface-raised border border-signal p-5 sm:p-6 max-w-2xl mx-auto text-paper select-none">
      {/* One-line how-to */}
      <div className="bg-void px-4 py-2.5 border border-signal/40 text-xs sm:text-sm text-signal mb-5 text-center leading-relaxed font-sans">
        HOW-TO: Order return packets: 1. water &amp; soil readings, 2. power &amp; nav log, 3. postcard. Wrong order resets.
      </div>

      {/* Protocol Priority List */}
      <div className="space-y-4 font-sans">
        <div className="border-b border-paper/15 pb-3">
          <div className="text-sm md:text-base text-signal font-bold font-mono">
            122 AU Heliopause Boundary (Simulation)
          </div>
          <div className="text-xs sm:text-sm text-paper-muted mt-1 leading-relaxed font-mono">
            Voyager 1 crossed into interstellar space in August 2012. Click packets in scientific priority order:
          </div>
        </div>

        <div className="space-y-3 my-4">
          {PROTOCOL_ITEMS.map((item) => {
            const isPicked = selectedItems.includes(item.id);
            const orderIndex = selectedItems.indexOf(item.id) + 1;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={`w-full py-3.5 px-4 text-left text-xs sm:text-sm border transition-colors flex justify-between items-center ${
                  isPicked
                    ? 'bg-paper text-void border-paper font-bold'
                    : 'bg-void hover:bg-signal hover:text-void border-paper/30 text-paper'
                }`}
              >
                <span className="font-medium">{item.name}</span>
                {isPicked && (
                  <span className="text-xs font-mono font-bold bg-surface text-signal px-3 py-1 border border-signal/40 ml-2 tabular-nums">
                    Queue #{orderIndex}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {statusMsg && (
          <div className="p-3.5 bg-surface border border-paper/20 text-xs sm:text-sm leading-relaxed font-mono mt-3">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
