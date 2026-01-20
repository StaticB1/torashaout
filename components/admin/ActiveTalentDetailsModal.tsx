'use client'

import { X, Mail, Phone, Calendar, DollarSign, User, FileText, Tag, Star, Video, Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ActiveTalentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  talent: {
    id: string
    name: string
    category: string
    email: string
    phone: string
    bio?: string
    priceUsd: number
    priceZig: number
    responseTime: number
    thumbnailUrl?: string
    isAcceptingBookings: boolean
    totalBookings: number
    averageRating: number | null
    ratingCount?: number
    joinedAt: string
  }
  onToggleBookings?: (isAccepting: boolean) => void
}

export function ActiveTalentDetailsModal({
  isOpen,
  onClose,
  talent,
  onToggleBookings
}: ActiveTalentDetailsModalProps) {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const categoryDisplay = talent.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {talent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{talent.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {categoryDisplay}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                  talent.isAcceptingBookings
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {talent.isAcceptingBookings ? (
                    <>
                      <ToggleRight className="w-3 h-3" />
                      Accepting Bookings
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3 h-3" />
                      Not Accepting
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs text-neutral-400">Average Rating</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {talent.averageRating !== null ? talent.averageRating.toFixed(1) : 'N/A'}
                </p>
                {talent.ratingCount !== undefined && talent.ratingCount > 0 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    from {talent.ratingCount} {talent.ratingCount === 1 ? 'review' : 'reviews'}
                  </p>
                )}
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-neutral-400">Total Bookings</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{talent.totalBookings}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-neutral-400">Response Time</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">{talent.responseTime}h</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-neutral-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-400 mb-1">Email Address</p>
                    <p className="text-sm font-medium truncate">{talent.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-400 mb-1">Phone Number</p>
                    <p className="text-sm font-medium">{talent.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-neutral-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Biography
              </h3>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {talent.bio || 'No biography provided.'}
              </p>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">USD Price</span>
                    <span className="text-xl font-bold text-green-400">${talent.priceUsd}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">ZIG Price</span>
                    <span className="text-xl font-bold text-blue-400">{talent.priceZig} ZIG</span>
                  </div>
                  <p className="text-xs text-neutral-500">per video shoutout</p>
                </div>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-400" />
                  Category
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-semibold">
                    {categoryDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Joined Date */}
            <div className="bg-neutral-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Member Since
              </h3>
              <p className="text-neutral-300">{formatDate(talent.joinedAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 bg-neutral-800/50 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">Booking Status:</span>
            {onToggleBookings && (
              <button
                onClick={() => onToggleBookings(!talent.isAcceptingBookings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                  talent.isAcceptingBookings
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={talent.isAcceptingBookings}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    talent.isAcceptingBookings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
            <span className={`text-sm font-medium ${
              talent.isAcceptingBookings ? 'text-green-400' : 'text-gray-400'
            }`}>
              {talent.isAcceptingBookings ? 'Accepting' : 'Not Accepting'}
            </span>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
