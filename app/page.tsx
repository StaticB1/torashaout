'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Play, Zap, ChevronRight, Shield, Clock, TrendingUp, Star } from 'lucide-react';
import { Currency } from '@/types';
import { mockTalentProfiles, categories } from '@/lib/mock-data';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';
import { TalentCard } from '@/components/TalentCard';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center space-x-2 bg-purple-900/30 border border-purple-700/50 rounded-full px-4 py-2">
                <Zap size={16} className="text-pink-400" />
                <span className="text-sm text-gray-300">Connecting Zimbabwe to the World</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Favorite
                <span className="block text-gradient-brand">
                  Stars, Delivered
                </span>
                Anywhere
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-lg">
                Book personalized video messages from Zimbabwe&apos;s biggest celebrities.
                For birthdays, graduations, or just because.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search for your favorite celebrity..."
                    className="w-full bg-gray-900 border border-purple-700/50 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <Link href="/browse">
                  <Button>
                    Browse Talent
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8 pt-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">500+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Verified Stars</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-pink-400">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Videos Delivered</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">4.9★</div>
                  <div className="text-xs sm:text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Video */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-purple-700/50">
                <Image 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop"
                  alt="Featured video"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition shadow-2xl">
                  <Play size={32} fill="white" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-sm text-gray-300 mb-1">Sample Video</div>
                  <div className="text-2xl font-bold">See how it works</div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl">
                <div className="text-sm text-gray-300">Starting from</div>
                <div className="text-3xl font-bold">{currency === 'USD' ? '$25' : 'ZIG 1,250'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Explore by <span className="text-gradient-brand">Category</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <button 
                key={index}
                className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 hover:border-purple-500 hover:bg-gray-800 transition group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className="font-semibold mb-1">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} talents</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talent */}
      <section id="browse" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Talent</h2>
              <p className="text-gray-400">Book personalized videos from Zimbabwe&apos;s finest</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition">
              <span>View All</span>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTalentProfiles.slice(0, 4).map((talent) => (
              <TalentCard key={talent.id} talent={talent} currency={currency} />
            ))}
          </div>

          <button className="md:hidden w-full mt-8 flex items-center justify-center space-x-2 text-purple-400 border border-purple-700/50 rounded-lg py-3">
            <span>View All Talent</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get your personalized video in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Choose Your Star</h3>
              <p className="text-gray-400">Browse our catalog of verified Zimbabwean celebrities across music, comedy, gospel, and more.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Book & Pay</h3>
              <p className="text-gray-400">Tell us the occasion and who it&apos;s for. Pay securely with EcoCash, OneMoney, or card.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Receive Your Video</h3>
              <p className="text-gray-400">Get your personalized video via WhatsApp within 7 days. Download and share forever.</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6">
              <Shield size={32} className="text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Verified</h3>
              <p className="text-gray-400">Every talent is personally verified by our team. No fake accounts.</p>
            </div>

            <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6">
              <Clock size={32} className="text-pink-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">7-Day Delivery</h3>
              <p className="text-gray-400">Your video delivered within a week, or your money back guaranteed.</p>
            </div>

            <div className="bg-gray-900 border border-purple-700/30 rounded-xl p-6">
              <TrendingUp size={32} className="text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Dual Currency</h3>
              <p className="text-gray-400">Pay in USD or ZIG. Perfect for diaspora and local fans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Make Someone&apos;s Day?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Over 10,000 videos delivered. Join thousands of happy customers worldwide.
            </p>
            <Link href="/browse">
              <Button size="lg">
                Browse All Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join as Talent Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-pink-900/30 border border-pink-700/50 rounded-full px-4 py-2">
                <Star size={16} className="text-pink-400" />
                <span className="text-sm text-gray-300">For Celebrities & Influencers</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold">
                Are You a <span className="text-gradient-brand">Celebrity?</span>
              </h2>

              <p className="text-xl text-gray-400">
                Join Zimbabwe&apos;s top talent on ToraShaout and earn money by creating personalized video messages for your fans. Set your own prices and work on your schedule.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Earn Extra Income</h3>
                    <p className="text-sm text-gray-400">Set your own rates and get paid for every video</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Work Your Schedule</h3>
                    <p className="text-sm text-gray-400">Accept requests when it suits you</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Build Your Brand</h3>
                    <p className="text-sm text-gray-400">Connect directly with fans worldwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Full Support</h3>
                    <p className="text-sm text-gray-400">Dedicated team to help you succeed</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/join">
                  <Button size="lg">
                    Apply to Join
                  </Button>
                </Link>
                <Link href="/join">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-sm text-gray-400">Active Talent</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">10K+</div>
                  <div className="text-sm text-gray-400">Videos Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">$2M+</div>
                  <div className="text-sm text-gray-400">Earned by Talent</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">4.9★</div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-purple-700/50">
                <p className="text-center text-gray-300 mb-4 italic">
                  "ToraShaout has completely changed how I connect with my fans. I&apos;ve made over $5,000 in just three months!"
                </p>
                <div className="text-center">
                  <div className="font-semibold">Winky D</div>
                  <div className="text-sm text-gray-400">Musician</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
