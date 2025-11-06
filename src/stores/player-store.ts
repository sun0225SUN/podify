import { Store } from '@tanstack/store'
import type { MediaPlayerInstance } from '@vidstack/react'
import type { Episode } from '@/types/podcast'

export type PlayerStore = {
  currentEpisode: Episode | null
  isPlaying: boolean
}

let playerStore: Store<PlayerStore> | null = null
let playerInstance: MediaPlayerInstance | null = null

const createPlayerStore = (): Store<PlayerStore> => {
  return new Store<PlayerStore>({
    currentEpisode: null,
    isPlaying: false,
  })
}

export function initPlayerStore(): Store<PlayerStore> {
  if (!playerStore) {
    playerStore = createPlayerStore()
  }
  return playerStore
}

export function getPlayerStore(): Store<PlayerStore> {
  if (!playerStore) return initPlayerStore()

  return playerStore
}

export function setCurrentEpisode(episode: Episode) {
  const store = getPlayerStore()
  store.setState(() => ({
    currentEpisode: episode,
    isPlaying: true,
  }))
}

export function clearCurrentEpisode() {
  const store = getPlayerStore()
  store.setState(() => ({
    currentEpisode: null,
    isPlaying: false,
  }))
}

export function setIsPlaying(isPlaying: boolean) {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    isPlaying,
  }))
}

export function registerPlayerInstance(instance: MediaPlayerInstance) {
  playerInstance = instance
}

export function play() {
  if (playerInstance) {
    playerInstance.play()
  }
}

export function pause() {
  if (playerInstance) {
    playerInstance.pause()
  }
}

export function getPlayerInstance() {
  return playerInstance
}
