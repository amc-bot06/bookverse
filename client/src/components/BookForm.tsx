import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { getGenres } from '../services/book.service'
import { LANGUAGES } from '../constants/languages'

export interface BookFormValues {
  title: string
  description: string
  genres: string[]
  language: string
  tags: string[]
  plannedChapters: number | null
  coverImage: string | null
}

interface Props {
  initialValues?: Partial<BookFormValues>
  onSubmit: (values: BookFormValues) => void
  isPending: boolean
  submitLabel: string
  pendingLabel: string
  onCancel: () => void
  serverError?: string
}

const BookForm = ({
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
  pendingLabel,
  onCancel,
  serverError,
}: Props) => {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [genres, setGenres] = useState<string[]>(initialValues?.genres ?? [])
  const [language, setLanguage] = useState(initialValues?.language ?? '')
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [plannedChaptersInput, setPlannedChaptersInput] = useState(
    initialValues?.plannedChapters != null ? String(initialValues.plannedChapters) : ''
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const { data: genreOptions } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const toggleGenre = (id: string) => {
    setGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setTagInput('')
      return
    }
    setTags((prev) => [...prev, trimmed])
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const titleValid = title.trim().length > 0
  const descriptionValid = description.trim().length >= 10
  const genresValid = genres.length > 0
  const languageValid = language.trim().length > 0
  const tagsValid = tags.length > 0

  const plannedChaptersTrimmed = plannedChaptersInput.trim()
  const plannedChaptersValid =
    plannedChaptersTrimmed === '' ||
    plannedChaptersTrimmed === '?' ||
    (Number.isInteger(Number(plannedChaptersTrimmed)) && Number(plannedChaptersTrimmed) > 0)

  const canSubmit = titleValid && descriptionValid && genresValid && languageValid && tagsValid && plannedChaptersValid

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!canSubmit) return
    const plannedChapters =
      plannedChaptersTrimmed === '' || plannedChaptersTrimmed === '?'
        ? null
        : parseInt(plannedChaptersTrimmed, 10)
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      genres,
      language,
      tags,
      plannedChapters,
      coverImage: coverImage.trim() || null,
    })
  }

  const showError = (valid: boolean) => submitAttempted && !valid

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
      {serverError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your book's title"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
        {showError(titleValid) && (
          <p className="text-red-400 text-xs mt-1">Title is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Cover Image URL</label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/cover.jpg"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
        <p className="text-gray-500 text-xs mt-1">Optional — paste a link to your book's cover image</p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's your story about? (at least 10 characters)"
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
        />
        {showError(descriptionValid) && (
          <p className="text-red-400 text-xs mt-1">Description must be at least 10 characters</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Genres</label>
        <div className="flex flex-wrap gap-2">
          {genreOptions?.map((genre: any) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                genres.includes(genre.id)
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <p className={`text-xs mt-1 ${showError(genresValid) ? 'text-red-400' : 'text-gray-500'}`}>
          Select at least one genre
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled>Select a language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {showError(languageValid) && (
            <p className="text-red-400 text-xs mt-1">Please select a language</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Planned Chapters</label>
          <input
            type="text"
            value={plannedChaptersInput}
            onChange={(e) => setPlannedChaptersInput(e.target.value)}
            placeholder="e.g. 50 or ?"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          {showError(plannedChaptersValid) ? (
            <p className="text-red-400 text-xs mt-1">Enter a positive number, or ? if unknown</p>
          ) : (
            <p className="text-gray-500 text-xs mt-1">Leave blank or use ? if you're not sure yet</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Tags</label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="magic, adventure, dragons..."
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="flex-shrink-0 px-3 bg-gray-800 border border-gray-700 hover:border-indigo-500 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {showError(tagsValid) && (
          <p className="text-red-400 text-xs mt-1">Add at least one tag</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </div>
  )
}

export default BookForm
