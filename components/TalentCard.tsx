'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Play } from 'lucide-react';
import { TalentProfile, Currency } from '@/types';
import { formatCurrency, formatResponseTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface TalentCardProps {
  talent: TalentProfile;
  currency: Currency;
}

export function TalentCard({ talent, currency }: TalentCardProps) {
  const price = currency === 'USD' ? talent.priceUSD : talent.priceZIG;
  
  return (
    <div className="bg-gray-900 border border-purple-700/30 rounded-xl overflow-hidden hover:border-purple-500 transition group cursor-pointer">
      <Link href={`/talent/${talent.id}`}>
        <div className="relative aspect-square">
          <Image
            src={talent.thumbnailUrl || '/images/default-avatar.jpg'}
            alt={talent.displayName}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition">
            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Play size={20} fill="white" />
            </button>
          </div>
          
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <Star size={14} fill="#fbbf24" className="text-yellow-400" />
            <span className="text-sm font-semibold">{talent.averageRating.toFixed(1)}</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/talent/${talent.id}`}>
            <h3 className="text-xl font-bold hover:text-purple-400 transition">
              {talent.displayName}
            </h3>
          </Link>
          <span className="text-xs px-2 py-1 bg-purple-900/50 rounded-full capitalize">
            {talent.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{formatResponseTime(talent.responseTimeHours)}</span>
          </span>
          <span>{talent.totalBookings} bookings</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient-brand">
            {price ? formatCurrency(price, currency) : 'Contact'}
          </div>
          <Button size="sm" onClick={() => window.location.href = `/talent/${talent.id}`}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
