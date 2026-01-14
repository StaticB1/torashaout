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
            <Link href="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link>
            <Link href="/business" className="text-gray-300 hover:text-white transition">
              For Business
            </Link>
            <Link href="/join" className="text-gray-300 hover:text-white transition">
              Join as Talent
            </Link>

            <div className="relative">
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="appearance-none bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg px-4 py-2 pr-8 text-sm font-medium cursor-pointer hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{
                  colorScheme: 'dark'
                }}
              >
                <option value="USD" className="bg-gray-900 text-white py-2">USD ($)</option>
                <option value="ZIG" className="bg-gray-900 text-white py-2">ZIG</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
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
              href="/about"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/business"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
            </Link>
            <Link
              href="/join"
              className="block text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join as Talent
            </Link>

            <div className="relative">
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="w-full appearance-none bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg px-4 py-3 pr-10 font-medium cursor-pointer hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{
                  colorScheme: 'dark'
                }}
              >
                <option value="USD" className="bg-gray-900 text-white py-2">USD ($)</option>
                <option value="ZIG" className="bg-gray-900 text-white py-2">ZIG</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-400">
                <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <Button className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
