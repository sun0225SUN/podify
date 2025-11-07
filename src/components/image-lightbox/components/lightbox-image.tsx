import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ZoomState } from '../types'

interface LightboxImageProps {
  src: string
  alt: string
  zoom: ZoomState
  onDoubleClick: (e: React.MouseEvent<HTMLImageElement>) => void
  onWheel: (e: React.WheelEvent<HTMLImageElement>) => void
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void
  onMouseUp: () => void
  onTouchStart: (e: React.TouchEvent<HTMLImageElement>) => void
  onTouchMove: (e: React.TouchEvent<HTMLImageElement>) => void
  onTouchEnd: () => void
}

export function LightboxImage({
  src,
  alt,
  zoom,
  onDoubleClick,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: LightboxImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <div className='relative flex w-full flex-1 items-center justify-center px-4 py-20'>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn(
          'max-h-[70vh] max-w-[80vw] rounded-lg object-contain transition-transform duration-300',
          zoom.scale !== 1 ? 'cursor-move' : 'cursor-zoom-in',
        )}
        style={{
          transform: `scale(${zoom.scale}) translate(${zoom.translateX / zoom.scale}px, ${zoom.translateY / zoom.scale}px)`,
          transformOrigin: 'center center',
        }}
        onDoubleClick={onDoubleClick}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        draggable={false}
      />
    </div>
  )
}
