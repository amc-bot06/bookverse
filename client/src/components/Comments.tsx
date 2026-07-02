import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Send } from 'lucide-react'
import { getComments, addComment, deleteComment } from '../services/interaction.service'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

interface Props {
  bookId: string
}

const Comments = ({ bookId }: Props) => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  const { data: comments } = useQuery({
    queryKey: ['comments', bookId],
    queryFn: () => getComments(bookId),
  })

  const addMutation = useMutation({
    mutationFn: () => addComment(bookId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', bookId] })
      setContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(bookId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', bookId] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (!content.trim()) return
    addMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">
        Comments ({comments?.length ?? 0})
      </h3>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? 'Write a comment...' : 'Login to comment'}
          disabled={!isAuthenticated}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={addMutation.isPending || !content.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {comments?.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No comments yet. Be the first!
          </p>
        ) : (
          comments?.map((comment: any) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {comment.user.avatar ? (
                  <img
                    src={comment.user.avatar}
                    className="w-full h-full object-cover rounded-full"
                    alt={comment.user.username}
                  />
                ) : (
                  comment.user.username[0].toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">
                    {comment.user.username}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1 break-words">
                  {comment.content}
                </p>
              </div>

              {/* Delete — only show for comment owner */}
              {user?.id === comment.user.id && (
                <button
                  onClick={() => deleteMutation.mutate(comment.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Comments