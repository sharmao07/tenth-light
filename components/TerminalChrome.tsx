'use client';
import React from 'react';

interface TerminalChromeProps {
  title?: string;
  nodeId?: string;
  status?: string;
  className?: string;
  children: React.ReactNode;
  showDots?: boolean; // kept for compatibility; the header no longer draws window dots
}

/** Instrument panel: title and channel on a hairline rule, status as a plain readout. */
export function TerminalChrome({
  title = 'Flight telemetry',
  nodeId = 'Bus 1',
  status = 'Nominal',
  className = '',
  children,
}: TerminalChromeProps) {
  return (
    <section className={`tui-frame overflow-hidden ${className}`}>
      <header className="flex items-baseline justify-between gap-6 border-b border-[#2a3039] px-6 py-3 text-xs uppercase tracking-wider select-none">
        <span className="text-[#e9e6dc]">{title}</span>
        <span className="flex items-center gap-5 text-[#7d8591]">
          <span className="hidden sm:inline">{nodeId}</span>
          <span className="flex items-center gap-2 text-[#e9e6dc]">
            <span aria-hidden className="inline-block h-1.5 w-1.5 bg-[#e9e6dc]" />
            {status}
          </span>
        </span>
      </header>
      <div className="relative p-6 text-sm leading-relaxed text-[#e9e6dc] md:p-8">{children}</div>
    </section>
  );
}
