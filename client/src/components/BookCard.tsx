import { Link } from 'react-router-dom'
import { Eye, Heart, BookOpen } from 'lucide-react'
import type { Book } from '../types'

interface Props {
  book: Book
}

const BookCard = ({ book }: Props) => {
  return (
    <Link to={`/book/${book.id}`} className="group block">
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
          {/* Status badge */}
          <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
            book.status === 'COMPLETED'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-indigo-500/20 text-indigo-400'
          }`}>
            {book.status === 'COMPLETED' ? 'Completed' : 'Ongoing'}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            by {book.author.username}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {book.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {book._count?.likes ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {book._count?.chapters ?? 0}
            </span>
          </div>

          {/* Genres */}
          {book.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {book.genres.slice(0, 2).map((g: any) => (
                <span
                  key={g.genre?.id ?? g.id}
                  className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full"
                >
                  {g.genre?.name ?? g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default BookCard