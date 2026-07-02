import LikeButton from '../components/LikeButton'
import Comments from '../components/Comments'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Eye, Heart, User, ChevronRight } from 'lucide-react'
import { getBookById, getBookChapters } from '../services/book.service'
import { useAuthStore } from '../store/authStore'

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()

  const { data: book, isLoading: bookLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBookById(id!),
  })

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters', id],
    queryFn: () => getBookChapters(id!),
    enabled: !!id,
  })

  if (bookLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-800 rounded-xl" />
        <div className="h-8 bg-gray-800 rounded w-1/2" />
        <div className="h-4 bg-gray-800 rounded w-3/4" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Book not found.</p>
      </div>
    )
  }

  const isAuthor = user?.id === book.author.id

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Book Header */}
      <div className="flex gap-6 md:gap-8">
        {/* Cover */}
        <div className="w-32 md:w-48 flex-shrink-0">
          <div className="aspect-[2/3] bg-gradient-to-br from-indigo-900 to-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <BookOpen className="w-12 h-12 text-indigo-400 opacity-50" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{book.title}</h1>
            <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
              book.status === 'COMPLETED'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {book.status}
            </span>
          </div>

          <Link
            to={`/profile/${book.author.username}`}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors w-fit"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">by {book.author.username}</span>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {book.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {book._count?.likes ?? 0} likes
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {book._count?.chapters ?? 0} chapters
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {book.genres.map((g: any) => (
              <span
                key={g.genre?.id ?? g.id}
                className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700"
              >
                {g.genre?.name ?? g.name}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {book.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {chapters && chapters.length > 0 && (
              <Link
                to={`/book/${book.id}/chapter/${chapters[0].id}`}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
              >
                Start Reading
              </Link>
            )}
            {isAuthor && (
              <Link
                to={`/write/${book.id}`}
                className="px-5 py-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
              >
                Manage Book
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Table of Contents
        </h2>

        {chaptersLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : chapters?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">No chapters published yet.</p>
            {isAuthor && (
              <Link
                to={`/write/${book.id}`}
                className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Add your first chapter →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {chapters?.map((chapter: any) => (
              <Link
                key={chapter.id}
                to={`/book/${book.id}/chapter/${chapter.id}`}
                className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-8">
                    {chapter.chapterNumber}
                  </span>
                  <span className="text-gray-200 group-hover:text-white transition-colors">
                    {chapter.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Like Button */}
      <div className="flex items-center gap-3">
        <LikeButton bookId={book.id} />
      </div>

      {/* Comments */}
      <Comments bookId={book.id} />

    </div>
  )
}

export default BookDetailPage