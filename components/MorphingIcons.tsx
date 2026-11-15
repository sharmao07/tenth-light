'use client';
import React from 'react';
import { MorphIcon } from 'morphicons/react';

// Standard technical SVG stroke paths for Tenth Light interactive controls
const AUDIO_ON = 'M11 5L6 9H2v6h4l5 4V5z M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14';
const AUDIO_MUTED = 'M11 5L6 9H2v6h4l5 4V5z M23 9l-6 6 M17 9l6 6';

const PLAY_ICON = 'M5 3l14 9-14 9V3z';
const PAUSE_ICON = 'M6 4h4v16H6V4z M14 4h4v16h-4V4z';

const CLEARANCE_LOCK = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v5';
const CLEARANCE_CHECK = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4';

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * AudioMorphIcon: Smoothly morphs speaker sound waves into mute cross using morphicons spring physics.
 */
export function AudioMorphIcon({ isMuted, size = 14, className = '' }: IconProps & { isMuted: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <MorphIcon
        icon={isMuted ? AUDIO_MUTED : AUDIO_ON}
        size={size}
        color="currentColor"
        strokeWidth={2}
        spring="smooth"
        reducedMotion="user"
      />
    </span>
  );
}

/**
 * AutoPlayMorphIcon: Morphs dialogue play chevron (>) into pause double-bars (||).
 */
export function AutoPlayMorphIcon({ isAuto, size = 12, className = '' }: IconProps & { isAuto: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <MorphIcon
        icon={isAuto ? PAUSE_ICON : PLAY_ICON}
        size={size}
        color="currentColor"
        strokeWidth={2}
        spring="smooth"
        reducedMotion="user"
      />
    </span>
  );
}

/**
 * ClearanceMorphIcon: Morphs planetary gate directive locked pylon into cleared checkmark shield.
 */
export function ClearanceMorphIcon({ isCleared, size = 13, className = '' }: IconProps & { isCleared: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <MorphIcon
        icon={isCleared ? CLEARANCE_CHECK : CLEARANCE_LOCK}
        size={size}
        color="currentColor"
        strokeWidth={2}
        spring="smooth"
        reducedMotion="user"
      />
    </span>
  );
}
