import type { Site } from '@/types/app'
import type { Podcast } from '@/types/podcast'

/**
 * Podcast configuration.
 * If base fields (title, description, link, cover) are empty strings,
 * they will be automatically filled from the RSS feed.
 */
export const podcast: Podcast = {
  base: {
    title: '',
    description: '',
    link: 'https://shutiao.life',
    cover: '',
  },
  hosts: [
    {
      name: 'Guoqi Sun',
      link: 'https://guoqi.dev',
    },
  ],
  platforms: [
    {
      id: 'xyz',
      name: '小宇宙',
      link: 'https://www.xiaoyuzhoufm.com',
    },
    {
      id: 'spotify',
      name: 'Spotify',
      link: 'https://open.spotify.com',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      link: 'https://www.youtube.com',
    },
    {
      id: 'apple',
      name: 'Apple Podcasts',
      link: 'https://podcasts.apple.com',
    },
  ],
}

export const site: Site = {
  themeColor: 'blue', // blue, pink, purple, green, yellow, orange, red
  pageSize: 10,
  defaultDescriptionLength: 150,
  seo: {
    siteName: '整点薯条吧',
    defaultTitle: '整点薯条吧',
    defaultDescription: '人生的意义就是去码头整点薯条',
    defaultImage: 'https://files.guoqi.dev/podcast-og.png',
    twitterHandle: '@sun0225SUN',
    locale: 'zh_CN',
  },
  favicon: 'https://files.guoqi.dev/podcast-favicon.ico',
}
