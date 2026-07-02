import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

interface Props {
  item: {
    progress: number
    book: {
      id: string
      title: string
      coverImage?: string
    }
    chapter: {
      id: string
      title: string
      chapterNumber: number
    }
  }
}

const ContinueReadingCard = ({ item }: Props) => {
  const { book, chapter, progress } = item
  const pct = Math.round((progress ?? 0) * 100)

  return (
    <Link to={`/book/${book.id}/chapter/${chapter.id}`} className="group block">
      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10">
        {/* Cover Image */}
        <div className="aspect-[2/3] bg-gray-800 relative overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900">
              <BookOpen className="w-12 h-12 text-indigo-400 opacity-50" />
            </div>
          )}
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ContinueReadingCard
