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
      <PlayerView
        variant='desktop'
        playerRef={playerRef}
        currentEpisode={currentEpisode}
        hasPlayer={hasPlayer}
      />
      <PlayerView
        variant='mobile'
        playerRef={playerRef}
        currentEpisode={currentEpisode}
        hasPlayer={hasPlayer}
      />
    </>
  )
}

function PlayerView({
  variant,
  playerRef,
  currentEpisode,
  hasPlayer,
}: {
  variant: 'desktop' | 'mobile'
  playerRef: React.RefObject<MediaPlayerInstance | null>
  currentEpisode: Episode | null
  hasPlayer: boolean
}) {
  const isDesktop = variant === 'desktop'

  return (
    <div
      className={cn(
        isDesktop ? 'hidden md:block' : 'block md:hidden',
        'fixed right-0 bottom-0 z-50',
        isDesktop ? 'left-[24rem] lg:left-[28rem]' : 'left-0',
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
        {isDesktop ? <PlayerLayoutDesktop /> : <PlayerLayoutMobile />}
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
  const pendingPlayRef = useRef(false)
  const retryTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (player) {
      registerPlayerInstance(player)

      // Listen to play/pause events to sync state
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
    }
  }, [player])

  useEffect(() => {
    if (currentEpisode?.id !== previousEpisodeRef.current?.id) {
      isEpisodeChangingRef.current = true
      pendingPlayRef.current = isPlaying
      previousEpisodeRef.current = currentEpisode
      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [currentEpisode, isPlaying])

  useEffect(() => {
    // Always sync player paused state to store, but skip during episode change
    // After episode change is complete, sync the actual state
    if (isEpisodeChangingRef.current) {
      // Reset the flag after a short delay to allow state to stabilize
      const timeoutId = setTimeout(() => {
        if (isEpisodeChangingRef.current) {
          isEpisodeChangingRef.current = false
          setIsPlaying(!paused)
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }
    setIsPlaying(!paused)
  }, [paused])

  useEffect(() => {
    if (!player) return

    const handleCanPlay = () => {
      // Sync actual player state to store when episode is ready
      if (isEpisodeChangingRef.current) {
        isEpisodeChangingRef.current = false
        setIsPlaying(!player.paused)
      }

      if (pendingPlayRef.current && player.paused) {
        if (retryTimeoutRef.current !== null) {
          clearTimeout(retryTimeoutRef.current)
        }

        retryTimeoutRef.current = window.setTimeout(() => {
          if (pendingPlayRef.current && player.paused) {
            const playPromise = player.play()
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  pendingPlayRef.current = false
                })
                .catch(() => {
                  if (retryTimeoutRef.current !== null) {
                    clearTimeout(retryTimeoutRef.current)
                  }
                  retryTimeoutRef.current = window.setTimeout(() => {
                    if (pendingPlayRef.current && player.paused) {
                      player.play().catch(() => {
                        pendingPlayRef.current = false
                      })
                    }
                  }, 100)
                })
            }
          }
        }, 50)
      }
    }

    player.addEventListener('can-play', handleCanPlay)

    if (canPlay && pendingPlayRef.current && player.paused) {
      handleCanPlay()
    }

    return () => {
      player.removeEventListener('can-play', handleCanPlay)
      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [player, canPlay])

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

    // Skip sync during episode change to avoid conflicts
    if (isEpisodeChangingRef.current) {
      return
    }

    if (isPlaying) {
      pendingPlayRef.current = true

      if (!canPlay && !player.paused) {
        player.pause()
      } else if (canPlay && player.paused) {
        // If store says playing but player is paused, sync player to store
        player.play().catch(() => {
          // If play fails, sync store to actual player state
          setIsPlaying(false)
        })
      }
    } else {
      pendingPlayRef.current = false
      if (!player.paused) {
        player.pause()
      }
    }
  }, [canPlay, currentEpisode, isPlaying, player])

  return null
}
