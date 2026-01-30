import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { TalentProfile, TalentCategory } from '@/types'

export interface TalentFilters {
  category?: TalentCategory
  search?: string
  minPrice?: number
  maxPrice?: number
  currency?: 'USD' | 'ZIG'
  verified?: boolean
  acceptingBookings?: boolean
}

/**
 * Get all talents with optional filters (client-side)
 */
export async function getTalents(filters?: TalentFilters) {
  const supabase = createClient()

  let query = supabase
    .from('talent_profiles')
    .select(`
      *,
      users:user_id (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('admin_verified', filters?.verified !== false)

  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.search) {
    query = query.or(`display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
  }

  if (filters?.acceptingBookings !== undefined) {
    query = query.eq('is_accepting_bookings', filters.acceptingBookings)
  }

  if (filters?.minPrice && filters.currency) {
    const priceField = filters.currency === 'USD' ? 'price_usd' : 'price_zig'
    query = query.gte(priceField, filters.minPrice)
  }

  if (filters?.maxPrice && filters.currency) {
    const priceField = filters.currency === 'USD' ? 'price_usd' : 'price_zig'
    query = query.lte(priceField, filters.maxPrice)
  }

  // Order by total bookings and rating
  query = query.order('admin_verified', { ascending: false })
    .order('total_bookings', { ascending: false })
    .order('average_rating', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching talents:', error)
    throw new Error(`Failed to fetch talents: ${error.message}`)
  }

  return data
}

/**
 * Get talent by ID (client-side)
 */
export async function getTalentById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .select(`
      *,
      users:user_id (
        id,
        email,
        full_name,
        avatar_url,
        region
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching talent:', error)
    throw new Error(`Failed to fetch talent: ${error.message}`)
  }

  return data
}

/**
 * Get talent by user ID (server-side)
 */
export async function getTalentByUserId(userId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // Return null if not found (user might not be a talent)
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching talent:', error)
    throw new Error(`Failed to fetch talent: ${error.message}`)
  }

  return data
}

/**
 * Create talent profile (server-side)
 */
export async function createTalentProfile(data: {
  userId: string
  displayName: string
  bio?: string
  category: TalentCategory
  priceUSD: number
  priceZIG: number
  profileVideoUrl?: string
  thumbnailUrl?: string
}) {
  const supabase = await createServerClient()

  const { data: profile, error } = await supabase
    .from('talent_profiles')
    .insert({
      user_id: data.userId,
      display_name: data.displayName,
      bio: data.bio,
      category: data.category,
      price_usd: data.priceUSD,
      price_zig: data.priceZIG,
      profile_video_url: data.profileVideoUrl,
      thumbnail_url: data.thumbnailUrl,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating talent profile:', error)
    throw new Error(`Failed to create talent profile: ${error.message}`)
  }

  return profile
}

/**
 * Update talent profile (server-side)
 */
export async function updateTalentProfile(
  id: string,
  data: Partial<{
    displayName: string
    bio: string
    category: TalentCategory
    priceUSD: number
    priceZIG: number
    profileVideoUrl: string
    thumbnailUrl: string
    isAcceptingBookings: boolean
    responseTimeHours: number
  }>
) {
  const supabase = await createServerClient()

  const updateData: any = {}
  if (data.displayName !== undefined) updateData.display_name = data.displayName
  if (data.bio !== undefined) updateData.bio = data.bio
  if (data.category !== undefined) updateData.category = data.category
  if (data.priceUSD !== undefined) updateData.price_usd = data.priceUSD
  if (data.priceZIG !== undefined) updateData.price_zig = data.priceZIG
  if (data.profileVideoUrl !== undefined) updateData.profile_video_url = data.profileVideoUrl
  if (data.thumbnailUrl !== undefined) updateData.thumbnail_url = data.thumbnailUrl
  if (data.isAcceptingBookings !== undefined) updateData.is_accepting_bookings = data.isAcceptingBookings
  if (data.responseTimeHours !== undefined) updateData.response_time_hours = data.responseTimeHours

  const { data: profile, error } = await supabase
    .from('talent_profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating talent profile:', error)
    throw new Error(`Failed to update talent profile: ${error.message}`)
  }

  return profile
}

/**
 * Verify talent (admin only - server-side)
 */
export async function verifyTalent(id: string, verified: boolean) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .update({ admin_verified: verified })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error verifying talent:', error)
    throw new Error(`Failed to verify talent: ${error.message}`)
  }

  return data
}

/**
 * Get featured talents (client-side)
 */
export async function getFeaturedTalents(limit: number = 6) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .select(`
      *,
      users:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('admin_verified', true)
    .eq('is_accepting_bookings', true)
    .order('total_bookings', { ascending: false })
    .order('average_rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured talents:', error)
    throw new Error(`Failed to fetch featured talents: ${error.message}`)
  }

  return data
}
