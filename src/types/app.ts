export interface Site {
  themeColor: ThemeColor
  pageSize: number
  defaultDescriptionLength: number
}

export type ThemeColor =
  | 'blue'
  | 'pink'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
