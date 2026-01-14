import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-purple-900/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-xl">
                TS
              </div>
              <span className="text-xl font-bold">ToraShaout</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting Zimbabwe&apos;s biggest stars with fans worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Fans</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/browse" className="hover:text-white transition">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-white transition">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Talent</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/join" className="hover:text-white transition">
                  Join as Talent
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Talent Dashboard
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:text-white transition">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-900/30 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2026 ToraShaout. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Facebook
            </a>
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
