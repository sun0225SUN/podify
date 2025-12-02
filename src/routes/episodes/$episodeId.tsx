import { createFileRoute, notFound } from '@tanstack/react-router'
import { EpisodeDetail } from '@/components/episodes/detail'
import { PodcastLayout } from '@/components/podcast/layout'
import { site } from '@/config/index'
import { getEpisodes, getPodcast, mergePodcastInfo } from '@/lib/podcast'
import { getPodcastStore, setPodcastInfo } from '@/stores/podcast-store'

export const Route = createFileRoute('/episodes/$episodeId')({
  component: EpisodePage,
  loader: async ({ params }) => {
    const episodes = await getEpisodes()
    const rssInfo = await getPodcast()
    const podcastInfo = mergePodcastInfo(rssInfo)
    setPodcastInfo(podcastInfo)
    const episode = episodes.find((ep) => ep.id === params.episodeId)
    if (!episode) {
      throw notFound()
    }
    return { episode, podcastInfo }
  },
  head: ({ loaderData }) => {
    const episode = loaderData?.episode
    const podcastInfo = loaderData?.podcastInfo
    if (!episode || !podcastInfo) {
      return {}
    }

    const podcastTitle =
      site.seo.defaultTitle && site.seo.defaultTitle !== 'Podcast'
        ? site.seo.defaultTitle
        : podcastInfo.title || site.seo.defaultTitle
    const title = `${episode.title} - ${podcastTitle}`
    const description =
      episode.description ||
      (site.seo.defaultDescription &&
      site.seo.defaultDescription !== 'A podcast platform'
        ? site.seo.defaultDescription
        : podcastInfo.description || site.seo.defaultDescription)
    const truncatedDescription =
      description.length > 160 ? `${description.slice(0, 160)}...` : description
    const image =
      site.seo.defaultImage && site.seo.defaultImage !== '/og-image.png'
        ? site.seo.defaultImage
        : podcastInfo.cover || site.seo.defaultImage
    const baseUrl =
      site.seo.siteName && site.seo.siteName !== 'Podcast'
        ? site.seo.siteName
        : podcastInfo.link || site.seo.siteName
    const url = `${baseUrl}/episodes/${episode.id}`

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
          content: 'article',
        },
        {
          property: 'og:url',
          content: url,
        },
        {
          property: 'article:published_time',
          content: episode.published,
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

function EpisodePage() {
  const { episode, podcastInfo } = Route.useLoaderData()

  const store = getPodcastStore()
  if (podcastInfo && store.state.podcastInfo !== podcastInfo) {
    setPodcastInfo(podcastInfo)
  }

  return (
    <PodcastLayout>
      <EpisodeDetail episode={episode} />
    </PodcastLayout>
  )
}
