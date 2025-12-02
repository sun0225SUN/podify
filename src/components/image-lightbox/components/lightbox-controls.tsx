import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxControlsProps {
  isDark: boolean
  currentIndex: number
  imagesLength: number
  zoomScale: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function LightboxControls({
  isDark,
  currentIndex,
  imagesLength,
  zoomScale,
  onClose,
  onPrevious,
  onNext,
  onZoomIn,
  onZoomOut,
}: LightboxControlsProps) {
  const buttonClassName = cn(
    'z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95',
    isDark
      ? 'border-white/20 bg-black/30 text-white hover:bg-black/50'
      : 'border-black/20 bg-white/30 text-black hover:bg-white/50',
  )

  return (
    <>
      <button
        type='button'
        onClick={onPrevious}
        disabled={currentIndex <= 0}
        className={cn(
          buttonClassName,
          '-translate-y-1/2 absolute top-1/2 left-4',
          currentIndex <= 0 && 'cursor-not-allowed opacity-50',
        )}
        aria-label='Previous image'
      >
        <ChevronLeft className='size-6' />
      </button>
      <button
        type='button'
        onClick={onNext}
        disabled={currentIndex >= imagesLength - 1}
        className={cn(
          buttonClassName,
          '-translate-y-1/2 absolute top-1/2 right-4',
          currentIndex >= imagesLength - 1 && 'cursor-not-allowed opacity-50',
        )}
        aria-label='Next image'
      >
        <ChevronRight className='size-6' />
      </button>
      <div className='absolute top-3 right-4 z-50 flex flex-row gap-5'>
        <button
          type='button'
          onClick={onZoomOut}
          disabled={zoomScale <= 0.5}
          className={cn(
            buttonClassName,
            zoomScale <= 0.5 && 'cursor-not-allowed opacity-50',
          )}
          aria-label='Zoom out'
        >
          <ZoomOut className='size-5' />
        </button>
        <button
          type='button'
          onClick={onZoomIn}
          disabled={zoomScale >= 3}
          className={cn(
            buttonClassName,
            zoomScale >= 3 && 'cursor-not-allowed opacity-50',
          )}
          aria-label='Zoom in'
        >
          <ZoomIn className='size-5' />
        </button>
        <button
          type='button'
          onClick={onClose}
          className={buttonClassName}
          aria-label='Close lightbox'
        >
          <X className='size-5' />
        </button>
      </div>
    </>
  )
}
