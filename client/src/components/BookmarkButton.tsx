import { Bookmark } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookmarkStatus, toggleBookmark } from '../services/library.service'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

interface Props {
  bookId: string
  chapterId: string
}

const BookmarkButton = ({ bookId, chapterId }: Props) => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['bookmark', chapterId],
    queryFn: () => getBookmarkStatus(chapterId),
    enabled: isAuthenticated,
  })

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(bookId, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', chapterId] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
  })

  const handleClick = () => {
    if (!isAuthenticated) { navigate('/login'); return }
    mutation.mutate()
  }

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
        data?.bookmarked
          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30'
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${data?.bookmarked ? 'fill-indigo-400' : ''}`} />
      {data?.bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}

export default BookmarkButton