import { useEffect, useRef, useState } from 'react'

export function useLightboxAnimation(open: boolean) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (open) {
      // Mount the component first
      setMounted(true)
      setIsVisible(false)
      // Trigger animation on next frame
      const rafId = requestAnimationFrame(() => {
        setIsVisible(true)
      })
      return () => cancelAnimationFrame(rafId)
    } else {
      // Start fade out animation
      setIsVisible(false)
      // Remove from DOM after animation completes
      timeoutRef.current = setTimeout(() => {
        setMounted(false)
      }, 300) // Match transition duration
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }
  }, [open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  return { isVisible, mounted }
}
