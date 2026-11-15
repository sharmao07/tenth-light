import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tenth Light — Space Mission Design Game',
  description: 'A space mission design game for NASA Space Apps 2026. Design the ship. Stay in the seat. Send the droid.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#100e0c]">
      <body className="h-full bg-[#100e0c] text-[#efe6d6] overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
