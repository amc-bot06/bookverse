import { useState } from 'react'

export interface ChapterFormValues {
  title: string
  content: string
  chapterNumber: number
}

interface Props {
  initialValues?: Partial<ChapterFormValues>
  onSubmit: (values: ChapterFormValues) => void
  isPending: boolean
  submitLabel: string
  pendingLabel: string
  onCancel: () => void
  serverError?: string
}

const ChapterForm = ({
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
  pendingLabel,
  onCancel,
  serverError,
}: Props) => {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [chapterNumber, setChapterNumber] = useState(initialValues?.chapterNumber ?? 1)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const titleValid = title.trim().length > 0
  const contentValid = content.trim().length > 0
  const chapterNumberValid = Number.isInteger(chapterNumber) && chapterNumber > 0

  const canSubmit = titleValid && contentValid && chapterNumberValid

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!canSubmit) return
    onSubmit({ title: title.trim(), content, chapterNumber })
  }

  const showError = (valid: boolean) => submitAttempted && !valid

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 space-y-4">
      {serverError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {serverError}
        </div>
      )}

      {/* Edit / Preview tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'edit'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            mode === 'preview'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Preview
        </button>
      </div>

      {mode === 'edit' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Chapter Number</label>
              <input
                type="number"
                min={1}
                step={1}
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              {showError(chapterNumberValid) && (
                <p className="text-red-400 text-xs mt-1">Must be a positive whole number</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Chapter Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              {showError(titleValid) && (
                <p className="text-red-400 text-xs mt-1">Title is required</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your chapter here..."
              rows={24}
              className="w-full min-h-[500px] bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
            />
            {showError(contentValid) && (
              <p className="text-red-400 text-xs mt-1">Content is required</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-6 sm:p-10">
          <p className="text-indigo-400 text-sm mb-1">Chapter {chapterNumber || '?'}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            {title || 'Untitled Chapter'}
          </h1>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {content || 'Nothing written yet.'}
            </div>
          </div>
        </div>
      )}

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

export default ChapterForm
