import { createClient } from '@/lib/supabase/client';

export interface TalentApplicationFormData {
  firstName: string;
  lastName: string;
  stageName: string;
  email: string;
  phone: string;
  category: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other';
  bio: string;
  yearsActive: string;
  notableWork: string;
  instagramHandle?: string;
  instagramFollowers?: string;
  facebookPage?: string;
  facebookFollowers?: string;
  youtubeChannel?: string;
  youtubeSubscribers?: string;
  twitterHandle?: string;
  tiktokHandle?: string;
  proposedPrice: string;
  responseTime: string;
  hearAboutUs?: string;
  additionalInfo?: string;
  agreeToTerms: boolean;
}

export interface TalentApplication {
  id: string;
  first_name: string;
  last_name: string;
  stage_name: string;
  email: string;
  phone: string;
  category: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other';
  bio: string;
  years_active: number;
  notable_work: string;
  instagram_handle: string | null;
  instagram_followers: number | null;
  facebook_page: string | null;
  facebook_followers: number | null;
  youtube_channel: string | null;
  youtube_subscribers: number | null;
  twitter_handle: string | null;
  tiktok_handle: string | null;
  proposed_price_usd: number;
  response_time_hours: number;
  hear_about_us: string | null;
  additional_info: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'onboarding';
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Submit a new talent application
 */
export async function submitTalentApplication(
  data: TalentApplicationFormData
): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    const supabase = createClient();

    // Convert form data to database format
    const applicationData = {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      stage_name: data.stageName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      category: data.category,
      bio: data.bio.trim(),
      years_active: parseInt(data.yearsActive),
      notable_work: data.notableWork.trim(),
      instagram_handle: data.instagramHandle?.trim() || null,
      instagram_followers: data.instagramFollowers ? parseInt(data.instagramFollowers) : null,
      facebook_page: data.facebookPage?.trim() || null,
      facebook_followers: data.facebookFollowers ? parseInt(data.facebookFollowers) : null,
      youtube_channel: data.youtubeChannel?.trim() || null,
      youtube_subscribers: data.youtubeSubscribers ? parseInt(data.youtubeSubscribers) : null,
      twitter_handle: data.twitterHandle?.trim() || null,
      tiktok_handle: data.tiktokHandle?.trim() || null,
      proposed_price_usd: parseFloat(data.proposedPrice),
      response_time_hours: parseInt(data.responseTime),
      hear_about_us: data.hearAboutUs || null,
      additional_info: data.additionalInfo?.trim() || null,
    };

    const { data: result, error } = await supabase
      .from('talent_applications')
      .insert(applicationData)
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting talent application:', error);
      return {
        success: false,
        error:
          error.message ===
          'duplicate key value violates unique constraint "talent_applications_email_key"'
            ? 'An application with this email already exists.'
            : 'Failed to submit application. Please try again.',
      };
    }

    return { success: true, applicationId: result.id };
  } catch (error) {
    console.error('Unexpected error submitting talent application:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Get all talent applications (admin only)
 */
export async function getTalentApplications(
  status?: string
): Promise<{ success: boolean; data?: TalentApplication[]; error?: string }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('talent_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching talent applications:', error);
      return { success: false, error: 'Failed to fetch applications.' };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching talent applications:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Get a single talent application by ID (admin only)
 */
export async function getTalentApplication(
  id: string
): Promise<{ success: boolean; data?: TalentApplication; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('talent_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching talent application:', error);
      return { success: false, error: 'Application not found.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching talent application:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Update talent application status (admin only)
 */
export async function updateTalentApplicationStatus(
  id: string,
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'onboarding',
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const updateData: Partial<TalentApplication> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    // Add review metadata if status is being changed from pending
    if (status !== 'pending') {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        updateData.reviewed_by = user.id;
        updateData.reviewed_at = new Date().toISOString();
      }
    }

    const { error } = await supabase.from('talent_applications').update(updateData).eq('id', id);

    if (error) {
      console.error('Error updating talent application:', error);
      return { success: false, error: 'Failed to update application.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating talent application:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Check if an email already has an application
 */
export async function checkApplicationExists(
  email: string
): Promise<{ exists: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('talent_applications')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found"
      console.error('Error checking application exists:', error);
      return { exists: false, error: 'Failed to check application status.' };
    }

    return { exists: !!data };
  } catch (error) {
    console.error('Unexpected error checking application exists:', error);
    return { exists: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Get the authenticated user's own talent application
 */
export async function getMyTalentApplication(): Promise<{
  success: boolean;
  data?: TalentApplication;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('talent_applications')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // PGRST116 is "not found" - not an error, just no application yet
      if (error.code === 'PGRST116') {
        return { success: true, data: undefined };
      }
      console.error('Error fetching user application:', error);
      return { success: false, error: 'Failed to fetch application.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching user application:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Get application statistics (admin only)
 */
export async function getTalentApplicationStats(): Promise<{
  success: boolean;
  data?: {
    total: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    onboarding: number;
  };
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from('talent_applications').select('status');

    if (error) {
      console.error('Error fetching application stats:', error);
      return { success: false, error: 'Failed to fetch statistics.' };
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((app) => app.status === 'pending').length || 0,
      under_review: data?.filter((app) => app.status === 'under_review').length || 0,
      approved: data?.filter((app) => app.status === 'approved').length || 0,
      rejected: data?.filter((app) => app.status === 'rejected').length || 0,
      onboarding: data?.filter((app) => app.status === 'onboarding').length || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Unexpected error fetching application stats:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
