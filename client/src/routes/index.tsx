import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import NotFoundPage from '../pages/NotFoundPage'
import BookDetailPage from '../pages/BookDetailPage'
import ChapterReaderPage from '../pages/ChapterReaderPage'
import WritePage from '../pages/WritePage'
import BrowsePage from '../pages/BrowsePage'
import ProfilePage from '../pages/ProfilePage'
import EditProfilePage from '../pages/EditProfilePage'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/',                              element: <HomePage /> },
      { path: '/book/:id',                      element: <BookDetailPage /> },
      { path: '/book/:bookId/chapter/:chapterId', element: <ChapterReaderPage /> },
      { path: '/write/:bookId',                 element: <WritePage /> },
      { path: '/browse', element: <BrowsePage /> },
      { path: '/profile/:username', element: <ProfilePage /> },
      { path: '/profile/edit',      element: <EditProfilePage /> },
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