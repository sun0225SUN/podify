'use client'

import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/components/theme/provider'
import { useIsClient } from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'
import { LightboxControls } from './components/lightbox-controls'
import { LightboxImage } from './components/lightbox-image'
import { LightboxThumbnails } from './components/lightbox-thumbnails'
import { useLightboxAnimation } from './hooks/use-lightbox-animation'
import { useLightboxGestures } from './hooks/use-lightbox-gestures'
import { useLightboxNavigation } from './hooks/use-lightbox-navigation'
import { useLightboxZoom } from './hooks/use-lightbox-zoom'
import type { ImageLightboxProps, ImageWithLightboxProps } from './types'

export function ImageLightbox({
  images,
  open,
  index,
  onClose,
  onViewChange,
}: ImageLightboxProps) {
  const isClient = useIsClient()
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const { isVisible, mounted } = useLightboxAnimation(open)

  const {
    zoom,
    setZoom,
    resetZoom,
    handleZoomIn,
    handleZoomOut,
    handleDoubleClick,
    handleWheel,
  } = useLightboxZoom()

  const { currentIndex, handlePrevious, handleNext, handleThumbnailClick } =
    useLightboxNavigation({
      imagesLength: images.length,
      initialIndex: index,
      open,
      onViewChange,
      resetZoom,
    })

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleContainerTouchStart,
    handleContainerTouchEnd,
  } = useLightboxGestures({
    zoom,
    setZoom,
    onPrevious: handlePrevious,
    onNext: handleNext,
  })

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const isDark = useMemo(() => {
    if (!isClient) return false
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme === 'dark'
  }, [theme, isClient])

  const currentImage = images[currentIndex]

  if (!isClient || !mounted || images.length === 0 || !currentImage) {
    return null
  }

  const lightboxContent = (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'transition-opacity duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
      style={{
        backgroundColor: isDark
          ? 'rgba(0, 0, 0, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        willChange: 'opacity',
      }}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onClose()
        }
      }}
      onTouchStart={handleContainerTouchStart}
      onTouchEnd={handleContainerTouchEnd}
    >
      <LightboxControls
        isDark={isDark}
        currentIndex={currentIndex}
        imagesLength={images.length}
        zoomScale={zoom.scale}
        onClose={onClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <LightboxImage
        src={currentImage.src}
        alt={currentImage.alt || ''}
        zoom={zoom}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {currentImage.alt && (
        <div
          className={cn(
            '-translate-x-1/2 absolute bottom-20 left-1/2 max-w-[80vw] rounded-lg bg-black/70 px-4 py-2 text-center text-sm backdrop-blur-md',
            isDark && 'bg-white/10 text-white',
          )}
        >
          {currentImage.alt}
        </div>
      )}

      <LightboxThumbnails
        images={images}
        currentIndex={currentIndex}
        isDark={isDark}
        onThumbnailClick={handleThumbnailClick}
      />
    </div>
  )

  return createPortal(lightboxContent, document.body)
}

export function ImageWithLightbox({
  src,
  alt,
  index,
  onOpen,
}: ImageWithLightboxProps) {
  if (!src) return null

  return (
    <button
      type='button'
      onClick={() => onOpen(index)}
      aria-label={alt || 'Open image in lightbox'}
      className='border-none bg-transparent p-0 outline-none'
      style={{ border: 'none', outline: 'none' }}
    >
      <img
        src={src}
        alt={alt || ''}
        className='my-6 max-h-[500px] max-w-full rounded-lg object-contain shadow-md'
        loading='lazy'
      />
    </button>
  )
}
