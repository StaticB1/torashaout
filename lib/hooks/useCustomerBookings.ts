'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface CustomerBooking {
  id: string;
  booking_code: string;
  talent_id: string;
  recipient_name: string;
  occasion: string;
  instructions: string;
  currency: string;
  amount_paid: number;
  platform_fee: number;
  talent_earnings: number;
  status: string;
  video_url: string | null;
  due_date: string | null;
  completed_at: string | null;
  customer_rating: number | null;
  customer_review: string | null;
  created_at: string;
  updated_at: string;
  talent: {
    id: string;
    display_name: string;
    thumbnail_url: string | null;
    category: string;
    response_time_hours: number;
  } | null;
}

interface UseCustomerBookingsReturn {
  bookings: CustomerBooking[];
  pendingBookings: CustomerBooking[];
  completedBookings: CustomerBooking[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: number;
  };
}

export function useCustomerBookings(): UseCustomerBookingsReturn {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[useCustomerBookings] Fetching bookings for user:', user?.id);
      const response = await fetch('/api/bookings', {
        credentials: 'include',
      });
      const data = await response.json();
      console.log('[useCustomerBookings] API response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data.data || []);
      console.log('[useCustomerBookings] Bookings loaded:', data.data?.length || 0);
    } catch (err: any) {
      console.error('[useCustomerBookings] Error fetching customer bookings:', err);
      setError(err.message || 'Failed to load your orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Separate pending and completed bookings
  const pendingBookings = bookings.filter(
    (b) => ['pending_payment', 'payment_confirmed', 'in_progress'].includes(b.status)
  );

  const completedBookings = bookings.filter(
    (b) => ['completed', 'delivered'].includes(b.status)
  );

  // Calculate stats
  const stats = {
    totalOrders: bookings.length,
    pendingOrders: pendingBookings.length,
    completedOrders: completedBookings.length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0),
  };

  return {
    bookings,
    pendingBookings,
    completedBookings,
    loading,
    error,
    refresh: fetchBookings,
    stats,
  };
}
