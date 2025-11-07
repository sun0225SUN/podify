export interface Site {
  themeColor: ThemeColor
  pageSize: number
  defaultDescriptionLength: number
  seo: {
    siteName: string
    defaultTitle: string
    defaultDescription: string
    defaultImage: string
    twitterHandle?: string
    locale: string
  }
  favicon: string
}

export type ThemeColor =
  | 'blue'
  | 'pink'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
