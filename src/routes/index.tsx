import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'
import { Podcast } from '@/components/podcast'
import { getEpisodes, getPodcast, mergePodcastInfo } from '@/lib/podcast'
import { setPodcastInfo } from '@/stores/podcast-store'

const searchSchema = z.object({
  page: z.number().int().positive().catch(1),
})

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: searchSchema,
  loader: async () => {
    const episodes = await getEpisodes()
    const rssInfo = await getPodcast()
    const podcastInfo = mergePodcastInfo(rssInfo)
    if (typeof window === 'undefined') {
      setPodcastInfo(podcastInfo)
    }
    return { episodes, podcastInfo }
  },
})

function App() {
  const { episodes, podcastInfo } = Route.useLoaderData()
  const { page } = Route.useSearch()

  useEffect(() => {
    if (podcastInfo) {
      setPodcastInfo(podcastInfo)
    }
  }, [podcastInfo])

  return (
    <Podcast
      episodes={episodes}
      currentPage={page}
    />
  )
}
