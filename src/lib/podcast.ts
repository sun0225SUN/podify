import { createServerFn } from '@tanstack/react-start'
import { XMLParser } from 'fast-xml-parser'
import TurndownService from 'turndown'
import { podcast } from '@/config'
import { env } from '@/env'
import type { Episode, PodcastRSSInfo } from '@/types/podcast'

/**
 * Server-only function to fetch podcast metadata from RSS feed
 */
export const getPodcast = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PodcastRSSInfo> => {
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
      title: channel.title || '',
      description: channel.description || '',
      link: channel.link || '',
      cover: image || '',
    }
  },
)

export const getEpisodes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Episode[]> => {
    try {
      const response = await fetch(env.VITE_PODCAST_RSS)
      const xmlData = await response.text()

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      })
      const result = parser.parse(xmlData)

      const channel = result.rss?.channel || result.feed
      if (!channel) {
        return []
      }

      let items = channel.item
      if (!items) {
        return []
      }
      if (!Array.isArray(items)) {
        items = [items]
      }

      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      })

      const episodes: Episode[] = items.map(
        (item: {
          guid?: { '#text'?: string; '@_isPermaLink'?: string } | string
          link?: string
          title?: string
          description?: string
          'content:encoded'?: string
          enclosure?:
            | Array<{ '@_url': string; '@_type': string }>
            | { '@_url': string; '@_type': string }
          pubDate?: string
        }) => {
          let id = ''
          if (typeof item.guid === 'string') {
            id = item.guid
          } else if (item.guid && typeof item.guid === 'object') {
            id =
              item.guid['#text'] ||
              item.guid['@_isPermaLink'] ||
              item.link ||
              ''
          } else {
            id = item.link || ''
          }

          const enclosures = Array.isArray(item.enclosure)
            ? item.enclosure
            : item.enclosure
              ? [item.enclosure]
              : []

          const descriptionText = item.description
            ? turndownService.turndown(item.description)
            : ''
          const contentText = item['content:encoded']
            ? turndownService.turndown(item['content:encoded'])
            : undefined

          return {
            id: id.toString(),
            title: item.title || '',
            description: descriptionText,
            content: contentText,
            published: item.pubDate || '',
            audio:
              enclosures.length > 0
                ? {
                    src: enclosures[0]['@_url'] || '',
                    type: enclosures[0]['@_type'] || '',
                  }
                : {
                    src: '',
                    type: '',
                  },
          }
        },
      )

      return episodes
    } catch (error) {
      console.error('Error fetching episodes:', error)
      return []
    }
  },
)

/**
 * Merge podcast configuration with RSS feed information.
 * Configuration values take precedence over RSS values when they are not empty.
 */
export function mergePodcastInfo(rssInfo: PodcastRSSInfo): PodcastRSSInfo {
  const { base } = podcast

  return {
    title: base.title || rssInfo.title,
    description: base.description || rssInfo.description,
    link: base.link || rssInfo.link,
    cover: base.cover || rssInfo.cover,
  }
}
