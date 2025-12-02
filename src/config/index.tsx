import { Podcast as PodcastIcon, Youtube } from 'lucide-react'
import { BilibiliIcon, SpotifyIcon, XYZIcon } from '@/components/icons'
import type { Site } from '@/types/app'
import type { Podcast } from '@/types/podcast'

/**
 * Site configuration.
 * Theme color, page size, default description length, SEO, favicon.
 */
export const site: Site = {
  themeColor: 'blue', // blue, pink, purple, green, yellow, orange, red
  pageSize: 10,
  defaultDescriptionLength: 120,
  favicon: 'https://files.guoqi.dev/podcast-favicon.ico',
  seo: {
    siteName: '整点薯条吧',
    defaultTitle: '整点薯条吧',
    defaultDescription: '人生的意义就是去码头整点薯条',
    defaultImage: 'https://files.guoqi.dev/podcast_og.png',
    twitterHandle: '@sun0225SUN',
    locale: 'zh_CN',
  },
}

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
      name: '小宇宙',
      link: 'https://www.xiaoyuzhoufm.com/podcast/676b92c1e63173b1783c08b7',
      icon: XYZIcon,
      colorClass: 'text-blue-500 hover:text-blue-600',
    },
    {
      name: 'Podcasts',
      link: 'https://podcasts.apple.com/cn/podcast/%E6%95%B4%E7%82%B9%E8%96%AF%E6%9D%A1%E5%90%A7/id1782625327',
      icon: PodcastIcon,
      colorClass: 'text-purple-500 hover:text-purple-600',
    },
    {
      name: 'Spotify',
      link: 'https://open.spotify.com/user/31k53kp6hgkbovg72427dya5av44',
      icon: SpotifyIcon,
      colorClass: 'text-green-500 hover:text-green-600',
    },
    {
      name: 'Bilibili',
      link: 'https://space.bilibili.com/448488855',
      icon: BilibiliIcon,
      colorClass: 'text-blue-500 hover:text-blue-600',
    },
    {
      name: 'YouTube',
      link: 'https://www.youtube.com/@sun0225SUN',
      icon: Youtube,
      colorClass: 'text-red-500 hover:text-red-600',
    },
  ],
}
