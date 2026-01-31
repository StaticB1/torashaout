'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Download, Share2, Clock, CheckCircle, Video, AlertCircle, Mail, Shield, User, DollarSign, Copy, RefreshCw, XCircle } from 'lucide-react'
import { BookingStatus, Currency } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'

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
  customer?: {
    id: string
    full_name: string | null
    email: string
    phone: string | null
  }
  payment?: {
    id: string
    gateway: string
    reference: string | null
    status: string
    created_at: string
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
  const { profile } = useAuth()
  const { success, error: showError } = useToast()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`, {
          credentials: 'include',
        })
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    success(`${label} copied to clipboard`)
  }

  const handleAdminAction = async (action: 'cancel' | 'refund' | 'complete') => {
    if (!booking) return

    const confirmMessage = {
      cancel: 'Are you sure you want to cancel this booking?',
      refund: 'Are you sure you want to refund this booking?',
      complete: 'Are you sure you want to mark this booking as complete?',
    }

    if (!confirm(confirmMessage[action])) return

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/${action}`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} booking`)
      }

      success(`Booking ${action}ed successfully`)
      // Refresh the booking data
      window.location.reload()
    } catch (err: any) {
      showError(err.message || `Failed to ${action} booking`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
            <p className="text-neutral-400 mb-6">{error || 'The booking you are looking for does not exist.'}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/dashboard')} variant="primary">
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push('/browse')} variant="outline">
                Browse Talent
              </Button>
            </div>
          </div>
        </div>
        <Footer />
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
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />

      {/* Sub Header */}
      <div className="border-b border-neutral-800 mt-16">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="text-sm text-neutral-400">
            Booking #{booking.booking_code}
          </div>
        </div>
      </div>

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
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-neutral-800" />

              <div className="space-y-0">
                {/* Step 1: Booking Created - Always completed */}
                <div className="flex gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="font-semibold mb-1">Booking Created</div>
                    <div className="text-sm text-neutral-400">
                      {new Date(booking.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment */}
                <div className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    booking.status === 'pending_payment'
                      ? 'bg-yellow-500/20'
                      : 'bg-green-500/20'
                  }`}>
                    {booking.status === 'pending_payment' ? (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className={`font-semibold mb-1 ${booking.status === 'pending_payment' ? 'text-yellow-400' : ''}`}>
                      {booking.status === 'pending_payment' ? 'Awaiting Payment' : 'Payment Confirmed'}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {booking.status === 'pending_payment'
                        ? 'Complete payment to proceed'
                        : booking.payment?.created_at
                          ? new Date(booking.payment.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Payment processed successfully'
                      }
                    </div>
                  </div>
                </div>

                {/* Step 3: In Progress (only show if not cancelled/refunded) */}
                {booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                  <div className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      booking.status === 'in_progress'
                        ? 'bg-purple-500/20 animate-pulse'
                        : booking.status === 'completed'
                          ? 'bg-green-500/20'
                          : 'bg-neutral-800'
                    }`}>
                      <Video className={`w-5 h-5 ${
                        booking.status === 'in_progress'
                          ? 'text-purple-400'
                          : booking.status === 'completed'
                            ? 'text-green-400'
                            : 'text-neutral-600'
                      }`} />
                    </div>
                    <div className="flex-1 pb-8">
                      <div className={`font-semibold mb-1 ${
                        booking.status === 'pending_payment' || booking.status === 'payment_confirmed'
                          ? 'text-neutral-500'
                          : booking.status === 'in_progress'
                            ? 'text-purple-400'
                            : ''
                      }`}>
                        {booking.status === 'completed'
                          ? 'Video Created'
                          : booking.status === 'in_progress'
                            ? 'Creating Video...'
                            : 'Video Creation'}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {booking.status === 'in_progress'
                          ? `${booking.talent.display_name} is working on your video`
                          : booking.status === 'completed'
                            ? `Created by ${booking.talent.display_name}`
                            : 'Talent will start after payment'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Delivery (only show if not cancelled/refunded) */}
                {booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                  <div className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      booking.status === 'completed' ? 'bg-green-500/20' : 'bg-neutral-800'
                    }`}>
                      <Mail className={`w-5 h-5 ${booking.status === 'completed' ? 'text-green-400' : 'text-neutral-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold mb-1 ${booking.status !== 'completed' ? 'text-neutral-500' : 'text-green-400'}`}>
                        {booking.status === 'completed' ? 'Delivered!' : 'Delivery'}
                      </div>
                      <div className="text-sm text-neutral-400">
                        {booking.status === 'completed' && booking.completed_at
                          ? new Date(booking.completed_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : hoursRemaining > 0
                            ? `Estimated delivery within ${hoursRemaining}h`
                            : 'Pending delivery'
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Cancelled Status */}
                {booking.status === 'cancelled' && (
                  <div className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 z-10">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-red-400">Cancelled</div>
                      <div className="text-sm text-neutral-400">
                        This booking was cancelled
                      </div>
                    </div>
                  </div>
                )}

                {/* Refunded Status */}
                {booking.status === 'refunded' && (
                  <div className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 z-10">
                      <RefreshCw className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-orange-400">Refunded</div>
                      <div className="text-sm text-neutral-400">
                        Payment has been refunded
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-6 space-y-6">
              {/* Admin Header */}
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-purple-300">Admin View</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold">Customer Details</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Customer ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/50 px-2 py-1 rounded font-mono">
                          {booking.customer_id.slice(0, 8)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(booking.customer_id, 'Customer ID')}
                          className="text-neutral-500 hover:text-white transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {booking.customer && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Name</span>
                          <span className="font-medium">{booking.customer.full_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Email</span>
                          <a href={`mailto:${booking.customer.email}`} className="text-purple-400 hover:text-purple-300">
                            {booking.customer.email}
                          </a>
                        </div>
                        {booking.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Phone</span>
                            <span className="font-medium">{booking.customer.phone}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-bold">Financial Breakdown</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Amount</span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(booking.amount_paid, booking.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Platform Fee (10%)</span>
                      <span className="font-medium text-yellow-400">
                        {formatCurrency(booking.platform_fee, booking.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Talent Earnings</span>
                      <span className="font-medium text-green-400">
                        {formatCurrency(booking.talent_earnings, booking.currency)}
                      </span>
                    </div>
                    <div className="border-t border-neutral-800 pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Currency</span>
                        <span className="font-medium">{booking.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal IDs & Payment Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Internal IDs */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <h2 className="text-lg font-bold mb-4">Internal IDs</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Booking ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/50 px-2 py-1 rounded font-mono">
                          {booking.id.slice(0, 8)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(booking.id, 'Booking ID')}
                          className="text-neutral-500 hover:text-white transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Talent Profile ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/50 px-2 py-1 rounded font-mono">
                          {booking.talent_id.slice(0, 8)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(booking.talent_id, 'Talent ID')}
                          className="text-neutral-500 hover:text-white transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Booking Code</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-black/50 px-2 py-1 rounded font-mono">
                          {booking.booking_code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(booking.booking_code, 'Booking Code')}
                          className="text-neutral-500 hover:text-white transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
                  <h2 className="text-lg font-bold mb-4">Payment Details</h2>
                  {booking.payment ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Gateway</span>
                        <span className="font-medium capitalize">{booking.payment.gateway}</span>
                      </div>
                      {booking.payment.reference && (
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Reference</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-black/50 px-2 py-1 rounded font-mono">
                              {booking.payment.reference}
                            </code>
                            <button
                              onClick={() => copyToClipboard(booking.payment!.reference!, 'Payment Ref')}
                              className="text-neutral-500 hover:text-white transition"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Payment Status</span>
                        <span className={`font-medium ${
                          booking.payment.status === 'completed' ? 'text-green-400' :
                          booking.payment.status === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {booking.payment.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Payment Date</span>
                        <span className="font-medium">
                          {new Date(booking.payment.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-500 text-sm">No payment information available</p>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-neutral-900 rounded-xl p-6 border border-red-900/30">
                <h2 className="text-lg font-bold mb-4">Admin Actions</h2>
                <div className="flex flex-wrap gap-3">
                  {booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdminAction('complete')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdminAction('cancel')}
                      className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </Button>
                  )}
                  {booking.status !== 'refunded' && booking.status !== 'pending_payment' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdminAction('refund')}
                      className="border-red-700 text-red-400 hover:bg-red-900/20"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Issue Refund
                    </Button>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-4">
                  These actions cannot be undone. Please use with caution.
                </p>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-neutral-900 rounded-xl p-6 mt-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            <p className="text-neutral-400 mb-4">
              If you have any questions about your booking, our support team is here to help.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/contact')}>
                Contact Support
              </Button>
              <Button variant="ghost" onClick={() => router.push('/faq')}>
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
