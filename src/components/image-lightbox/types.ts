import type { ImageInfo } from '@/lib/markdown'

export interface ImageLightboxProps {
  images: ImageInfo[]
  open: boolean
  index: number
  onClose: () => void
  onViewChange?: (index: number) => void
}

export interface ImageWithLightboxProps {
  src?: string
  alt?: string
  index: number
  onOpen: (index: number) => void
}

export interface ZoomState {
  scale: number
  translateX: number
  translateY: number
}
