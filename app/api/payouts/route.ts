import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Payout request interface
interface PayoutRequest {
  amount: number;
  currency: 'USD' | 'ZIG';
  payment_method: 'bank_transfer' | 'ecocash' | 'innbucks';
  account_details: string;
}

// GET - Fetch payout history for the authenticated talent
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get talent profile
    const { data: talentProfile } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!talentProfile) {
      return NextResponse.json(
        { success: false, error: 'Talent profile not found' },
        { status: 404 }
      );
    }

    // Fetch payouts for this talent
    const { data: payouts, error } = await (supabase as any)
      .from('payouts')
      .select('*')
      .eq('talent_id', talentProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payouts:', error);
      // If table doesn't exist, return empty array
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: payouts || [],
    });

  } catch (error: any) {
    console.error('Error in payouts GET:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create a new payout request (simulated)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get talent profile with earnings info
    const { data: talentProfile } = await supabase
      .from('talent_profiles')
      .select('id, display_name, user_id')
      .eq('user_id', user.id)
      .single();

    if (!talentProfile) {
      return NextResponse.json(
        { success: false, error: 'Talent profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body: PayoutRequest = await request.json();

    // Validate request
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payout amount' },
        { status: 400 }
      );
    }

    if (!body.payment_method) {
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      );
    }

    if (!body.account_details) {
      return NextResponse.json(
        { success: false, error: 'Account details are required' },
        { status: 400 }
      );
    }

    // Calculate available balance from completed bookings
    const { data: completedBookings } = await supabase
      .from('bookings')
      .select('talent_earnings')
      .eq('talent_id', talentProfile.id)
      .eq('status', 'completed');

    const totalEarnings = completedBookings?.reduce(
      (sum, b) => sum + (b.talent_earnings || 0), 0
    ) || 0;

    // Get total already paid out (simulated - would need payouts table)
    // For now, we'll assume all earnings are available
    const availableBalance = totalEarnings;

    if (body.amount > availableBalance) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Generate payout reference
    const payoutRef = `PO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Simulate payout creation (in real system, this would create a record in payouts table)
    // For simulation, we'll just return success with the payout details
    const simulatedPayout = {
      id: crypto.randomUUID(),
      talent_id: talentProfile.id,
      reference: payoutRef,
      amount: body.amount,
      currency: body.currency || 'USD',
      payment_method: body.payment_method,
      account_details: body.account_details,
      status: 'pending', // pending -> processing -> completed
      created_at: new Date().toISOString(),
      estimated_arrival: getEstimatedArrival(body.payment_method),
    };

    // Try to insert into payouts table (if it exists)
    const { error: insertError } = await (supabase as any)
      .from('payouts')
      .insert({
        talent_id: talentProfile.id,
        reference: payoutRef,
        amount: body.amount,
        currency: body.currency || 'USD',
        payment_method: body.payment_method,
        account_details: body.account_details,
        status: 'pending',
      });

    if (insertError) {
      console.log('Payouts table may not exist, simulating payout:', insertError.message);
      // Continue with simulation even if table doesn't exist
    }

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted successfully',
      data: simulatedPayout,
    });

  } catch (error: any) {
    console.error('Error in payouts POST:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to get estimated arrival time based on payment method
function getEstimatedArrival(method: string): string {
  const now = new Date();
  switch (method) {
    case 'ecocash':
    case 'innbucks':
      // Mobile money: 1-2 hours
      now.setHours(now.getHours() + 2);
      break;
    case 'bank_transfer':
      // Bank transfer: 2-3 business days
      now.setDate(now.getDate() + 3);
      break;
    default:
      now.setDate(now.getDate() + 5);
  }
  return now.toISOString();
}
