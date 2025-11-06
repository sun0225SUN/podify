import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Waveform } from '@/components/common/waveform'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { site } from '@/config'
import { cn } from '@/lib/utils'
import { getPageStore } from '@/stores/page-store'
import type { Episode } from '@/types/podcast'

interface EpisodesProps {
  episodes: Episode[]
  currentPage: number
}

export function Episodes({ episodes, currentPage }: EpisodesProps) {
  useEffect(() => {
    const pageStore = getPageStore()
    pageStore.setState(() => ({ currentPage }))
  }, [currentPage])
  const pageSize = site.pageSize
  const totalPages = Math.ceil(episodes.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentEpisodes = episodes.slice(startIndex, endIndex)

  return (
    <div className='flex w-full flex-1 flex-col'>
      <div className='sticky top-0 z-10 border-border border-b bg-background'>
        <Waveform className='h-24 w-full' />
        <h1 className='absolute inset-0 top-10 px-28 font-bold text-2xl'>
          Episodes
        </h1>
      </div>

      {episodes.length === 0 ? (
        <p className='text-muted-foreground'>No episodes available.</p>
      ) : (
        <>
          <ul className='flex min-h-[70vh] flex-col'>
            {currentEpisodes.map((episode) => (
              <li
                key={episode.id}
                className='flex flex-col gap-3 border-border border-b px-28 py-12'
              >
                {episode.published && (
                  <time className='text-muted-foreground text-sm'>
                    {new Date(episode.published).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
                <h2 className='font-bold text-2xl'>{episode.title}</h2>
                {episode.description && (
                  <div className='line-clamp-2 text-foreground/80 leading-relaxed'>
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-medium text-theme underline transition-colors hover:text-theme-hover'
                          >
                            {children}
                          </a>
                        ),
                        // Remove images in list view
                        img: () => null,
                        // Flatten headings to span elements
                        h1: ({ children }) => <span>{children}</span>,
                        h2: ({ children }) => <span>{children}</span>,
                        h3: ({ children }) => <span>{children}</span>,
                        h4: ({ children }) => <span>{children}</span>,
                        h5: ({ children }) => <span>{children}</span>,
                        h6: ({ children }) => <span>{children}</span>,
                        // Keep paragraphs inline
                        p: ({ children }) => <span>{children} </span>,
                        // Remove lists markers
                        ul: ({ children }) => <span>{children}</span>,
                        ol: ({ children }) => <span>{children}</span>,
                        li: ({ children }) => <span>{children} </span>,
                        // Remove blockquotes styling
                        blockquote: ({ children }) => <span>{children}</span>,
                      }}
                    >
                      {episode.description}
                    </ReactMarkdown>
                  </div>
                )}
                <div className='mt-2 flex items-center gap-4 text-sm'>
                  <Link
                    to='/episodes/$episodeId'
                    params={{ episodeId: episode.id }}
                    className='flex items-center gap-2 font-medium text-theme hover:text-theme-hover'
                  >
                    <span>▶</span>
                    <span>Listen</span>
                  </Link>
                  <span className='text-muted-foreground'>/</span>
                  <Link
                    to='/episodes/$episodeId'
                    params={{ episodeId: episode.id }}
                    className='font-medium text-theme hover:text-theme-hover'
                  >
                    Show notes
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className='px-28 py-12'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Link
                      to='/'
                      search={{ page: currentPage - 1 }}
                      disabled={currentPage === 1}
                    >
                      <PaginationPrevious
                        className={cn(
                          currentPage === 1 && 'pointer-events-none opacity-50',
                        )}
                      />
                    </Link>
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first, last, current, and adjacent pages
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1

                      // Show ellipsis
                      const showEllipsisBefore = page === 2 && currentPage > 3
                      const showEllipsisAfter =
                        page === totalPages - 1 && currentPage < totalPages - 2

                      if (
                        !showPage &&
                        !showEllipsisBefore &&
                        !showEllipsisAfter
                      )
                        return null

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }

                      return (
                        <PaginationItem key={page}>
                          <Link
                            to='/'
                            search={{ page }}
                          >
                            <PaginationLink
                              isActive={page === currentPage}
                              className={cn(
                                page === currentPage &&
                                  'bg-theme text-white hover:bg-theme-hover hover:text-white',
                              )}
                            >
                              {page}
                            </PaginationLink>
                          </Link>
                        </PaginationItem>
                      )
                    },
                  )}

                  <PaginationItem>
                    <Link
                      to='/'
                      search={{ page: currentPage + 1 }}
                      disabled={currentPage === totalPages}
                    >
                      <PaginationNext
                        className={cn(
                          currentPage === totalPages &&
                            'pointer-events-none opacity-50',
                        )}
                      />
                    </Link>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
