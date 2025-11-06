import { Time } from '@vidstack/react'

export function CurrentTime() {
  return (
    <Time
      className='font-medium text-sm tabular-nums'
      type='current'
    />
  )
}

export function Duration() {
  return (
    <Time
      className='font-medium text-muted-foreground text-sm tabular-nums'
      type='duration'
    />
  )
}
