import { useCallback, useState } from 'react'

interface UseLightboxOptions {
  initialIndex?: number
}

interface UseLightboxReturn {
  isOpen: boolean
  currentIndex: number
  open: (index: number) => void
  close: () => void
  setIndex: (index: number) => void
}

/**
 * Hook for managing lightbox state
 *
 * @param options - Configuration options
 * @returns Lightbox state and control functions
 */
export function useLightbox(
  options: UseLightboxOptions = {},
): UseLightboxReturn {
  const { initialIndex = 0 } = options
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const open = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  return {
    isOpen,
    currentIndex,
    open,
    close,
    setIndex,
  }
}
