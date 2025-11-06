import { useId } from 'react'

export function Waveform(props: React.SVGProps<SVGSVGElement>) {
  const id = useId()
  const bars = {
    total: 100,
    width: 2,
    gap: 2,
    minHeight: 40,
    maxHeight: 100,
  }

  const barHeights = Array.from({ length: bars.total }, (_, index) => {
    const progress = index / bars.total
    const envelope = 1 - (Math.abs(progress - 0.5) * 2) ** 1.5
    const wave = Math.sin(progress * Math.PI * 6 + Math.PI / 4) * 0.3 + 0.7
    const height = envelope * wave
    const calculatedHeight =
      bars.minHeight + height * (bars.maxHeight - bars.minHeight)
    return Math.round(calculatedHeight * 10000) / 10000
  })

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
