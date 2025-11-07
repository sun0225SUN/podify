import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect } from 'react'
import { EpisodeDetail } from '@/components/episodes/detail'
import { PodcastLayout } from '@/components/podcast/layout'
import { getEpisodes, getPodcast, mergePodcastInfo } from '@/lib/podcast'
import { setPodcastInfo } from '@/stores/podcast-store'

export const Route = createFileRoute('/episodes/$episodeId')({
  component: EpisodePage,
  loader: async ({ params }) => {
    const episodes = await getEpisodes()
    const rssInfo = await getPodcast()
    const podcastInfo = mergePodcastInfo(rssInfo)
    if (typeof window === 'undefined') {
      setPodcastInfo(podcastInfo)
    }
    const episode = episodes.find((ep) => ep.id === params.episodeId)
    if (!episode) {
      throw notFound()
    }
    return { episode, podcastInfo }
  },
})

function EpisodePage() {
  const { episode, podcastInfo } = Route.useLoaderData()

  useEffect(() => {
    if (podcastInfo) {
      setPodcastInfo(podcastInfo)
    }
  }, [podcastInfo])

  return (
    <PodcastLayout>
      <EpisodeDetail episode={episode} />
    </PodcastLayout>
  )
}
