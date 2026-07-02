// Shown while library rows are loading — prevents layout shift
const LibraryBookRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl animate-pulse">
      <div className="w-12 h-16 bg-gray-800 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  )
}

export default LibraryBookRowSkeleton
