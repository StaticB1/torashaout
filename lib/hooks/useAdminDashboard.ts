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

  // Pagination state
  const [pendingPage, setPendingPage] = useState(1)
  const [rejectedPage, setRejectedPage] = useState(1)
  const [pendingTotal, setPendingTotal] = useState(0)
  const [rejectedTotal, setRejectedTotal] = useState(0)
  const [pendingTotalPages, setPendingTotalPages] = useState(0)
  const [rejectedTotalPages, setRejectedTotalPages] = useState(0)
  const pageSize = 10

  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Reload when pagination changes
  useEffect(() => {
    loadPendingTalents()
  }, [pendingPage])

  useEffect(() => {
    loadRejectedTalents()
  }, [rejectedPage])

  const loadPendingTalents = async () => {
    try {
      const result = await getPendingTalents({ page: pendingPage, pageSize })
      setPendingTalents(result.data)
      setPendingTotal(result.total)
      setPendingTotalPages(result.totalPages)
    } catch (err) {
      console.error('Error loading pending talents:', err)
    }
  }

  const loadRejectedTalents = async () => {
    try {
      const result = await getRejectedTalents({ page: rejectedPage, pageSize })
      setRejectedTalents(result.data)
      setRejectedTotal(result.total)
      setRejectedTotalPages(result.totalPages)
    } catch (err) {
      console.error('Error loading rejected talents:', err)
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data in parallel
      const [statsData, bookingsData, talentsData, rejectedData, revenueAnalytics] = await Promise.all([
        getPlatformStats(),
        getRecentBookings(10),
        getPendingTalents({ page: pendingPage, pageSize }),
        getRejectedTalents({ page: rejectedPage, pageSize }),
        getRevenueAnalytics(6)
      ])

      setStats(statsData)
      setRecentBookings(bookingsData)
      setPendingTalents(talentsData.data)
      setPendingTotal(talentsData.total)
      setPendingTotalPages(talentsData.totalPages)
      setRejectedTalents(rejectedData.data)
      setRejectedTotal(rejectedData.total)
      setRejectedTotalPages(rejectedData.totalPages)
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
        getPendingTalents({ page: pendingPage, pageSize }),
        getRejectedTalents({ page: rejectedPage, pageSize }),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData.data)
      setPendingTotal(newPendingData.total)
      setPendingTotalPages(newPendingData.totalPages)
      setRejectedTalents(newRejectedData.data)
      setRejectedTotal(newRejectedData.total)
      setRejectedTotalPages(newRejectedData.totalPages)
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
        getPendingTalents({ page: pendingPage, pageSize }),
        getRejectedTalents({ page: rejectedPage, pageSize }),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData.data)
      setPendingTotal(newPendingData.total)
      setPendingTotalPages(newPendingData.totalPages)
      setRejectedTalents(newRejectedData.data)
      setRejectedTotal(newRejectedData.total)
      setRejectedTotalPages(newRejectedData.totalPages)
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
        getPendingTalents({ page: pendingPage, pageSize }),
        getRejectedTalents({ page: rejectedPage, pageSize }),
        getPlatformStats()
      ])

      setPendingTalents(newPendingData.data)
      setPendingTotal(newPendingData.total)
      setPendingTotalPages(newPendingData.totalPages)
      setRejectedTalents(newRejectedData.data)
      setRejectedTotal(newRejectedData.total)
      setRejectedTotalPages(newRejectedData.totalPages)
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
    refresh,
    // Pagination
    pendingPage,
    setPendingPage,
    rejectedPage,
    setRejectedPage,
    pendingTotal,
    rejectedTotal,
    pendingTotalPages,
    rejectedTotalPages,
    pageSize,
  }
}
