import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { BookingStatus, Currency } from '@/types'

export interface CreateBookingData {
  customerId: string
  talentId: string
  recipientName: string
  occasion: string
  instructions?: string
  currency: Currency
  amountPaid: number
  platformFee: number
  talentEarnings: number
}

export interface UpdateBookingData {
  status?: BookingStatus
  videoUrl?: string
  completedAt?: string
  customerRating?: number
  customerReview?: string
}

/**
 * Get bookings for current user (client-side)
 * Automatically fetches bookings based on user role (customer or talent)
 */
export async function getMyBookings(status?: BookingStatus) {
  const supabase = createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      customer:customer_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      talent:talent_id (
        id,
        display_name,
        thumbnail_url,
        users:user_id (
          id,
          full_name
        )
      )
    `)

  // Filter by role
  if (profile?.role === 'talent') {
    // Get talent profile ID
    const { data: talentProfile } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (talentProfile) {
      query = query.eq('talent_id', talentProfile.id)
    }
  } else {
    // Default to customer bookings
    query = query.eq('customer_id', user.id)
  }

  // Filter by status if provided
  if (status) {
    query = query.eq('status', status)
  }

  // Order by most recent
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings:', error)
    throw new Error(`Failed to fetch bookings: ${error.message}`)
  }

  return data
}

/**
 * Get booking by ID (client-side)
 */
export async function getBookingById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customer_id (
        id,
        full_name,
        email,
        avatar_url,
        phone
      ),
      talent:talent_id (
        id,
        display_name,
        bio,
        thumbnail_url,
        users:user_id (
          id,
          full_name,
          email,
          phone
        )
      ),
      payments (
        id,
        gateway,
        amount,
        status,
        created_at
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching booking:', error)
    throw new Error(`Failed to fetch booking: ${error.message}`)
  }

  return data
}

/**
 * Create a new booking (server-side)
 */
export async function createBooking(data: CreateBookingData) {
  const supabase = await createServerClient()

  // Generate booking code using database function
  const { data: codeResult } = await supabase.rpc('generate_booking_code')
  const bookingCode = codeResult || `TRS-${Date.now()}`

  // Calculate due date (7 days from now)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7)

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_code: bookingCode,
      customer_id: data.customerId,
      talent_id: data.talentId,
      recipient_name: data.recipientName,
      occasion: data.occasion,
      instructions: data.instructions,
      currency: data.currency,
      amount_paid: data.amountPaid,
      platform_fee: data.platformFee,
      talent_earnings: data.talentEarnings,
      status: 'pending_payment',
      due_date: dueDate.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw new Error(`Failed to create booking: ${error.message}`)
  }

  return booking
}

/**
 * Update booking (server-side)
 */
export async function updateBooking(id: string, data: UpdateBookingData) {
  const supabase = await createServerClient()

  const updateData: any = {}

  if (data.status) updateData.status = data.status
  if (data.videoUrl) updateData.video_url = data.videoUrl
  if (data.completedAt) updateData.completed_at = data.completedAt
  if (data.customerRating) updateData.customer_rating = data.customerRating
  if (data.customerReview) updateData.customer_review = data.customerReview

  // Auto-set completed_at when status changes to completed
  if (data.status === 'completed' && !data.completedAt) {
    updateData.completed_at = new Date().toISOString()
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating booking:', error)
    throw new Error(`Failed to update booking: ${error.message}`)
  }

  return booking
}

/**
 * Get booking statistics for a user
 */
export async function getBookingStats(userId: string, role: 'customer' | 'talent') {
  const supabase = createClient()

  let query = supabase
    .from('bookings')
    .select('status, amount_paid, created_at', { count: 'exact' })

  if (role === 'customer') {
    query = query.eq('customer_id', userId)
  } else {
    // Get talent profile ID first
    const { data: talentProfile } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!talentProfile) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        totalEarnings: 0,
      }
    }

    query = query.eq('talent_id', talentProfile.id)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching booking stats:', error)
    throw new Error(`Failed to fetch booking stats: ${error.message}`)
  }

  const stats = {
    total: count || 0,
    completed: data?.filter(b => b.status === 'completed').length || 0,
    pending: data?.filter(b => b.status === 'pending_payment').length || 0,
    inProgress: data?.filter(b => b.status === 'in_progress').length || 0,
    totalEarnings: data?.reduce((sum, b) => {
      if (b.status === 'completed') {
        return sum + parseFloat(b.amount_paid as any)
      }
      return sum
    }, 0) || 0,
  }

  return stats
}

/**
 * Cancel booking (server-side)
 */
export async function cancelBooking(id: string) {
  return updateBooking(id, { status: 'cancelled' })
}

/**
 * Complete booking with video (server-side)
 */
export async function completeBooking(id: string, videoUrl: string) {
  return updateBooking(id, {
    status: 'completed',
    videoUrl,
    completedAt: new Date().toISOString(),
  })
}
