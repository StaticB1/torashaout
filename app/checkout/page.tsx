'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle } from 'lucide-react'
import { mockTalentProfiles } from '@/lib/mock-data'
import { Currency, PaymentGateway } from '@/types'
import { formatCurrency } from '@/lib/utils'
import BookingForm, { BookingFormData } from '@/components/BookingForm'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const talentId = searchParams.get('talent')
  const occasion = searchParams.get('occasion') || ''
  const currencyParam = searchParams.get('currency') as Currency || 'USD'

  const [currency, setCurrency] = useState<Currency>(currencyParam)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentGateway>('paynow')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const talent = mockTalentProfiles.find(t => t.id === talentId)

  useEffect(() => {
    if (!talent) {
      router.push('/browse')
    }
  }, [talent, router])

  if (!talent) {
    return null
  }

  const paymentMethods = [
    {
      id: 'paynow' as PaymentGateway,
      name: 'Paynow',
      description: 'Ecocash, OneMoney, Visa',
      icon: '💳',
      available: true,
    },
    {
      id: 'innbucks' as PaymentGateway,
      name: 'Innbucks',
      description: 'Digital wallet',
      icon: '💰',
      available: currency === 'USD',
    },
    {
      id: 'stripe' as PaymentGateway,
      name: 'Credit Card',
      description: 'Visa, Mastercard',
      icon: '🌍',
      available: currency === 'USD',
    },
  ]

  const handleBookingSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create booking object
    const bookingId = `BK${Date.now()}`

    // In a real app, this would send data to your backend
    console.log('Booking data:', {
      bookingId,
      talentId: talent.id,
      currency,
      amount: currency === 'USD' ? talent.priceUSD : talent.priceZIG,
      paymentGateway: selectedPaymentMethod,
      ...formData,
    })

    setIsSubmitting(false)
    setShowSuccess(true)

    // Redirect to confirmation page
    setTimeout(() => {
      router.push(`/booking/${bookingId}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Details */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Booking Details</h2>
                <BookingForm
                  initialOccasion={occasion}
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                      disabled={!method.available}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                        selectedPaymentMethod === method.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : method.available
                          ? 'border-neutral-700 hover:border-neutral-600'
                          : 'border-neutral-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-3xl">{method.icon}</div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-neutral-400">{method.description}</div>
                        {!method.available && (
                          <div className="text-xs text-yellow-500 mt-1">
                            Not available for {currency}
                          </div>
                        )}
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="w-6 h-6 text-purple-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-900 rounded-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Talent Info */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-neutral-800">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={talent.thumbnailUrl}
                      alt={talent.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{talent.displayName}</h3>
                    <p className="text-sm text-neutral-400 capitalize">{talent.category}</p>
                  </div>
                </div>

                {/* Currency Toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <div className="flex gap-2 bg-black rounded-lg p-1">
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`flex-1 px-3 py-2 rounded ${
                        currency === 'USD' ? 'bg-purple-600 text-white' : 'text-neutral-400'
                      }`}
                    >
                      USD
                    </button>
                    <button
                      onClick={() => setCurrency('ZIG')}
                      className={`flex-1 px-3 py-2 rounded ${
                        currency === 'ZIG' ? 'bg-purple-600 text-white' : 'text-neutral-400'
                      }`}
                    >
                      ZIG
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neutral-300">
                    <span>Video message</span>
                    <span>{formatCurrency(currency === 'USD' ? talent.priceUSD : talent.priceZIG, currency)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Service fee</span>
                    <span>{formatCurrency(0, currency)}</span>
                  </div>
                  <div className="border-t border-neutral-800 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(currency === 'USD' ? talent.priceUSD : talent.priceZIG, currency)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Delivered within {talent.responseTimeHours}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-neutral-400 mb-4">
              Your request has been sent to {talent.displayName}. You'll receive an email once they start working on your video.
            </p>
            <p className="text-sm text-neutral-500">Redirecting to booking details...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
