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
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl max-w-3xl w-full my-2 sm:my-4 animate-scale-in flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-gradient-to-r from-green-900/20 to-blue-900/20 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold flex-shrink-0">
              {talent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{talent.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                      <span className="hidden sm:inline">Accepting Bookings</span>
                      <span className="sm:hidden">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Not Accepting</span>
                      <span className="sm:hidden">Paused</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/30 rounded-lg p-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mb-1" />
                <p className="text-base sm:text-lg font-bold text-yellow-400">
                  {talent.averageRating !== null ? talent.averageRating.toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs text-neutral-500">{talent.ratingCount || 0} reviews</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/30 rounded-lg p-2">
                <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mb-1" />
                <p className="text-base sm:text-lg font-bold text-blue-400">{talent.totalBookings}</p>
                <p className="text-xs text-neutral-500">bookings</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700/30 rounded-lg p-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mb-1" />
                <p className="text-base sm:text-lg font-bold text-purple-400">{talent.responseTime}h</p>
                <p className="text-xs text-neutral-500">response</p>
              </div>
            </div>

            {/* Contact & Bio Combined */}
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <div className="grid gap-2 text-xs sm:text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <p className="truncate">{talent.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <p>{talent.phone || 'Not provided'}</p>
                </div>
              </div>
              {talent.bio && (
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 border-t border-neutral-700 pt-2">
                  {talent.bio}
                </p>
              )}
            </div>

            {/* Pricing, Category & Date Combined */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-neutral-800/50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <h3 className="text-xs font-bold">Pricing</h3>
                </div>
                <p className="text-sm font-bold text-green-400">${talent.priceUsd}</p>
                <p className="text-xs text-blue-400">{talent.priceZig} ZIG</p>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Tag className="w-3 h-3 text-pink-400" />
                  <h3 className="text-xs font-bold">Category</h3>
                </div>
                <p className="text-xs text-purple-400 font-semibold line-clamp-2">
                  {categoryDisplay}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-neutral-800/50 rounded-lg p-2">
              <p className="text-xs text-neutral-400">
                <Calendar className="w-3 h-3 inline mr-1" />
                Joined {new Date(talent.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 bg-neutral-800/50 border-t border-neutral-800 flex-shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-neutral-400">Booking Status:</span>
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
            <span className={`text-xs sm:text-sm font-medium ${
              talent.isAcceptingBookings ? 'text-green-400' : 'text-gray-400'
            }`}>
              {talent.isAcceptingBookings ? 'Accepting' : 'Not Accepting'}
            </span>
          </div>
          <Button variant="outline" onClick={onClose} size="sm" className="w-full sm:w-auto">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
