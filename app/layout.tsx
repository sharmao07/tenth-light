import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, Martian_Mono } from 'next/font/google';
import './globals.css';
import FaviconManager from '@/components/FaviconManager';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const data = Martian_Mono({ subsets: ['latin'], variable: '--font-data', display: 'swap' });

const NORI_DATA_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA40lEQVR4nGNkIBJw8Qj8ZyABfPvygZEYdUwMAwwYifX5/VtnSDJYUc2EqJBgYhhgwEhtn5MaEkwMgz0EODi5UcTvOQpgVa+0/wOYvn7xIJjW1LcH0z++fx3cIcBCbQNhPicWMDEM9hC4Do1TGPiJSx2BXDBoQ4CRVvmf2PKAiWGwp4Ep87dSZEFOojdeeSaGwR4COQR8QClgYhgudQF6nQADg74uYBrxDmBkGOklISOuEFBQ0cSq4cGd6yg+qW2diNJfaK7OZyTFHCaGAQZMI94BjOT2AQn1eIg1h2mgo4BhxAMAl7VU6cn9cLMAAAAASUVORK5CYII=';

export const metadata: Metadata = {
  title: 'The Tenth Light — Space Mission Design Game',
  description: 'A space mission design game for NASA Space Apps 2026. Design the ship. Stay in the seat. Send the droid.',
  icons: {
    icon: [
      { url: NORI_DATA_PNG, type: 'image/png' },
      { url: '/nori-icon.svg?v=20261115-4', type: 'image/svg+xml' },
      { url: '/nori-32x32.png?v=20261115-4', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=20261115-4', sizes: 'any' },
    ],
    shortcut: NORI_DATA_PNG,
    apple: [
      { url: '/apple-icon.png?v=20261115-4', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable} h-full bg-[#0a0c10]`}>
      <head>
        <link rel="preconnect" href="https://images-assets.nasa.gov" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images-assets.nasa.gov" />
      </head>
      <body className="h-full bg-[#0a0c10] text-[#e9e6dc] overflow-x-hidden antialiased">
        <FaviconManager />
        <noscript>
          <div className="bg-[#12151b] border-b border-[#f0562b] p-6 text-center font-mono text-sm text-[#e9e6dc] space-y-3">
            <p className="font-bold text-[#f0562b] text-base">The Tenth Light &mdash; Space Mission Design Game</p>
            <p className="italic text-[#7d8591]">&ldquo;Design the ship. Stay in the seat. Send the droid.&rdquo;</p>
            <p className="max-w-2xl mx-auto text-xs leading-relaxed text-[#e9e6dc]/80">
              An interactive 3D space mission design game built for the NASA Space Apps Challenge 2026.
              Follow Specialist Wren and astromech droid Nori through an 11-stop corridor across the Solar System to exoplanet TOI-700 e.
            </p>
            <p className="text-xs text-[#f0562b]">
              Interactive 3D vehicle assembly and real-time telemetry require JavaScript. Please enable JavaScript to launch the simulation.
            </p>
            <div className="flex justify-center gap-4 text-xs pt-2">
              <a href="https://github.com/sharmao07/tenth-light" className="underline hover:text-[#f0562b]">GitHub Repository</a>
              <span>&bull;</span>
              <a href="/data" className="underline hover:text-[#f0562b]">NASA Data Disclosures</a>
              <span>&bull;</span>
              <a href="https://1drv.ms/p/c/5d6c8f0368f48b28/IQAK4XN06IYmS6RtsfYhzG--AeyV_eGfnFNZQRdago5KvD0?e=pgJLsE" className="underline hover:text-[#f0562b]">Demonstration Deck</a>
            </div>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
