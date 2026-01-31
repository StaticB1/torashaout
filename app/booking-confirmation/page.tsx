'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Share2, ArrowRight, Clock, Mail, AlertCircle } from 'lucide-react';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentRef = searchParams.get('ref');
  const bookingId = searchParams.get('booking');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch real booking data from API
        const response = await fetch(`/api/bookings/${bookingId}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch booking details');
        }

        const booking = data.data;
        const talent = booking.talent;

        // Calculate expected delivery based on talent's response time
        const responseTimeHours = talent?.response_time_hours || 48;
        const expectedDeliveryDate = new Date(Date.now() + responseTimeHours * 60 * 60 * 1000);

        setBookingDetails({
          id: booking.id,
          bookingCode: booking.booking_code,
          paymentReference: paymentRef || booking.booking_code,
          talentName: talent?.display_name || 'Talent',
          talentImage: talent?.thumbnail_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
          amount: booking.amount_paid,
          currency: booking.currency,
          occasion: booking.occasion,
          recipientName: booking.recipient_name,
          instructions: booking.instructions,
          expectedDelivery: expectedDeliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          status: booking.status,
        });
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, paymentRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/30 border-2 border-red-500 mb-4">
              <AlertCircle size={48} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Unable to Load Booking</h1>
            <p className="text-gray-400 mb-6">{error || 'Booking details not found'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg">
                  Browse Talents
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-500 mb-4 animate-scale-in">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-xl text-gray-400">Your booking has been confirmed</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-gray-900/50 border border-purple-700/30 rounded-2xl p-6 sm:p-8 mb-6">
            {/* Payment Reference */}
            <div className="mb-6 pb-6 border-b border-gray-800">
              <div className="text-sm text-gray-400 mb-1">Payment Reference</div>
              <div className="font-mono text-lg text-white">{bookingDetails.paymentReference}</div>
            </div>

            {/* Talent Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
              <img
                src={bookingDetails.talentImage}
                alt={bookingDetails.talentName}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
              />
              <div>
                <div className="text-sm text-gray-400">Video from</div>
                <div className="text-xl font-bold text-white">{bookingDetails.talentName}</div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Occasion</span>
                <span className="text-white font-semibold">{bookingDetails.occasion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient</span>
                <span className="text-white font-semibold">{bookingDetails.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-semibold text-xl">
                  {bookingDetails.currency === 'USD'
                    ? `$${bookingDetails.amount.toFixed(2)}`
                    : `ZIG ${bookingDetails.amount.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Expected Delivery */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-purple-400 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Expected Delivery</div>
                  <div className="text-lg font-semibold text-white">
                    {bookingDetails.expectedDelivery}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    You'll receive an email when your video is ready
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-gray-900/50 border border-purple-700/30 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-gray-400">
                    Check your inbox for booking confirmation and receipt
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{bookingDetails.talentName} Creates Your Video</h3>
                  <p className="text-sm text-gray-400">
                    The talent will record your personalized video message
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Video Delivered</h3>
                  <p className="text-sm text-gray-400">
                    You'll receive your video via email and can download it anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link href="/dashboard" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                <Mail size={18} className="mr-2" />
                View in Dashboard
              </Button>
            </Link>
            <Link href="/browse" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                <ArrowRight size={18} className="mr-2" />
                Book Another Video
              </Button>
            </Link>
          </div>

          {/* Share Section */}
          <div className="text-center">
            <p className="text-gray-400 mb-3">Love ToraShaout? Share with friends!</p>
            <div className="flex justify-center gap-3">
              <button className="p-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-purple-500 transition">
                <Share2 size={20} />
              </button>
              <button className="p-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-purple-500 transition">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
