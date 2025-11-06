import { useStore } from '@tanstack/react-store'
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { PlayerLayout } from '@/components/player/layout'
import { cn } from '@/lib/utils'
import {
  getPlayerStore,
  registerPlayerInstance,
  setIsPlaying,
} from '@/stores/player-store'

export function Player() {
  const playerRef = useRef<MediaPlayerInstance>(null)
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const hasPlayer = currentEpisode !== null

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-120 z-50',
        'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-opacity duration-300',
        hasPlayer
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
      )}
    >
      <MediaPlayer
        ref={playerRef}
        src={currentEpisode?.audio.src || ''}
        viewType='audio'
        streamType='on-demand'
        logLevel='warn'
        playsInline
        title={currentEpisode?.title || ''}
      >
        <MediaProvider />
        <PlayerContent />
        <PlayerLayout />
      </MediaPlayer>
    </div>
  )
}

function PlayerContent() {
  const player = useMediaPlayer()
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)
  const canPlay = useMediaState('canPlay')
  const paused = useMediaState('paused')

  useEffect(() => {
    if (player) {
      registerPlayerInstance(player)
    }
  }, [player])

  useEffect(() => {
    setIsPlaying(!paused)
  }, [paused])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' || event.repeat) return

      const target = event.target as HTMLElement
      const isInputElement =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (isInputElement) return

      event.preventDefault()
      if (player && currentEpisode) {
        if (paused) {
          player.play()
        } else {
          player.pause()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [player, currentEpisode, paused])

  useEffect(() => {
    if (currentEpisode && isPlaying && player) {
      const playPromise = player.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Play failed:', error)
        })
      }
    }
  }, [currentEpisode, isPlaying, player])

  useEffect(() => {
    if (currentEpisode && isPlaying && player && canPlay) {
      const playPromise = player.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Play failed:', error)
        })
      }
    }
  }, [canPlay, currentEpisode, isPlaying, player])

  return null
}
