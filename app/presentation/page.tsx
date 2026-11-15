import React from 'react';
import { PresentationDeck } from '@/components/PresentationDeck';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tenth Light — 7-Slide Space Apps Demonstration',
  description: 'Official 7-slide demonstration presentation for NASA Space Apps Challenge 2026: Space Mission Design Game.',
};

export default function PresentationPage() {
  return <PresentationDeck />;
}
