import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Podcast } from '@/components/podcast'
import { getEpisodes } from '@/lib/podcast'

const searchSchema = z.object({
  page: z.number().int().positive().catch(1),
})

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: searchSchema,
  loader: async () => {
    const episodes = await getEpisodes()
    return { episodes }
  },
})

function App() {
  const { episodes } = Route.useLoaderData()
  const { page } = Route.useSearch()

  return (
    <Podcast
      episodes={episodes}
      currentPage={page}
    />
  )
}
