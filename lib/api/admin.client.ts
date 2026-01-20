/**
 * Client-side Admin API functions
 * These run in the browser and use the anon key (with RLS policies)
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Get platform statistics for admin dashboard
 */
export async function getPlatformStats() {
  const supabase = createClient()

  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get total talents
    const { count: totalTalents } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })

    // Get verified talents
    const { count: activeTalents } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('admin_verified', true)
      .eq('is_accepting_bookings', true)

    // Get pending verifications
    const { count: pendingVerifications } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('admin_verified', false)

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Get completed bookings
    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get revenue data
    const { data: completedOrders } = await supabase
      .from('bookings')
      .select('amount_paid, platform_fee, created_at')
      .eq('status', 'completed')

    const orders = (completedOrders as any[]) || []
    const totalRevenue = orders.reduce((sum, b) => sum + Number(b.amount_paid || 0), 0)
    const platformFee = orders.reduce((sum, b) => sum + Number(b.platform_fee || 0), 0)
    const totalPayouts = totalRevenue - platformFee

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const monthlyOrders = orders.filter(order =>
      new Date(order.created_at) >= thirtyDaysAgo
    )

    const monthlyRevenue = monthlyOrders.reduce((sum, b) => sum + Number(b.amount_paid || 0), 0)

    // Calculate revenue growth (compare to previous month)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const previousMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo
    })

    const previousMonthRevenue = previousMonthOrders.reduce((sum, b) => sum + Number(b.amount_paid || 0), 0)
    const revenueGrowth = previousMonthRevenue > 0
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0

    const avgBookingValue = completedBookings && completedBookings > 0
      ? totalRevenue / completedBookings
      : 0

    return {
      totalUsers: totalUsers || 0,
      totalTalents: totalTalents || 0,
      activeTalents: activeTalents || 0,
      pendingVerifications: pendingVerifications || 0,
      totalBookings: totalBookings || 0,
      completedBookings: completedBookings || 0,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      avgBookingValue: Math.round(avgBookingValue * 100) / 100,
      platformFee: 0.10, // 10% platform fee
      totalPayouts: Math.round(totalPayouts * 100) / 100,
    }
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    throw error
  }
}

/**
 * Get recent bookings for admin dashboard
 */
export async function getRecentBookings(limit: number = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      recipient_name,
      occasion,
      status,
      amount_paid,
      currency,
      created_at,
      customer:customer_id (
        id,
        full_name,
        email
      ),
      talent:talent_id (
        id,
        display_name,
        category
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent bookings:', error)
    throw error
  }

  if (!data) {
    return []
  }

  return (data as any[]).map(booking => ({
    id: booking.id,
    bookingCode: booking.booking_code,
    customerName: (booking.customer as any)?.full_name || 'Unknown',
    talentName: (booking.talent as any)?.display_name || 'Unknown',
    amount: Number(booking.amount_paid || 0),
    currency: booking.currency,
    status: booking.status,
    occasion: booking.occasion,
    createdAt: booking.created_at,
  }))
}

/**
 * Get pending talent applications with pagination
 */
