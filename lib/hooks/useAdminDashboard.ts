/**
 * Custom hook for Admin Dashboard
 * Manages admin dashboard state and data fetching
 */

'use client'

import { useState, useEffect } from 'react'
import {
  getPlatformStats,
  getRecentBookings,
  getPendingTalents,
  getRejectedTalents,
  approveTalent,
  rejectTalent,
  reapproveTalent,
  getRevenueAnalytics
} from '@/lib/api/admin.client'

export interface PlatformStats {
  totalUsers: number
  totalTalents: number
  activeTalents: number
  pendingVerifications: number
  totalBookings: number
  completedBookings: number
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  avgBookingValue: number
  platformFee: number
  totalPayouts: number
}

export interface RecentBooking {
  id: string
  bookingCode: string
  customerName: string
  talentName: string
  amount: number
  currency: string
  status: string
  occasion: string
  createdAt: string
}

export interface PendingTalent {
  id: string
  name: string
  category: string
  email: string
  phone: string
  appliedAt: string
  requestedPrice: number
  bio?: string
}

export interface RejectedTalent {
  id: string
  name: string
  category: string
  email: string
  phone: string
  appliedAt: string
  rejectedAt: string
  requestedPrice: number
  bio?: string
}

export interface RevenueData {
  month: string
  revenue: number
  bookings: number
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [pendingTalents, setPendingTalents] = useState<PendingTalent[]>([])
  const [rejectedTalents, setRejectedTalents] = useState<RejectedTalent[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data in parallel
      const [statsData, bookingsData, talentsData, rejectedData, revenueAnalytics] = await Promise.all([
        getPlatformStats(),
        getRecentBookings(10),
        getPendingTalents(),
        getRejectedTalents(),
        getRevenueAnalytics(6)
      ])

      setStats(statsData)
      setRecentBookings(bookingsData)
      setPendingTalents(talentsData)
      setRejectedTalents(rejectedData)
      setRevenueData(revenueAnalytics)

    } catch (err) {
      console.error('Error loading admin dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Approve talent application
  const handleApproveTalent = async (talentId: string) => {
    try {
      await approveTalent(talentId)

      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100))

      // Refresh all talent lists to ensure consistent state
      const [newPendingData, newRejectedData, newStats] = await Promise.all([
        getPendingTalents(),
        getRejectedTalents(),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData)
      setRejectedTalents(newRejectedData)
      setStats(newStats)

      return { success: true }
    } catch (err) {
      console.error('Error approving talent:', err)
      throw err
    }
  }

  // Reject talent application
  const handleRejectTalent = async (talentId: string) => {
    try {
      await rejectTalent(talentId)

      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100))

      // Refresh all talent lists to ensure consistent state
      const [newPendingData, newRejectedData, newStats] = await Promise.all([
        getPendingTalents(),
        getRejectedTalents(),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData)
      setRejectedTalents(newRejectedData)
      setStats(newStats)

      return { success: true }
    } catch (err) {
      console.error('Error rejecting talent:', err)
      throw err
    }
  }

  // Re-approve rejected talent
  const handleReapproveTalent = async (talentId: string) => {
    try {
      await reapproveTalent(talentId)

      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100))

      // Refresh all talent lists to ensure consistent state
      const [newPendingData, newRejectedData, newStats] = await Promise.all([
        getPendingTalents(),
        getRejectedTalents(),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData)
      setRejectedTalents(newRejectedData)
      setStats(newStats)

      return { success: true }
    } catch (err) {
      console.error('Error re-approving talent:', err)
      throw err
    }
  }

  // Refresh dashboard data
  const refresh = async () => {
    await loadDashboardData()
  }

  return {
    stats,
    recentBookings,
    pendingTalents,
    rejectedTalents,
    revenueData,
    loading,
    error,
    approveTalent: handleApproveTalent,
    rejectTalent: handleRejectTalent,
    reapproveTalent: handleReapproveTalent,
    refresh
  }
}
