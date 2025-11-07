import { useStore } from '@tanstack/react-store'
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { PlayerLayoutDesktop } from '@/components/player/layout-desktop'
import { PlayerLayoutMobile } from '@/components/player/layout-mobile'
import { cn } from '@/lib/utils'
import {
  getPlayerStore,
  registerPlayerInstance,
  setIsPlaying,
} from '@/stores/player-store'
import type { Episode } from '@/types/podcast'

export function Player() {
  const playerRef = useRef<MediaPlayerInstance>(null)
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const hasPlayer = currentEpisode !== null

  return (
    <>
      <PlayerDesktop
        playerRef={playerRef}
        currentEpisode={currentEpisode}
        hasPlayer={hasPlayer}
      />
      <PlayerMobile
        playerRef={playerRef}
        currentEpisode={currentEpisode}
        hasPlayer={hasPlayer}
      />
    </>
  )
}

function PlayerDesktop({
  playerRef,
  currentEpisode,
  hasPlayer,
}: {
  playerRef: React.RefObject<MediaPlayerInstance | null>
  currentEpisode: Episode | null
  hasPlayer: boolean
}) {
  return (
    <div
      className={cn(
        'hidden md:block',
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
        <PlayerLayoutDesktop />
      </MediaPlayer>
    </div>
  )
}

function PlayerMobile({
  playerRef,
  currentEpisode,
  hasPlayer,
}: {
  playerRef: React.RefObject<MediaPlayerInstance | null>
  currentEpisode: Episode | null
  hasPlayer: boolean
}) {
  return (
    <div
      className={cn(
        'block md:hidden',
        'fixed right-0 bottom-0 left-0 z-50',
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
        <PlayerLayoutMobile />
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
      if (player && currentEpisode && canPlay) {
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
  }, [player, currentEpisode, paused, canPlay])

  useEffect(() => {
    if (!currentEpisode || !player) return

    // When episode changes, the src changes and canPlay becomes false
    // Wait for can-play event before attempting to play
    if (!canPlay) {
      // Ensure player is paused while loading
      if (!player.paused) {
        player.pause()
      }
      return
    }

    // Only play when media is ready and isPlaying is true
    if (isPlaying) {
      const playPromise = player.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Play failed:', error)
        })
      }
    } else {
      // Ensure player is paused when isPlaying is false
      if (!player.paused) {
        player.pause()
      }
    }
  }, [canPlay, currentEpisode, isPlaying, player])

  return null
}
