import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">BookVerse</h1>
          <p className="text-gray-400 mt-1">Your story starts here</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout