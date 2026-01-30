'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  Video,
  Clock,
  DollarSign,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getActiveTalents, toggleTalentAcceptingBookings, getTalentCategories } from '@/lib/api/admin.client'
import { ActiveTalentDetailsModal } from './ActiveTalentDetailsModal'
import { Pagination } from '@/components/ui/Pagination'

interface ActiveTalent {
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

export function ActiveTalentsList() {
  const [talents, setTalents] = useState<ActiveTalent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [selectedTalent, setSelectedTalent] = useState<ActiveTalent | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    loadTalents()
  }, [categoryFilter, page])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getTalentCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadTalents = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getActiveTalents({
        category: categoryFilter || undefined,
        search: searchQuery || undefined,
        page,
        pageSize
      })
      setTalents(result.data)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      console.error('Error loading active talents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load talents')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBookings = async (talentId: string, currentStatus: boolean) => {
    try {
      await toggleTalentAcceptingBookings(talentId, !currentStatus)
      // Update local state
      setTalents(prev => prev.map(t =>
        t.id === talentId ? { ...t, isAcceptingBookings: !currentStatus } : t
      ))
    } catch (err) {
      console.error('Error toggling bookings:', err)
    }
  }

  const handleSearch = () => {
    setPage(1) // Reset to page 1 when searching
    loadTalents()
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory)
    setPage(1) // Reset to page 1 when changing category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading active talents...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Talents</h3>
        <p className="text-neutral-300 mb-4">{error}</p>
        <Button onClick={loadTalents}>Retry</Button>
      </div>
    )
  }

  // Helper to format category for display
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </option>
          ))}
        </select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Talents Count */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-400">
          Showing <span className="text-white font-semibold">{talents.length}</span> of <span className="text-white font-semibold">{total}</span> active talents
        </p>
      </div>

      {/* Talents Grid */}
      {talents.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl p-12 text-center">
          <p className="text-neutral-400">No active talents found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {talents.map((talent) => (
            <div key={talent.id} className="bg-neutral-900 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold">
                      {talent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">{talent.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-neutral-400">{formatCategory(talent.category)}</p>
                        {talent.isAcceptingBookings ? (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Paused
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Bookings</p>
                      <div className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-neutral-400" />
                        <p className="text-sm">{talent.totalBookings}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Rating</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm">
                          {talent.averageRating !== null
                            ? `${talent.averageRating.toFixed(1)} (${talent.ratingCount || 0})`
                            : 'No ratings'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Price</p>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-neutral-400" />
                        <p className="text-sm">${talent.priceUsd}/video</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Response</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <p className="text-sm">{talent.responseTime}h</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Accepting Bookings:</span>
                    <button
                      onClick={() => handleToggleBookings(talent.id, talent.isAcceptingBookings)}
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
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTalent(talent)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
          pageSize={pageSize}
        />
      )}

      {/* Active Talent Details Modal */}
      {selectedTalent && (
        <ActiveTalentDetailsModal
          isOpen={!!selectedTalent}
          onClose={() => setSelectedTalent(null)}
          talent={selectedTalent}
          onToggleBookings={async (isAccepting) => {
            try {
              await toggleTalentAcceptingBookings(selectedTalent.id, isAccepting)
              // Update local state
              setTalents(prev => prev.map(t =>
                t.id === selectedTalent.id ? { ...t, isAcceptingBookings: isAccepting } : t
              ))
              setSelectedTalent({ ...selectedTalent, isAcceptingBookings: isAccepting })
            } catch (err) {
              console.error('Error toggling bookings:', err)
            }
          }}
        />
      )}
    </div>
  )
}
