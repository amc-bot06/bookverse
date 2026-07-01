import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
  {
    // Main pages — navbar + footer visible
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },
  {
    // Auth pages — centered card layout, no navbar
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    // Catch-all — any unknown URL lands here
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router