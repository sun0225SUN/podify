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
