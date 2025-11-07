import { useEffect, useState } from 'react'

/**
 * Check if the code is running on the client side.
 * Returns false during SSR, true after hydration.
 *
 * @returns {boolean} true if running on client, false during SSR
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isClient = useIsClient()
 *
 *   if (!isClient) {
 *     return null // Skip SSR
 *   }
 *
 *   return <div>Client-only content</div>
 * }
 * ```
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
