'use client'

import { createClient } from '@/lib/supabase/client'

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
 * Mark notification as read (client-side)
 */
export async function markAsRead(notificationId: string) {
  const supabase = createClient()

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
 * Mark all notifications as read (client-side)
 */
export async function markAllAsRead(userId?: string) {
  const supabase = createClient()

  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    targetUserId = user.id
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', targetUserId)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking all as read:', error)
    throw new Error(`Failed to mark all as read: ${error.message}`)
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
