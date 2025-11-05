export function TinyWaveFormIcon({
  colors = [],
  className,
}: {
  colors: string[]
  className?: string
}) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 10 10'
      className={className}
    >
      <path
        d='M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z'
        className={colors[0]}
      />
      <path
        d='M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z'
        className={colors[1]}
      />
    </svg>
  )
}
