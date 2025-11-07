export interface Podcast {
  base: PodcastBase
  hosts: HostProps[]
  platforms?: PlatformProps[]
}

export interface Episode {
  id: string
  title: string
  description: string
  content?: string
  published: string
  audio: {
    src: string
    type: string
  }
}

export interface HostProps {
  name: string
  link: string
}

export interface PlatformProps {
  id: string
  name: string
  link: string
}

export interface PodcastBase {
  title: string | null
  description: string | null
  link: string | null
  cover: string | null
}

export interface PodcastRSSInfo {
  title: string
  description: string
  link: string
  cover: string
}

export interface PodcastRSSInfo {
  title: string
  description: string
  link: string
  cover: string
}
