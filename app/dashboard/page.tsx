'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  ArrowDownRight
} from 'lucide-react';
import { Currency, BookingStatus } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

// Mock data for the dashboard
const mockTalentProfile = {
  id: '1',
  displayName: 'Jah Prayzah',
  avatarUrl: '/images/talent/jah-prayzah.jpg',
  category: 'Musician',
  priceUSD: 75,
  isAcceptingBookings: true,
  responseTimeHours: 48,
  totalBookings: 156,
  averageRating: 4.9,
  pendingRequests: 5,
  completedThisMonth: 23,
  totalEarningsUSD: 8750,
  monthlyEarningsUSD: 1725,
  profileViews: 3420,
  conversionRate: 12.5,
};

const mockPendingRequests = [
  {
    id: '1',
    bookingCode: 'TS-2026-0124',
    customerName: 'Tendai M.',
    recipientName: 'Sarah',
    occasion: 'Birthday',
    instructions: 'Please wish Sarah a happy 25th birthday! She\'s your biggest fan and loves Mukwasha. Can you sing a few lines?',
    amountUSD: 75,
    createdAt: '2026-01-16T10:30:00Z',
    dueDate: '2026-01-18T10:30:00Z',
    status: 'payment_confirmed' as BookingStatus,
  },
  {
    id: '2',
    bookingCode: 'TS-2026-0125',
    customerName: 'Michael K.',
    recipientName: 'Team Zimbabwe',
    occasion: 'Motivation',
    instructions: 'A motivational message for our office team. We\'re launching a new project and need some inspiration!',
    amountUSD: 75,
    createdAt: '2026-01-16T08:15:00Z',
    dueDate: '2026-01-18T08:15:00Z',
    status: 'payment_confirmed' as BookingStatus,
  },
  {
    id: '3',
    bookingCode: 'TS-2026-0126',
    customerName: 'Grace N.',
    recipientName: 'My Husband',
    occasion: 'Anniversary',
    instructions: 'Please wish my husband Tapiwa a happy 10th anniversary. We got married to your song playing!',
    amountUSD: 75,
    createdAt: '2026-01-15T14:20:00Z',
    dueDate: '2026-01-17T14:20:00Z',
    status: 'payment_confirmed' as BookingStatus,
  },
];

const mockRecentCompletedRequests = [
  {
    id: '4',
    bookingCode: 'TS-2026-0120',
    recipientName: 'David',
    occasion: 'Graduation',
    completedAt: '2026-01-15T09:00:00Z',
    amountUSD: 75,
    rating: 5,
    review: 'Amazing video! David was so happy!',
  },
  {
    id: '5',
    bookingCode: 'TS-2026-0118',
    recipientName: 'Nyasha',
    occasion: 'Birthday',
    completedAt: '2026-01-14T16:30:00Z',
    amountUSD: 75,
    rating: 5,
    review: null,
  },
  {
    id: '6',
    bookingCode: 'TS-2026-0115',
    recipientName: 'Corporate Event',
    occasion: 'Business',
    completedAt: '2026-01-13T11:00:00Z',
    amountUSD: 150,
    rating: 5,
    review: 'Perfect for our event! Thank you!',
  },
];

const mockEarningsHistory = [
  { month: 'Aug', amount: 1200 },
  { month: 'Sep', amount: 1450 },
  { month: 'Oct', amount: 1680 },
  { month: 'Nov', amount: 1520 },
  { month: 'Dec', amount: 2100 },
  { month: 'Jan', amount: 1725 },
];

type TabType = 'overview' | 'requests' | 'earnings' | 'settings';

