import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar — will be built fully in the Homepage phase */}
      <header className="border-b border-gray-800 px-6 py-4">
        <span className="text-xl font-bold text-white tracking-tight">BookVerse</span>
      </header>

      {/* Active page renders here */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer — will be built fully later */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-gray-500 text-sm">
        © 2025 BookVerse. All rights reserved.
      </footer>
    </div>
  )
}

export default MainLayout