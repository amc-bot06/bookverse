import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bookmark, BookOpen, Heart } from 'lucide-react'
import { getUserBookmarks, getContinueReading, getUserSavedBooks } from '../services/library.service'
import { useAuthStore } from '../store/authStore'
import LibraryBookRow from '../components/LibraryBookRow'
import LibraryBookRowSkeleton from '../components/LibraryBookRowSkeleton'
import BackButton from '../components/BackButton'

const LibraryPage = () => {
  const { isAuthenticated } = useAuthStore()

  const { data: savedBooks, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-books'],
    queryFn: getUserSavedBooks,
    enabled: isAuthenticated,
  })

  const { data: bookmarks, isLoading: bookmarksLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getUserBookmarks,
    enabled: isAuthenticated,
  })

  const { data: continueReading, isLoading: progressLoading } = useQuery({
    queryKey: ['continue-reading'],
    queryFn: getContinueReading,
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Library</h2>
        <p className="text-gray-400 mb-6">Login to see your bookmarks and reading progress</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-12">

      <BackButton />

      {/* Saved Books */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-indigo-400" />
          Saved Books
        </h2>

        {savedLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <LibraryBookRowSkeleton key={i} />)}
          </div>
        ) : savedBooks?.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">No saved books yet.</p>
            <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
              Find something to read →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedBooks?.map((saved: any) => (
              <LibraryBookRow
                key={saved.id}
                to={`/book/${saved.bookId}`}
                coverImage={saved.book.coverImage}
                title={saved.book.title}
                subtitle={`by ${saved.book.author.username}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Continue Reading */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Continue Reading
        </h2>

        {progressLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <LibraryBookRowSkeleton key={i} />)}
          </div>
        ) : continueReading?.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">You haven't started reading anything yet.</p>
            <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
              Browse books →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {continueReading?.map((item: any) => (
              <LibraryBookRow
                key={item.id}
                to={`/book/${item.bookId}/chapter/${item.chapterId}`}
                coverImage={item.book.coverImage}
                title={item.book.title}
                chapterNumber={item.chapter.chapterNumber}
                chapterTitle={item.chapter.title}
                progress={item.progress}
              />
            ))}
          </div>
        )}
      </section>

      {/* Reading Bookmarks (per-chapter markers) */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-400" />
          Reading Bookmarks
        </h2>

        {bookmarksLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <LibraryBookRowSkeleton key={i} />)}
          </div>
        ) : bookmarks?.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">No bookmarks yet.</p>
            <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
              Find something to read →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks?.map((bookmark: any) => (
              <LibraryBookRow
                key={bookmark.id}
                to={`/book/${bookmark.bookId}/chapter/${bookmark.chapterId}`}
                coverImage={bookmark.book.coverImage}
                title={bookmark.book.title}
                chapterNumber={bookmark.chapter.chapterNumber}
                chapterTitle={bookmark.chapter.title}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default LibraryPage
