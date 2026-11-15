import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, Martian_Mono } from 'next/font/google';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const data = Martian_Mono({ subsets: ['latin'], variable: '--font-data', display: 'swap' });

export const metadata: Metadata = {
  title: 'Tenth Light — Space Mission Design Game',
  description: 'A space mission design game for NASA Space Apps 2026. Design the ship. Stay in the seat. Send the droid.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable} h-full bg-[#0a0c10]`}>
      <body className="h-full bg-[#0a0c10] text-[#e9e6dc] overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
