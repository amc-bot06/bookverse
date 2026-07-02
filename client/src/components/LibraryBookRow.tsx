import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'

interface Props {
  to: string
  coverImage?: string
  title: string
  chapterNumber: number
  chapterTitle: string
  progress?: number
}

const LibraryBookRow = ({ to, coverImage, title, chapterNumber, chapterTitle, progress }: Props) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-all group"
    >
      {/* Cover */}
      <div className="w-12 h-16 bg-gradient-to-br from-indigo-900 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
        {coverImage ? (
          <img src={coverImage} className="w-full h-full object-cover rounded-lg" alt="" />
        ) : (
          <BookOpen className="w-5 h-5 text-indigo-400 opacity-50" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate group-hover:text-indigo-400 transition-colors">
          {title}
        </p>
        <p className="text-gray-400 text-sm mt-0.5">
          Chapter {chapterNumber} — {chapterTitle}
        </p>
        {progress !== undefined && (
          <div className="mt-2 h-1 bg-gray-800 rounded-full w-32">
            <div
              className="h-1 bg-indigo-500 rounded-full"
              style={{ width: `${(progress * 100).toFixed(0)}%` }}
            />
          </div>
        )}
      </div>

      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
    </Link>
  )
}

export default LibraryBookRow