export default function DashboardPage() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(mockTalentProfile.isAcceptingBookings);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) return 'Overdue';
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'requests' as TabType, label: 'Requests', icon: Video, badge: mockTalentProfile.pendingRequests },
    { id: 'earnings' as TabType, label: 'Earnings', icon: Wallet },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
              JP
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{mockTalentProfile.displayName}</h1>
              <p className="text-neutral-400">{mockTalentProfile.category} • ${mockTalentProfile.priceUSD}/video</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2 bg-neutral-900 rounded-lg px-4 py-2">
              <span className="text-sm text-neutral-400">Accepting Bookings</span>
              <button
                onClick={() => setIsAcceptingBookings(!isAcceptingBookings)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isAcceptingBookings ? 'bg-green-500' : 'bg-neutral-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isAcceptingBookings ? 'left-7' : 'left-1'}`} />
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
                {tab.badge && (
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
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    12%
                  </span>
                </div>
                <p className="text-2xl font-bold">${mockTalentProfile.monthlyEarningsUSD.toLocaleString()}</p>
                <p className="text-sm text-neutral-400">This Month</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="flex items-center text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    8%
                  </span>
                </div>
                <p className="text-2xl font-bold">{mockTalentProfile.completedThisMonth}</p>
                <p className="text-sm text-neutral-400">Videos This Month</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className="text-pink-400 text-sm font-medium">
                    Action needed
                  </span>
                </div>
                <p className="text-2xl font-bold">{mockTalentProfile.pendingRequests}</p>
                <p className="text-sm text-neutral-400">Pending Requests</p>
              </div>

              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{mockTalentProfile.averageRating}</p>
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
                <div className="space-y-4">
                  {mockPendingRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="bg-black/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">For: {request.recipientName}</p>
                          <p className="text-sm text-neutral-400">{request.occasion} • {request.bookingCode}</p>
                        </div>
                        <span className="text-sm text-pink-400 font-medium">
                          {getTimeRemaining(request.dueDate)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-300 mb-3 line-clamp-2">{request.instructions}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-semibold">${request.amountUSD}</span>
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
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-neutral-900 rounded-xl p-6">
                  <h3 className="font-bold mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Profile Views</span>
                        <span className="font-medium">{mockTalentProfile.profileViews.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Conversion Rate</span>
                        <span className="font-medium">{mockTalentProfile.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${mockTalentProfile.conversionRate * 5}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Response Time</span>
                        <span className="font-medium">{mockTalentProfile.responseTimeHours}h avg</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-xl p-6">
                  <h3 className="font-bold mb-2">Total Earnings</h3>
                  <p className="text-3xl font-bold text-gradient-brand">${mockTalentProfile.totalEarningsUSD.toLocaleString()}</p>
                  <p className="text-sm text-neutral-400 mt-1">From {mockTalentProfile.totalBookings} videos</p>
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
              <div className="grid md:grid-cols-3 gap-4">
                {mockRecentCompletedRequests.filter(r => r.review).map((request) => (
                  <div key={request.id} className="bg-black/50 rounded-lg p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(request.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-300 mb-2">"{request.review}"</p>
                    <p className="text-xs text-neutral-500">
                      {request.recipientName} • {request.occasion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-neutral-800 pb-4">
              <button className="text-purple-400 font-medium border-b-2 border-purple-400 pb-2">
                Pending ({mockPendingRequests.length})
              </button>
              <button className="text-neutral-400 hover:text-white pb-2">
                Completed ({mockRecentCompletedRequests.length})
              </button>
              <button className="text-neutral-400 hover:text-white pb-2">
                Declined (0)
              </button>
            </div>

            {/* Pending Requests List */}
            <div className="space-y-4">
              {mockPendingRequests.map((request) => (
                <div key={request.id} className="bg-neutral-900 rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-neutral-500">{request.bookingCode}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          getTimeRemaining(request.dueDate).includes('Overdue')
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {getTimeRemaining(request.dueDate)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">
                        Video for {request.recipientName}
                      </h3>
                      <p className="text-sm text-neutral-400 mb-3">
                        {request.occasion} • Requested by {request.customerName}
                      </p>
                      <div className="bg-black/50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-neutral-300">
                          <span className="font-semibold text-purple-400">Instructions: </span>
                          {request.instructions}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Requested: {formatDate(request.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due: {formatDate(request.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-green-400">${request.amountUSD}</p>
                      <p className="text-sm text-neutral-400">You earn: ${(request.amountUSD * 0.75).toFixed(0)}</p>
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

            {/* Completed Requests */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Recently Completed</h2>
              <div className="space-y-4">
                {mockRecentCompletedRequests.map((request) => (
                  <div key={request.id} className="bg-neutral-900 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.recipientName}</h3>
                        <p className="text-sm text-neutral-400">{request.occasion} • {request.bookingCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        {[...Array(request.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-green-400 font-semibold">${request.amountUSD}</span>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                <p className="text-4xl font-bold">${mockTalentProfile.totalEarningsUSD.toLocaleString()}</p>
                <p className="text-sm text-neutral-400 mt-2">From {mockTalentProfile.totalBookings} completed videos</p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <p className="text-neutral-400 mb-2">This Month</p>
                <p className="text-4xl font-bold text-green-400">${mockTalentProfile.monthlyEarningsUSD.toLocaleString()}</p>
                <p className="text-sm text-green-400 mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  12% vs last month
                </p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <p className="text-neutral-400 mb-2">Available for Payout</p>
                <p className="text-4xl font-bold">${(mockTalentProfile.monthlyEarningsUSD * 0.75).toLocaleString()}</p>
                <Button className="mt-4 w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Earnings History</h2>
              <div className="h-64 flex items-end gap-4">
                {mockEarningsHistory.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.amount / 2500) * 100}%` }}
                    />
                    <p className="text-sm text-neutral-400 mt-2">{item.month}</p>
                    <p className="text-xs text-neutral-500">${item.amount}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Payout History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Jan 1, 2026', amount: 1575, method: 'EcoCash', status: 'Completed', ref: 'PAY-2026-001' },
                      { date: 'Dec 1, 2025', amount: 1890, method: 'EcoCash', status: 'Completed', ref: 'PAY-2025-012' },
                      { date: 'Nov 1, 2025', amount: 1368, method: 'Bank Transfer', status: 'Completed', ref: 'PAY-2025-011' },
                    ].map((payout, idx) => (
                      <tr key={idx} className="border-b border-neutral-800/50">
                        <td className="py-4">{payout.date}</td>
                        <td className="py-4 font-semibold">${payout.amount}</td>
                        <td className="py-4">{payout.method}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            {payout.status}
                          </span>
                        </td>
                        <td className="py-4 text-neutral-400">{payout.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    defaultValue={mockTalentProfile.displayName}
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="Award-winning Zimbabwean musician known for Afro-jazz fusion. Multiple awards winner and Africa's finest performer."
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Musician</option>
                      <option>Comedian</option>
                      <option>Actor/Actress</option>
                      <option>Sports Personality</option>
                      <option>Influencer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Response Time</label>
                    <select className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="24">24 hours</option>
                      <option value="48" selected>48 hours</option>
                      <option value="72">72 hours</option>
                      <option value="168">1 week</option>
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
                      defaultValue={mockTalentProfile.priceUSD}
                      className="w-full bg-black/50 border border-neutral-700 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">You will earn ${(mockTalentProfile.priceUSD * 0.75).toFixed(0)} per video (75%)</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                  <p className="text-sm text-neutral-300">
                    <strong>Tip:</strong> Based on your category and follower count, similar talent price their videos between $50-$150. Higher prices may reduce bookings but increase earnings per video.
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Settings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Payout Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Payout Method</label>
                  <select className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>EcoCash</option>
                    <option>OneMoney</option>
                    <option>Bank Transfer (Zimbabwe)</option>
                    <option>International Wire Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">EcoCash Number</label>
                  <input
                    type="tel"
                    placeholder="+263 77 XXX XXXX"
                    className="w-full bg-black/50 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: 'New booking requests', description: 'Get notified when someone books a video', enabled: true },
                  { label: 'Payment received', description: 'Get notified when payment is confirmed', enabled: true },
                  { label: 'Review received', description: 'Get notified when someone leaves a review', enabled: true },
                  { label: 'Marketing emails', description: 'Receive tips and platform updates', enabled: false },
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
