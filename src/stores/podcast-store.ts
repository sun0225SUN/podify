import { Store } from '@tanstack/store'
import type { Episode, PodcastRSSInfo } from '@/types/podcast'

export type PodcastStore = {
  podcastInfo: PodcastRSSInfo | null
  episodes: Episode[]
}

let podcastStore: Store<PodcastStore> | null = null

const createPodcastStore = (): Store<PodcastStore> => {
  return new Store<PodcastStore>({
    podcastInfo: null,
    episodes: [],
  })
}

export function initPodcastStore(): Store<PodcastStore> {
  if (!podcastStore) {
    podcastStore = createPodcastStore()
  }
  return podcastStore
}

export function getPodcastStore(): Store<PodcastStore> {
  if (!podcastStore) return initPodcastStore()

  return podcastStore
}

export function setPodcastInfo(podcastInfo: PodcastRSSInfo) {
  const store = getPodcastStore()
  store.setState((state) => ({
    ...state,
    podcastInfo,
  }))
}

export function setEpisodes(episodes: Episode[]) {
  const store = getPodcastStore()
  store.setState((state) => ({
    ...state,
    episodes,
  }))
}

export function getPodcastInfo(): PodcastRSSInfo | null {
  const store = getPodcastStore()
  return store.state.podcastInfo
}
