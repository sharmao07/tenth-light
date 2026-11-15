'use client';
import React, { useEffect, useState } from 'react';
import { sound, SoundCaptionCallback } from './AudioController';

interface SoundCaptionsHUDProps {
  enabled?: boolean;
}

export function SoundCaptionsHUD({ enabled = true }: SoundCaptionsHUDProps) {
  const [caption, setCaption] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleCaption: SoundCaptionCallback = (newCaption) => {
      setCaption(newCaption);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCaption(null);
      }, 2600);
    };

    sound.addCaptionListener(handleCaption);

    return () => {
      sound.removeCaptionListener(handleCaption);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled]);

  if (!enabled || !caption) return null;

  return (
    <aside 
      aria-live="polite" 
      aria-label="Audio telemetry caption" 
      className="fixed bottom-24 right-8 z-50 pointer-events-none select-none animate-fadeIn"
    >
      <div className="bg-void/90 border border-signal text-paper px-4 py-2 font-mono text-xs flex items-center gap-3 backdrop-blur-none">
        <span className="text-signal font-bold" aria-hidden="true">&sung;</span>
        <span className="tracking-wide text-paper font-medium">{caption}</span>
      </div>
    </aside>
  );
}