export async function getPendingTalents(options?: {
  page?: number
  pageSize?: number
}) {
  const supabase = createClient()
  const page = options?.page || 1
  const pageSize = options?.pageSize || 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Get total count
  const { count } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('admin_verified', false)
    .or('verification_status.eq.pending,verification_status.is.null')

  // Get talents that are not verified AND not rejected
  // Query for admin_verified = false AND verification_status = 'pending' (or NULL for backwards compatibility)
  let query = supabase
    .from('talent_profiles')
    .select(`
      id,
      display_name,
      bio,
      category,
      price_usd,
      price_zig,
      thumbnail_url,
      created_at,
      admin_verified,
      verification_status,
      user:user_id (
        id,
        email,
        phone,
        full_name,
        created_at
      )
    `)
    .eq('admin_verified', false)
    .or('verification_status.eq.pending,verification_status.is.null')
    .order('created_at', { ascending: true })
    .range(from, to)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching pending talents:', error)
    throw error
  }

  if (!data) {
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    }
  }

  const talents = (data as any[]).map(talent => ({
    id: talent.id,
    name: talent.display_name,
    category: talent.category,
    email: (talent.user as any)?.email || '',
    phone: (talent.user as any)?.phone || '',
    appliedAt: talent.created_at,
    requestedPrice: talent.price_usd,
    bio: talent.bio,
  }))

  return {
    data: talents,
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

/**
 * Get rejected talent applications with pagination
 * Note: This requires the verification_status column migration to be run
 */
export async function getRejectedTalents(options?: {
  page?: number
  pageSize?: number
}) {
  const supabase = createClient()
  const page = options?.page || 1
  const pageSize = options?.pageSize || 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    // Get total count
    const { count } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'rejected')

    const { data, error } = await supabase
      .from('talent_profiles')
      .select(`
        id,
        display_name,
        bio,
        category,
        price_usd,
        price_zig,
        thumbnail_url,
        created_at,
        updated_at,
        verification_status,
        user:user_id (
          id,
          email,
          phone,
          full_name,
          created_at
        )
      `)
      .eq('verification_status', 'rejected')
      .order('updated_at', { ascending: false })
      .range(from, to)

    // If error (column doesn't exist), return empty array
    if (error) {
      console.warn('verification_status column not found, returning empty rejected list:', error.message)
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      }
    }

    if (!data) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      }
    }

    const talents = (data as any[]).map(talent => ({
      id: talent.id,
      name: talent.display_name,
      category: talent.category,
      email: (talent.user as any)?.email || '',
      phone: (talent.user as any)?.phone || '',
      appliedAt: talent.created_at,
      rejectedAt: talent.updated_at,
      requestedPrice: talent.price_usd,
      bio: talent.bio,
    }))

    return {
      data: talents,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  } catch (err) {
    console.warn('Error fetching rejected talents, likely column does not exist yet:', err)
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    }
  }
}

/**
 * Approve a talent application
 */
export async function approveTalent(talentId: string) {
  const supabase = createClient()

  // Try with verification_status, but don't fail if column doesn't exist
  const updateData: any = {
    admin_verified: true,
    is_accepting_bookings: true
  }

  // Try to set verification_status if the column exists
  try {
    updateData.verification_status = 'approved'
  } catch (e) {
    // Column doesn't exist, that's ok
  }

  const { error } = await supabase
    .from('talent_profiles')
    // @ts-ignore - Supabase type inference issue with dynamic updateData
    .update(updateData)
    .eq('id', talentId)

  if (error) {
    console.error('Error approving talent:', error)
    throw error
  }

  return { success: true }
}

/**
 * Reject a talent application
 */
export async function rejectTalent(talentId: string) {
  const supabase = createClient()

  // Try with verification_status, but don't fail if column doesn't exist
  const updateData: any = {
    admin_verified: false,
    is_accepting_bookings: false
  }

  // Try to set verification_status if the column exists
  try {
    updateData.verification_status = 'rejected'
  } catch (e) {
    // Column doesn't exist, that's ok
  }

  const { error } = await supabase
    .from('talent_profiles')
    // @ts-ignore - Supabase type inference issue with dynamic updateData
    .update(updateData)
    .eq('id', talentId)

  if (error) {
    console.error('Error rejecting talent:', error)
    throw error
  }

  return { success: true }
}

/**
 * Get revenue analytics by month
 */
export async function getRevenueAnalytics(months: number = 6) {
  const supabase = createClient()

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, amount_paid, platform_fee')
    .eq('status', 'completed')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching revenue analytics:', error)
    throw error
  }

  // Group by month
  const monthlyData: Record<string, { revenue: number; bookings: number }> = {}

  const bookings = (data as any[]) || []
  bookings.forEach(booking => {
    const month = new Date(booking.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })

    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, bookings: 0 }
    }
    monthlyData[month].revenue += Number(booking.amount_paid || 0)
    monthlyData[month].bookings += 1
  })

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    revenue: Math.round(data.revenue * 100) / 100,
    bookings: data.bookings,
  }))
}

/**
 * Get all bookings with filters
 */
export async function getAllBookings(filters?: {
  status?: string
  limit?: number
}) {
  const supabase = createClient()

  let query = supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      recipient_name,
      occasion,
      status,
      amount_paid,
      currency,
      created_at,
      customer:customer_id (
        full_name,
        email
      ),
      talent:talent_id (
        display_name,
        category
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }

  return data
}

/**
 * Get all unique talent categories from the database
 */
