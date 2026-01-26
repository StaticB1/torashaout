'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Currency, TalentCategory, TalentProfile } from '@/types'
import { TalentCard } from '@/components/TalentCard'
import { AuthNavbar } from '@/components/AuthNavbar'
import { Footer } from '@/components/Footer'

interface CategoryOption {
  value: TalentCategory | 'all'
  label: string
}

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'response', label: 'Fastest Response' },
]

export default function BrowsePage() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TalentCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryOption[]>([{ value: 'all', label: 'All' }])

  // Load talents from database
  useEffect(() => {
    const loadTalents = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('talent_profiles')
          .select(`
            *,
            users:user_id (
              id,
              email,
              full_name,
              avatar_url
            )
          `)
          .eq('admin_verified', true)
          .order('total_bookings', { ascending: false })
          .order('average_rating', { ascending: false })

        if (error) {
          console.error('Error fetching talents:', error)
          setTalents([])
        } else {
          // Map database fields to TalentProfile type
          const mappedTalents: TalentProfile[] = (data || []).map((talent: any) => ({
            id: talent.id,
            userId: talent.user_id,
            displayName: talent.display_name,
            bio: talent.bio,
            category: talent.category,
            priceUSD: talent.price_usd,
            priceZIG: talent.price_zig,
            thumbnailUrl: talent.thumbnail_url,
            profileVideoUrl: talent.profile_video_url,
            responseTimeHours: talent.response_time_hours,
            totalBookings: talent.total_bookings,
            averageRating: talent.average_rating,
            isAcceptingBookings: talent.is_accepting_bookings,
            adminVerified: talent.admin_verified,
            createdAt: talent.created_at,
            updatedAt: talent.updated_at,
            user: talent.users ? {
              id: talent.users.id,
              email: talent.users.email,
              fullName: talent.users.full_name,
              avatarUrl: talent.users.avatar_url,
            } : undefined,
          }))
          setTalents(mappedTalents)
        }
      } catch (error) {
        console.error('Error loading talents:', error)
        setTalents([])
      } finally {
        setLoading(false)
      }
    }
    loadTalents()
  }, [])

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('categories')
          .select('name, slug')
          .order('name')

        if (error) {
          console.error('Error fetching categories:', error)
        } else if (data) {
          const categoryOptions: CategoryOption[] = [
            { value: 'all', label: 'All' },
            ...data.map((cat: { name: string; slug: string }) => ({
              value: cat.slug as TalentCategory,
              label: cat.name,
            }))
          ]
          setCategories(categoryOptions)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  const filteredAndSortedTalent = useMemo(() => {
    let filtered = talents

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        talent =>
          talent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (talent.bio && talent.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(talent => talent.category === selectedCategory)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceALow = currency === 'USD' ? (a.priceUSD || 0) : (a.priceZIG || 0)
          const priceBLow = currency === 'USD' ? (b.priceUSD || 0) : (b.priceZIG || 0)
          return priceALow - priceBLow
        case 'price-high':
          const priceAHigh = currency === 'USD' ? (a.priceUSD || 0) : (a.priceZIG || 0)
          const priceBHigh = currency === 'USD' ? (b.priceUSD || 0) : (b.priceZIG || 0)
          return priceBHigh - priceAHigh
        case 'rating':
          return b.averageRating - a.averageRating
        case 'response':
          return a.responseTimeHours - b.responseTimeHours
        case 'popular':
        default:
          return b.totalBookings - a.totalBookings
      }
    })

    return sorted
  }, [talents, searchQuery, selectedCategory, sortBy, currency])

  return (
    <div className="min-h-screen bg-black">
      <AuthNavbar currency={currency} onCurrencyChange={setCurrency} />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse Talent
          </h1>
          <p className="text-neutral-400 text-lg">
            Discover Zimbabwe's finest celebrities and get personalized video messages
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 min-w-[200px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-neutral-900 rounded-xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchQuery('')
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-3 text-neutral-300">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category.value
                          ? 'bg-purple-600 text-white'
                          : 'text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <p className="text-sm text-neutral-400">
                  Showing {filteredAndSortedTalent.length} of {talents.length} talents
                </p>
              </div>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-neutral-800"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                      <div className="h-4 bg-neutral-800 rounded w-full"></div>
                      <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedTalent.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTalent.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} currency={currency} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No talents found</h3>
                <p className="text-neutral-400 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
