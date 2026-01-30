'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Video,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Settings,
  Bell,
  Download,
  Play,
  Upload,
  MessageSquare,
  ChevronRight,
  BarChart3,
  Wallet,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { Currency, BookingStatus } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { AuthGuard } from '@/components/AuthGuard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTalentProfile, BookingRequest } from '@/lib/hooks/useTalentProfile';
import { useCustomerBookings, CustomerBooking } from '@/lib/hooks/useCustomerBookings';
import { getUnreadCount } from '@/lib/api/notifications.client';
import { useToast } from '@/components/ui/Toast';
import { getMyTalentApplication, TalentApplication } from '@/lib/api/talent-applications';

type TabType = 'overview' | 'requests' | 'my-orders' | 'earnings' | 'settings';

function DashboardContent() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [savingSettings, setSavingSettings] = useState(false);

  // Form state for settings
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [responseTime, setResponseTime] = useState(48);
  const [priceUSD, setPriceUSD] = useState(0);

  // Customer application state
  const [myApplication, setMyApplication] = useState<TalentApplication | null>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);

  const { user, profile } = useAuth();
  const {
    talentProfile,
    stats,
    pendingBookings,
    completedBookings,
    loading,
    error,
    refresh,
    updateProfile,
    toggleAcceptingBookings
  } = useTalentProfile();
  const {
    bookings: customerBookings,
    pendingBookings: customerPendingBookings,
    completedBookings: customerCompletedBookings,
    loading: loadingCustomerBookings,
    error: customerBookingsError,
    refresh: refreshCustomerBookings,
    stats: customerStats,
  } = useCustomerBookings();
  const toast = useToast();

  // Determine if user is a talent or customer
  const isTalent = profile?.role === 'talent' || profile?.role === 'admin';

  // Debug logging
  useEffect(() => {
    console.log('[Dashboard] User role:', profile?.role, 'isTalent:', isTalent);
    console.log('[Dashboard] Customer bookings:', customerBookings?.length || 0);
  }, [profile?.role, isTalent, customerBookings]);

  // Initialize form state when talentProfile loads
  useEffect(() => {
    if (talentProfile) {
      setDisplayName(talentProfile.display_name || '');
      setBio(talentProfile.bio || '');
      setCategory(talentProfile.category || '');
      setResponseTime(talentProfile.response_time_hours || 48);
      setPriceUSD(talentProfile.price_usd || 0);
    }
  }, [talentProfile]);

  // Load notification count
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadNotifications(count);
      } catch (err) {
        console.error('Error loading notifications:', err);
      }
    };
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Load customer's talent application if they're a fan
  useEffect(() => {
    const loadApplication = async () => {
      if (!isTalent && user) {
        setLoadingApplication(true);
        try {
          const result = await getMyTalentApplication();
          if (result.success) {
            setMyApplication(result.data || null);
          }
        } catch (err) {
          console.error('Error loading application:', err);
        } finally {
          setLoadingApplication(false);
        }
      } else {
        setLoadingApplication(false);
      }
    };
    loadApplication();
  }, [user, isTalent]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayNameHeader = talentProfile?.display_name || profile?.full_name || user?.email?.split('@')[0] || 'Talent';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (dueDate: string | null) => {
    if (!dueDate) return 'No deadline';
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) return 'Overdue';
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  };

  const formatCurrency = (amount: number) => {
    return currency === 'USD' ? `$${amount.toLocaleString()}` : `ZIG ${amount.toLocaleString()}`;
  };

  const handleToggleBookings = async () => {
    try {
      await toggleAcceptingBookings();
      toast.success(talentProfile?.is_accepting_bookings ? 'Bookings paused' : 'Now accepting bookings');
    } catch (err) {
      toast.error('Failed to update booking status');
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateProfile({
        display_name: displayName,
        bio: bio,
        category: category as any,
        response_time_hours: responseTime,
        price_usd: priceUSD,
      });
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'requests' as TabType, label: 'Requests', icon: Video, badge: stats?.pendingRequests },
    { id: 'my-orders' as TabType, label: 'My Orders', icon: Star },
    { id: 'earnings' as TabType, label: 'Earnings', icon: Wallet },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  // Show loading state
  if (loading || (loadingApplication && !isTalent) || (!isTalent && loadingCustomerBookings)) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="w-48 h-8 mb-2" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
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
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to load dashboard</h2>
            <p className="text-neutral-400 mb-4">{error}</p>
            <Button onClick={refresh}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get reviews from completed bookings
  const recentReviews = completedBookings
    .filter(b => b.customer_review)
    .slice(0, 3);

  // Customer Dashboard View (for fans)
  if (!isTalent) {
    const getApplicationStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-900/20 border-yellow-700/50 text-yellow-400';
        case 'under_review':
          return 'bg-blue-900/20 border-blue-700/50 text-blue-400';
        case 'approved':
          return 'bg-green-900/20 border-green-700/50 text-green-400';
        case 'rejected':
          return 'bg-red-900/20 border-red-700/50 text-red-400';
        default:
          return 'bg-neutral-900/50 border-neutral-700/50 text-neutral-400';
      }
    };

    const getApplicationStatusIcon = (status: string) => {
      switch (status) {
        case 'pending':
          return <Clock className="w-6 h-6" />;
        case 'under_review':
          return <AlertCircle className="w-6 h-6" />;
        case 'approved':
          return <CheckCircle className="w-6 h-6" />;
        case 'rejected':
          return <XCircle className="w-6 h-6" />;
        default:
          return <AlertCircle className="w-6 h-6" />;
      }
    };

    const getApplicationStatusText = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Your application is pending review';
        case 'under_review':
          return 'Your application is under review';
        case 'approved':
          return 'Your application has been approved!';
        case 'rejected':
          return 'Your application was not approved';
        case 'onboarding':
          return 'Your application is being processed';
        default:
          return 'Application status unknown';
      }
    };

    const getBookingStatusColor = (status: string) => {
      switch (status) {
        case 'pending_payment':
          return 'bg-yellow-500/20 text-yellow-400';
        case 'payment_confirmed':
          return 'bg-blue-500/20 text-blue-400';
        case 'in_progress':
          return 'bg-purple-500/20 text-purple-400';
        case 'completed':
        case 'delivered':
          return 'bg-green-500/20 text-green-400';
        case 'cancelled':
        case 'refunded':
          return 'bg-red-500/20 text-red-400';
        default:
          return 'bg-neutral-500/20 text-neutral-400';
      }
    };

    const getBookingStatusText = (status: string) => {
      switch (status) {
        case 'pending_payment':
          return 'Awaiting Payment';
        case 'payment_confirmed':
          return 'Confirmed';
        case 'in_progress':
          return 'In Progress';
        case 'completed':
          return 'Completed';
        case 'delivered':
          return 'Delivered';
        case 'cancelled':
          return 'Cancelled';
        case 'refunded':
          return 'Refunded';
        default:
          return status;
      }
    };

    const getTimeRemaining = (dueDate: string | null) => {
      if (!dueDate) return null;
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 0) return 'Overdue';
      if (hours < 24) return `${hours}h remaining`;
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    };

    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

        <div className="container mx-auto px-4 py-8 pt-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {getInitials(profile?.full_name)}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{profile?.full_name || 'My Dashboard'}</h1>
                <p className="text-neutral-400">Manage your orders and account</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/notifications" className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
              <Link href="/browse">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Star className="w-4 h-4 mr-2" />
                  Book a Talent
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{customerStats.totalOrders}</p>
              <p className="text-sm text-neutral-400">Total Orders</p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{customerStats.pendingOrders}</p>
              <p className="text-sm text-neutral-400">Pending</p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{customerStats.completedOrders}</p>
              <p className="text-sm text-neutral-400">Completed</p>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-pink-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(customerStats.totalSpent)}</p>
              <p className="text-sm text-neutral-400">Total Spent</p>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-neutral-900 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Orders</h2>
              {customerPendingBookings.length > 0 && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  {customerPendingBookings.length} in progress
                </span>
              )}
            </div>

            {customerPendingBookings.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold mb-2">No active orders</h3>
                <p className="text-neutral-400 mb-6">Browse our amazing talent and book your first video!</p>
                <Link href="/browse">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Star className="w-4 h-4 mr-2" />
                    Discover Talent
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerPendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-black/50 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {booking.talent?.thumbnail_url ? (
                          <Image
                            src={booking.talent.thumbnail_url}
                            alt={booking.talent.display_name}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-xl font-bold">
                            {booking.talent?.display_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{booking.talent?.display_name || 'Unknown Talent'}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getBookingStatusColor(booking.status)}`}>
                              {getBookingStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-400 mb-1">
                            For: {booking.recipient_name} • {booking.occasion}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Booking #{booking.booking_code}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-semibold text-purple-400">
                          {currency === 'USD' ? `$${booking.amount_paid}` : `ZIG ${booking.amount_paid}`}
                        </p>
                        {booking.due_date && (
                          <p className="text-sm text-neutral-400">
                            {getTimeRemaining(booking.due_date)}
                          </p>
                        )}
                        <Link href={`/booking/${booking.booking_code}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order History */}
          {customerCompletedBookings.length > 0 && (
            <div className="bg-neutral-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Order History</h2>
              <div className="space-y-4">
                {customerCompletedBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between bg-black/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {booking.talent?.thumbnail_url ? (
                        <Image
                          src={booking.talent.thumbnail_url}
                          alt={booking.talent.display_name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-lg font-bold">
                          {booking.talent?.display_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{booking.talent?.display_name || 'Unknown Talent'}</h3>
                        <p className="text-sm text-neutral-400">
                          For: {booking.recipient_name} • {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getBookingStatusColor(booking.status)}`}>
                        {getBookingStatusText(booking.status)}
                      </span>
                      {booking.video_url ? (
                        <Link href={`/booking/${booking.booking_code}`}>
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            Watch
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/booking/${booking.booking_code}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Talent Application Section */}
          <div className="bg-neutral-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Become a Talent</h2>
            {myApplication ? (
              <div className={`border rounded-xl p-4 ${getApplicationStatusColor(myApplication.status)}`}>
                <div className="flex items-start gap-4">
                  {getApplicationStatusIcon(myApplication.status)}
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{getApplicationStatusText(myApplication.status)}</h3>
                    <p className="text-sm mb-2">
                      Submitted as &quot;{myApplication.stage_name}&quot; on {new Date(myApplication.created_at).toLocaleDateString()}
                    </p>
                    {myApplication.status === 'approved' && (
                      <Button
                        onClick={() => window.location.reload()}
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Access Talent Dashboard
                      </Button>
                    )}
                    {myApplication.status === 'rejected' && (
                      <Link href="/join">
                        <Button size="sm" variant="outline" className="mt-2">
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Update & Resubmit
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Share Your Talent</h3>
                <p className="text-neutral-400 mb-4 max-w-md mx-auto">
                  Join our platform and start earning by creating personalized video messages for your fans!
                </p>
                <Link href="/join">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Star className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Talent Dashboard View (existing code)
  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {talentProfile?.thumbnail_url || profile?.avatar_url ? (
              <Image
                src={talentProfile?.thumbnail_url || profile?.avatar_url || ''}
                alt={displayNameHeader}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {getInitials(talentProfile?.display_name || profile?.full_name)}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{displayNameHeader}</h1>
              <p className="text-neutral-400">
                {talentProfile?.category || 'Talent'} • {formatCurrency(talentProfile?.price_usd || 0)}/video
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 bg-neutral-900 rounded-lg px-4 py-2">
              <span className="text-sm text-neutral-400">Accepting Bookings</span>
              <button
                onClick={handleToggleBookings}
                className={`relative w-12 h-6 rounded-full transition-colors ${talentProfile?.is_accepting_bookings ? 'bg-green-500' : 'bg-neutral-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${talentProfile?.is_accepting_bookings ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
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
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-pink-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(stats?.monthlyEarnings || 0)}</p>
                <p className="text-sm text-neutral-400">This Month</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.completedThisMonth || 0}</p>
                <p className="text-sm text-neutral-400">Videos This Month</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-pink-400" />
                  </div>
                  {(stats?.pendingRequests || 0) > 0 && (
                    <span className="text-pink-400 text-sm font-medium">
                      Action needed
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold">{stats?.pendingRequests || 0}</p>
                <p className="text-sm text-neutral-400">Pending Requests</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{talentProfile?.average_rating?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-neutral-400">Average Rating</p>
              </div>
            </div>

            {/* Quick Actions & Pending Requests */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pending Requests */}
              <div className="lg:col-span-2 bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Pending Requests</h2>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending requests</p>
                    <p className="text-sm">New bookings will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.slice(0, 3).map((request) => (
                      <div key={request.id} className="bg-black/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">For: {request.recipient_name}</p>
                            <p className="text-sm text-neutral-400">{request.occasion || 'General'} • {request.booking_code}</p>
                          </div>
                          <span className="text-sm text-pink-400 font-medium">
                            {getTimeRemaining(request.due_date)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300 mb-3 line-clamp-2">{request.instructions || 'No specific instructions'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-semibold">{formatCurrency(request.amount_paid)}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Decline
                            </Button>
                            <Button size="sm" className="text-xs">
                              <Upload className="w-3 h-3 mr-1" />
                              Record
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-neutral-900 rounded-xl p-6">
                  <h3 className="font-bold mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Total Bookings</span>
                        <span className="font-medium">{talentProfile?.total_bookings || 0}</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((talentProfile?.total_bookings || 0) * 2, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Conversion Rate</span>
                        <span className="font-medium">{stats?.conversionRate || 0}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min((stats?.conversionRate || 0) * 5, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Response Time</span>
                        <span className="font-medium">{talentProfile?.response_time_hours || 48}h</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.max(100 - (talentProfile?.response_time_hours || 48), 10)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="font-bold mb-2">Total Earnings</h3>
                  <p className="text-3xl font-bold text-gradient-brand">{formatCurrency(stats?.totalEarnings || 0)}</p>
                  <p className="text-sm text-neutral-400 mt-1">From {talentProfile?.total_bookings || 0} videos</p>
                  <Button className="w-full mt-4" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Request Payout
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Recent Reviews</h2>
              {recentReviews.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Complete bookings to receive reviews</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {recentReviews.map((request) => (
                    <div key={request.id} className="bg-black/50 rounded-lg p-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(request.customer_rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">"{request.customer_review}"</p>
                      <p className="text-xs text-neutral-500">
                        {request.recipient_name} • {request.occasion || 'General'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-neutral-800 pb-4">
              <button className="text-purple-400 font-medium border-b-2 border-purple-400 pb-2">
                Pending ({pendingBookings.length})
              </button>
              <button className="text-neutral-400 hover:text-white pb-2">
                Completed ({completedBookings.length})
              </button>
            </div>

            {/* Pending Requests List */}
            {pendingBookings.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-8 text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold mb-2">No pending requests</h3>
                <p className="text-neutral-400">When customers book videos, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((request) => (
                  <div key={request.id} className="bg-neutral-900 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-neutral-500">{request.booking_code}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            getTimeRemaining(request.due_date).includes('Overdue')
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {getTimeRemaining(request.due_date)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                          Video for {request.recipient_name}
                        </h3>
                        <p className="text-sm text-neutral-400 mb-3">
                          {request.occasion || 'General'} • Requested by {request.customer?.full_name || request.customer?.email}
                        </p>
                        <div className="bg-black/50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-neutral-300">
                            <span className="font-semibold text-purple-400">Instructions: </span>
                            {request.instructions || 'No specific instructions provided'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Requested: {formatDate(request.created_at)}
                          </span>
                          {request.due_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Due: {formatDate(request.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(request.amount_paid)}</p>
                        <p className="text-sm text-neutral-400">You earn: {formatCurrency(request.talent_earnings)}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                          <Button size="sm">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Requests */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Recently Completed</h2>
              {completedBookings.length === 0 ? (
                <div className="bg-neutral-900 rounded-xl p-6 text-center text-neutral-400">
                  <p>No completed bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedBookings.slice(0, 5).map((request) => (
                    <div key={request.id} className="bg-neutral-900 rounded-xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.recipient_name}</h3>
                          <p className="text-sm text-neutral-400">{request.occasion || 'General'} • {request.booking_code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {request.customer_rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(request.customer_rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        )}
                        <span className="text-green-400 font-semibold">{formatCurrency(request.talent_earnings)}</span>
                        {request.video_url && (
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Orders Tab - Bookings where talent is the customer */}
        {activeTab === 'my-orders' && (
          <div className="space-y-6">
            {/* Stats for My Orders */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{customerStats?.totalOrders ?? 0}</p>
                <p className="text-sm text-neutral-400">Total Orders</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{customerStats?.pendingOrders ?? 0}</p>
                <p className="text-sm text-neutral-400">Pending</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{customerStats?.completedOrders ?? 0}</p>
                <p className="text-sm text-neutral-400">Completed</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(customerStats?.totalSpent ?? 0)}</p>
                <p className="text-sm text-neutral-400">Total Spent</p>
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Active Orders</h2>
                {(customerPendingBookings?.length ?? 0) > 0 && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    {customerPendingBookings?.length ?? 0} in progress
                  </span>
                )}
              </div>

              {loadingCustomerBookings ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                </div>
              ) : (customerPendingBookings?.length ?? 0) === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                  <h3 className="text-xl font-bold mb-2">No active orders</h3>
                  <p className="text-neutral-400 mb-6">Book personalized videos from other amazing talents!</p>
                  <Link href="/browse">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Star className="w-4 h-4 mr-2" />
                      Discover Talent
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(customerPendingBookings ?? []).map((booking) => (
                    <div key={booking.id} className="bg-black/50 rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {booking.talent?.thumbnail_url ? (
                            <Image
                              src={booking.talent.thumbnail_url}
                              alt={booking.talent.display_name}
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-xl font-bold">
                              {booking.talent?.display_name?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{booking.talent?.display_name || 'Unknown Talent'}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                booking.status === 'pending_payment' ? 'bg-yellow-500/20 text-yellow-400' :
                                booking.status === 'payment_confirmed' ? 'bg-blue-500/20 text-blue-400' :
                                booking.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-neutral-500/20 text-neutral-400'
                              }`}>
                                {booking.status === 'pending_payment' ? 'Awaiting Payment' :
                                 booking.status === 'payment_confirmed' ? 'Confirmed' :
                                 booking.status === 'in_progress' ? 'In Progress' : booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-400 mb-1">
                              For: {booking.recipient_name} • {booking.occasion}
                            </p>
                            <p className="text-xs text-neutral-500">
                              Booking #{booking.booking_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold text-purple-400">
                            {currency === 'USD' ? `$${booking.amount_paid}` : `ZIG ${booking.amount_paid}`}
                          </p>
                          {booking.due_date && (
                            <p className="text-sm text-neutral-400">
                              {getTimeRemaining(booking.due_date)}
                            </p>
                          )}
                          <Link href={`/booking/${booking.booking_code}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            {(customerCompletedBookings?.length ?? 0) > 0 && (
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Order History</h2>
                <div className="space-y-4">
                  {(customerCompletedBookings ?? []).slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between bg-black/50 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {booking.talent?.thumbnail_url ? (
                          <Image
                            src={booking.talent.thumbnail_url}
                            alt={booking.talent.display_name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-lg font-bold">
                            {booking.talent?.display_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{booking.talent?.display_name || 'Unknown Talent'}</h3>
                          <p className="text-sm text-neutral-400">
                            For: {booking.recipient_name} • {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          booking.status === 'completed' || booking.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : booking.status === 'cancelled' || booking.status === 'refunded'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-neutral-500/20 text-neutral-400'
                        }`}>
                          {booking.status === 'completed' ? 'Completed' :
                           booking.status === 'delivered' ? 'Delivered' :
                           booking.status === 'cancelled' ? 'Cancelled' :
                           booking.status === 'refunded' ? 'Refunded' : booking.status}
                        </span>
                        {booking.video_url ? (
                          <Link href={`/booking/${booking.booking_code}`}>
                            <Button variant="outline" size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              Watch
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/booking/${booking.booking_code}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA to book more */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Discover More Talent</h3>
              <p className="text-neutral-400 mb-4">Book personalized videos from musicians, comedians, athletes, and more!</p>
              <Link href="/browse">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Star className="w-4 h-4 mr-2" />
                  Browse Talent
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
                <p className="text-neutral-400 mb-2">Total Earnings</p>
                <p className="text-4xl font-bold">{formatCurrency(stats?.totalEarnings || 0)}</p>
                <p className="text-sm text-neutral-400 mt-2">From {talentProfile?.total_bookings || 0} completed videos</p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <p className="text-neutral-400 mb-2">This Month</p>
                <p className="text-4xl font-bold text-green-400">{formatCurrency(stats?.monthlyEarnings || 0)}</p>
                <p className="text-sm text-neutral-400 mt-2">
                  {stats?.completedThisMonth || 0} videos completed
                </p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <p className="text-neutral-400 mb-2">Available for Payout</p>
                <p className="text-4xl font-bold">{formatCurrency(stats?.totalEarnings || 0)}</p>
                <Button className="mt-4 w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>

            {/* Recent Earnings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Recent Earnings</h2>
              {completedBookings.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No earnings yet</p>
                  <p className="text-sm">Complete bookings to start earning</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Booking</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Your Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedBookings.slice(0, 10).map((booking) => (
                        <tr key={booking.id} className="border-b border-neutral-800/50">
                          <td className="py-4">{formatDate(booking.completed_at || booking.created_at)}</td>
                          <td className="py-4">{booking.booking_code}</td>
                          <td className="py-4">{booking.customer?.full_name || booking.customer?.email}</td>
                          <td className="py-4">{formatCurrency(booking.amount_paid)}</td>
                          <td className="py-4 font-semibold text-green-400">{formatCurrency(booking.talent_earnings)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            {/* Profile Settings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your fans about yourself..."
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="musician">Musician</option>
                      <option value="comedian">Comedian</option>
                      <option value="gospel">Gospel Artist</option>
                      <option value="sports">Sports Personality</option>
                      <option value="influencer">Influencer</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Response Time</label>
                    <select
                      value={responseTime}
                      onChange={(e) => setResponseTime(parseInt(e.target.value))}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={24}>24 hours</option>
                      <option value={48}>48 hours</option>
                      <option value={72}>72 hours</option>
                      <option value={168}>1 week</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price per Video (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                    <input
                      type="number"
                      value={priceUSD}
                      onChange={(e) => setPriceUSD(parseInt(e.target.value) || 0)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">You will earn ${Math.round(priceUSD * 0.75)} per video (75%)</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                  <p className="text-sm text-neutral-300">
                    <strong>Tip:</strong> Based on your category, similar talent price their videos between $50-$150. Higher prices may reduce bookings but increase earnings per video.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                if (talentProfile) {
                  setDisplayName(talentProfile.display_name || '');
                  setBio(talentProfile.bio || '');
                  setCategory(talentProfile.category || '');
                  setResponseTime(talentProfile.response_time_hours || 48);
                  setPriceUSD(talentProfile.price_usd || 0);
                }
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings} disabled={savingSettings}>
                {savingSettings ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
