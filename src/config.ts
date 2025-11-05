import type { Podcast } from '@/types/podcast'
import type { ThemeColor } from '@/types/theme'

export const podcast: Podcast = {
  base: {
    title: '整点薯条吧🍟',
    description: '我们要飞向何方？我想去码头整点薯条～',
    link: 'https://shutiao.life',
    cover: 'https://files.guoqi.dev/podcast_cover.png',
  },
  hosts: [
    {
      name: 'Guoqi Sun',
      link: 'https://guoqi.dev',
    },
  ],
  about: '整点薯条吧，计划两周一更，欢迎大家收听。（todo，完善）',
  platforms: [
    {
      name: 'Apple Podcasts',
      link: 'https://podcasts.apple.com',
    },
    {
      name: 'Spotify',
      link: 'https://open.spotify.com',
    },
    {
      name: 'YouTube',
      link: 'https://www.youtube.com',
    },
  ],
}

export const themeColor: ThemeColor = 'blue'
