import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Eye, EyeOff } from 'lucide-react'
import { getBookById, getBookChapters, createChapter, togglePublishChapter } from '../services/book.service'
import { useAuthStore } from '../store/authStore'

const WritePage = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [newChapter, setNewChapter] = useState({
    title: '',
    content: '',
    chapterNumber: 1,
    published: false,
  })
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId!),
  })

  const { data: chapters } = useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => getBookChapters(bookId!),
    enabled: !!bookId,
  })

  const nextChapterNumber = (chapters?.length ?? 0) + 1

  const openForm = () => {
    setFormError('')
    setNewChapter((prev) => ({ ...prev, chapterNumber: nextChapterNumber }))
    setShowForm(true)
  }

  const createMutation = useMutation({
    mutationFn: () => createChapter(bookId!, newChapter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
      setNewChapter({ title: '', content: '', chapterNumber: nextChapterNumber + 1, published: false })
      setFormError('')
      setShowForm(false)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to save chapter. Please try again.')
    },
  })

  const publishMutation = useMutation({
    mutationFn: (chapterId: string) => togglePublishChapter(bookId!, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
    },
  })

  // Redirect if not the author
  if (book && user?.id !== book.author.id) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{book?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your chapters</p>
        </div>
        <button
          onClick={() => (showForm ? setShowForm(false) : openForm())}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chapter
        </button>
      </div>

      {/* New Chapter Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">New Chapter</h2>

          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Chapter Number</label>
              <input
                type="number"
                value={newChapter.chapterNumber}
                onChange={(e) => setNewChapter({ ...newChapter, chapterNumber: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={newChapter.title}
                onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                placeholder="Chapter title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <textarea
              value={newChapter.content}
              onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })}
              placeholder="Write your chapter here..."
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={newChapter.published}
                onChange={(e) => setNewChapter({ ...newChapter, published: e.target.checked })}
                className="rounded"
              />
              Publish immediately
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowForm(false); setFormError('') }}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !newChapter.title || !newChapter.content}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Chapter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="space-y-2">
        {chapters?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500">No chapters yet. Add your first one!</p>
          </div>
        ) : (
          chapters?.map((chapter: any) => (
            <div
              key={chapter.id}
              className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-8">{chapter.chapterNumber}</span>
                <div>
                  <p className="text-white text-sm font-medium">{chapter.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {chapter.published ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => publishMutation.mutate(chapter.id)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title={chapter.published ? 'Unpublish' : 'Publish'}
                >
                  {chapter.published
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default WritePage