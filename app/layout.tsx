import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, Martian_Mono } from 'next/font/google';
import './globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const data = Martian_Mono({ subsets: ['latin'], variable: '--font-data', display: 'swap' });

export const metadata: Metadata = {
  title: 'Tenth Light — Space Mission Design Game',
  description: 'A space mission design game for NASA Space Apps 2026. Design the ship. Stay in the seat. Send the droid.',
  icons: {
    icon: [
      { url: '/nori-32x32.png?v=20261115', sizes: '32x32', type: 'image/png' },
      { url: '/nori-16x16.png?v=20261115', sizes: '16x16', type: 'image/png' },
      { url: '/nori-icon.svg?v=20261115', type: 'image/svg+xml' },
      { url: '/nori-favicon.ico?v=20261115', sizes: 'any' },
    ],
    shortcut: '/nori-favicon.ico?v=20261115',
    apple: [
      { url: '/nori-180x180.png?v=20261115', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable} h-full bg-[#0a0c10]`}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/nori-32x32.png?v=20261115" />
        <link rel="icon" type="image/png" sizes="16x16" href="/nori-16x16.png?v=20261115" />
        <link rel="icon" type="image/svg+xml" href="/nori-icon.svg?v=20261115" />
        <link rel="shortcut icon" href="/nori-favicon.ico?v=20261115" />
        <link rel="apple-touch-icon" sizes="180x180" href="/nori-180x180.png?v=20261115" />
        <link rel="preconnect" href="https://images-assets.nasa.gov" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images-assets.nasa.gov" />
      </head>
      <body className="h-full bg-[#0a0c10] text-[#e9e6dc] overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
