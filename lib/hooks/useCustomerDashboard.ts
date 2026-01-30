'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface CustomerBooking {
  id: string;
  booking_code: string;
  talent: {
    id: string;
    display_name: string;
    thumbnail_url: string | null;
    category: string;
    users: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  recipient_name: string;
  occasion: string | null;
  instructions: string | null;
  amount_paid: number;
  currency: string;
  status: string;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  video_url: string | null;
  customer_rating: number | null;
  customer_review: string | null;
}

export interface FavoriteTalent {
  created_at: string;
  talent: {
    id: string;
    display_name: string;
    bio: string | null;
    category: string;
    thumbnail_url: string | null;
    price_usd: number;
    price_zig: number;
    average_rating: number;
    total_bookings: number;
    is_accepting_bookings: boolean;
    response_time_hours: number;
    users: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export interface CustomerStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalSpent: number;
  favoriteCount: number;
}

export function useCustomerDashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTalent[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadCustomerData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get bookings for this customer
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          talent:talent_id (
            id,
            display_name,
            thumbnail_url,
            category,
            users:user_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Get favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          created_at,
          talent:talent_id (
            id,
            display_name,
            bio,
            category,
            thumbnail_url,
            price_usd,
            price_zig,
            average_rating,
            total_bookings,
            is_accepting_bookings,
            response_time_hours,
            users:user_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData || []);

      // Calculate stats
      const allBookings = bookingsData || [];
      const completed = allBookings.filter(b => b.status === 'completed');
      const pending = allBookings.filter(b =>
        b.status === 'pending_payment' ||
        b.status === 'payment_confirmed' ||
        b.status === 'in_progress'
      );

      setStats({
        totalBookings: allBookings.length,
        completedBookings: completed.length,
        pendingBookings: pending.length,
        totalSpent: allBookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0),
        favoriteCount: (favoritesData || []).length,
      });

    } catch (err: any) {
      console.error('Error loading customer data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const removeFavorite = useCallback(async (talentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('talent_id', talentId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => prev.filter(f => f.talent.id !== talentId));
      setStats(prev => prev ? { ...prev, favoriteCount: prev.favoriteCount - 1 } : null);
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      throw err;
    }
  }, [user, supabase]);

  const submitReview = useCallback(async (bookingId: string, rating: number, review?: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          customer_rating: rating,
          customer_review: review,
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, customer_rating: rating, customer_review: review || null } : b)
      );

      return data;
    } catch (err: any) {
      console.error('Error submitting review:', err);
      throw err;
    }
  }, [supabase]);

  useEffect(() => {
    if (user) {
      loadCustomerData();
    }
  }, [user, loadCustomerData]);

  return {
    bookings,
    favorites,
    stats,
    loading,
    error,
    refresh: loadCustomerData,
    removeFavorite,
    submitReview,
  };
}
