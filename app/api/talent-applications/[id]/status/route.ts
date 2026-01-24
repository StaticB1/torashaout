import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (
      !status ||
      !['pending', 'under_review', 'approved', 'rejected', 'onboarding'].includes(status)
    ) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if user is authenticated and is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // First, get the application data
    const { data: application, error: fetchError } = await supabase
      .from('talent_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found.' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    // Add review metadata if status is being changed from pending
    if (status !== 'pending') {
      updateData.reviewed_by = user.id;
      updateData.reviewed_at = new Date().toISOString();
    }

    const { error } = await supabase.from('talent_applications').update(updateData).eq('id', id);

    if (error) {
      console.error('Error updating talent application:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update application.' },
        { status: 500 }
      );
    }

    // If status is 'approved', create talent profile and update user role
    if (status === 'approved' && application.user_id) {
      // Use admin client to bypass RLS for talent profile creation
      const adminClient = createAdminClient();

      // 1. Update user role to 'talent'
      const { error: roleError } = await adminClient
        .from('users')
        .update({ role: 'talent' })
        .eq('id', application.user_id);

      if (roleError) {
        console.error('Error updating user role:', roleError);
        return NextResponse.json(
          { success: false, error: 'Failed to update user role.' },
          { status: 500 }
        );
      }

      // 2. Check if talent profile already exists
      const { data: existingProfile } = await adminClient
        .from('talent_profiles')
        .select('id')
        .eq('user_id', application.user_id)
        .single();

      // 3. Create talent profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await adminClient.from('talent_profiles').insert({
          user_id: application.user_id,
          display_name: application.stage_name,
          bio: application.bio,
          category: application.category,
          price_usd: application.proposed_price_usd,
          response_time_hours: application.response_time_hours,
          admin_verified: true,
          is_accepting_bookings: true,
        });

        if (profileError) {
          console.error('Error creating talent profile:', profileError);
          return NextResponse.json(
            { success: false, error: 'Failed to create talent profile.' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in talent application status API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Check if user is authenticated and is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('talent_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching talent application:', error);
      return NextResponse.json(
        { success: false, error: 'Application not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in talent application GET API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
