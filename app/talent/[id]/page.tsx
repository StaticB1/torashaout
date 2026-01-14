'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Star, Clock, CheckCircle, MessageSquare, ArrowLeft, Share2 } from 'lucide-react'
import { mockTalentProfiles } from '@/lib/mock-data'
import { formatCurrency, formatResponseTime } from '@/lib/utils'
import { Currency } from '@/types'
import { Button } from '@/components/ui/Button'

export default function TalentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [currency, setCurrency] = useState<Currency>('USD')
  const [selectedOccasion, setSelectedOccasion] = useState('')

  const talent = mockTalentProfiles.find(t => t.id === params.id)

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Talent not found</h1>
          <Button onClick={() => router.push('/browse')}>Browse Talent</Button>
        </div>
      </div>
    )
  }

  const occasions = [
    'Birthday',
    'Anniversary',
    'Congratulations',
    'Motivation',
    'Get Well Soon',
    'Thank You',
    'Just Because',
    'Other'
  ]

  const handleBookNow = () => {
    router.push(`/checkout?talent=${talent.id}&occasion=${selectedOccasion}&currency=${currency}`)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-800 rounded-lg transition">
              <Share2 className="w-5 h-5" />
            </button>
            <div className="flex gap-2 bg-neutral-900 rounded-lg p-1">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded ${currency === 'USD' ? 'bg-purple-600 text-white' : 'text-neutral-400'}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('ZIG')}
                className={`px-3 py-1 rounded ${currency === 'ZIG' ? 'bg-purple-600 text-white' : 'text-neutral-400'}`}
              >
                ZIG
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-64 md:h-48 rounded-xl overflow-hidden">
                <Image
                  src={talent.thumbnailUrl}
                  alt={talent.displayName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{talent.displayName}</h1>
                    <p className="text-purple-400 text-lg capitalize">{talent.category}</p>
                  </div>
                  {talent.adminVerified && (
                    <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{talent.averageRating}</span>
                    <span className="text-neutral-400">({talent.totalBookings} bookings)</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Clock className="w-5 h-5" />
                    <span>Responds in {formatResponseTime(talent.responseTimeHours)}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-neutral-300 mt-4 leading-relaxed">{talent.bio}</p>
              </div>
            </div>

            {/* What You'll Get Section */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-400" />
                What You'll Get
              </h2>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Personalized video message recorded by {talent.displayName}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Delivered within {formatResponseTime(talent.responseTimeHours)}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>HD quality video you can download and share</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>100% money-back guarantee if request isn't fulfilled</span>
                </li>
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                <div className="border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-400">2 days ago</span>
                  </div>
                  <p className="text-neutral-300">
                    Amazing! {talent.displayName} made my brother's birthday so special. The message was heartfelt and funny!
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">- Tanaka M.</p>
                </div>

                <div className="border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-400">1 week ago</span>
                  </div>
                  <p className="text-neutral-300">
                    Quick response and exactly what I asked for. Highly recommend!
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">- Rumbi K.</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      <Star className="w-4 h-4 text-neutral-600" />
                    </div>
                    <span className="text-sm text-neutral-400">2 weeks ago</span>
                  </div>
                  <p className="text-neutral-300">
                    Great video, my wife loved it. Would have been perfect if it was a bit longer.
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">- Simba T.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-xl p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(currency === 'USD' ? talent.priceUSD : talent.priceZIG, currency)}
                </div>
                <p className="text-neutral-400">Per personalized video</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Occasion</label>
                  <select
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Choose an occasion...</option>
                    {occasions.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                disabled={!selectedOccasion}
                className="w-full mb-4"
                size="lg"
              >
                Book Now
              </Button>

              <div className="text-center text-sm text-neutral-400">
                <p>Secure payment • Money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
