import { Store } from '@tanstack/store'
import type { PodcastRSSInfo } from '@/types/podcast'

export type PodcastStore = {
  podcastInfo: PodcastRSSInfo | null
}

let podcastStore: Store<PodcastStore> | null = null

const createPodcastStore = (): Store<PodcastStore> => {
  return new Store<PodcastStore>({
    podcastInfo: null,
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
  store.setState(() => ({
    podcastInfo,
  }))
}

export function getPodcastInfo(): PodcastRSSInfo | null {
  const store = getPodcastStore()
  return store.state.podcastInfo
}
