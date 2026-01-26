'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AuthNavbar } from '@/components/AuthNavbar';
import { Footer } from '@/components/Footer';
import { PaymentContainer } from '@/components/payment/PaymentContainer';
import { Currency } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabase = createClient();

        // Fetch booking directly from database by ID
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_code,
            recipient_name,
            occasion,
            instructions,
            currency,
            amount_paid,
            status,
            talent_profiles (
              display_name,
              thumbnail_url
            )
          `)
          .eq('id', params.bookingId)
          .single();

        if (error || !data) {
          console.error('Booking fetch error:', error);
          // Fallback to simulated data for testing
          setBooking({
            id: params.bookingId,
            talentName: 'Winky D',
            talentImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
            occasion: 'Birthday',
            recipientName: 'John Doe',
            amount: 50,
            currency: 'USD',
          });
          setLoading(false);
          return;
        }

        const talentData = data.talent_profiles as any;

        setBooking({
          id: data.id,
          talentName: talentData?.display_name || 'Talent',
          talentImage: talentData?.thumbnail_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
          occasion: data.occasion,
          recipientName: data.recipient_name,
          amount: data.amount_paid,
          currency: data.currency as Currency,
        });
        setCurrency(data.currency as Currency);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking:', error);
        // Fallback to simulated data for testing
        setBooking({
          id: params.bookingId,
          talentName: 'Winky D',
          talentImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
          occasion: 'Birthday',
          recipientName: 'John Doe',
          amount: 50,
          currency: 'USD',
        });
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    router.push('/browse');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
          >
            <ArrowLeft size={20} />
            Back to Booking
          </button>

          {/* Booking Summary */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Complete Your Payment</h1>
            <div className="flex items-center gap-4 bg-gray-900/50 border border-purple-700/30 rounded-lg p-4">
              <img
                src={booking.talentImage}
                alt={booking.talentName}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Video from</p>
                <p className="text-xl font-bold">{booking.talentName}</p>
                <p className="text-sm text-gray-400">
                  for {booking.recipientName} • {booking.occasion}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Container */}
          <PaymentContainer
            bookingId={booking.id}
            amount={booking.amount}
            currency={currency}
            talentName={booking.talentName}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
