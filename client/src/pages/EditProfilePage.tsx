import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '../services/user.service'
import { useAuthStore } from '../store/authStore'

const EditProfilePage = () => {
  const { user, setAuth, token } = useAuthStore()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
  })

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      setAuth({ ...updatedUser, token: token! } as any, token!)
      navigate(`/profile/${updatedUser.username}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to update profile. Please try again.')
    },
  })

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

      <form
        onSubmit={handleSubmit((data) => { setFormError(''); mutation.mutate(data) })}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
      >
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            {...register('username')}
            type="text"
            placeholder="username"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <p className="text-gray-500 text-xs mt-1">3-20 characters — letters, numbers, and underscores only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Avatar URL
          </label>
          <input
            {...register('avatar')}
            type="url"
            placeholder="https://example.com/avatar.jpg"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <p className="text-gray-500 text-xs mt-1">Paste a link to your profile picture</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder="Tell readers about yourself..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${user?.username}`)}
            className="px-6 py-2.5 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage