interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-b-2 border-music-purple-400 ${sizes[size]} ${className}`} />
  )
}

export function LoadingPage({ text = 'Loading...', className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-music-neutral-700 text-lg">{text}</p>
      </div>
    </div>
  )
}

export function EventCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden animate-pulse ${className}`}>
      <div className="aspect-video bg-music-neutral-200"></div>
      <div className="p-6">
        <div className="h-6 bg-music-neutral-200 rounded mb-2"></div>
        <div className="h-4 bg-music-neutral-200 rounded mb-4 w-3/4"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-music-neutral-200 rounded w-16"></div>
          <div className="h-4 bg-music-neutral-200 rounded w-20"></div>
        </div>
        <div className="border-t border-music-neutral-200 mt-4 pt-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-music-neutral-200 rounded-full mr-2"></div>
            <div className="h-3 bg-music-neutral-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventGridSkeleton({ count = 8, className = '' }: { count?: number, className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Backward compatibility aliases
export const RecipeCardSkeleton = EventCardSkeleton
export const RecipeGridSkeleton = EventGridSkeleton

export default LoadingSpinner