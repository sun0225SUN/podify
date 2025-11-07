import { useStore } from '@tanstack/react-store'
import { ScrollTextContainer, ScrollTextRow } from '@/components/ui/scroll-text'
import { getPlayerStore } from '@/stores/player-store'

export function EpisodeTitle() {
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)

  if (!currentEpisode) {
    return null
  }

  return (
    <ScrollTextContainer className='w-60 text-sm'>
      <ScrollTextRow
        baseVelocity={20}
        direction={1}
        isPlaying={isPlaying}
      >
        {currentEpisode.title}
      </ScrollTextRow>
    </ScrollTextContainer>
  )
}
