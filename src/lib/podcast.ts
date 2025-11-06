import { createServerFn } from '@tanstack/react-start'
import { XMLParser } from 'fast-xml-parser'
import TurndownService from 'turndown'
import { env } from '@/env'
import type { Episode } from '@/types/podcast'

/**
 * Server-only function to fetch episodes from RSS feed
 */
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
