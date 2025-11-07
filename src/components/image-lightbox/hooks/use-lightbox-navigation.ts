import { useCallback, useEffect, useState } from 'react'

interface UseLightboxNavigationProps {
  imagesLength: number
  initialIndex: number
  open: boolean
  onViewChange?: (index: number) => void
  resetZoom: () => void
}

export function useLightboxNavigation({
  imagesLength,
  initialIndex,
  open,
  onViewChange,
  resetZoom,
}: UseLightboxNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Update current index when prop changes
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      resetZoom()
    }
  }, [initialIndex, open, resetZoom])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      onViewChange?.(newIndex)
      resetZoom()
    }
  }, [currentIndex, onViewChange, resetZoom])

  const handleNext = useCallback(() => {
    if (currentIndex < imagesLength - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      onViewChange?.(newIndex)
      resetZoom()
    }
  }, [currentIndex, imagesLength, onViewChange, resetZoom])

  const handleThumbnailClick = useCallback(
    (idx: number) => {
      setCurrentIndex(idx)
      onViewChange?.(idx)
      resetZoom()
    },
    [onViewChange, resetZoom],
  )

  // Handle keyboard navigation (arrow keys)
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious()
      } else if (e.key === 'ArrowRight' && currentIndex < imagesLength - 1) {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, currentIndex, imagesLength, handlePrevious, handleNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return {
    currentIndex,
    handlePrevious,
    handleNext,
    handleThumbnailClick,
  }
}
