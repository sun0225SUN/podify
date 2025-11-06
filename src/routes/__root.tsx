import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Scripts,
  useRouteContext,
} from '@tanstack/react-router'
import { LanguageProvider } from '@/components/language/provider'
import { Player } from '@/components/player'
import { ThemeProvider } from '@/components/theme/provider'
import { site } from '@/config'
import { env } from '@/env'
import {
  defaultLocale,
  detectLocale,
  isValidLocale,
  type Locale,
} from '@/i18n/config'
import appCss from '@/styles/globals.css?url'
import '@/styles/view-transition.css'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'

interface MyRouterContext {
  detectedLocale?: string
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async (opts) => {
    let acceptLanguage: string | null = null

    const request = 'request' in opts ? opts.request : undefined

    if (
      request &&
      typeof request === 'object' &&
      'headers' in request &&
      request.headers instanceof Headers
    ) {
      acceptLanguage = request.headers.get('accept-language')
    }

    const detectedLocale = detectLocale(acceptLanguage)

    return {
      detectedLocale,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-4 font-bold text-6xl'>404</h1>
        <p className='mb-8 text-gray-600 text-xl dark:text-gray-400'>
          Page not found
        </p>
        <Link
          to='/'
          search={{ page: 1 }}
          className='inline-block rounded-lg bg-theme px-6 py-3 text-white transition-colors hover:bg-theme-hover'
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const context = useRouteContext({ from: '__root__' })
  const detectedLocaleRaw = (context?.detectedLocale as string) || defaultLocale
  const detectedLocale: Locale = isValidLocale(detectedLocaleRaw)
    ? detectedLocaleRaw
    : defaultLocale

  return (
    <html
      lang={detectedLocale}
      className={`theme-${site.themeColor}`}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for theme initialization
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('vite-ui-theme') || 'dark';
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {env.VITE_UMAMI_SCRIPT && env.VITE_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={env.VITE_UMAMI_SCRIPT}
            data-website-id={env.VITE_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider language={detectedLocale}>
          <ThemeProvider
            defaultTheme='system'
            storageKey='vite-ui-theme'
          >
            {children}
            <Player />
          </ThemeProvider>
        </LanguageProvider>
        <Scripts />
      </body>
    </html>
  )
}
