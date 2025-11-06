import { useStore } from '@tanstack/react-store'
import { useEffect, useId, useRef, useState } from 'react'
import { getPlayerStore } from '@/stores/player-store'

const bars = {
  total: 100,
  width: 2,
  gap: 2,
  minHeight: 40,
  maxHeight: 100,
}

const generateStaticHeights = () => {
  return Array.from({ length: bars.total }, (_, index) => {
    const progress = index / bars.total
    const envelope = 1 - (Math.abs(progress - 0.5) * 2) ** 1.5
    const wave = Math.sin(progress * Math.PI * 6 + Math.PI / 4) * 0.3 + 0.7
    const height = envelope * wave
    const calculatedHeight =
      bars.minHeight + height * (bars.maxHeight - bars.minHeight)
    return Math.round(calculatedHeight * 10000) / 10000
  })
}

const generateWaveHeights = (time: number) => {
  return Array.from({ length: bars.total }, (_, index) => {
    const progress = index / bars.total

    const wave1 = Math.sin(progress * Math.PI * 8 + time * 2) * 0.4
    const wave2 = Math.sin(progress * Math.PI * 12 + time * 1.5) * 0.3
    const wave3 = Math.sin(progress * Math.PI * 6 + time * 2.5) * 0.2
    const wave4 = Math.sin(progress * Math.PI * 4 + time * 1.2) * 0.1

    const combinedWave = (wave1 + wave2 + wave3 + wave4 + 1) / 2

    const envelope = 1 - (Math.abs(progress - 0.5) * 2) ** 0.8
    const height = combinedWave * envelope

    const calculatedHeight =
      bars.minHeight + height * (bars.maxHeight - bars.minHeight)
    return Math.round(calculatedHeight * 10000) / 10000
  })
}

export function Waveform(props: React.SVGProps<SVGSVGElement>) {
  const id = useId()
  const playerStore = getPlayerStore()
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)

  const [barHeights, setBarHeights] = useState<number[]>(() =>
    generateStaticHeights(),
  )
  const timeRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(generateStaticHeights())
      timeRef.current = 0
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return

    let animationFrameId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      timeRef.current += deltaTime * 2

      setBarHeights(generateWaveHeights(timeRef.current))

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPlaying])

  return (
    <svg
      {...props}
      aria-hidden='true'
    >
      <defs>
        <linearGradient
          id={`${id}-fade`}
          x1='0'
          x2='0'
          y1='0'
          y2='1'
        >
          <stop
            offset='40%'
            stopColor='white'
          />
          <stop
            offset='100%'
            stopColor='black'
          />
        </linearGradient>
        <linearGradient id={`${id}-gradient`}>
          <stop
            offset='0%'
            stopColor='var(--theme-gradient-start)'
          />
          <stop
            offset='50%'
            stopColor='var(--theme-gradient-mid)'
          />
          <stop
            offset='100%'
            stopColor='var(--theme-gradient-end)'
          />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect
            width='100%'
            height='100%'
            fill={`url(#${id}-pattern)`}
          />
        </mask>
        <pattern
          id={`${id}-pattern`}
          width={bars.total * bars.width + bars.total * bars.gap}
          height='100%'
          patternUnits='userSpaceOnUse'
        >
          {Array.from({ length: bars.total }, (_, index) => (
            <rect
              key={index}
              width={bars.width}
              height={`${barHeights[index]}%`}
              x={bars.gap * (index + 1) + bars.width * index}
              fill={`url(#${id}-fade)`}
            />
          ))}
        </pattern>
      </defs>
      <rect
        width='100%'
        height='100%'
        fill={`url(#${id}-gradient)`}
        mask={`url(#${id}-mask)`}
        opacity='0.25'
      />
    </svg>
  )
}
