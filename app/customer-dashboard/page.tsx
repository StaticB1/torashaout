'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Eye
} from 'lucide-react';
import { Currency, BookingStatus } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

// Mock data for customer dashboard
const mockCustomerProfile = {
  id: '1',
  name: 'Tendai Moyo',
  email: 'tendai.moyo@example.com',
  avatarUrl: '/images/customer-avatar.jpg',
  totalBookings: 8,
  completedBookings: 5,
  pendingBookings: 3,
  totalSpent: 425,
  memberSince: '2025-06-15',
  favoriteCount: 12,
};

const mockBookings = [
  {
    id: '1',
    bookingCode: 'TS-2026-0127',
    talentName: 'Winky D',
    talentAvatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    recipientName: 'Sarah',
    occasion: 'Birthday',
    status: 'in_progress' as BookingStatus,
    amountUSD: 50,
    orderedAt: '2026-01-16T10:30:00Z',
    dueDate: '2026-01-18T10:30:00Z',
    videoUrl: null,
  },
  {
    id: '2',
    bookingCode: 'TS-2026-0115',
    talentName: 'Comic Pastor',
    talentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    recipientName: 'My Team',
    occasion: 'Motivation',
    status: 'completed' as BookingStatus,
    amountUSD: 35,
    orderedAt: '2026-01-10T14:20:00Z',
    completedAt: '2026-01-12T09:15:00Z',
    videoUrl: '/videos/sample.mp4',
    rating: 5,
    review: 'Absolutely amazing! The team loved it!',
  },
  {
    id: '3',
    bookingCode: 'TS-2026-0108',
    talentName: 'Janet Manyowa',
    talentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    recipientName: 'Mom',
    occasion: "Mother's Day",
    status: 'completed' as BookingStatus,
    amountUSD: 40,
    orderedAt: '2026-01-05T08:00:00Z',
    completedAt: '2026-01-07T16:30:00Z',
    videoUrl: '/videos/sample2.mp4',
    rating: 5,
    review: null,
  },
  {
    id: '4',
    bookingCode: 'TS-2026-0120',
    talentName: 'Stunner',
    talentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    recipientName: 'David',
    occasion: 'Graduation',
    status: 'payment_confirmed' as BookingStatus,
    amountUSD: 45,
    orderedAt: '2026-01-15T12:00:00Z',
    dueDate: '2026-01-17T12:00:00Z',
    videoUrl: null,
  },
];

const mockFavoriteTalents = [
  {
    id: '1',
    name: 'Winky D',
    category: 'Musician',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
    priceUSD: 50,
    rating: 4.9,
    responseTime: 48,
  },
  {
    id: '2',
    name: 'Comic Pastor',
    category: 'Comedian',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    priceUSD: 35,
    rating: 4.8,
    responseTime: 24,
  },
  {
    id: '3',
    name: 'Janet Manyowa',
    category: 'Gospel Artist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    priceUSD: 40,
    rating: 5.0,
    responseTime: 72,
  },
  {
    id: '5',
    name: 'Tendai Mtawarira',
    category: 'Sports',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
    priceUSD: 60,
    rating: 4.9,
    responseTime: 48,
  },
];

type TabType = 'overview' | 'bookings' | 'favorites' | 'settings';

