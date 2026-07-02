import { Heart } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLikeStatus, toggleLike } from '../services/interaction.service'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

interface Props {
  bookId: string
}

const LikeButton = ({ bookId }: Props) => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['like', bookId],
    queryFn: () => getLikeStatus(bookId),
  })

  const mutation = useMutation({
    mutationFn: () => toggleLike(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['like', bookId] })
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
    },
  })

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    mutation.mutate()
  }

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        data?.liked
          ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white'
      }`}
    >
      <Heart
        className={`w-4 h-4 ${data?.liked ? 'fill-red-400' : ''}`}
      />
      {data?.count ?? 0} {data?.liked ? 'Liked' : 'Like'}
    </button>
  )
}

export default LikeButton