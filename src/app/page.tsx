import { About } from '~/components/about'
import { Aside } from '~/components/aside'
import { Intro } from '~/components/intro'
import { Listen } from '~/components/listen'
import { cn } from '~/lib/utils'

export default function Home() {
  return (
    <div className='flex justify-center lg:w-112'>
      <Aside />
      <div
        className={cn(
          'h-screen w-full overflow-y-auto px-4 py-10 lg:px-8 lg:py-12',
          'bg-slate-50 lg:border-slate-200 lg:border-x dark:border-slate-800 dark:bg-black',
        )}
      >
        <Intro />
        <About />
        <Listen />
      </div>
    </div>
  )
}
