export interface Podcast {
  base: PodcastBase
  hosts: HostProps[]
  about: string
  platforms: PlatformProps[]
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
  name: string
  link: string
}

export interface PodcastBase {
  title: string
  description: string
  link: string
  cover: string
}