export async function getTalentCategories() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('talent_profiles')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    if (!data) {
      return []
    }

    // Get unique categories
    const categories = [...new Set((data as any[]).map(t => t.category))]
    return categories.sort()
  } catch (err) {
    console.error('Error in getTalentCategories:', err)
    return []
  }
}

/**
 * Get all active (verified) talents with pagination
 */
export async function getActiveTalents(filters?: {
  category?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const supabase = createClient()
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    // Build count query with same filters
    let countQuery = supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('admin_verified', true)

    if (filters?.category) {
      countQuery = countQuery.eq('category', filters.category)
    }

    if (filters?.search) {
      countQuery = countQuery.or(`display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
    }

    const { count } = await countQuery

    // Build data query
    let query = supabase
      .from('talent_profiles')
      .select(`
        id,
        display_name,
        bio,
        category,
        price_usd,
        price_zig,
        response_time_hours,
        thumbnail_url,
        admin_verified,
        is_accepting_bookings,
        total_bookings,
        average_rating,
        created_at,
        user:user_id (
          id,
          email,
          phone,
          full_name
        )
      `)
      .eq('admin_verified', true)
      .order('total_bookings', { ascending: false })
      .range(from, to)

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(`display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching active talents:', error)
      throw error
    }

    if (!data) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      }
    }

    const talents = (data as any[]).map(talent => ({
      id: talent.id,
      name: talent.display_name,
      category: talent.category,
      email: (talent.user as any)?.email || '',
      phone: (talent.user as any)?.phone || '',
      bio: talent.bio,
      priceUsd: talent.price_usd,
      priceZig: talent.price_zig,
      responseTime: talent.response_time_hours || 24,
      thumbnailUrl: talent.thumbnail_url,
      isAcceptingBookings: talent.is_accepting_bookings || false,
      totalBookings: talent.total_bookings || 0,
      averageRating: talent.average_rating || 0,
      joinedAt: talent.created_at,
    }))

    return {
      data: talents,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  } catch (err) {
    console.error('Error in getActiveTalents:', err)
    throw err
  }
}

/**
 * Get single talent details
 */
export async function getTalentDetails(talentId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .select(`
      *,
      user:user_id (
        id,
        email,
        phone,
        full_name,
        created_at
      )
    `)
    .eq('id', talentId)
    .single()

  if (error) {
    console.error('Error fetching talent details:', error)
    throw error
  }

  const talent = data as any

  return {
    id: talent.id,
    name: talent.display_name,
    category: talent.category,
    email: (talent.user as any)?.email || '',
    phone: (talent.user as any)?.phone || '',
    fullName: (talent.user as any)?.full_name || '',
    bio: talent.bio,
    priceUsd: talent.price_usd,
    priceZig: talent.price_zig,
    responseTime: talent.response_time_hours,
    thumbnailUrl: talent.thumbnail_url,
    isAcceptingBookings: talent.is_accepting_bookings,
    adminVerified: talent.admin_verified,
    totalBookings: talent.total_bookings,
    averageRating: talent.average_rating,
    joinedAt: talent.created_at,
    userCreatedAt: (talent.user as any)?.created_at,
  }
}

/**
 * Toggle talent booking acceptance
 */
export async function toggleTalentAcceptingBookings(talentId: string, isAccepting: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from('talent_profiles')
    // @ts-ignore - Supabase type inference issue
    .update({ is_accepting_bookings: isAccepting })
    .eq('id', talentId)

  if (error) {
    console.error('Error toggling talent booking acceptance:', error)
    throw error
  }

  return { success: true }
}

/**
 * Update talent verification status
 */
export async function updateTalentVerification(talentId: string, verified: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from('talent_profiles')
    // @ts-ignore - Supabase type inference issue
    .update({
      admin_verified: verified,
      is_accepting_bookings: verified ? true : false,
      verification_status: verified ? 'approved' : 'rejected'
    })
    .eq('id', talentId)

  if (error) {
    console.error('Error updating talent verification:', error)
    throw error
  }

  return { success: true }
}

/**
 * Re-approve a rejected talent (move from rejected back to approved)
 */
export async function reapproveTalent(talentId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('talent_profiles')
    // @ts-ignore - Supabase type inference issue
    .update({
      admin_verified: true,
      is_accepting_bookings: true,
      verification_status: 'approved'
    })
    .eq('id', talentId)

  if (error) {
    console.error('Error re-approving talent:', error)
    throw error
  }

  return { success: true }
}
