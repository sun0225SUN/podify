import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface EpisodesPaginationProps {
  currentPage: number
  totalPages: number
  paddingClassName: string
}

export function EpisodesPagination({
  currentPage,
  totalPages,
  paddingClassName,
}: EpisodesPaginationProps) {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  const handleClick = () => {
    setTimeout(() => {
      const mainContainer = document.getElementById('main-scroll-container')
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'instant' })
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 100)
  }

  return (
    <div className={paddingClassName}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              asChild
              className={cn(
                currentPage === 1 && 'pointer-events-none opacity-50',
              )}
            >
              <Link
                to='/'
                search={{ page: currentPage - 1 }}
                disabled={currentPage === 1}
                onClick={handleClick}
              >
                <ChevronLeftIcon />
                <span className='hidden sm:block'>
                  {t('pagination.previous')}
                </span>
              </Link>
            </PaginationPrevious>
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const showPage =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1

            const showEllipsisBefore = page === 2 && currentPage > 3
            const showEllipsisAfter =
              page === totalPages - 1 && currentPage < totalPages - 2

            if (!showPage && !showEllipsisBefore && !showEllipsisAfter)
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
                <PaginationLink
                  asChild
                  isActive={page === currentPage}
                  className={cn(
                    page === currentPage &&
                      'bg-theme text-white hover:bg-theme-hover hover:text-white',
                  )}
                >
                  <Link
                    to='/'
                    search={{ page }}
                    onClick={handleClick}
                  >
                    {page}
                  </Link>
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              asChild
              className={cn(
                currentPage === totalPages && 'pointer-events-none opacity-50',
              )}
            >
              <Link
                to='/'
                search={{ page: currentPage + 1 }}
                disabled={currentPage === totalPages}
                onClick={handleClick}
              >
                <span className='hidden sm:block'>{t('pagination.next')}</span>
                <ChevronRightIcon />
              </Link>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
