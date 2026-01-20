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
  getRevenueAnalytics,
  getCategoryAnalytics,
  getFlaggedContent,
  updateFlaggedContentStatus,
  getAdminNotificationCount,
  getPlatformStatsWithGrowth
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

export interface CategoryAnalytics {
  category: string
  bookings: number
  percentage: number
}

export interface FlaggedContent {
  id: string
  bookingCode: string
  talentName: string
  customerName: string
  reason: string
  reportedAt: string
  status: string
  adminNotes?: string
  reporterName?: string
}

export interface GrowthMetrics {
  userGrowth: number
  talentGrowth: number
  bookingGrowth: number
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [pendingTalents, setPendingTalents] = useState<PendingTalent[]>([])
  const [rejectedTalents, setRejectedTalents] = useState<RejectedTalent[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [categoryAnalytics, setCategoryAnalytics] = useState<CategoryAnalytics[]>([])
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({ userGrowth: 0, talentGrowth: 0, bookingGrowth: 0 })
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
      const [
        statsData,
        bookingsData,
        talentsData,
        rejectedData,
        revenueAnalytics,
        categoryData,
        flaggedData,
        notifCount,
        growthData
      ] = await Promise.all([
        getPlatformStats(),
        getRecentBookings(10),
        getPendingTalents({ page: pendingPage, pageSize }),
        getRejectedTalents({ page: rejectedPage, pageSize }),
        getRevenueAnalytics(6),
        getCategoryAnalytics(),
        getFlaggedContent(),
        getAdminNotificationCount(),
        getPlatformStatsWithGrowth()
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
      setCategoryAnalytics(categoryData)
      setFlaggedContent(flaggedData)
      setNotificationCount(notifCount)
      setGrowthMetrics(growthData)

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

  // Update flagged content status
  const handleUpdateFlaggedStatus = async (
    flagId: string,
    status: 'reviewing' | 'resolved' | 'dismissed',
    adminNotes?: string
  ) => {
    try {
      await updateFlaggedContentStatus(flagId, status, adminNotes)

      // Refresh flagged content and notification count
      const [newFlaggedData, newNotifCount] = await Promise.all([
        getFlaggedContent(),
        getAdminNotificationCount()
      ])

      setFlaggedContent(newFlaggedData)
      setNotificationCount(newNotifCount)

      return { success: true }
    } catch (err) {
      console.error('Error updating flagged content status:', err)
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
    categoryAnalytics,
    flaggedContent,
    notificationCount,
    growthMetrics,
    loading,
    error,
    approveTalent: handleApproveTalent,
    rejectTalent: handleRejectTalent,
    reapproveTalent: handleReapproveTalent,
    updateFlaggedStatus: handleUpdateFlaggedStatus,
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
