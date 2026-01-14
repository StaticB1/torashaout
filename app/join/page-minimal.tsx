'use client';

import { useState } from 'react';
import { Currency } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function JoinPage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="min-h-screen bg-black">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold">Join as Talent - Test</h1>
      </div>
      <Footer />
    </div>
  );
}