export default function CustomerDashboardPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    const badges = {
      pending_payment: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending Payment' },
      payment_confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Payment Confirmed' },
      in_progress: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'In Progress' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Completed' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' },
      refunded: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', label: 'Refunded' },
    };
    return badges[status] || badges.pending_payment;
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings' as TabType, label: 'My Bookings', icon: Video, badge: mockCustomerProfile.pendingBookings },
    { id: 'favorites' as TabType, label: 'Favorites', icon: Heart, badge: mockCustomerProfile.favoriteCount },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const filteredBookings = filterStatus === 'all'
    ? mockBookings
    : mockBookings.filter(b => b.status === filterStatus);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {mockCustomerProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{mockCustomerProfile.name}</h1>
              <p className="text-neutral-400">Member since {formatDate(mockCustomerProfile.memberSince)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center">2</span>
            </button>
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
                {tab.badge ? (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-pink-500'
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
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold">{mockCustomerProfile.totalBookings}</p>
                <p className="text-sm text-neutral-400">Total Bookings</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold">{mockCustomerProfile.completedBookings}</p>
                <p className="text-sm text-neutral-400">Completed</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold">{mockCustomerProfile.pendingBookings}</p>
                <p className="text-sm text-neutral-400">Pending</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-2xl font-bold">${mockCustomerProfile.totalSpent}</p>
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
                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => {
                    const badge = getStatusBadge(booking.status);
                    return (
                      <div key={booking.id} className="bg-black/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={booking.talentAvatar}
                            alt={booking.talentName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{booking.talentName}</p>
                            <p className="text-sm text-neutral-400">For: {booking.recipientName}</p>
                            <p className="text-xs text-neutral-500 mt-1">{booking.bookingCode}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <div className="space-y-4">
                  {mockFavoriteTalents.slice(0, 3).map((talent) => (
                    <Link
                      key={talent.id}
                      href={`/talent/${talent.id}`}
                      className="bg-black/50 rounded-lg p-4 flex items-center gap-3 hover:bg-black/70 transition"
                    >
                      <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{talent.name}</p>
                        <p className="text-sm text-neutral-400">{talent.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${talent.priceUSD}</p>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {talent.rating}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/browse">
                  <div className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition cursor-pointer">
                    <Search className="w-8 h-8 text-purple-400 mb-2" />
                    <p className="font-semibold">Book a Video</p>
                    <p className="text-sm text-neutral-400">Find your favorite celebrity</p>
                  </div>
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
                All ({mockBookings.length})
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
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const badge = getStatusBadge(booking.status);
                return (
                  <div key={booking.id} className="bg-neutral-900 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={booking.talentAvatar}
                          alt={booking.talentName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">{booking.talentName}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-400 mb-1">
                            For: {booking.recipientName} • {booking.occasion}
                          </p>
                          <p className="text-xs text-neutral-500 mb-3">{booking.bookingCode}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Ordered: {formatDate(booking.orderedAt)}
                            </span>
                            {booking.completedAt && (
                              <span className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                Completed: {formatDate(booking.completedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <p className="text-xl font-bold">${booking.amountUSD}</p>
                        {booking.status === 'completed' && booking.videoUrl && (
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
                        {booking.status === 'completed' && !booking.rating && (
                          <Button size="sm" variant="outline">
                            <Star className="w-4 h-4 mr-1" />
                            Leave Review
                          </Button>
                        )}
                        {booking.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(booking.rating)].map((_, i) => (
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
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavoriteTalents.map((talent) => (
                <div key={talent.id} className="bg-neutral-900 rounded-xl overflow-hidden group">
                  <div className="relative">
                    <img
                      src={talent.avatar}
                      alt={talent.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 w-10 h-10 bg-black/70 hover:bg-pink-600 rounded-full flex items-center justify-center transition">
                      <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{talent.name}</h3>
                    <p className="text-sm text-neutral-400 mb-3">{talent.category}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{talent.rating}</span>
                      </div>
                      <span className="text-sm text-neutral-400">{talent.responseTime}h response</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">${talent.priceUSD}</span>
                      <Link href={`/talent/${talent.id}`}>
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Tendai"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Moyo"
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={mockCustomerProfile.email}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
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
                  <select className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="USD">USD ($)</option>
                    <option value="ZIG">ZIG (ZIG)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: 'Order updates', description: 'Get notified when your video is ready', enabled: true },
                  { label: 'Promotions', description: 'Receive special offers and discounts', enabled: true },
                  { label: 'New talents', description: 'Be the first to know about new celebrities', enabled: false },
                  { label: 'Reminders', description: 'Get reminded about special occasions', enabled: true },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                    <div>
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-neutral-400">{setting.description}</p>
                    </div>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-purple-500' : 'bg-neutral-700'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${setting.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
