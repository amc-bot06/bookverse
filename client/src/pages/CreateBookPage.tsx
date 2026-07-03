import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createBook } from '../services/book.service'
import BookForm, { type BookFormValues } from '../components/BookForm'

const CreateBookPage = () => {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const mutation = useMutation({
    mutationFn: (values: BookFormValues) => createBook(values),
    onSuccess: (book) => {
      navigate(`/write/${book.id}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to create book. Please try again.')
    },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Start a New Book</h1>
      <p className="text-gray-400 text-sm mb-6">Set up the basics — you'll add chapters next.</p>

      <BookForm
        onSubmit={(values) => { setFormError(''); mutation.mutate(values) }}
        isPending={mutation.isPending}
        submitLabel="Create Book"
        pendingLabel="Creating..."
        onCancel={() => navigate('/')}
        serverError={formError}
      />
    </div>
  )
}

export default CreateBookPage
