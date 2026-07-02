import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { getBooks, getGenres } from '../services/book.service'
import BookCard from '../components/BookCard'
import BookCardSkeleton from '../components/BookCardSkeleton'

const SORT_OPTIONS = [
  { label: 'Newest',   value: 'newest' },
  { label: 'Trending', value: 'trending' },
  { label: 'Popular',  value: 'popular' },
]

const STATUS_OPTIONS = [
  { label: 'All',       value: '' },
  { label: 'Ongoing',   value: 'ONGOING' },
  { label: 'Completed', value: 'COMPLETED' },
]

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch]   = useState(searchParams.get('q') || '')
  const [genre, setGenre]     = useState(searchParams.get('genre') || '')
  const [status, setStatus]   = useState(searchParams.get('status') || '')
  const [sort, setSort]       = useState(searchParams.get('sort') || 'newest')
  const [page, setPage]       = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Sync state to URL params
  useEffect(() => {
    const params: any = {}
    if (search) params.q = search
    if (genre)  params.genre = genre
    if (status) params.status = status
    if (sort !== 'newest') params.sort = sort
    setSearchParams(params)
    setPage(1)
  }, [search, genre, status, sort])

  const { data, isLoading } = useQuery({
    queryKey: ['books', 'browse', search, genre, status, sort, page],
    queryFn: () => getBooks({ page, search, genre, status, sort }),
  })

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const books = data?.data ?? []
  const pagination = data?.pagination

  const clearFilters = () => {
    setSearch('')
    setGenre('')
    setStatus('')
    setSort('newest')
  }

  const hasActiveFilters = search || genre || status || sort !== 'newest'

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Browse Books</h1>
          {pagination && (
            <p className="text-gray-400 text-sm mt-1">
              {pagination.total.toLocaleString()} books found
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg text-sm transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or description..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Sort */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Sort by</label>
              <div className="flex gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      sort === opt.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Status</label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      status === opt.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Genres */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Genre</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGenre('')}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  !genre
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {genres?.map((g: any) => (
                <button
                  key={g.id}
                  onClick={() => setGenre(g.slug)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    genre === g.slug
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <BookCardSkeleton key={i} />)
          : books.length === 0
          ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No books found.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Clear filters and try again
                </button>
              )}
            </div>
          )
          : books.map((book: any) => <BookCard key={book.id} book={book} />)
        }
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm px-4">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>
  )
}

export default BrowsePage