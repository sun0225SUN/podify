import React, { useEffect, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

interface ScrollVelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  baseVelocity?: number
  direction?: 1 | -1
  isPlaying?: boolean
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function ScrollTextContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      {children}
    </div>
  )
}

export function ScrollTextRow({
  children,
  baseVelocity = 5,
  direction = 1,
  isPlaying = true,
  className,
  ...props
}: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const [numCopies, setNumCopies] = useState(1)

  const baseX = useMotionValue(0)
  const directionRef = useRef<number>(direction >= 0 ? 1 : -1)
  const unitWidth = useMotionValue(0)

  const isInViewRef = useRef(true)
  const isPageVisibleRef = useRef(true)
  const prefersReducedMotionRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const block = blockRef.current
    if (!container || !block) return

    const updateSizes = () => {
      const cw = container.offsetWidth || 0
      const bw = block.scrollWidth || 0
      unitWidth.set(bw)
      const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1
      setNumCopies((prev) => (prev === nextCopies ? prev : nextCopies))
    }

    updateSizes()

    const ro = new ResizeObserver(updateSizes)
    ro.observe(container)
    ro.observe(block)

    const io = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting
    })
    io.observe(container)

    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", handleVisibility, {
      passive: true,
    })
    handleVisibility()

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handlePRM = () => {
      prefersReducedMotionRef.current = mq.matches
    }
    mq.addEventListener("change", handlePRM)
    handlePRM()

    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      mq.removeEventListener("change", handlePRM)
    }
  }, [children, unitWidth])

  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1
    const offset = Number(v) || 0
    return `${-wrap(0, width, offset)}px`
  })

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current || !isPlaying) return
    const dt = delta / 1000

    const bw = unitWidth.get() || 0
    if (bw <= 0) return
    const pixelsPerSecond = (bw * baseVelocity) / 100
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1
    const moveBy = directionRef.current * pixelsPerSecond * speedMultiplier * dt
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <motion.div
        className="inline-flex transform-gpu items-center will-change-transform select-none"
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            aria-hidden={i !== 0}
            className="inline-flex shrink-0 items-center"
          >
            {children}
            {i < numCopies - 1 && (
              <div className="inline-flex shrink-0 w-8" aria-hidden="true" />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
