import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookById, updateBook } from '../services/book.service'
import BookForm, { type BookFormValues } from '../components/BookForm'
import BackButton from '../components/BackButton'
import { useAuthStore } from '../store/authStore'

const EditBookPage = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState('')

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookById(bookId!),
  })

  const mutation = useMutation({
    mutationFn: (values: BookFormValues) => updateBook(bookId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] })
      navigate(`/write/${bookId}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to update book. Please try again.')
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-96 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!book) {
    return <div className="text-center py-20 text-gray-400">Book not found.</div>
  }

  // Redirect if not the author
  if (user?.id !== book.author.id) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold text-white mb-1">Edit Book</h1>
      <p className="text-gray-400 text-sm mb-6">Update your book's details.</p>

      <BookForm
        initialValues={{
          title: book.title,
          description: book.description,
          genres: (book.genres as any[]).map((g) => g.genre?.id ?? g.id),
          language: book.language,
          tags: book.tags,
          plannedChapters: book.plannedChapters ?? null,
          coverImage: book.coverImage ?? null,
        }}
        onSubmit={(values) => { setFormError(''); mutation.mutate(values) }}
        isPending={mutation.isPending}
        submitLabel="Save Changes"
        pendingLabel="Saving..."
        onCancel={() => navigate(`/write/${bookId}`)}
        serverError={formError}
      />
    </div>
  )
}

export default EditBookPage
