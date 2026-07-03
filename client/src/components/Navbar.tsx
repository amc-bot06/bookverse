import { Link, useNavigate } from 'react-router-dom'
import { Search, User, PenSquare, BookMarked } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white tracking-tight flex-shrink-0">
          Book<span className="text-indigo-400">Verse</span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/browse?q=${(e.target as HTMLInputElement).value}`)
                }
              }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/write"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
              >
                <PenSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Write</span>
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.username}</span>
              </Link>
              <Link
                to="/library"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Library"
              >
                <BookMarked className="w-4 h-4" />
              </Link>
              <NotificationBell />
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-4 py-2 text-gray-300 hover:text-white text-sm transition-colors"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar