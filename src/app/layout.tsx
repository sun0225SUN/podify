import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'
import { Analytics } from '~/components/analytics'
import { ThemeProvider } from '~/components/theme/provider'
import { podcastInfo } from '~/config'
import { cn } from '~/lib/utils'

import '~/styles/tailwind.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: podcastInfo.name,
  description: podcastInfo.description,
  icons: {
    icon: podcastInfo.logo.src,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={cn(
          'bg-background text-foreground antialiased',
          geist.variable,
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
