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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
              status === 'rejected'
                ? 'bg-gradient-to-br from-red-600 to-orange-600'
                : 'bg-gradient-to-br from-purple-600 to-pink-600'
            }`}>
              {talent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{talent.name}</h2>
              <div className="flex items-center gap-2 mt-1">
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
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
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

            {/* Pricing & Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  Requested Pricing
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-sm">USD Price</span>
                    <span className="text-2xl font-bold text-gradient-brand">${talent.requestedPrice}</span>
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

            {/* Application Timeline */}
            <div className="bg-neutral-800/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Application Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-neutral-400">{formatDate(talent.appliedAt)}</p>
                  </div>
                </div>
                {status === 'rejected' && talent.rejectedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-red-400">Application Rejected</p>
                      <p className="text-xs text-neutral-400">{formatDate(talent.rejectedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 bg-neutral-800/50 border-t border-neutral-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {status === 'pending' && (
            <>
              {onReject && (
                <Button
                  variant="outline"
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
