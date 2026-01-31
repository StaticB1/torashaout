'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Video,
  Heart,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Download,
  Play,
  MessageSquare,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Gift,
  Share2,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Currency, BookingStatus } from '@/types';
import { AuthNavbar } from '@/components/AuthNavbar';
import { AuthGuard } from '@/components/AuthGuard';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCustomerDashboard, CustomerBooking, FavoriteTalent } from '@/lib/hooks/useCustomerDashboard';
import { getUnreadCount } from '@/lib/api/notifications.client';
import { useToast } from '@/components/ui/Toast';
import { getMyTalentApplication, TalentApplication } from '@/lib/api/talent-applications';

type TabType = 'overview' | 'bookings' | 'favorites' | 'settings';

function CustomerDashboardContent() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [myApplication, setMyApplication] = useState<TalentApplication | null>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);

  const { user, profile } = useAuth();
  const {
    bookings,
    favorites,
    stats,
    loading,
    error,
    refresh,
    removeFavorite,
    submitReview
  } = useCustomerDashboard();
  const toast = useToast();

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

  // Load customer's talent application
  useEffect(() => {
    const loadApplication = async () => {
      if (user) {
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
      }
    };
    loadApplication();
  }, [user]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Customer';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return currency === 'USD' ? `$${amount.toLocaleString()}` : `ZIG ${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending_payment: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending Payment' },
      payment_confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Payment Confirmed' },
      in_progress: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'In Progress' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Completed' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' },
      refunded: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', label: 'Refunded' },
    };
    return badges[status] || badges.pending_payment;
  };

  const handleRemoveFavorite = async (talentId: string) => {
    try {
      await removeFavorite(talentId);
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings' as TabType, label: 'My Bookings', icon: Video, badge: stats?.pendingBookings },
    { id: 'favorites' as TabType, label: 'Favorites', icon: Heart, badge: stats?.favoriteCount },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  // Show loading state
  if (loading) {
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

  // Get member since date from user creation
  const memberSince = user?.created_at ? formatDate(user.created_at) : 'Recently';

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
                alt={displayName}
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
              <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
              <p className="text-neutral-400">Member since {memberSince}</p>
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
              <Button size="sm">
                <Search className="w-4 h-4 mr-2" />
                Book a Video
              </Button>
            </Link>
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
            {/* Talent Application Status */}
            {myApplication ? (
              <div
                className={`border rounded-xl p-6 ${
                  myApplication.status === 'pending'
                    ? 'bg-yellow-900/20 border-yellow-700/50'
                    : myApplication.status === 'under_review'
                    ? 'bg-blue-900/20 border-blue-700/50'
                    : myApplication.status === 'approved'
                    ? 'bg-green-900/20 border-green-700/50'
                    : myApplication.status === 'rejected'
                    ? 'bg-red-900/20 border-red-700/50'
                    : 'bg-neutral-900/50 border-neutral-700/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      myApplication.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : myApplication.status === 'under_review'
                        ? 'bg-blue-500/20 text-blue-400'
                        : myApplication.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : myApplication.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-neutral-500/20 text-neutral-400'
                    }`}
                  >
                    {myApplication.status === 'pending' && <Clock className="w-6 h-6" />}
                    {myApplication.status === 'under_review' && <AlertCircle className="w-6 h-6" />}
                    {myApplication.status === 'approved' && <CheckCircle className="w-6 h-6" />}
                    {myApplication.status === 'rejected' && <XCircle className="w-6 h-6" />}
                    {!['pending', 'under_review', 'approved', 'rejected'].includes(myApplication.status) && (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {myApplication.status === 'pending' && 'Talent Application Pending'}
                      {myApplication.status === 'under_review' && 'Application Under Review'}
                      {myApplication.status === 'approved' && 'Talent Application Approved!'}
                      {myApplication.status === 'rejected' && 'Application Needs Updates'}
                    </h3>
                    <p className="text-neutral-300 mb-4">
                      {myApplication.status === 'pending' &&
                        'We will review your application and get back to you within 5-7 business days.'}
                      {myApplication.status === 'under_review' &&
                        'Our team is currently reviewing your application. Thank you for your patience!'}
                      {myApplication.status === 'approved' &&
                        'Congratulations! Your application has been approved. Refresh the page to access your talent dashboard.'}
                      {myApplication.status === 'rejected' &&
                        'Please review the feedback below and update your application to resubmit.'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div>
                        <span className="text-neutral-400">Submitted:</span>
                        <span className="ml-2 font-medium">
                          {new Date(myApplication.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {myApplication.reviewed_at && (
                        <div>
                          <span className="text-neutral-400">Last Updated:</span>
                          <span className="ml-2 font-medium">
                            {new Date(myApplication.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-neutral-400">Stage Name:</span>
                        <span className="ml-2 font-medium">{myApplication.stage_name}</span>
                      </div>
                    </div>
                    {myApplication.status === 'rejected' && myApplication.admin_notes && (
                      <div className="bg-black/30 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold mb-1 text-red-300">Feedback from our team:</p>
                        <p className="text-sm text-neutral-300">{myApplication.admin_notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {myApplication.status === 'rejected' && (
                        <Link href="/join">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Update & Resubmit
                          </Button>
                        </Link>
                      )}
                      {myApplication.status === 'approved' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => window.location.reload()}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Access Talent Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : !loadingApplication ? (
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Become a Talent on Torashout</h3>
                    <p className="text-neutral-300 mb-4">
                      Join our platform and start earning by creating personalized video messages for your fans!
                    </p>
                    <Link href="/join">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Star className="w-4 h-4 mr-1" />
                        Apply to Become a Talent
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
                <p className="text-sm text-neutral-400">Total Bookings</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold">{stats?.completedBookings || 0}</p>
                <p className="text-sm text-neutral-400">Completed</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold">{stats?.pendingBookings || 0}</p>
                <p className="text-sm text-neutral-400">Pending</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalSpent || 0)}</p>
                <p className="text-sm text-neutral-400">Total Spent</p>
              </div>
            </div>

            {/* Recent Bookings & Favorites */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
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
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings yet</p>
                    <p className="text-sm">Book your first video from a celebrity!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => {
                      const badge = getStatusBadge(booking.status);
                      const talentImage = booking.talent?.thumbnail_url || booking.talent?.users?.avatar_url;
                      return (
                        <Link key={booking.id} href={`/booking/${booking.booking_code}`} className="block">
                          <div className="bg-black/50 rounded-lg p-4 hover:bg-black/70 transition cursor-pointer">
                            <div className="flex items-start gap-3">
                              {talentImage ? (
                                <Image
                                  src={talentImage}
                                  alt={booking.talent?.display_name || 'Talent'}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                  <User className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-semibold">{booking.talent?.display_name || 'Unknown Talent'}</p>
                                <p className="text-sm text-neutral-400">For: {booking.recipient_name}</p>
                                <p className="text-xs text-neutral-500 mt-1">{booking.booking_code}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>
                                  {badge.label}
                                </span>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Favorite Talents */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Favorite Talents</h2>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {favorites.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No favorites yet</p>
                    <p className="text-sm">Browse and save your favorite talents</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.slice(0, 3).map((fav) => {
                      const talentImage = fav.talent?.thumbnail_url || fav.talent?.users?.avatar_url;
                      return (
                        <Link
                          key={fav.talent.id}
                          href={`/talent/${fav.talent.id}`}
                          className="bg-black/50 rounded-lg p-4 flex items-center gap-3 hover:bg-black/70 transition"
                        >
                          {talentImage ? (
                            <Image
                              src={talentImage}
                              alt={fav.talent.display_name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">{fav.talent.display_name}</p>
                            <p className="text-sm text-neutral-400 capitalize">{fav.talent.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(fav.talent.price_usd)}</p>
                            <div className="flex items-center gap-1 text-xs text-neutral-400">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {fav.talent.average_rating?.toFixed(1) || '0.0'}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/browse" className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition cursor-pointer block">
                  <Search className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="font-semibold">Book a Video</p>
                  <p className="text-sm text-neutral-400">Find your favorite celebrity</p>
                </Link>
                <div className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition cursor-pointer">
                  <Gift className="w-8 h-8 text-pink-400 mb-2" />
                  <p className="font-semibold">Send as Gift</p>
                  <p className="text-sm text-neutral-400">Gift a personalized video</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition cursor-pointer">
                  <Share2 className="w-8 h-8 text-green-400 mb-2" />
                  <p className="font-semibold">Refer & Earn</p>
                  <p className="text-sm text-neutral-400">Get $10 for each referral</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filterStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filterStatus === 'in_progress'
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('payment_confirmed')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  filterStatus === 'payment_confirmed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                Awaiting Video
              </button>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-8 text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                <p className="text-neutral-400 mb-4">
                  {filterStatus === 'all'
                    ? "You haven't made any bookings yet."
                    : `No ${filterStatus.replace('_', ' ')} bookings found.`}
                </p>
                <Link href="/browse">
                  <Button>Browse Talents</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const badge = getStatusBadge(booking.status);
                  const talentImage = booking.talent?.thumbnail_url || booking.talent?.users?.avatar_url;
                  return (
                    <div key={booking.id} className="bg-neutral-900 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {talentImage ? (
                            <Image
                              src={talentImage}
                              alt={booking.talent?.display_name || 'Talent'}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">{booking.talent?.display_name || 'Unknown Talent'}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-400 mb-1">
                              For: {booking.recipient_name} • {booking.occasion || 'General'}
                            </p>
                            <p className="text-xs text-neutral-500 mb-3">{booking.booking_code}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Ordered: {formatDate(booking.created_at)}
                              </span>
                              {booking.completed_at && (
                                <span className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  Completed: {formatDate(booking.completed_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <p className="text-xl font-bold">{formatCurrency(booking.amount_paid)}</p>
                          <Link href={`/booking/${booking.booking_code}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          {booking.status === 'completed' && booking.video_url && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <Button size="sm">
                                <Play className="w-4 h-4 mr-1" />
                                Watch
                              </Button>
                            </div>
                          )}
                          {booking.status === 'completed' && !booking.customer_rating && (
                            <Button size="sm" variant="outline">
                              <Star className="w-4 h-4 mr-1" />
                              Leave Review
                            </Button>
                          )}
                          {booking.customer_rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(booking.customer_rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {favorites.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-8 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                <p className="text-neutral-400 mb-4">Browse and save your favorite talents to book them later.</p>
                <Link href="/browse">
                  <Button>Browse Talents</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => {
                  const talentImage = fav.talent?.thumbnail_url || fav.talent?.users?.avatar_url;
                  return (
                    <div key={fav.talent.id} className="bg-neutral-900 rounded-xl overflow-hidden group">
                      <div className="relative h-48">
                        {talentImage ? (
                          <Image
                            src={talentImage}
                            alt={fav.talent.display_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <User className="w-16 h-16" />
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveFavorite(fav.talent.id)}
                          className="absolute top-3 right-3 w-10 h-10 bg-black/70 hover:bg-pink-600 rounded-full flex items-center justify-center transition"
                        >
                          <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{fav.talent.display_name}</h3>
                        <p className="text-sm text-neutral-400 mb-3 capitalize">{fav.talent.category}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{fav.talent.average_rating?.toFixed(1) || '0.0'}</span>
                          </div>
                          <span className="text-sm text-neutral-400">{fav.talent.response_time_hours}h response</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold">{formatCurrency(fav.talent.price_usd)}</span>
                          <Link href={`/talent/${fav.talent.id}`}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+263 77 XXX XXXX"
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Currency Preference */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Currency Preference</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ZIG">ZIG (ZIG)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => toast.success('Settings saved!')}>Save Changes</Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <AuthGuard requiredRole="fan">
      <CustomerDashboardContent />
    </AuthGuard>
  );
}
