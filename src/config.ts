import type { Site } from '@/types/app'
import type { Podcast } from '@/types/podcast'

// if empty, use RSS information
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
  about:
    'In this show, Eric and Wes dig deep to get to the facts with guests who have been labeled villains by a society quick to judge, without actually getting the full story. Tune in every Thursday to get to the truth with another misunderstood outcast as they share the missing context in their tragic tale.',
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
}
