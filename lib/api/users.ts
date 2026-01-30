import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { UserRole, UserRegion, Currency } from '@/types'

export interface CreateUserData {
  id: string
  email: string
  fullName?: string
  phone?: string
  role?: UserRole
  region?: UserRegion
  preferredCurrency?: Currency
  avatarUrl?: string
}

export interface UpdateUserData {
  fullName?: string
  phone?: string
  region?: UserRegion
  preferredCurrency?: Currency
  avatarUrl?: string
}

/**
 * Get current user profile (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * Get user by ID (server-side)
 */
export async function getUserById(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    throw new Error(`Failed to fetch user: ${error.message}`)
  }

  return data
}

/**
 * Create user profile (called after auth signup)
 */
export async function createUserProfile(data: CreateUserData) {
  const supabase = await createServerClient()

  const { data: profile, error } = await supabase
    .from('users')
    .insert({
      id: data.id,
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      role: data.role || 'fan',
      region: data.region || 'zimbabwe',
      preferred_currency: data.preferredCurrency || 'USD',
      avatar_url: data.avatarUrl,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user profile:', error)
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  return profile
}

/**
 * Update user profile (server-side)
 */
export async function updateUserProfile(id: string, data: UpdateUserData) {
  const supabase = await createServerClient()

  const updateData: any = {}
  if (data.fullName !== undefined) updateData.full_name = data.fullName
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.region !== undefined) updateData.region = data.region
  if (data.preferredCurrency !== undefined) updateData.preferred_currency = data.preferredCurrency
  if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl

  const { data: profile, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw new Error(`Failed to update user profile: ${error.message}`)
  }

  return profile
}

/**
 * Update user role (admin only - server-side)
 */
export async function updateUserRole(id: string, role: UserRole) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user role:', error)
    throw new Error(`Failed to update user role: ${error.message}`)
  }

  return data
}

/**
 * Verify user (admin only - server-side)
 */
export async function verifyUser(id: string, verified: boolean) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('users')
    .update({ is_verified: verified })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error verifying user:', error)
    throw new Error(`Failed to verify user: ${error.message}`)
  }

  return data
}

/**
 * Get user statistics
 */
export async function getUserStats(id: string) {
  const supabase = createClient()

  // Get user profile
  const { data: user } = await supabase
    .from('users')
    .select('role, created_at')
    .eq('id', id)
    .single()

  if (!user) {
    throw new Error('User not found')
  }

  const stats: any = {
    role: user.role,
    joinedDate: user.created_at,
  }

  // Get booking stats based on role
  if (user.role === 'customer' || user.role === 'fan') {
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', id)

    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', id)
      .eq('status', 'completed')

    const { data: totalSpent } = await supabase
      .from('bookings')
      .select('amount_paid')
      .eq('customer_id', id)
      .eq('status', 'completed')

    stats.totalBookings = totalBookings || 0
    stats.completedBookings = completedBookings || 0
    stats.totalSpent = totalSpent?.reduce((sum, b) => sum + parseFloat(b.amount_paid as any), 0) || 0
  }

  if (user.role === 'talent') {
    // Get talent profile
    const { data: talentProfile } = await supabase
      .from('talent_profiles')
      .select('id, total_bookings, average_rating')
      .eq('user_id', id)
      .single()

    if (talentProfile) {
      stats.talentId = talentProfile.id
      stats.totalBookings = talentProfile.total_bookings
      stats.averageRating = talentProfile.average_rating

      // Get total earnings
      const { data: earnings } = await supabase
        .from('bookings')
        .select('talent_earnings')
        .eq('talent_id', talentProfile.id)
        .eq('status', 'completed')

      stats.totalEarnings = earnings?.reduce((sum, b) => sum + parseFloat(b.talent_earnings as any), 0) || 0
    }
  }

  return stats
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  return data?.role === 'admin'
}

/**
 * Check if user is talent
 */
export async function isTalent(userId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  return data?.role === 'talent'
}
