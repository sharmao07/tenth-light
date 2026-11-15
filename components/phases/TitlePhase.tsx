'use client';
import React from 'react';
import Link from 'next/link';
import { sound } from '@/components/AudioController';
import { NoriPixelToken } from '@/components/SleevePixelTokens';

interface TitlePhaseProps {
  callsign: string;
  currentStop: number;
  onUpdateCallsign: (callsign: string) => void;
  onStartBriefing: () => void;
  onResumeGame: () => void;
  onOpenLogbook: () => void;
}

export function TitlePhase({
  callsign,
  currentStop,
  onUpdateCallsign,
  onStartBriefing,
  onResumeGame,
  onOpenLogbook,
}: TitlePhaseProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24 select-none grid gap-16 lg:gap-24 lg:grid-cols-[1.5fr_1fr] items-end animate-fadeIn">
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface border border-signal/70 flex items-center justify-center p-2 shadow-sm shrink-0">
            <NoriPixelToken size={34} />
          </div>
          <div>
            <p className="label !text-signal">Mission Insignia &middot; Droid Nori</p>
            <p className="text-xs font-mono text-paper-muted">NASA Space Apps 2026 &middot; Space Mission Design Game</p>
          </div>
        </div>
        <h1 className="display-xl">
          <span className="block font-extralight">Tenth</span>
          <span className="block font-extrabold -mt-[0.08em]">Light</span>
        </h1>
        <h2 className="font-serif italic text-2xl md:text-3xl text-paper max-w-xl leading-snug">
          Design the ship. Stay in the seat. Send the droid.
        </h2>
        <blockquote className="max-w-xl border-l border-signal pl-6 text-[15px] leading-[1.8] text-paper-muted">
          &ldquo;Stops 1 through 9 are real places. Harbor is TOI-700 e, from the NASA Exoplanet Archive.
          The voyage past the heliopause is a mission simulation that uses the archive&rsquo;s numbers.
          The aliens, the depot fight, and the droid are the story.&rdquo;
        </blockquote>
      </div>

      <div className="space-y-12 pb-2">
        <div className="space-y-3">
          <label htmlFor="callsign" className="label">Specialist callsign</label>
          <input
            id="callsign"
            type="text"
            maxLength={16}
            value={callsign}
            onChange={(e) => onUpdateCallsign(e.target.value.trim() || 'Wren')}
            className="field"
            placeholder="Wren"
          />
          <p className="text-sm text-paper-muted leading-relaxed">
            The specialist never leaves the ship and appears only in dialogue.
          </p>
        </div>

        <div className="space-y-8">
          <button
            onClick={onStartBriefing}
            onMouseEnter={() => sound.playHoverBlip()}
            className="btn"
          >
            <span>Begin mission</span>
            <span aria-hidden="true">&rarr;</span>
          </button>

          <ul className="index-list">
            {currentStop > 0 && (
              <li>
                <button onClick={onResumeGame} onMouseEnter={() => sound.playHoverBlip()}>
                  <span>Resume corridor</span><em className="tabular-nums">Stop {currentStop}</em>
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => {
                  sound.playUiClick();
                  onOpenLogbook();
                }}
                onMouseEnter={() => sound.playHoverBlip()}
              >
                <span>Mission logbook</span><em className="tabular-nums">11 acts</em>
              </button>
            </li>
            <li>
              <Link href="/presentation" onMouseEnter={() => sound.playHoverBlip()}>
                <span>Demo deck</span><em className="tabular-nums">7 slides</em>
              </Link>
            </li>
            <li>
              <Link href="/data" onMouseEnter={() => sound.playHoverBlip()}>
                <span>Scientific data</span><em>NASA sources</em>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
