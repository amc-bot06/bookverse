import BookmarkButton from '../components/BookmarkButton'
import { useEffect } from 'react'
import { updateProgress } from '../services/library.service'
import { useAuthStore } from '../store/authStore'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { getChapter, getBookChapters } from '../services/book.service'

const ChapterReaderPage = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()
  const { isAuthenticated } = useAuthStore()

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapter(bookId!, chapterId!),
  })

  const { data: chapters } = useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => getBookChapters(bookId!),
  })

  useEffect(() => {
    if (!isAuthenticated || !chapter) return

    // Track that the user started reading this chapter
    updateProgress(bookId!, chapterId!, 0).catch(() => {})
  }, [chapter, isAuthenticated])

  const currentIndex = chapters?.findIndex((c: any) => c.id === chapterId) ?? -1
  const prevChapter = currentIndex > 0 ? chapters?.[currentIndex - 1] : null
  const nextChapter = currentIndex < (chapters?.length ?? 0) - 1 ? chapters?.[currentIndex + 1] : null

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-3/4" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!chapter) {
    return <div className="text-center py-20 text-gray-400">Chapter not found.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Back to book */}
      <Link
        to={`/book/${bookId}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        {chapter.book.title}
      </Link>

     {/* Chapter header */}
<div className="mb-8 flex items-start justify-between gap-4">
  <div>
    <p className="text-indigo-400 text-sm mb-1">
      Chapter {chapter.chapterNumber}
    </p>
    <h1 className="text-3xl font-bold text-white">{chapter.title}</h1>
  </div>
  <BookmarkButton bookId={bookId!} chapterId={chapterId!} />
</div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
          {chapter.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-800">
        {prevChapter ? (
          <Link
            to={`/book/${bookId}/chapter/${prevChapter.id}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Previous</p>
              <p className="text-sm">{prevChapter.title}</p>
            </div>
          </Link>
        ) : <div />}

        {nextChapter ? (
          <Link
            to={`/book/${bookId}/chapter/${nextChapter.id}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="text-right">
              <p className="text-xs text-gray-500">Next</p>
              <p className="text-sm">{nextChapter.title}</p>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>

    </div>
  )
}

export default ChapterReaderPage