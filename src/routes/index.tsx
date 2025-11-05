import { createFileRoute } from '@tanstack/react-router'
import { Podcast } from '@/components/podcast'
import { getEpisodes } from '@/lib/podcast'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const episodes = await getEpisodes()
    return { episodes }
  },
})

function App() {
  const { episodes } = Route.useLoaderData()

  return <Podcast episodes={episodes} />
}
