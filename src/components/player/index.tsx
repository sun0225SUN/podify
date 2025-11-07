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
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-50 md:left-[24rem] lg:left-[28rem]',
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
  const previousEpisodeRef = useRef<Episode | null>(null)
  const isEpisodeChangingRef = useRef(false)

  // Register player instance
  useEffect(() => {
    if (player) {
      registerPlayerInstance(player)
    }
  }, [player])

  // Listen to player events and sync to store
  useEffect(() => {
    if (!player) return

    const handlePlay = () => {
      if (!isEpisodeChangingRef.current) {
        setIsPlaying(true)
      }
    }

    const handlePause = () => {
      if (!isEpisodeChangingRef.current) {
        setIsPlaying(false)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)
    player.addEventListener('ended', handleEnded)

    return () => {
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('pause', handlePause)
      player.removeEventListener('ended', handleEnded)
    }
  }, [player])

  // Detect episode change
  useEffect(() => {
    if (currentEpisode?.id !== previousEpisodeRef.current?.id) {
      isEpisodeChangingRef.current = true
      previousEpisodeRef.current = currentEpisode
    }
  }, [currentEpisode])

  // Handle playback when media is ready
  useEffect(() => {
    if (!player || !canPlay) return

    // Clear episode changing flag when ready
    if (isEpisodeChangingRef.current) {
      isEpisodeChangingRef.current = false
    }

    // Auto-play when episode changes and isPlaying is true
    if (isPlaying && player.paused) {
      player.play().catch((error) => {
        console.error('Failed to play:', error)
        setIsPlaying(false)
      })
    }
  }, [player, canPlay, isPlaying])

  // Sync store isPlaying to player state
  useEffect(() => {
    if (!player || !currentEpisode || isEpisodeChangingRef.current) return

    if (isPlaying && player.paused) {
      player.play().catch((error) => {
        console.error('Failed to play:', error)
        setIsPlaying(false)
      })
    } else if (!isPlaying && !player.paused) {
      player.pause()
    }
  }, [player, currentEpisode, isPlaying])

  // Space bar shortcut
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

  return null
}
