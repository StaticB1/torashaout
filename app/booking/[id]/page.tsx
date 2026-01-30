'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Download, Share2, Clock, CheckCircle, Video, AlertCircle, Mail } from 'lucide-react'
import { BookingStatus, Currency } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface BookingData {
  id: string
  booking_code: string
  customer_id: string
  talent_id: string
  recipient_name: string
  occasion: string
  instructions: string
  currency: Currency
  amount_paid: number
  platform_fee: number
  talent_earnings: number
  status: BookingStatus
  video_url: string | null
  due_date: string
  completed_at: string | null
  customer_rating: number | null
  customer_review: string | null
  created_at: string
  updated_at: string
  talent: {
    id: string
    display_name: string
    thumbnail_url: string | null
    category: string
    response_time_hours: number
  }
}

const statusConfig = {
  pending_payment: {
    label: 'Pending Payment',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    icon: AlertCircle,
    description: 'Waiting for payment confirmation',
  },
  payment_confirmed: {
    label: 'Payment Confirmed',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    icon: CheckCircle,
    description: 'Payment received, talent has been notified',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    icon: Video,
    description: 'Your talent is creating your video',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    icon: CheckCircle,
    description: 'Video delivered',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    icon: AlertCircle,
    description: 'Booking cancelled',
  },
  refunded: {
    label: 'Refunded',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    icon: AlertCircle,
    description: 'Payment refunded',
  },
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load booking')
        }

        setBooking(data.data)
      } catch (err: any) {
        console.error('Error fetching booking:', err)
        setError(err.message || 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
          <p className="text-neutral-400 mb-6">{error || 'The booking you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/browse')} variant="primary">
            Browse Talent
          </Button>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[booking.status].icon
  const timeRemaining = new Date(booking.due_date).getTime() - Date.now()
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))

  const handleDownload = () => {
    if (booking.video_url) {
      window.open(booking.video_url, '_blank')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my video from ' + booking.talent.display_name,
        text: 'I got a personalized video message!',
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/browse')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>
          <div className="text-sm text-neutral-400">
            Booking #{booking.booking_code}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Status Header */}
          <div className={`${statusConfig[booking.status].bgColor} rounded-xl p-6 mb-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${statusConfig[booking.status].bgColor} flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${statusConfig[booking.status].color}`} />
              </div>
              <div className="flex-1">
                <h1 className={`text-2xl font-bold ${statusConfig[booking.status].color} mb-1`}>
                  {statusConfig[booking.status].label}
                </h1>
                <p className="text-neutral-300">{statusConfig[booking.status].description}</p>
              </div>
              {(booking.status === 'in_progress' || booking.status === 'payment_confirmed') && hoursRemaining > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold">{hoursRemaining}h</div>
                  <div className="text-sm text-neutral-400">estimated</div>
                </div>
              )}
            </div>
          </div>

          {/* Video Player (if completed) */}
          {booking.status === 'completed' && (
            <div className="bg-neutral-900 rounded-xl overflow-hidden mb-6">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {booking.video_url ? (
                  <video
                    src={booking.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <Video className="w-16 h-16 text-neutral-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition">
                        <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 flex gap-3">
                <Button onClick={handleDownload} variant="primary" className="flex-1" disabled={!booking.video_url}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Booking Details */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-neutral-400 mb-1">For</div>
                  <div className="font-medium">{booking.recipient_name}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400 mb-1">Occasion</div>
                  <div className="font-medium">{booking.occasion}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400 mb-1">Instructions</div>
                  <div className="text-neutral-300 text-sm leading-relaxed">
                    {booking.instructions}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-400 mb-1">Booked</div>
                  <div className="font-medium">
                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Talent & Payment Info */}
            <div className="space-y-6">
              {/* Talent Card */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Talent</h2>
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600">
                    {booking.talent.thumbnail_url ? (
                      <Image
                        src={booking.talent.thumbnail_url}
                        alt={booking.talent.display_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                        {booking.talent.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{booking.talent.display_name}</h3>
                    <p className="text-neutral-400 capitalize text-sm mb-2">{booking.talent.category}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-400">
                        Responds in {booking.talent.response_time_hours}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Payment</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Amount</span>
                    <span className="font-semibold">
                      {formatCurrency(booking.amount_paid, booking.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Currency</span>
                    <span className="font-medium">{booking.currency}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payment confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-neutral-900 rounded-xl p-6 mt-6">
            <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 pb-6 border-l-2 border-neutral-800 -ml-4 pl-8">
                  <div className="font-semibold mb-1">Booking Created</div>
                  <div className="text-sm text-neutral-400">
                    {new Date(booking.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1 pb-6 border-l-2 border-neutral-800 -ml-4 pl-8">
                  <div className="font-semibold mb-1">Payment Confirmed</div>
                  <div className="text-sm text-neutral-400">
                    Payment processed successfully
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full ${booking.status === 'in_progress' || booking.status === 'completed' ? 'bg-purple-500/20' : 'bg-neutral-800'} flex items-center justify-center flex-shrink-0 ${booking.status === 'in_progress' ? 'animate-pulse' : ''}`}>
                  <Video className={`w-5 h-5 ${booking.status === 'in_progress' || booking.status === 'completed' ? 'text-purple-400' : 'text-neutral-600'}`} />
                </div>
                <div className="flex-1 pb-6 -ml-4 pl-8">
                  <div className={`font-semibold mb-1 ${booking.status === 'payment_confirmed' ? 'text-neutral-500' : ''}`}>
                    {booking.status === 'in_progress' ? 'In Progress' : booking.status === 'completed' ? 'Video Created' : 'Awaiting Video'}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {booking.status === 'in_progress' || booking.status === 'completed'
                      ? `${booking.talent.display_name} is creating your video`
                      : 'Talent will start soon'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full ${booking.status === 'completed' ? 'bg-green-500/20' : 'bg-neutral-800'} flex items-center justify-center flex-shrink-0`}>
                  <Mail className={`w-5 h-5 ${booking.status === 'completed' ? 'text-green-400' : 'text-neutral-600'}`} />
                </div>
                <div className="flex-1 -ml-4 pl-8">
                  <div className={`font-semibold mb-1 ${booking.status !== 'completed' ? 'text-neutral-500' : ''}`}>
                    {booking.status === 'completed' ? 'Delivered' : 'Delivery'}
                  </div>
                  <div className={`text-sm ${booking.status === 'completed' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {booking.status === 'completed'
                      ? `Delivered on ${new Date(booking.completed_at || '').toLocaleString()}`
                      : `Estimated delivery within ${hoursRemaining}h`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-neutral-900 rounded-xl p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            <p className="text-neutral-400 mb-4">
              If you have any questions about your booking, our support team is here to help.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/support')}>
                Contact Support
              </Button>
              <Button variant="ghost" onClick={() => router.push('/faq')}>
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
