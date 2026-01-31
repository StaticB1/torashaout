import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UserData {
  role: string;
}

interface BookingData {
  id: string;
  status: string;
  customer_id: string;
  talent_id: string;
  amount_paid: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: UserData | null; error: any };

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch the booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single() as { data: BookingData | null; error: any };

    if (fetchError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Use any cast to bypass incomplete Supabase types
    const db = supabase as any;

    // Handle different actions
    switch (action) {
      case 'cancel': {
        if (booking.status === 'cancelled' || booking.status === 'refunded') {
          return NextResponse.json(
            { success: false, error: 'Booking is already cancelled or refunded' },
            { status: 400 }
          );
        }

        const { error: updateError } = await db
          .from('bookings')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        return NextResponse.json({
          success: true,
          message: 'Booking cancelled successfully',
        });
      }

      case 'refund': {
        if (booking.status === 'refunded') {
          return NextResponse.json(
            { success: false, error: 'Booking is already refunded' },
            { status: 400 }
          );
        }

        if (booking.status === 'pending_payment') {
          return NextResponse.json(
            { success: false, error: 'Cannot refund a booking that has not been paid' },
            { status: 400 }
          );
        }

        // Update booking status to refunded
        const { error: updateError } = await db
          .from('bookings')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        // Update payment status if exists
        await db
          .from('payments')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('booking_id', id);

        return NextResponse.json({
          success: true,
          message: 'Booking refunded successfully',
        });
      }

      case 'complete': {
        if (booking.status === 'completed') {
          return NextResponse.json(
            { success: false, error: 'Booking is already completed' },
            { status: 400 }
          );
        }

        if (booking.status === 'cancelled' || booking.status === 'refunded') {
          return NextResponse.json(
            { success: false, error: 'Cannot complete a cancelled or refunded booking' },
            { status: 400 }
          );
        }

        const { error: updateError } = await db
          .from('bookings')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        return NextResponse.json({
          success: true,
          message: 'Booking marked as completed',
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Admin booking action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
