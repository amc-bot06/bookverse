import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import NotFoundPage from '../pages/NotFoundPage'
import BookDetailPage from '../pages/BookDetailPage'
import ChapterReaderPage from '../pages/ChapterReaderPage'
import WritePage from '../pages/WritePage'
import CreateBookPage from '../pages/CreateBookPage'
import BrowsePage from '../pages/BrowsePage'
import ProfilePage from '../pages/ProfilePage'
import EditProfilePage from '../pages/EditProfilePage'
import LibraryPage from '../pages/LibraryPage'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/',                                element: <HomePage /> },
      { path: '/browse',                          element: <BrowsePage /> },
      { path: '/book/:id',                        element: <BookDetailPage /> },
      { path: '/book/:bookId/chapter/:chapterId', element: <ChapterReaderPage /> },
      { path: '/profile/:username',               element: <ProfilePage /> },

      // Protected — must be logged in
      {
        path: '/write',
        element: <ProtectedRoute><CreateBookPage /></ProtectedRoute>,
      },
      {
        path: '/write/:bookId',
        element: <ProtectedRoute><WritePage /></ProtectedRoute>,
      },
      {
        path: '/profile/edit',
        element: <ProtectedRoute><EditProfilePage /></ProtectedRoute>,
      },
      {
        path: '/library',
        element: <ProtectedRoute><LibraryPage /></ProtectedRoute>,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',  element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router