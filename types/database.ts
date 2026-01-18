/**
 * Database type definitions for Supabase
 * This file will be auto-generated after running: npx supabase gen types typescript
 * For now, we'll define the basic structure manually
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          role: 'fan' | 'talent' | 'admin'
          region: 'zimbabwe' | 'diaspora'
          preferred_currency: 'USD' | 'ZIG'
          avatar_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name?: string | null
          role?: 'fan' | 'talent' | 'admin'
          region?: 'zimbabwe' | 'diaspora'
          preferred_currency?: 'USD' | 'ZIG'
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          role?: 'fan' | 'talent' | 'admin'
          region?: 'zimbabwe' | 'diaspora'
          preferred_currency?: 'USD' | 'ZIG'
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      talent_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          category: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other'
          profile_video_url: string | null
          thumbnail_url: string | null
          price_usd: number
          price_zig: number
          is_accepting_bookings: boolean
          response_time_hours: number
          admin_verified: boolean
          total_bookings: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          category: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other'
          profile_video_url?: string | null
          thumbnail_url?: string | null
          price_usd: number
          price_zig: number
          is_accepting_bookings?: boolean
          response_time_hours?: number
          admin_verified?: boolean
          total_bookings?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          category?: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other'
          profile_video_url?: string | null
          thumbnail_url?: string | null
          price_usd?: number
          price_zig?: number
          is_accepting_bookings?: boolean
          response_time_hours?: number
          admin_verified?: boolean
          total_bookings?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_code: string
          customer_id: string
          talent_id: string
          recipient_name: string
          occasion: string
          instructions: string | null
          currency: 'USD' | 'ZIG'
          amount_paid: number
          platform_fee: number
          talent_earnings: number
          status: 'pending_payment' | 'payment_confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
          video_url: string | null
          due_date: string | null
          completed_at: string | null
          customer_rating: number | null
          customer_review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_code: string
          customer_id: string
          talent_id: string
          recipient_name: string
          occasion: string
          instructions?: string | null
          currency: 'USD' | 'ZIG'
          amount_paid: number
          platform_fee: number
          talent_earnings: number
          status?: 'pending_payment' | 'payment_confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
          video_url?: string | null
          due_date?: string | null
          completed_at?: string | null
          customer_rating?: number | null
          customer_review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_code?: string
          customer_id?: string
          talent_id?: string
          recipient_name?: string
          occasion?: string
          instructions?: string | null
          currency?: 'USD' | 'ZIG'
          amount_paid?: number
          platform_fee?: number
          talent_earnings?: number
          status?: 'pending_payment' | 'payment_confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
          video_url?: string | null
          due_date?: string | null
          completed_at?: string | null
          customer_rating?: number | null
          customer_review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          gateway: 'paynow' | 'stripe' | 'innbucks'
          gateway_transaction_id: string | null
          amount: number
          currency: 'USD' | 'ZIG'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          gateway_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          gateway: 'paynow' | 'stripe' | 'innbucks'
          gateway_transaction_id?: string | null
          amount: number
          currency: 'USD' | 'ZIG'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          gateway_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          gateway?: 'paynow' | 'stripe' | 'innbucks'
          gateway_transaction_id?: string | null
          amount?: number
          currency?: 'USD' | 'ZIG'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          gateway_response?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          talent_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          talent_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          talent_id?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          booking_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          booking_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          booking_count?: number
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'fan' | 'talent' | 'admin'
      user_region: 'zimbabwe' | 'diaspora'
      currency: 'USD' | 'ZIG'
      talent_category: 'musician' | 'comedian' | 'gospel' | 'business' | 'sports' | 'influencer' | 'other'
      booking_status: 'pending_payment' | 'payment_confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
      payment_gateway: 'paynow' | 'stripe' | 'innbucks'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
  }
}
