'use client';
import React from 'react';
import { sound } from './AudioController';

interface TerminalChromeProps {
  title?: string;
  nodeId?: string;
  status?: string;
  className?: string;
  children: React.ReactNode;
  showDots?: boolean;
}

export function TerminalChrome({
  title = 'TENTH-LIGHT-OS // FLIGHT-TELEMETRY',
  nodeId = 'CORRIDOR-BUS-1',
  status = 'NOMINAL',
  className = '',
  children,
  showDots = true,
}: TerminalChromeProps) {
  return (
    <div className={`tui-frame rounded-lg overflow-hidden border border-[#efe6d6]/25 bg-[#1a1714] shadow-xl ${className}`}>
      {/* Top Retro TUI Header Bar */}
      <div className="bg-[#100e0c] px-3.5 py-1.5 border-b border-[#efe6d6]/20 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2.5">
          {showDots && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c4452d] inline-block opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e39b12] inline-block opacity-80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#5bc0be] inline-block opacity-80" />
            </div>
          )}
          <span className="text-[#e39b12] font-bold tracking-wider">{title}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#efe6d6]/70">
          <span className="hidden sm:inline font-mono opacity-60">NODE: [{nodeId}]</span>
          <span className="px-1.5 py-0.5 rounded bg-[#100e0c] border border-[#5bc0be]/40 text-[#5bc0be] font-bold">
            {status}
          </span>
        </div>
      </div>

      {/* Main Terminal Window Body */}
      <div className="p-4 md:p-5 relative font-mono text-sm leading-relaxed text-[#efe6d6]">
        {children}
      </div>

      {/* Bottom TUI Status Line */}
      <div className="bg-[#100e0c]/80 px-3.5 py-1 border-t border-[#efe6d6]/10 flex items-center justify-between text-[10px] font-mono text-[#efe6d6]/50">
        <span>PROMPT: wren@tenth-light:~/mission$</span>
        <span>SECURITY: ENCRYPTED LOCAL // AUTH: NASA-JPL-CALTECH</span>
      </div>
    </div>
  );
}
