import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookById, getBookChapters, getChapter, createChapter, updateChapter } from '../services/book.service'
import { useAuthStore } from '../store/authStore'
import ChapterForm, { type ChapterFormValues } from '../components/ChapterForm'
import BackButton from '../components/BackButton'

const ChapterEditorPage = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId?: string }>()
  const isEditMode = !!chapterId
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState('')

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId!),
  })

  const { data: chapters } = useQuery({
    queryKey: ['chapters', bookId],
    queryFn: () => getBookChapters(bookId!),
    enabled: !isEditMode,
  })

  const { data: existingChapter, isLoading: chapterLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapter(bookId!, chapterId!),
    enabled: isEditMode,
  })

  const nextChapterNumber = (chapters?.length ?? 0) + 1

  const createMutation = useMutation({
    mutationFn: (values: ChapterFormValues) => createChapter(bookId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
      navigate(`/write/${bookId}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to save chapter. Please try again.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: ChapterFormValues) => updateChapter(bookId!, chapterId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters', bookId] })
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] })
      navigate(`/write/${bookId}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to save chapter. Please try again.')
    },
  })

  // Redirect if not the author
  if (book && user?.id !== book.author.id) {
    navigate('/')
    return null
  }

  if (isEditMode && chapterLoading) {
    return (
      <div className="max-w-6xl mx-auto w-full">
        <div className="h-96 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <BackButton />
      <h1 className="text-2xl font-bold text-white mb-1">
        {isEditMode ? 'Edit Chapter' : 'New Chapter'}
      </h1>
      <p className="text-gray-400 text-sm mb-6">{book?.title}</p>

      <ChapterForm
        initialValues={
          isEditMode
            ? {
                title: existingChapter?.title,
                content: existingChapter?.content,
                chapterNumber: existingChapter?.chapterNumber,
              }
            : { chapterNumber: nextChapterNumber }
        }
        onSubmit={(values) => {
          setFormError('')
          if (isEditMode) updateMutation.mutate(values)
          else createMutation.mutate(values)
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
        submitLabel={isEditMode ? 'Save Changes' : 'Save Chapter'}
        pendingLabel="Saving..."
        onCancel={() => navigate(`/write/${bookId}`)}
        serverError={formError}
      />
    </div>
  )
}

export default ChapterEditorPage
