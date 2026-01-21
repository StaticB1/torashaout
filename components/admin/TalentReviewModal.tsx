'use client'

import { X, Mail, Phone, Calendar, DollarSign, User, FileText, Tag, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface TalentReviewModalProps {
  isOpen: boolean
  onClose: () => void
  talent: {
    id: string
    name: string
    category: string
    email: string
    phone: string
    bio?: string
    requestedPrice: number
    appliedAt: string
    rejectedAt?: string
  }
  onApprove?: () => void
  onReject?: () => void
  onReapprove?: () => void
  status: 'pending' | 'rejected'
}

export function TalentReviewModal({
  isOpen,
  onClose,
  talent,
  onApprove,
  onReject,
  onReapprove,
  status
}: TalentReviewModalProps) {
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold flex-shrink-0 ${
              status === 'rejected'
                ? 'bg-gradient-to-br from-red-600 to-orange-600'
                : 'bg-gradient-to-br from-purple-600 to-pink-600'
            }`}>
              {talent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{talent.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {categoryDisplay}
                </span>
                {status === 'rejected' ? (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Rejected
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Pending Review
                  </span>
                )}
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold mb-2 sm:mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Contact
              </h3>
              <div className="grid gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <p className="truncate">{talent.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p>{talent.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Bio
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                {talent.bio || 'No biography provided.'}
              </p>
            </div>

            {/* Pricing & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Price
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gradient-brand">${talent.requestedPrice}</p>
                <p className="text-xs text-neutral-500">per video</p>
              </div>

              <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-pink-400" />
                  Category
                </h3>
                <p className="text-xs sm:text-sm text-purple-400 font-semibold">
                  {categoryDisplay}
                </p>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-neutral-800/50 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Timeline
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <p className="text-neutral-400">Applied {new Date(talent.appliedAt).toLocaleDateString()}</p>
                </div>
                {status === 'rejected' && talent.rejectedAt && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <p className="text-red-400">Rejected {new Date(talent.rejectedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 bg-neutral-800/50 border-t border-neutral-800 flex-shrink-0">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
          {status === 'pending' && (
            <>
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onReject()
                    onClose()
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button
                  size="sm"
                  onClick={() => {
                    onApprove()
                    onClose()
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Talent
                </Button>
              )}
            </>
          )}
          {status === 'rejected' && onReapprove && (
            <Button
              size="sm"
              onClick={() => {
                onReapprove()
                onClose()
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Re-Approve Talent
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
