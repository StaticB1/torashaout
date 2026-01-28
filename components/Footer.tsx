import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-purple-900/30 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-base sm:text-xl">
                TS
              </div>
              <span className="text-lg sm:text-xl font-bold">ToraShaout</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Connecting Zimbabwe&apos;s biggest stars with fans worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">For Fans</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
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
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">For Talent</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
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
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
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

        <div className="border-t border-purple-900/30 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
          <div className="text-center md:text-left">
            <p>© 2026 ToraShaout. All rights reserved.</p>
            <p className="mt-1">© 2026 StatoTech. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="X">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a href="https://wa.me/821048370343" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a href="mailto:info@torashaout.com" className="flex items-center gap-1.5 hover:text-white transition" aria-label="Email">
              <Mail className="w-5 h-5" />
              <span className="hidden sm:inline">Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
