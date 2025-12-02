export interface ImageInfo {
  src: string
  alt: string
}

/**
 * Extract all images from markdown content
 *
 * @param content - Markdown content string
 * @returns Array of image information
 */
export function extractImagesFromMarkdown(content: string): ImageInfo[] {
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const matches: ImageInfo[] = []
  let match: RegExpExecArray | null = imgRegex.exec(content)

  while (match !== null) {
    matches.push({
      src: match[2] ?? '',
      alt: match[1] ?? '',
    })
    match = imgRegex.exec(content)
  }

  return matches
}

/**
 * Parse timestamps from content and wrap them in a custom link format
 *
 * @param content - Markdown content string
 * @returns Content with timestamps wrapped in links
 */
export function parseTimeStamps(content: string): string {
  return content.replace(/(^|\s)(\d{1,2}:\d{2}(?::\d{2})?)/g, '$1[$2](#t=$2)')
}
