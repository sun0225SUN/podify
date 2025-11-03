import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouteContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { LanguageProvider } from '@/components/language/provider'
import { ThemeProvider } from '@/components/theme/provider'
import {
  defaultLocale,
  detectLocale,
  isValidLocale,
  type Locale,
} from '@/i18n/config'
import type { TRPCRouter } from '@/integrations/trpc/router'
import appCss from '@/styles/globals.css?url'
import '@/styles/view-transition.css'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCRouter>
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

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const context = useRouteContext({ from: '__root__' })
  const detectedLocaleRaw = (context?.detectedLocale as string) || defaultLocale
  const detectedLocale: Locale = isValidLocale(detectedLocaleRaw)
    ? detectedLocaleRaw
    : defaultLocale

  return (
    <html lang={detectedLocale}>
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
      <body>
        <LanguageProvider language={detectedLocale}>
          <ThemeProvider
            defaultTheme='system'
            storageKey='vite-ui-theme'
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
