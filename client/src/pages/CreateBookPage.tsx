import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getGenres, createBook } from '../services/book.service'

const CreateBookPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    genres: [] as string[],
    tags: '',
    language: 'English',
  })
  const [formError, setFormError] = useState('')

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const toggleGenre = (id: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(id)
        ? prev.genres.filter((g) => g !== id)
        : [...prev.genres, id],
    }))
  }

  const mutation = useMutation({
    mutationFn: () => createBook({
      title: form.title,
      description: form.description,
      genres: form.genres,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      language: form.language,
    }),
    onSuccess: (book) => {
      navigate(`/write/${book.id}`)
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to create book. Please try again.')
    },
  })

  const canSubmit = form.title.trim().length > 0 && form.description.trim().length >= 10 && form.genres.length > 0

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Start a New Book</h1>
      <p className="text-gray-400 text-sm mb-6">Set up the basics — you'll add chapters next.</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        {formError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Your book's title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What's your story about? (at least 10 characters)"
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres?.map((genre: any) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  form.genres.includes(genre.id)
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-1">Select at least one genre</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Language</label>
            <input
              type="text"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="magic, adventure, dragons"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-gray-500 text-xs mt-1">Comma-separated</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { setFormError(''); mutation.mutate() }}
            disabled={mutation.isPending || !canSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBookPage
