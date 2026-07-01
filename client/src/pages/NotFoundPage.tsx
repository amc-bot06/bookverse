import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-8xl font-bold text-gray-700">404</h1>
        <p className="text-2xl text-white mt-4">Page not found</p>
        <p className="text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
export default NotFoundPage