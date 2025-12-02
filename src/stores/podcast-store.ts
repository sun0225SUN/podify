import { Store } from '@tanstack/store'
import type { Episode, PodcastRSSInfo } from '@/types/podcast'

export type PodcastStore = {
  podcastInfo: PodcastRSSInfo | null
  episodes: Episode[]
}

export const podcastStore = new Store<PodcastStore>({
  podcastInfo: null,
  episodes: [],
})

export function setPodcastInfo(podcastInfo: PodcastRSSInfo) {
  podcastStore.setState((state) => ({
    ...state,
    podcastInfo,
  }))
}

export function setEpisodes(episodes: Episode[]) {
  podcastStore.setState((state) => ({
    ...state,
    episodes,
  }))
}
