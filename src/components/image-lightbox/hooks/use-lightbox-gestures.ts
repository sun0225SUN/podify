import { useCallback, useRef, useState } from 'react'
import type { ZoomState } from '../types'

interface UseLightboxGesturesProps {
  zoom: ZoomState
  setZoom: React.Dispatch<React.SetStateAction<ZoomState>>
  onPrevious: () => void
  onNext: () => void
}

export function useLightboxGestures({
  zoom,
  setZoom,
  onPrevious,
  onNext,
}: UseLightboxGesturesProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState<{
    x: number
    y: number
    distance: number
  } | null>(null)
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)

  // Mouse drag for panning when zoomed
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (zoom.scale !== 1) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - zoom.translateX,
          y: e.clientY - zoom.translateY,
        })
      }
    },
    [zoom],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (isDragging && zoom.scale !== 1) {
        setZoom({
          ...zoom,
          translateX: e.clientX - dragStart.x,
          translateY: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, zoom, dragStart, setZoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLImageElement>) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY,
        )
        setTouchStart({
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
          distance,
        })
      } else if (e.touches.length === 1 && zoom.scale !== 1) {
        setIsDragging(true)
        setDragStart({
          x: e.touches[0].clientX - zoom.translateX,
          y: e.touches[0].clientY - zoom.translateY,
        })
      }
    },
    [zoom],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLImageElement>) => {
      if (e.touches.length === 2 && touchStart) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY,
        )
        const scale = (distance / touchStart.distance) * zoom.scale
        setZoom({
          scale: Math.max(0.5, Math.min(3, scale)),
          translateX: zoom.translateX,
          translateY: zoom.translateY,
        })
      } else if (e.touches.length === 1 && isDragging && zoom.scale !== 1) {
        setZoom({
          ...zoom,
          translateX: e.touches[0].clientX - dragStart.x,
          translateY: e.touches[0].clientY - dragStart.y,
        })
      }
    },
    [touchStart, zoom, isDragging, dragStart, setZoom],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setTouchStart(null)
  }, [])

  // Swipe detection for image navigation
  const handleContainerTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoom.scale === 1) {
        swipeStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    },
    [zoom.scale],
  )

  const handleContainerTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeStartRef.current || zoom.scale !== 1) return

      const swipeEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
      const deltaX = swipeEnd.x - swipeStartRef.current.x
      const deltaY = swipeEnd.y - swipeStartRef.current.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Only handle horizontal swipes
      if (absDeltaX > absDeltaY && absDeltaX > 50) {
        if (deltaX > 0) {
          onPrevious()
        } else {
          onNext()
        }
      }

      swipeStartRef.current = null
    },
    [zoom.scale, onPrevious, onNext],
  )

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleContainerTouchStart,
    handleContainerTouchEnd,
  }
}
