import type { ImageInfo } from '@/lib/markdown'
import { cn } from '@/lib/utils'

interface LightboxThumbnailsProps {
  images: ImageInfo[]
  currentIndex: number
  isDark: boolean
  onThumbnailClick: (index: number) => void
}

export function LightboxThumbnails({
  images,
  currentIndex,
  isDark,
  onThumbnailClick,
}: LightboxThumbnailsProps) {
  if (images.length <= 1) return null

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex items-center justify-center gap-5 overflow-x-auto px-4 py-4',
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: isDark
          ? 'rgba(255, 255, 255, 0.3) transparent'
          : 'rgba(0, 0, 0, 0.3) transparent',
      }}
    >
      {images.map((img, idx) => (
        <button
          key={idx}
          type='button'
          onClick={() => onThumbnailClick(idx)}
          className={cn(
            'group relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300',
            idx === currentIndex
              ? 'scale-110 opacity-100'
              : 'opacity-70 hover:scale-105 hover:opacity-100',
          )}
          style={{
            width: '80px',
            height: '80px',
          }}
          aria-label={`View image ${idx + 1}`}
        >
          <img
            src={img.src}
            alt={img.alt || ''}
            className={cn(
              'h-full w-full object-cover transition-transform duration-300',
              idx === currentIndex && 'scale-105',
            )}
            loading='lazy'
          />
        </button>
      ))}
    </div>
  )
}
