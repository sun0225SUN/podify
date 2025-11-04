import { createFileRoute } from '@tanstack/react-router'
import { Podcast } from '@/components/podcast'
import { getPodcastInfo } from '@/lib/podcast'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const podcastInfo = await getPodcastInfo()
    return { podcastInfo }
  },
})

function App() {
  const { podcastInfo } = Route.useLoaderData()

  return <Podcast podcastInfo={podcastInfo} />
}
