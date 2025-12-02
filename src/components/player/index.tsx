import { useStore } from '@tanstack/react-store'
import {
  MediaPlayer,
  MediaProvider,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { PlayerLayoutDesktop } from '@/components/player/layout-desktop'
import { PlayerLayoutMobile } from '@/components/player/layout-mobile'
import { cn } from '@/lib/utils'
import { getPlayerStore, resetSeek, setIsPlaying } from '@/stores/player-store'
import type { Episode } from '@/types/podcast'

export function Player() {
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-50 md:left-96 lg:left-112',
        'border-t bg-background/5 backdrop-blur-xs',
        'transition-all duration-300 ease-in-out',
        currentEpisode
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      {currentEpisode && (
        <MediaPlayer
          key={currentEpisode.id}
          src={currentEpisode.audio.src}
          viewType='audio'
          streamType='on-demand'
          logLevel='warn'
          playsInline
          title={currentEpisode.title}
        >
          <MediaProvider />
          <PlayerContent />
          <PlayerLayoutDesktop />
          <PlayerLayoutMobile />
        </MediaPlayer>
      )}
    </div>
  )
}

function PlayerContent() {
  const player = useMediaPlayer()
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)
  const seekTime = useStore(playerStore, (state) => state.seekTime)
  const canPlay = useMediaState('canPlay')
  const paused = useMediaState('paused')
  const previousEpisodeRef = useRef<Episode | null>(null)
  const isEpisodeChangingRef = useRef(false)

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

  // Handle playback state
  useEffect(() => {
    if (!player || !currentEpisode) return
    if (currentEpisode.id !== previousEpisodeRef.current?.id) {
      isEpisodeChangingRef.current = true
      previousEpisodeRef.current = currentEpisode
    }

    if (canPlay && isEpisodeChangingRef.current) {
      isEpisodeChangingRef.current = false
    }

    if (isEpisodeChangingRef.current || !canPlay) return

    if (isPlaying && player.paused) {
      player.play().catch((error) => {
        console.error('Failed to play:', error)
        setIsPlaying(false)
      })
    } else if (!isPlaying && !player.paused) {
      player.pause()
    }
  }, [player, currentEpisode, isPlaying, canPlay])

  // Handle seek request
  useEffect(() => {
    if (player && seekTime !== null) {
      player.currentTime = seekTime
      resetSeek()
    }
  }, [player, seekTime])

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
