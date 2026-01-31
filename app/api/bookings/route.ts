import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Currency, PaymentGateway, BookingStatus } from '@/types';

// Database types
interface TalentProfileRow {
  id: string;
  user_id: string;
  display_name: string;
  price_usd: number | null;
  price_zig: number | null;
  response_time_hours: number;
  is_accepting_bookings: boolean;
  total_bookings: number;
}

interface BookingRow {
  id: string;
  booking_code: string;
}

// Platform fee percentage (25%)
const PLATFORM_FEE_PERCENT = 0.25;

// Generate a unique booking code
function generateBookingCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TS-${timestamp}-${random}`;
}

// Validate booking request
function validateBookingRequest(data: any): string[] {
  const errors: string[] = [];

  if (!data.talentId?.trim()) errors.push('Talent ID is required');
  if (!data.recipientName?.trim()) errors.push('Recipient name is required');
  if (!data.occasion?.trim()) errors.push('Occasion is required');
  if (!data.instructions?.trim()) errors.push('Instructions are required');
  if (!data.currency || !['USD', 'ZIG'].includes(data.currency)) {
    errors.push('Valid currency (USD or ZIG) is required');
  }
  if (!data.paymentGateway || !['paynow', 'stripe', 'innbucks'].includes(data.paymentGateway)) {
    errors.push('Valid payment gateway is required');
  }
  if (!data.fromName?.trim()) errors.push('Your name is required');
  if (!data.fromEmail?.trim()) errors.push('Email is required');

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    const validationErrors = validateBookingRequest(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is authenticated (optional - allow guest checkout)
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch talent profile to get pricing
    const { data: talent, error: talentError } = await supabase
      .from('talent_profiles')
      .select('id, user_id, display_name, price_usd, price_zig, response_time_hours, is_accepting_bookings, total_bookings')
      .eq('id', body.talentId)
      .eq('admin_verified', true)
      .single() as { data: TalentProfileRow | null; error: any };

    if (talentError || !talent) {
      return NextResponse.json(
        { success: false, error: 'Talent not found or not available' },
        { status: 404 }
      );
    }

    if (!talent.is_accepting_bookings) {
      return NextResponse.json(
        { success: false, error: 'This talent is not currently accepting bookings' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const currency: Currency = body.currency;
    const basePrice = currency === 'USD' ? (talent.price_usd || 0) : (talent.price_zig || 0);

    if (basePrice <= 0) {
      return NextResponse.json(
        { success: false, error: `This talent does not have pricing set for ${currency}` },
        { status: 400 }
      );
    }

    const platformFee = Math.round(basePrice * PLATFORM_FEE_PERCENT * 100) / 100;
    const talentEarnings = Math.round((basePrice - platformFee) * 100) / 100;

    // Generate booking code
    const bookingCode = generateBookingCode();

    // Calculate due date based on talent's response time
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + talent.response_time_hours);

    // For guest checkout, we need to handle the customer_id
    // If user is logged in, use their ID; otherwise, we'll need to create a guest record
    // For now, require authentication
    let customerId = user?.id;

    if (!customerId) {
      // For guest checkout, we could create a temporary user or use email
      // For simplicity, let's require login for now
      return NextResponse.json(
        { success: false, error: 'Please log in to complete your booking' },
        { status: 401 }
      );
    }

    // Create the booking with pending_payment status
    const bookingData = {
      booking_code: bookingCode,
      customer_id: customerId,
      talent_id: talent.id,
      recipient_name: body.recipientName.trim(),
      occasion: body.occasion.trim(),
      instructions: body.instructions.trim(),
      currency: currency,
      amount_paid: basePrice,
      platform_fee: platformFee,
      talent_earnings: talentEarnings,
      status: 'pending_payment' as BookingStatus, // Wait for payment
      due_date: null, // Will be set after payment
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData as any)
      .select('id, booking_code')
      .single() as { data: BookingRow | null; error: any };

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { success: false, error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      );
    }

    // Return booking details - frontend will redirect to payment page
    return NextResponse.json({
      success: true,
      requiresPayment: true, // Signal that payment is needed
      booking: {
        id: booking.id,
        bookingCode: booking.booking_code,
        talentName: talent.display_name,
        recipientName: body.recipientName,
        occasion: body.occasion,
        amount: basePrice,
        currency: currency,
        status: 'pending_payment',
        dueDate: dueDate.toISOString(),
        estimatedDelivery: `${talent.response_time_hours} hours`,
      },
      message: 'Booking confirmed! The talent will receive your request shortly.',
    });

  } catch (error: any) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Fetch user's bookings (as customer) - works for both fans AND talents ordering videos
    let query = supabase
      .from('bookings')
      .select(`
        *,
        talent:talent_profiles(id, display_name, thumbnail_url, category, response_time_hours)
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookings || [],
    });

  } catch (error: any) {
    console.error('Error in bookings GET API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
