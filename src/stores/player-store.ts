import { Store } from '@tanstack/store'
import type { Episode } from '@/types/podcast'

export type PlayerStore = {
  currentEpisode: Episode | null
  isPlaying: boolean
  seekTime: number | null
}

let playerStore: Store<PlayerStore> | null = null

const createPlayerStore = (): Store<PlayerStore> => {
  return new Store<PlayerStore>({
    currentEpisode: null,
    isPlaying: false,
    seekTime: null,
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
    seekTime: null,
  }))
}

export function setInitialEpisode(episode: Episode) {
  const store = getPlayerStore()
  if (!store.state.currentEpisode) {
    store.setState((state) => ({
      ...state,
      currentEpisode: episode,
      isPlaying: false,
      seekTime: null,
    }))
  }
}

export function clearCurrentEpisode() {
  const store = getPlayerStore()
  store.setState(() => ({
    currentEpisode: null,
    isPlaying: false,
    seekTime: null,
  }))
}

export function setIsPlaying(isPlaying: boolean) {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    isPlaying,
  }))
}

export function play() {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    isPlaying: true,
  }))
}

export function pause() {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    isPlaying: false,
  }))
}

export function seek(time: number) {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    seekTime: time,
    isPlaying: true,
  }))
}

export function resetSeek() {
  const store = getPlayerStore()
  store.setState((state) => ({
    ...state,
    seekTime: null,
  }))
}
