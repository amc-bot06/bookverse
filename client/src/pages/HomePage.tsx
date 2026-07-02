import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getContinueReading } from '../services/library.service'
import { getTrendingBooks, getRecentBooks } from '../services/book.service'
import BookCard from '../components/BookCard'
import BookCardSkeleton from '../components/BookCardSkeleton'
import SectionHeader from '../components/SectionHeader'
import ContinueReadingCard from '../components/ContinueReadingCard'

const HomePage = () => {
  const { isAuthenticated } = useAuthStore()

  const {
    data: continueReading,
    isLoading: continueLoading,
  } = useQuery({
    queryKey: ['continue-reading'],
    queryFn: getContinueReading,
    enabled: isAuthenticated,
  })

  const {
    data: trendingBooks,
    isLoading: trendingLoading,
  } = useQuery({
    queryKey: ['books', 'trending'],
    queryFn: getTrendingBooks,
  })

  const {
    data: recentBooks,
    isLoading: recentLoading,
  } = useQuery({
    queryKey: ['books', 'recent'],
    queryFn: getRecentBooks,
  })

  return (
    <div className="space-y-16">

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Read. Write.
          <span className="text-indigo-400"> Publish.</span>
        </h1>
        <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
          Discover millions of stories or share your own with the world.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            to="/browse"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Books
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            Start Writing
          </Link>
        </div>
      </section>

      {/* Continue Reading */}
      {isAuthenticated && (continueLoading || (continueReading && continueReading.length > 0)) && (
        <section>
          <SectionHeader
            title="Continue Reading"
            subtitle="Pick up where you left off"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {continueLoading
              ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
              : continueReading?.map((item: any) => <ContinueReadingCard key={item.id} item={item} />)
            }
          </div>
        </section>
      )}

      {/* Trending */}
      <section>
        <SectionHeader
          title="Trending Now"
          subtitle="Most viewed books this week"
          action={
            <Link
              to="/browse?sort=trending"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingLoading
            ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
            : trendingBooks?.length === 0
            ? <p className="text-gray-500 col-span-full text-center py-8">No books yet. Be the first to publish!</p>
            : trendingBooks?.map((book) => <BookCard key={book.id} book={book} />)
          }
        </div>
      </section>

      {/* Recent */}
      <section>
        <SectionHeader
          title="Recently Updated"
          subtitle="Fresh chapters from your favorite authors"
          action={
            <Link
              to="/browse?sort=recent"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentLoading
            ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
            : recentBooks?.length === 0
            ? <p className="text-gray-500 col-span-full text-center py-8">No books yet.</p>
            : recentBooks?.map((book) => <BookCard key={book.id} book={book} />)
          }
        </div>
      </section>

    </div>
  )
}

export default HomePage