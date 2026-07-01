import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-gray-500 text-sm">
        © 2025 BookVerse. All rights reserved.
      </footer>
    </div>
  )
}

export default MainLayout