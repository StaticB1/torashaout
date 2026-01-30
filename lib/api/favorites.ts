import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Get user's favorite talents (client-side)
 */
export async function getFavorites(userId?: string) {
  const supabase = createClient()

  // If no userId provided, get current user
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    targetUserId = user.id
  }

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      created_at,
      talent:talent_id (
        id,
        display_name,
        bio,
        category,
        thumbnail_url,
        price_usd,
        price_zig,
        average_rating,
        total_bookings,
        is_accepting_bookings,
        users:user_id (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    throw new Error(`Failed to fetch favorites: ${error.message}`)
  }

  return data
}

/**
 * Add talent to favorites (server-side)
 */
export async function addFavorite(userId: string, talentId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      talent_id: talentId,
    })
    .select()
    .single()

  if (error) {
    // Check if already exists
    if (error.code === '23505') {
      throw new Error('Talent already in favorites')
    }
    console.error('Error adding favorite:', error)
    throw new Error(`Failed to add favorite: ${error.message}`)
  }

  return data
}

/**
 * Remove talent from favorites (server-side)
 */
export async function removeFavorite(userId: string, talentId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('talent_id', talentId)

  if (error) {
    console.error('Error removing favorite:', error)
    throw new Error(`Failed to remove favorite: ${error.message}`)
  }

  return true
}

/**
 * Check if talent is favorited by user (client-side)
 */
export async function isFavorite(userId: string, talentId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('favorites')
    .select('talent_id')
    .eq('user_id', userId)
    .eq('talent_id', talentId)
    .single()

  if (error) {
    // Not found is not an error, just means not favorited
    if (error.code === 'PGRST116') {
      return false
    }
    console.error('Error checking favorite:', error)
    return false
  }

  return !!data
}

/**
 * Get favorite count for a talent (client-side)
 */
export async function getFavoriteCount(talentId: string) {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('talent_id', talentId)

  if (error) {
    console.error('Error getting favorite count:', error)
    return 0
  }

  return count || 0
}

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(userId: string, talentId: string) {
  const favorited = await isFavorite(userId, talentId)

  if (favorited) {
    await removeFavorite(userId, talentId)
    return false
  } else {
    await addFavorite(userId, talentId)
    return true
  }
}
