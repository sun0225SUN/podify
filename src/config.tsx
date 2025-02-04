import { Podcast } from 'lucide-react'
import Cover from '~/assets/images/cover.jpg'
import Logo from '~/assets/images/logo.ico'
import Rss from '~/assets/images/rss.svg'
import Spotify from '~/assets/images/spotify.svg'
import Xyz from '~/assets/images/xyz.svg'
import Youtube from '~/assets/images/youtube.svg'

export const podcastInfo = {
  name: '整点薯条',
  description: '人生的意义就是去码头整点薯条～',
  introduction:
    '嗨！亲爱的朋友们，欢迎上岛！赛博岛屿是一档关注 AI、互联网、前沿行业的职场对话栏目。由 Demi 和 Arya，一个 HR 和一个产品经理发起，希望能够碰撞出跨行业的火花，给你带来不一样的视角。我们聊科技前沿，聊职业转型，也聊创业感悟。在科技快速发展的今天，我们更关注的，是人本身。在未来的节目中，我们会邀请 AI 创业者、资深职场人或 AI 领域实践者来进行深度对话。无论是打工人、创业者，还是梦想家，我们坚信每个人都会走出属于自己的一条路。希望这座赛博岛屿，是你信息海洋中的一个港湾。',
  hosts: [
    {
      name: '小孙同学',
      link: 'https://guoqi.dev',
    },
    {
      name: 'Arya',
    },
    {
      name: 'Ricky',
    },
  ],
  logo: Logo,
  cover: Cover.src,
  listenChannel: [
    {
      label: '小宇宙',
      icon: <Xyz className='size-6 text-blue-400' />,
      link: 'https://www.xiaoyuzhoufm.com/podcast/662b06921611e0c56b176495',
    },
    {
      label: 'Youtube',
      icon: <Youtube className='size-6 text-red-400' />,
      link: 'https://www.xiaoyuzhoufm.com/podcast/662b06921611e0c56b176495',
    },
    {
      label: 'Spotify',
      icon: <Spotify className='size-6 text-green-400' />,
      link: 'https://www.xiaoyuzhoufm.com/podcast/662b06921611e0c56b176495',
    },
    {
      label: 'Apple Podcast',
      icon: <Podcast className='size-6 text-purple-400' />,
      link: 'https://www.xiaoyuzhoufm.com/podcast/662b06921611e0c56b176495',
    },
    {
      label: 'Rss Feed',
      icon: <Rss className='size-6 text-orange-400' />,
      link: 'https://www.xiaoyuzhoufm.com/podcast/662b06921611e0c56b176495',
    },
  ],
}
