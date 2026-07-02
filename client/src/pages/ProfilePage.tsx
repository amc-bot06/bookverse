import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, UserCheck, Calendar } from 'lucide-react'
import { getUserProfile, getUserBooks, followUser, getFollowStatus } from '../services/user.service'
import { useAuthStore } from '../store/authStore'
import BookCard from '../components/BookCard'

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const isOwnProfile = currentUser?.username === username

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getUserProfile(username!),
  })

  const { data: books } = useQuery({
    queryKey: ['userBooks', username],
    queryFn: () => getUserBooks(username!),
    enabled: !!username,
  })

  const { data: followStatus } = useQuery({
    queryKey: ['followStatus', username],
    queryFn: () => getFollowStatus(username!),
    enabled: !!username && isAuthenticated && !isOwnProfile,
  })

  const followMutation = useMutation({
    mutationFn: () => followUser(username!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', username] })
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
    },
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-800 rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-800 rounded w-40" />
            <div className="h-4 bg-gray-800 rounded w-64" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <div className="text-center py-20 text-gray-400">User not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Profile Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                profile.username[0].toUpperCase()
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
              {profile.bio && (
                <p className="text-gray-400 text-sm mt-1 max-w-md">{profile.bio}</p>
              )}
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                <Calendar className="w-3 h-3" />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Follow / Edit Button */}
          {isAuthenticated && !isOwnProfile && (
            <button
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                followStatus?.following
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {followStatus?.following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{profile._count.books}</p>
            <p className="text-gray-400 text-xs mt-0.5">Books</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{profile._count.followers}</p>
            <p className="text-gray-400 text-xs mt-0.5">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{profile._count.following}</p>
            <p className="text-gray-400 text-xs mt-0.5">Following</p>
          </div>
        </div>
      </div>

      {/* Books */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Published Books
        </h2>

        {books?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">No published books yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books?.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default ProfilePage