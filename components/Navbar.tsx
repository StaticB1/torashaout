'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Currency } from '@/types';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function Navbar({ currency, onCurrencyChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-lg border-b border-purple-900/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-xl">
              TS
            </div>
            <span className="text-xl font-bold text-gradient-brand">
              ToraShaout
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-300 hover:text-white transition">
              Browse Talent
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition">
              How It Works
            </Link>
            <Link href="/business" className="text-gray-300 hover:text-white transition">
              For Business
            </Link>
            
            <select 
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-1.5 text-sm cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="ZIG">ZIG</option>
            </select>
            
            <Button size="sm" variant="primary">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-900/30">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/browse" 
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Talent
            </Link>
            <Link 
              href="/how-it-works" 
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/business" 
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
            </Link>
            
            <select 
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="w-full bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2"
            >
              <option value="USD">USD ($)</option>
              <option value="ZIG">ZIG</option>
            </select>
            
            <Button className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
