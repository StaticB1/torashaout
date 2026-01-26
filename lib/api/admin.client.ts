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

    // Get pending verifications from talent_applications
    const { count: pendingVerifications } = await supabase
      .from('talent_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'under_review'])

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
      platformFee: 0.25, // 25% platform fee
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
 * Now uses talent_applications table instead of talent_profiles
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

  // Get total count of pending/under_review applications
  const { count } = await supabase
    .from('talent_applications')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'under_review'])

  // Get pending and under_review applications
  let query = supabase
    .from('talent_applications')
    .select('*')
    .in('status', ['pending', 'under_review'])
    .order('created_at', { ascending: true })
    .range(from, to)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching pending talent applications:', error)
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

  const talents = (data as any[]).map(app => ({
    id: app.id,
    name: app.stage_name,
    category: app.category,
    email: app.email,
    phone: app.phone,
    appliedAt: app.created_at,
    requestedPrice: app.proposed_price_usd,
    bio: app.bio,
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
 * Now uses talent_applications table instead of talent_profiles
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
    // Get total count of rejected applications
    const { count } = await supabase
      .from('talent_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    const { data, error } = await supabase
      .from('talent_applications')
      .select('*')
      .eq('status', 'rejected')
      .order('updated_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.warn('Error fetching rejected applications:', error.message)
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

    const talents = (data as any[]).map(app => ({
      id: app.id,
      name: app.stage_name,
      category: app.category,
      email: app.email,
      phone: app.phone,
      appliedAt: app.created_at,
      rejectedAt: app.updated_at,
      requestedPrice: app.proposed_price_usd,
      bio: app.bio,
    }))

    return {
      data: talents,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  } catch (err) {
    console.warn('Error fetching rejected talents:', err)
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
 * Now uses the talent_applications API which handles profile creation
 */
export async function approveTalent(talentId: string) {
  try {
    const response = await fetch(`/api/talent-applications/${talentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'approved'
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to approve talent')
    }

    return { success: true }
  } catch (error) {
    console.error('Error approving talent:', error)
    throw error
  }
}

/**
 * Reject a talent application
 * Now uses the talent_applications API
 */
export async function rejectTalent(talentId: string, adminNotes?: string) {
  try {
    const response = await fetch(`/api/talent-applications/${talentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'rejected',
        adminNotes
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to reject talent')
    }

    return { success: true }
  } catch (error) {
    console.error('Error rejecting talent:', error)
    throw error
  }
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
 * Calculates real average rating from completed bookings
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

    // Get talent IDs to fetch their real ratings from bookings
    const talentIds = (data as any[]).map(t => t.id)

    // Fetch completed bookings with ratings for these talents
    const { data: bookingsWithRatings } = await supabase
      .from('bookings')
      .select('talent_id, customer_rating')
      .in('talent_id', talentIds)
      .eq('status', 'completed')
      .not('customer_rating', 'is', null)

    // Calculate real average ratings per talent
    const ratingsByTalent: Record<string, { sum: number; count: number }> = {}
    if (bookingsWithRatings) {
      for (const booking of bookingsWithRatings as any[]) {
        if (!ratingsByTalent[booking.talent_id]) {
          ratingsByTalent[booking.talent_id] = { sum: 0, count: 0 }
        }
        ratingsByTalent[booking.talent_id].sum += Number(booking.customer_rating)
        ratingsByTalent[booking.talent_id].count += 1
      }
    }

    // Also fetch real total bookings count (completed only)
    const { data: bookingCounts } = await supabase
      .from('bookings')
      .select('talent_id')
      .in('talent_id', talentIds)
      .eq('status', 'completed')

    const completedBookingsByTalent: Record<string, number> = {}
    if (bookingCounts) {
      for (const booking of bookingCounts as any[]) {
        completedBookingsByTalent[booking.talent_id] = (completedBookingsByTalent[booking.talent_id] || 0) + 1
      }
    }

    const talents = (data as any[]).map(talent => {
      const ratingData = ratingsByTalent[talent.id]
      const realAverageRating = ratingData && ratingData.count > 0
        ? ratingData.sum / ratingData.count
        : null
      const ratingCount = ratingData?.count || 0
      const completedBookings = completedBookingsByTalent[talent.id] || 0

      return {
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
        totalBookings: completedBookings,
        averageRating: realAverageRating,
        ratingCount: ratingCount,
        joinedAt: talent.created_at,
      }
    })

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
 * Now uses the talent_applications API
 */
export async function reapproveTalent(talentId: string) {
  try {
    const response = await fetch(`/api/talent-applications/${talentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'approved'
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to re-approve talent')
    }

    return { success: true }
  } catch (error) {
    console.error('Error re-approving talent:', error)
    throw error
  }
}

/**
 * Get category analytics - booking counts per talent category
 */
export async function getCategoryAnalytics() {
  const supabase = createClient()

  try {
    // Fetch all completed bookings with their talent's category
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        talent:talent_id (
          category
        )
      `)
      .eq('status', 'completed')

    if (error) {
      console.error('Error fetching category analytics:', error)
      throw error
    }

    if (!bookings || bookings.length === 0) {
      return []
    }

    // Count bookings per category
    const categoryCounts: Record<string, number> = {}
    let totalBookings = 0

    for (const booking of bookings as any[]) {
      const category = booking.talent?.category
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
        totalBookings++
      }
    }

    // Convert to array and calculate percentages
    const categoryData = Object.entries(categoryCounts)
      .map(([category, bookings]) => ({
        category: formatCategoryName(category),
        bookings,
        percentage: totalBookings > 0 ? Math.round((bookings / totalBookings) * 100) : 0
      }))
      .sort((a, b) => b.bookings - a.bookings)

    return categoryData
  } catch (err) {
    console.error('Error in getCategoryAnalytics:', err)
    return []
  }
}

/**
 * Helper to format category names for display
 */
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'musician': 'Musicians',
    'comedian': 'Comedians',
    'gospel': 'Gospel Artists',
    'business': 'Business',
    'sports': 'Sports',
    'influencer': 'Influencers',
    'other': 'Other'
  }
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

/**
 * Get flagged content for moderation
 */
export async function getFlaggedContent() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('flagged_content')
      .select(`
        id,
        reason,
        status,
        admin_notes,
        created_at,
        resolved_at,
        booking:booking_id (
          id,
          booking_code,
          customer:customer_id (
            full_name
          ),
          talent:talent_id (
            display_name
          )
        ),
        reporter:reporter_id (
          full_name
        )
      `)
      .in('status', ['pending', 'reviewing'])
      .order('created_at', { ascending: false })

    if (error) {
      // Table might not exist yet
      if (error.code === '42P01') {
        console.warn('flagged_content table does not exist yet')
        return []
      }
      console.error('Error fetching flagged content:', error)
      throw error
    }

    if (!data) {
      return []
    }

    return (data as any[]).map(item => ({
      id: item.id,
      bookingCode: item.booking?.booking_code || 'Unknown',
      talentName: item.booking?.talent?.display_name || 'Unknown',
      customerName: item.booking?.customer?.full_name || 'Unknown',
      reason: item.reason,
      reportedAt: item.created_at,
      status: item.status,
      adminNotes: item.admin_notes,
      reporterName: item.reporter?.full_name || 'Anonymous'
    }))
  } catch (err) {
    console.error('Error in getFlaggedContent:', err)
    return []
  }
}

/**
 * Update flagged content status
 */
export async function updateFlaggedContentStatus(
  flagId: string,
  status: 'reviewing' | 'resolved' | 'dismissed',
  adminNotes?: string
) {
  const supabase = createClient()

  const updateData: any = {
    status,
    admin_notes: adminNotes
  }

  if (status === 'resolved' || status === 'dismissed') {
    updateData.resolved_at = new Date().toISOString()
    // Get current user as resolver
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      updateData.resolved_by = user.id
    }
  }

  const { error } = await supabase
    .from('flagged_content')
    // @ts-ignore - Supabase type inference issue with dynamic updateData
    .update(updateData)
    .eq('id', flagId)

  if (error) {
    console.error('Error updating flagged content status:', error)
    throw error
  }

  return { success: true }
}

/**
 * Get admin notification count (pending actions)
 */
export async function getAdminNotificationCount() {
  const supabase = createClient()

  try {
    // Count pending talent applications
    const { count: pendingTalents } = await supabase
      .from('talent_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'under_review'])

    // Count pending flagged content
    let pendingFlags = 0
    try {
      const { count } = await supabase
        .from('flagged_content')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'reviewing'])
      pendingFlags = count || 0
    } catch {
      // Table might not exist
      pendingFlags = 0
    }

    return (pendingTalents || 0) + pendingFlags
  } catch (err) {
    console.error('Error getting admin notification count:', err)
    return 0
  }
}

/**
 * Get extended platform stats with growth metrics
 */
export async function getPlatformStatsWithGrowth() {
  const supabase = createClient()

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Get current period user count (last 30 days)
    const { count: currentPeriodUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get previous period user count (30-60 days ago)
    const { count: previousPeriodUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    // Get current period talent count
    const { count: currentPeriodTalents } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('admin_verified', true)
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get previous period talent count
    const { count: previousPeriodTalents } = await supabase
      .from('talent_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('admin_verified', true)
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    // Get current period booking count
    const { count: currentPeriodBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // Get previous period booking count
    const { count: previousPeriodBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const userGrowth = calculateGrowth(currentPeriodUsers || 0, previousPeriodUsers || 0)
    const talentGrowth = calculateGrowth(currentPeriodTalents || 0, previousPeriodTalents || 0)
    const bookingGrowth = calculateGrowth(currentPeriodBookings || 0, previousPeriodBookings || 0)

    return {
      userGrowth,
      talentGrowth,
      bookingGrowth
    }
  } catch (err) {
    console.error('Error calculating growth metrics:', err)
    return {
      userGrowth: 0,
      talentGrowth: 0,
      bookingGrowth: 0
    }
  }
}
