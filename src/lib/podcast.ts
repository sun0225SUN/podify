import { createServerFn } from '@tanstack/react-start'
import { XMLParser } from 'fast-xml-parser'
import { env } from '@/env'

/**
 * Server-only function to fetch podcast metadata from RSS feed
 */
export const getPodcastInfo = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response = await fetch(env.VITE_PODCAST_RSS)
    const xmlData = await response.text()

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })
    const result = parser.parse(xmlData)

    const channel = result.rss?.channel || result.feed
    const image = channel.image?.url || channel['itunes:image']?.['@_href']

    return {
      title: channel.title,
      description: channel.description,
      link: channel.link,
      cover: image,
    }
  },
)
