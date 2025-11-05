import { createFileRoute, notFound } from '@tanstack/react-router'
import { EpisodeDetail } from '@/components/episodes/detail'
import { PodcastLayout } from '@/components/podcast/layout'
import { getEpisodes } from '@/lib/podcast'

export const Route = createFileRoute('/episodes/$episodeId')({
  component: EpisodePage,
  loader: async ({ params }) => {
    const episodes = await getEpisodes()
    const episode = episodes.find((ep) => ep.id === params.episodeId)
    if (!episode) {
      throw notFound()
    }
    return { episode }
  },
})

function EpisodePage() {
  const { episode } = Route.useLoaderData()

  return (
    <PodcastLayout>
      <EpisodeDetail episode={episode} />
    </PodcastLayout>
  )
}
