import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Get platform statistics (admin only - server-side)
 */
export async function getPlatformStats() {
  const supabase = await createServerClient()

  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Get total talents
  const { count: totalTalents } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })

  // Get verified talents
  const { count: verifiedTalents } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('admin_verified', true)

  // Get pending talent verifications
  const { count: pendingTalents } = await supabase
    .from('talent_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('admin_verified', false)

  // Get total bookings
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  // Get bookings by status
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_payment')

  const { count: inProgressBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress')

  const { count: completedBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('bookings')
    .select('amount_paid, platform_fee')
    .eq('status', 'completed')

  const revenue = (revenueData as any[]) || []
  const totalRevenue = revenue.reduce((sum, b) => sum + parseFloat(b.amount_paid as any), 0)
  const platformRevenue = revenue.reduce((sum, b) => sum + parseFloat(b.platform_fee as any), 0)

  return {
    totalUsers: totalUsers || 0,
    totalTalents: totalTalents || 0,
    verifiedTalents: verifiedTalents || 0,
    pendingTalents: pendingTalents || 0,
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    inProgressBookings: inProgressBookings || 0,
    completedBookings: completedBookings || 0,
    totalRevenue,
    platformRevenue,
  }
}

/**
 * Get pending talent applications (admin only - server-side)
 */
export async function getPendingTalents() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('talent_profiles')
    .select(`
      *,
      users:user_id (
        id,
        email,
        full_name,
        phone,
        created_at
      )
    `)
    .eq('admin_verified', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching pending talents:', error)
    throw new Error(`Failed to fetch pending talents: ${error.message}`)
  }

  return data
}

/**
 * Get all users with filters (admin only - server-side)
 */
export async function getAllUsers(filters?: {
  role?: string
  region?: string
  verified?: boolean
  search?: string
}) {
  const supabase = await createServerClient()

  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.region) {
    query = query.eq('region', filters.region)
  }

  if (filters?.verified !== undefined) {
    query = query.eq('is_verified', filters.verified)
  }

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  return data
}

/**
 * Get all bookings with details (admin only - server-side)
 */
export async function getAllBookings(filters?: {
  status?: string
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createServerClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      customer:customer_id (
        id,
        full_name,
        email
      ),
      talent:talent_id (
        id,
        display_name,
        category
      ),
      payments (
        id,
        gateway,
        status,
        amount
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings:', error)
    throw new Error(`Failed to fetch bookings: ${error.message}`)
  }

  return data
}

/**
 * Get revenue analytics by date range (admin only - server-side)
 */
export async function getRevenueAnalytics(months: number = 6) {
  const supabase = await createServerClient()

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, amount_paid, platform_fee, status')
    .eq('status', 'completed')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching revenue analytics:', error)
    throw new Error(`Failed to fetch revenue analytics: ${error.message}`)
  }

  // Group by month
  const monthlyData: Record<string, { revenue: number; bookings: number }> = {}

  const bookings = (data as any[]) || []
  bookings.forEach(booking => {
    const month = new Date(booking.created_at).toISOString().slice(0, 7) // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, bookings: 0 }
    }
    monthlyData[month].revenue += parseFloat(booking.amount_paid as any)
    monthlyData[month].bookings += 1
  })

  return monthlyData
}

/**
 * Get category performance (admin only - server-side)
 */
export async function getCategoryPerformance() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      amount_paid,
      talent:talent_id (
        category
      )
    `)
    .eq('status', 'completed')

  if (error) {
    console.error('Error fetching category performance:', error)
    throw new Error(`Failed to fetch category performance: ${error.message}`)
  }

  // Group by category
  const categoryData: Record<string, { revenue: number; bookings: number }> = {}

  data?.forEach((booking: any) => {
    const category = booking.talent?.category
    if (category) {
      if (!categoryData[category]) {
        categoryData[category] = { revenue: 0, bookings: 0 }
      }
      categoryData[category].revenue += parseFloat(booking.amount_paid)
      categoryData[category].bookings += 1
    }
  })

  return categoryData
}

/**
 * Get recent activity for admin dashboard (admin only - server-side)
 */
export async function getRecentActivity(limit: number = 10) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_code,
      status,
      amount_paid,
      created_at,
      customer:customer_id (
        full_name,
        email
      ),
      talent:talent_id (
        display_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent activity:', error)
    throw new Error(`Failed to fetch recent activity: ${error.message}`)
  }

  return data
}
