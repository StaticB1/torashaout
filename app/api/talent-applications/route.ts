import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple validation without zod for now
function validateApplication(data: any) {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim()) errors.push('Last name is required');
  if (!data.stageName?.trim()) errors.push('Stage name is required');
  if (!data.email?.trim() || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push('Valid email address is required');
  }
  if (!data.phone?.trim()) errors.push('Phone number is required');
  if (!data.category?.trim()) errors.push('Category is required');
  if (!data.bio?.trim() || data.bio.length < 10) errors.push('Bio must be at least 10 characters');
  if (!data.yearsActive?.trim()) errors.push('Years active is required');
  if (!data.notableWork?.trim() || data.notableWork.length < 10)
    errors.push('Notable work must be at least 10 characters');
  if (!data.proposedPrice?.trim()) errors.push('Proposed price is required');
  if (!data.responseTime?.trim()) errors.push('Response time is required');
  if (data.agreeToTerms !== true) errors.push('You must agree to the terms');

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationErrors = validateApplication(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to submit an application.' },
        { status: 401 }
      );
    }

    // Check if user already has an application
    const { data: existingApplication } = await supabase
      .from('talent_applications')
      .select('id, status')
      .eq('user_id', user.id)
      .single();

    // Map category to proper type
    const categoryMap: Record<
      string,
      'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other'
    > = {
      Musician: 'musician',
      Comedian: 'comedian',
      'Gospel Artist': 'gospel',
      'Actor/Actress': 'other',
      'Sports Personality': 'sports',
      'Media Personality': 'other',
      Influencer: 'influencer',
      Other: 'other',
    };

    // Convert form data to database format
    const applicationData = {
      user_id: user.id, // Link application to user account
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      stage_name: body.stageName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      category: categoryMap[body.category] || 'other',
      bio: body.bio.trim(),
      years_active: parseInt(body.yearsActive),
      notable_work: body.notableWork.trim(),
      instagram_handle: body.instagramHandle?.trim() || null,
      instagram_followers: body.instagramFollowers ? parseInt(body.instagramFollowers) : null,
      facebook_page: body.facebookPage?.trim() || null,
      facebook_followers: body.facebookFollowers ? parseInt(body.facebookFollowers) : null,
      youtube_channel: body.youtubeChannel?.trim() || null,
      youtube_subscribers: body.youtubeSubscribers ? parseInt(body.youtubeSubscribers) : null,
      twitter_handle: body.twitterHandle?.trim() || null,
      tiktok_handle: body.tiktokHandle?.trim() || null,
      proposed_price_usd: parseFloat(body.proposedPrice),
      response_time_hours: parseInt(body.responseTime),
      hear_about_us: body.hearAboutUs || null,
      additional_info: body.additionalInfo?.trim() || null,
    };

    // Handle existing application (resubmission or blocking)
    if (existingApplication) {
      if (existingApplication.status === 'rejected') {
        // RESUBMISSION: Update existing application
        const updateData: any = {
          ...applicationData,
          status: 'pending',
          reviewed_by: null,
          reviewed_at: null,
          // Keep admin_notes for audit trail - user can see previous feedback
        };

        const { data: result, error } = await supabase
          .from('talent_applications')
          .update(updateData)
          .eq('id', existingApplication.id)
          .select('id')
          .single();

        if (error) {
          console.error('Error resubmitting talent application:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to resubmit application. Please try again.' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          applicationId: result.id,
          message:
            'Application resubmitted successfully! We will review it and get back to you within 5-7 business days.',
        });
      } else {
        // BLOCKED: Existing application in non-rejected status
        const statusMessages: Record<string, string> = {
          pending: 'Please wait for review.',
          under_review: 'Your application is currently under review.',
          approved: 'Your application has been approved!',
          onboarding: 'Your application is being processed.',
        };

        return NextResponse.json(
          {
            success: false,
            error: `You already have an application with status: ${existingApplication.status}. ${statusMessages[existingApplication.status] || 'Please wait for review.'}`,
          },
          { status: 400 }
        );
      }
    }

    // Insert the application (new submission)
    const { data: result, error } = await supabase
      .from('talent_applications')
      .insert(applicationData)
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting talent application:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: result.id,
      message:
        'Application submitted successfully! We will review it and get back to you within 5-7 business days.',
    });
  } catch (error: any) {
    console.error('Error in talent application API:', error);

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('talent_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    // Debug logging
    console.log('🔍 GET /api/talent-applications - Debug Info:');
    console.log('- User ID:', user.id);
    console.log('- User role:', userData?.role);
    console.log('- Status filter:', status);
    console.log('- Applications found:', data?.length || 0);
    console.log('- Error:', error);

    if (error) {
      console.error('Error fetching talent applications:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch applications.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error('Error in talent applications GET API:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
