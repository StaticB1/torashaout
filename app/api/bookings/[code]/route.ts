import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

// Helper function to enrich booking with payment info (for timeline)
async function enrichBookingWithPayment(supabase: SupabaseClient, booking: BookingWithTalent): Promise<BookingWithTalent> {
  // Fetch payment details for timeline
  const { data: paymentData } = await supabase
    .from('payments')
    .select('id, gateway, reference, status, created_at')
    .eq('booking_id', booking.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    ...booking,
    payment: paymentData ? {
      id: paymentData.id,
      gateway: paymentData.gateway,
      reference: paymentData.reference,
      status: paymentData.status,
      created_at: paymentData.created_at,
    } : undefined,
  };
}

// Helper function to enrich booking data with customer and payment info for admins
async function enrichBookingForAdmin(supabase: SupabaseClient, booking: BookingWithTalent): Promise<BookingWithTalent> {
  // Fetch customer details
  const { data: customerData } = await supabase
    .from('users')
    .select('id, full_name, email, phone')
    .eq('id', booking.customer_id)
    .single();

  // Fetch payment details
  const { data: paymentData } = await supabase
    .from('payments')
    .select('id, gateway, reference, status, created_at')
    .eq('booking_id', booking.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    ...booking,
    customer: customerData ? {
      id: customerData.id,
      full_name: customerData.full_name,
      email: customerData.email,
      phone: customerData.phone,
    } : undefined,
    payment: paymentData ? {
      id: paymentData.id,
      gateway: paymentData.gateway,
      reference: paymentData.reference,
      status: paymentData.status,
      created_at: paymentData.created_at,
    } : undefined,
  };
}

// Database types for bookings with relations
interface BookingWithTalent {
  id: string;
  booking_code: string;
  customer_id: string;
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
  due_date: string;
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
  };
  customer?: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  };
  payment?: {
    id: string;
    gateway: string;
    reference: string | null;
    status: string;
    created_at: string;
  };
}

interface TalentProfile {
  id: string;
}

interface UserData {
  role: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch booking with talent details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        talent:talent_profiles(
          id,
          display_name,
          thumbnail_url,
          category,
          response_time_hours
        )
      `)
      .eq('booking_code', code)
      .single() as { data: BookingWithTalent | null; error: any };

    if (error || !booking) {
      // Try fetching by ID as fallback
      const { data: bookingById, error: errorById } = await supabase
        .from('bookings')
        .select(`
          *,
          talent:talent_profiles(
            id,
            display_name,
            thumbnail_url,
            category,
            response_time_hours
          )
        `)
        .eq('id', code)
        .single() as { data: BookingWithTalent | null; error: any };

      if (errorById || !bookingById) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }

      // Verify user has access to this booking
      if (bookingById.customer_id !== user.id) {
        // Check if user is the talent
        const { data: talentProfile } = await supabase
          .from('talent_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single() as { data: TalentProfile | null; error: any };

        if (!talentProfile || talentProfile.id !== bookingById.talent_id) {
          // Check if user is admin
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single() as { data: UserData | null; error: any };

          if (!userData || userData.role !== 'admin') {
            return NextResponse.json(
              { success: false, error: 'Unauthorized to view this booking' },
              { status: 403 }
            );
          }

          // Fetch additional data for admin
          const enrichedBooking = await enrichBookingForAdmin(supabase, bookingById);
          return NextResponse.json({
            success: true,
            data: enrichedBooking,
          });
        }
      }

      // Enrich with payment data for timeline
      const enrichedBooking = await enrichBookingWithPayment(supabase, bookingById);
      return NextResponse.json({
        success: true,
        data: enrichedBooking,
      });
    }

    // Verify user has access to this booking
    if (booking.customer_id !== user.id) {
      // Check if user is the talent
      const { data: talentProfile } = await supabase
        .from('talent_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single() as { data: TalentProfile | null; error: any };

      if (!talentProfile || talentProfile.id !== booking.talent_id) {
        // Check if user is admin
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single() as { data: UserData | null; error: any };

        if (!userData || userData.role !== 'admin') {
          return NextResponse.json(
            { success: false, error: 'Unauthorized to view this booking' },
            { status: 403 }
          );
        }

        // Fetch additional data for admin
        const enrichedBooking = await enrichBookingForAdmin(supabase, booking);
        return NextResponse.json({
          success: true,
          data: enrichedBooking,
        });
      }
    }

    // Enrich with payment data for timeline
    const enrichedBooking = await enrichBookingWithPayment(supabase, booking);
    return NextResponse.json({
      success: true,
      data: enrichedBooking,
    });

  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
