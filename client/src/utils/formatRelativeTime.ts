// Formats a timestamp as relative time (e.g. "2m ago") for recent dates,
// falling back to a plain date once it's more than a week old.
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)

  if (diffSec < 5) return 'Just now'
  if (diffSec < 60) return `${diffSec}s ago`

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}d ago`

  return date.toLocaleDateString()
}
