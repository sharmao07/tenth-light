'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import type { ShipDesign } from '@/lib/gameTypes';

export interface Ship3DViewProps {
  design: ShipDesign;
  cruiseMode?: boolean;
  interactive?: boolean;
  className?: string;
  showCoM?: boolean;
  showCoT?: boolean;
  showCoL?: boolean;
}

export const Ship3DView = dynamic<Ship3DViewProps>(
  () => import('./Ship3DViewDirect').then((m) => m.Ship3DViewDirect),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-void border border-paper/10 text-paper-muted font-mono text-xs p-4 select-none">
        <span className="w-2.5 h-2.5 bg-signal animate-pulse mb-3" />
        <span className="label text-[11px] text-paper-muted">Initialising 3D telemetry...</span>
      </div>
    ),
  }
);

export default Ship3DView;
