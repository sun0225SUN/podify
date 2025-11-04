import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Scripts,
  useRouteContext,
} from '@tanstack/react-router'
import { LanguageProvider } from '@/components/language/provider'
import { ThemeProvider } from '@/components/theme/provider'
import {
  defaultLocale,
  detectLocale,
  isValidLocale,
  type Locale,
} from '@/i18n/config'
import appCss from '@/styles/globals.css?url'
import '@/styles/view-transition.css'

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
          className='inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700'
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
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for theme toggle
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
        <script
          defer
          src='https://umami.guoqi.dev/script.js'
          data-website-id='f382c8db-e41d-4b65-8d4b-ffbcc5f86b93'
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider language={detectedLocale}>
          <ThemeProvider
            defaultTheme='system'
            storageKey='vite-ui-theme'
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
        <Scripts />
      </body>
    </html>
  )
}
