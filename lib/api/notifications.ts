import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'booking_confirmed'
  | 'video_ready'
  | 'payment_received'
  | 'review_received'
  | 'booking_request'
  | 'talent_approved'
  | 'message_received'
  | 'promotion'
  | 'reminder'

export interface CreateNotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
}

/**
 * Get notifications for current user (client-side)
 */
export async function getNotifications(userId?: string, unreadOnly: boolean = false) {
  const supabase = createClient()

  // If no userId provided, get current user
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    targetUserId = user.id
  }

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', targetUserId)

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching notifications:', error)
    throw new Error(`Failed to fetch notifications: ${error.message}`)
  }

  return data
}

/**
 * Get unread notification count (client-side)
 */
export async function getUnreadCount(userId?: string) {
  const supabase = createClient()

  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0
    targetUserId = user.id
  }

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', targetUserId)
    .eq('is_read', false)

  if (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }

  return count || 0
}

/**
 * Create notification (server-side)
 */
export async function createNotification(data: CreateNotificationData) {
  const supabase = await createServerClient()

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      action_url: data.actionUrl,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw new Error(`Failed to create notification: ${error.message}`)
  }

  return notification
}

/**
 * Mark notification as read (server-side)
 */
export async function markAsRead(notificationId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Error marking notification as read:', error)
    throw new Error(`Failed to mark notification as read: ${error.message}`)
  }

  return true
}

/**
 * Mark all notifications as read (server-side)
 */
export async function markAllAsRead(userId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking all as read:', error)
    throw new Error(`Failed to mark all as read: ${error.message}`)
  }

  return true
}

/**
 * Delete notification (server-side)
 */
export async function deleteNotification(notificationId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    console.error('Error deleting notification:', error)
    throw new Error(`Failed to delete notification: ${error.message}`)
  }

  return true
}

/**
 * Subscribe to real-time notifications (client-side)
 */
export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: any) => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNotification(payload.new)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Helper functions to create specific notification types
 */

export async function notifyBookingConfirmed(
  userId: string,
  bookingCode: string,
  talentName: string
) {
  return createNotification({
    userId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: `Your booking ${bookingCode} with ${talentName} has been confirmed.`,
    actionUrl: `/bookings/${bookingCode}`,
  })
}

export async function notifyVideoReady(
  userId: string,
  bookingCode: string,
  talentName: string
) {
  return createNotification({
    userId,
    type: 'video_ready',
    title: 'Video Ready!',
    message: `${talentName} has completed your video! Watch it now.`,
    actionUrl: `/bookings/${bookingCode}`,
  })
}

export async function notifyPaymentReceived(
  userId: string,
  amount: number,
  currency: string
) {
  return createNotification({
    userId,
    type: 'payment_received',
    title: 'Payment Received',
    message: `You received a payment of ${currency} ${amount.toFixed(2)}.`,
    actionUrl: '/dashboard',
  })
}

export async function notifyBookingRequest(
  userId: string,
  customerName: string,
  bookingCode: string
) {
  return createNotification({
    userId,
    type: 'booking_request',
    title: 'New Booking Request',
    message: `${customerName} has requested a video from you.`,
    actionUrl: `/dashboard?booking=${bookingCode}`,
  })
}

export async function notifyTalentApproved(userId: string) {
  return createNotification({
    userId,
    type: 'talent_approved',
    title: 'Account Approved!',
    message: 'Congratulations! Your talent account has been verified.',
    actionUrl: '/dashboard',
  })
}

export async function notifyReviewReceived(
  userId: string,
  customerName: string,
  rating: number
) {
  return createNotification({
    userId,
    type: 'review_received',
    title: 'New Review',
    message: `${customerName} left you a ${rating}-star review!`,
    actionUrl: '/dashboard',
  })
}
