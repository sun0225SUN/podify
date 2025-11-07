import { Time } from '@vidstack/react'
import { cn } from '@/lib/utils'

interface TimeProps {
  className?: string
}

export function CurrentTime({ className }: TimeProps = {}) {
  return (
    <Time
      className={cn('font-medium text-sm tabular-nums', className)}
      type='current'
    />
  )
}

export function Duration({ className }: TimeProps = {}) {
  return (
    <Time
      className={cn(
        'font-medium text-muted-foreground text-sm tabular-nums',
        className,
      )}
      type='duration'
    />
  )
}
