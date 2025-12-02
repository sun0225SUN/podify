import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Podcast } from '@/components/podcast'
import { site } from '@/config/index'
import { getEpisodes, getPodcast, mergePodcastInfo } from '@/lib/podcast'
import { getPodcastStore, setPodcastInfo } from '@/stores/podcast-store'

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
    setPodcastInfo(podcastInfo)
    return { episodes, podcastInfo }
  },
  head: ({ loaderData }) => {
    const podcastInfo = loaderData?.podcastInfo
    const title =
      site.seo.defaultTitle && site.seo.defaultTitle !== 'Podcast'
        ? site.seo.defaultTitle
        : podcastInfo?.title || site.seo.defaultTitle
    const description =
      site.seo.defaultDescription &&
      site.seo.defaultDescription !== 'A podcast platform'
        ? site.seo.defaultDescription
        : podcastInfo?.description || site.seo.defaultDescription
    const truncatedDescription =
      description.length > 160 ? `${description.slice(0, 160)}...` : description
    const image =
      site.seo.defaultImage && site.seo.defaultImage !== '/og-image.png'
        ? site.seo.defaultImage
        : podcastInfo?.cover || site.seo.defaultImage

    return {
      meta: [
        {
          title,
        },
        {
          name: 'description',
          content: truncatedDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: truncatedDescription,
        },
        {
          property: 'og:image',
          content: image,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: podcastInfo?.link || site.seo.siteName,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: truncatedDescription,
        },
        {
          name: 'twitter:image',
          content: image,
        },
      ],
    }
  },
})

function App() {
  const { episodes, podcastInfo } = Route.useLoaderData()
  const { page } = Route.useSearch()

  const store = getPodcastStore()
  if (podcastInfo && store.state.podcastInfo !== podcastInfo) {
    setPodcastInfo(podcastInfo)
  }

  return (
    <Podcast
      episodes={episodes}
      currentPage={page}
    />
  )
}
