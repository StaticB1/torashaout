'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Video,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  UserCheck,
  Settings,
  BarChart3,
  Activity,
  Star,
  Clock,
  MessageSquare,
  Flag,
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Calendar
} from 'lucide-react';
import { Currency } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { AuthGuard } from '@/components/AuthGuard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAdminDashboard } from '@/lib/hooks/useAdminDashboard';
import { ActiveTalentsList } from '@/components/admin/ActiveTalentsList';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { TalentReviewModal } from '@/components/admin/TalentReviewModal';

// Mock flagged content (this will be implemented later)
const mockFlaggedContent = [
  {
    id: '1',
    bookingCode: 'TS-2026-0120',
    talentName: 'Winky D',
    customerName: 'John D.',
    reason: 'Video quality issues',
    reportedAt: '2026-01-16T12:00:00Z',
    status: 'pending',
  },
  {
    id: '2',
    bookingCode: 'TS-2026-0115',
    talentName: 'Comic Pastor',
    customerName: 'Mary S.',
    reason: 'Inappropriate content',
    reportedAt: '2026-01-15T09:30:00Z',
    status: 'reviewing',
  },
];

type TabType = 'overview' | 'talents' | 'bookings' | 'moderation' | 'analytics';

function AdminPanelContent() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showPendingTalents, setShowPendingTalents] = useState(true);
  const [showActiveTalents, setShowActiveTalents] = useState(true);
  const [showRejectedTalents, setShowRejectedTalents] = useState(false);
  const { user, profile } = useAuth();
  const { success, error: showError } = useToast();

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant?: 'danger' | 'warning' | 'success'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Review modal state
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    talent: any
    status: 'pending' | 'rejected'
  }>({
    isOpen: false,
    talent: null,
    status: 'pending'
  });

  // Get real data from backend
  const {
    stats,
    recentBookings,
    pendingTalents,
    rejectedTalents,
    revenueData,
    loading,
    error,
    approveTalent,
    rejectTalent,
    reapproveTalent,
    refresh
  } = useAdminDashboard();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';

  // Handle approve talent
  const handleApproveTalent = async (talentId: string) => {
    const talent = pendingTalents.find(t => t.id === talentId);
    if (!talent) return;

    setConfirmModal({
      isOpen: true,
      title: 'Approve Talent',
      message: `Are you sure you want to approve ${talent.name} as a talent on the platform? They will be able to accept bookings immediately.`,
      variant: 'success',
      onConfirm: async () => {
        try {
          await approveTalent(talentId);
          success(`${talent.name} has been approved and can now accept bookings!`);
        } catch (err) {
          console.error('Failed to approve talent:', err);
          showError('Failed to approve talent. Please try again.');
        }
      }
    });
  };

  // Handle reject talent
  const handleRejectTalent = async (talentId: string) => {
    const talent = pendingTalents.find(t => t.id === talentId);
    if (!talent) return;

    setConfirmModal({
      isOpen: true,
      title: 'Reject Application',
      message: `Are you sure you want to reject ${talent.name}'s application? They will not be able to accept bookings and will be moved to the rejected list.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await rejectTalent(talentId);
          success(`${talent.name}'s application has been rejected.`);
        } catch (err) {
          console.error('Failed to reject talent:', err);
          showError('Failed to reject talent. Please try again.');
        }
      }
    });
  };

  // Handle re-approve talent
  const handleReapproveTalent = async (talentId: string) => {
    const talent = rejectedTalents.find(t => t.id === talentId);
    if (!talent) return;

    setConfirmModal({
      isOpen: true,
      title: 'Re-Approve Talent',
      message: `Re-approve ${talent.name} and allow them to accept bookings? They will be moved back to the active talents list.`,
      variant: 'success',
      onConfirm: async () => {
        try {
          await reapproveTalent(talentId);
          success(`${talent.name} has been re-approved and can now accept bookings!`);
        } catch (err) {
          console.error('Failed to re-approve talent:', err);
          showError('Failed to re-approve talent. Please try again.');
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'talents' as TabType, label: 'Talent Management', icon: Users, badge: stats?.pendingVerifications || 0 },
    { id: 'bookings' as TabType, label: 'Bookings', icon: Video },
    { id: 'moderation' as TabType, label: 'Moderation', icon: Flag, badge: mockFlaggedContent.length },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
            <p className="text-neutral-300 mb-4">{error}</p>
            <Button onClick={refresh}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  // Default stats if data not loaded yet
  const platformStats = stats || {
    totalUsers: 0,
    totalTalents: 0,
    activeTalents: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    avgBookingValue: 0,
    platformFee: 0.10,
    totalPayouts: 0,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-neutral-400">Welcome back, {displayName}</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
            </button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge ? (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-red-500'
                  }`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    8%
                  </span>
                </div>
                <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-neutral-400">Total Users</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    5%
                  </span>
                </div>
                <p className="text-2xl font-bold">{platformStats.activeTalents}</p>
                <p className="text-sm text-neutral-400">Active Talents</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    15%
                  </span>
                </div>
                <p className="text-2xl font-bold">{platformStats.totalBookings.toLocaleString()}</p>
                <p className="text-sm text-neutral-400">Total Bookings</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    {platformStats.revenueGrowth}%
                  </span>
                </div>
                <p className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-neutral-400">Total Revenue</p>
              </div>
            </div>

            {/* Revenue Chart & Quick Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
                <div className="h-64 flex items-end gap-4">
                  {revenueData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(item.revenue / 25000) * 100}%` }}
                      />
                      <p className="text-sm text-neutral-400 mt-2">{item.month}</p>
                      <p className="text-xs text-neutral-500">${(item.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="font-bold mb-2">This Month</h3>
                  <p className="text-3xl font-bold text-gradient-brand">${platformStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-400 mt-2 flex items-center">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {platformStats.revenueGrowth}% vs last month
                  </p>
                </div>

                <div className="bg-neutral-900 rounded-xl p-6">
                  <h3 className="font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Avg. Booking Value</span>
                      <span className="font-semibold">${platformStats.avgBookingValue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Platform Fee</span>
                      <span className="font-semibold">{platformStats.platformFee * 100}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Total Payouts</span>
                      <span className="font-semibold">${platformStats.totalPayouts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Completion Rate</span>
                      <span className="font-semibold text-green-400">
                        {((platformStats.completedBookings / platformStats.totalBookings) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Bookings</h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="bg-black/50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{booking.bookingCode}</p>
                        <p className="text-xs text-neutral-400">{booking.customerName} → {booking.talentName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${booking.amount}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Pending Verifications</h2>
                  <button
                    onClick={() => setActiveTab('talents')}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {pendingTalents.slice(0, 3).map((talent) => (
                    <div key={talent.id} className="bg-black/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{talent.name}</p>
                          <p className="text-xs text-neutral-400">{talent.category}</p>
                        </div>
                        <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">Requested: ${talent.requestedPrice}/video</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talent Management Tab */}
        {activeTab === 'talents' && (
          <div className="space-y-6">
            {/* Pending Verifications Section */}
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowPendingTalents(!showPendingTalents)}
                className="w-full flex items-center justify-between p-6 hover:bg-neutral-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Pending Verifications</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pendingTalents.length > 0
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {pendingTalents.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {showPendingTalents ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>

              {showPendingTalents && (
                <div className="px-6 pb-6">
                  {pendingTalents.length === 0 ? (
                    <div className="bg-black/50 rounded-lg p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-neutral-400">No pending talent verifications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTalents.map((talent) => (
                <div key={talent.id} className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold">
                          {talent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{talent.name}</h3>
                          <p className="text-sm text-neutral-400">{talent.category}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Contact</p>
                          <p className="text-sm">{talent.email}</p>
                          <p className="text-sm text-neutral-400">{talent.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 mb-1">Bio</p>
                          <p className="text-sm text-neutral-400 line-clamp-2">{talent.bio || 'No bio provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {formatDate(talent.appliedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Requested: ${talent.requestedPrice}/video
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => handleApproveTalent(talent.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewModal({ isOpen: true, talent, status: 'pending' })}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review Details
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectTalent(talent.id)}>
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Talents Section */}
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowActiveTalents(!showActiveTalents)}
                className="w-full flex items-center justify-between p-6 hover:bg-neutral-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Active Talents</h2>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    {platformStats.activeTalents}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  {showActiveTalents ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>

              {showActiveTalents && (
                <div className="px-6 pb-6">
                  <ActiveTalentsList key={platformStats.activeTalents} />
                </div>
              )}
            </div>

            {/* Rejected Talents Section */}
            <div className="bg-neutral-900 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowRejectedTalents(!showRejectedTalents)}
                className="w-full flex items-center justify-between p-6 hover:bg-neutral-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Rejected Applications</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    rejectedTalents.length > 0
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {rejectedTalents.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {showRejectedTalents ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>

              {showRejectedTalents && (
                <div className="px-6 pb-6">
                  {rejectedTalents.length === 0 ? (
                    <div className="bg-black/50 rounded-lg p-8 text-center">
                      <p className="text-neutral-400">No rejected talents</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rejectedTalents.map((talent) => (
                        <div key={talent.id} className="bg-black/50 rounded-xl p-6 border border-red-900/30">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                                  {talent.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold">{talent.name}</h3>
                                  <p className="text-sm text-neutral-400">{talent.category}</p>
                                </div>
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  Rejected
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-neutral-500 mb-1">Contact</p>
                                  <p className="text-sm">{talent.email}</p>
                                  <p className="text-sm text-neutral-400">{talent.phone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500 mb-1">Bio</p>
                                  <p className="text-sm text-neutral-400 line-clamp-2">{talent.bio || 'No bio provided'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-neutral-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Applied: {formatDate(talent.appliedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Rejected: {formatDate(talent.rejectedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  Requested: ${talent.requestedPrice}/video
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" onClick={() => handleReapproveTalent(talent.id)}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Re-Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReviewModal({ isOpen: true, talent, status: 'rejected' })}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Bookings ({platformStats.totalBookings})</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                      <th className="pb-3">Booking Code</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Talent</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-neutral-800/50">
                        <td className="py-4 font-mono text-sm">{booking.bookingCode}</td>
                        <td className="py-4">{booking.customerName}</td>
                        <td className="py-4">{booking.talentName}</td>
                        <td className="py-4 font-semibold">${booking.amount}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-neutral-400">{formatDate(booking.createdAt)}</td>
                        <td className="py-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Flagged Content ({mockFlaggedContent.length})</h2>
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {mockFlaggedContent.map((item) => (
                <div key={item.id} className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Flag className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.bookingCode}</h3>
                        <p className="text-sm text-neutral-400">{item.talentName} • Reported by {item.customerName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-neutral-300">
                      <span className="font-semibold text-red-400">Reason: </span>
                      {item.reason}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400">Reported: {formatDate(item.reportedAt)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                      <Button size="sm" variant="outline">
                        <Ban className="w-4 h-4 mr-1" />
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Platform Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">User Growth</h3>
                <div className="h-64 flex items-end gap-4">
                  {revenueData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(item.bookings / 500) * 100}%` }}
                      />
                      <p className="text-sm text-neutral-400 mt-2">{item.month}</p>
                      <p className="text-xs text-neutral-500">{item.bookings}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="font-bold mb-4">Top Performing Categories</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Musicians', bookings: 1245, percentage: 36 },
                    { category: 'Comedians', bookings: 892, percentage: 26 },
                    { category: 'Gospel Artists', bookings: 654, percentage: 19 },
                    { category: 'Sports', bookings: 438, percentage: 13 },
                    { category: 'Influencers', bookings: 192, percentage: 6 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-300">{item.category}</span>
                        <span className="font-medium">{item.bookings} bookings</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Talent Review Modal */}
      {reviewModal.talent && (
        <TalentReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
          talent={reviewModal.talent}
          status={reviewModal.status}
          onApprove={() => handleApproveTalent(reviewModal.talent.id)}
          onReject={() => handleRejectTalent(reviewModal.talent.id)}
          onReapprove={() => handleReapproveTalent(reviewModal.talent.id)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function AdminPanelPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminPanelContent />
    </AuthGuard>
  );
}
