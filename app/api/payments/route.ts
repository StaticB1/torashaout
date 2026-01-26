import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      bookingId,
      method,
      amount,
      currency,
      reference,
      status,
      ...additionalData
    } = body;

    // Validate required fields
    if (!bookingId || !method || !amount || !currency || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, customer_id, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.customer_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to pay for this booking' },
        { status: 403 }
      );
    }

    // Check if payment already exists for this booking
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('booking_id', bookingId)
      .eq('status', 'completed')
      .single();

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Booking already paid' },
        { status: 400 }
      );
    }

    // Insert payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        gateway: method,
        reference,
        amount,
        currency,
        status: status || 'completed', // Default to completed for simulation
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment insert error:', paymentError);
      return NextResponse.json(
        { error: 'Failed to save payment', details: paymentError.message },
        { status: 500 }
      );
    }

    // The trigger will automatically update booking status
    // But we can also do it explicitly here for certainty
    const { error: bookingUpdateError } = await supabase
      .from('bookings')
      .update({
        status: 'payment_confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (bookingUpdateError) {
      console.error('Booking update error:', bookingUpdateError);
      // Payment is saved, so we don't fail the request
      // Just log the error
    }

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment processed successfully',
    });
  } catch (error: any) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('bookingId');
    const reference = searchParams.get('reference');

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let query = supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id);

    if (bookingId) {
      query = query.eq('booking_id', bookingId);
    }

    if (reference) {
      query = query.eq('reference', reference);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('Payment fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments', details: error.message },
        { status: 500 }
      );
    }

    // If single result requested, return single payment
    if (bookingId && payments && payments.length > 0) {
      return NextResponse.json({
        success: true,
        payment: payments[0],
      });
    }

    return NextResponse.json({
      success: true,
      payments: payments || [],
    });
  } catch (error: any) {
    console.error('Payment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment', details: error.message },
      { status: 500 }
    );
  }
}
