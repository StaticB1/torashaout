'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface TalentProfileData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  category: string;
  thumbnail_url: string | null;
  profile_video_url: string | null;
  price_usd: number;
  price_zig: number;
  is_accepting_bookings: boolean;
  response_time_hours: number;
  admin_verified: boolean;
  total_bookings: number;
  average_rating: number;
  created_at: string;
}

export interface TalentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  completedThisMonth: number;
  pendingRequests: number;
  profileViews: number;
  conversionRate: number;
}

export interface BookingRequest {
  id: string;
  booking_code: string;
  customer: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  recipient_name: string;
  occasion: string | null;
  instructions: string | null;
  amount_paid: number;
  talent_earnings: number;
  currency: string;
  status: string;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  video_url: string | null;
  customer_rating: number | null;
  customer_review: string | null;
}

export function useTalentProfile() {
  const { user } = useAuth();
  const [talentProfile, setTalentProfile] = useState<TalentProfileData | null>(null);
  const [stats, setStats] = useState<TalentStats | null>(null);
  const [pendingBookings, setPendingBookings] = useState<BookingRequest[]>([]);
  const [completedBookings, setCompletedBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadTalentProfile = useCallback(async () => {
    if (!user) return;

    try {
      // Get talent profile
      const { data: profile, error: profileError } = await supabase
        .from('talent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setError('No talent profile found. Please complete your profile setup.');
        } else {
          throw profileError;
        }
        return;
      }

      setTalentProfile(profile);

      // Get bookings for this talent
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('talent_id', profile.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Separate pending and completed bookings
      const pending = bookings?.filter(b =>
        b.status === 'payment_confirmed' || b.status === 'in_progress'
      ) || [];
      const completed = bookings?.filter(b => b.status === 'completed') || [];

      setPendingBookings(pending);
      setCompletedBookings(completed);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const completedThisMonth = completed.filter(b =>
        new Date(b.completed_at) >= startOfMonth
      );

      const totalEarnings = completed.reduce((sum, b) => sum + (b.talent_earnings || 0), 0);
      const monthlyEarnings = completedThisMonth.reduce((sum, b) => sum + (b.talent_earnings || 0), 0);

      // Profile views and conversion rate would typically come from analytics
      // For now, we'll estimate based on bookings
      const estimatedViews = profile.total_bookings * 10;
      const conversionRate = estimatedViews > 0
        ? (profile.total_bookings / estimatedViews) * 100
        : 0;

      setStats({
        totalEarnings,
        monthlyEarnings,
        completedThisMonth: completedThisMonth.length,
        pendingRequests: pending.length,
        profileViews: estimatedViews,
        conversionRate: Math.round(conversionRate * 10) / 10,
      });

    } catch (err: any) {
      console.error('Error loading talent profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const updateProfile = useCallback(async (updates: Partial<TalentProfileData>) => {
    if (!talentProfile) return;

    try {
      const { data, error } = await supabase
        .from('talent_profiles')
        .update(updates)
        .eq('id', talentProfile.id)
        .select()
        .single();

      if (error) throw error;
      setTalentProfile(data);
      return data;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw err;
    }
  }, [talentProfile, supabase]);

  const toggleAcceptingBookings = useCallback(async () => {
    if (!talentProfile) return;
    return updateProfile({
      is_accepting_bookings: !talentProfile.is_accepting_bookings
    });
  }, [talentProfile, updateProfile]);

  useEffect(() => {
    if (user) {
      loadTalentProfile();
    }
  }, [user, loadTalentProfile]);

  return {
    talentProfile,
    stats,
    pendingBookings,
    completedBookings,
    loading,
    error,
    refresh: loadTalentProfile,
    updateProfile,
    toggleAcceptingBookings,
  };
}
