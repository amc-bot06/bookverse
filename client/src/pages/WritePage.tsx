import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Eye, Trash2, Send } from 'lucide-react'
import { getBookById, getBookChapters, togglePublishChapter, deleteChapter } from '../services/book.service'
import { useAuthStore } from '../store/authStore'
import ConfirmDialog from '../components/ConfirmDialog'
import BackButton from '../components/BackButton'

const WritePage = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [publishTarget, setPublishTarget] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId!),
  })

  const { data: chapters } = useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => getBookChapters(bookId!),
    enabled: !!bookId,
  })

  const publishMutation = useMutation({
    mutationFn: (chapterId: string) => togglePublishChapter(bookId!, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      setPublishTarget(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (chapterId: string) => deleteChapter(bookId!, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      setDeleteTarget(null)
    },
  })

  // Redirect if not the author
  if (book && user?.id !== book.author.id) {
    navigate('/')
    return null
  }

  const publishedCount = chapters?.filter((c: any) => c.published).length ?? 0
  const plannedLabel = book?.plannedChapters ? book.plannedChapters : '?'

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{book?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your chapters · Published: {publishedCount} / {plannedLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/write/${bookId}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Details
          </Link>
          <Link
            to={`/write/${bookId}/chapter/new`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chapter
          </Link>
        </div>
      </div>

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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-gray-500 text-sm w-8 flex-shrink-0">{chapter.chapterNumber}</span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{chapter.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      chapter.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {chapter.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Updated {new Date(chapter.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 self-end sm:self-auto">
                <Link
                  to={`/write/${bookId}/chapter/${chapter.id}/edit`}
                  title="Edit"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <Link
                  to={`/book/${bookId}/chapter/${chapter.id}`}
                  title="Preview"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                {!chapter.published && (
                  <button
                    onClick={() => setPublishTarget(chapter.id)}
                    title="Publish"
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(chapter.id)}
                  title="Delete"
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!publishTarget}
        title="Publish Chapter?"
        message="Are you sure you want to publish this chapter? Once published, readers will immediately be able to access it. You can still edit the chapter later if necessary."
        confirmLabel="Publish"
        onConfirm={() => publishTarget && publishMutation.mutate(publishTarget)}
        onCancel={() => setPublishTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Chapter?"
        message="This will permanently delete this chapter. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  )
}

export default WritePage
