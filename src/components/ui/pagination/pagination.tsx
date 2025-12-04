import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

const DOTS = 'DOTS'

const createRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => index + start)

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
  ariaLabel?: string
  isLoading?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ariaLabel = 'Pagination Navigation',
  isLoading = false
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const paginationRange = useMemo(() => {
    if (totalPages <= 1) {
      return []
    }

    const totalNumbersToShow = siblingCount * 2 + 5

    if (totalNumbersToShow >= totalPages) {
      return createRange(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = createRange(1, 3 + siblingCount * 2)
      return [...leftRange, DOTS, totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = createRange(totalPages - (3 + siblingCount * 2) + 1, totalPages)
      return [1, DOTS, ...rightRange]
    }

    const middleRange = createRange(leftSiblingIndex, rightSiblingIndex)
    const firstRange = createRange(1, 3)
    const lastRange = createRange(Math.max(totalPages - 1, 1), totalPages)

  const filteredMiddleRange = middleRange.filter(
    (value) => value > firstRange[firstRange.length - 1] && value < lastRange[0]
  )

  return [
    ...firstRange,
    DOTS,
    ...filteredMiddleRange,
    DOTS,
    ...lastRange
  ]
  }, [currentPage, siblingCount, totalPages])

  if (totalPages <= 1 || paginationRange.length === 0) {
    return null
  }

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || isLoading) {
      return
    }

    onPageChange(page)
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex items-center justify-end gap-2', className)}
    >
      <div className="flex items-center gap-2">
        {paginationRange.map((page, index) => {
          if (page === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="px-1 text-sm font-medium text-[color:var(--tokens-color-text-text-inactive-2)]"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page as number)}
              disabled={isLoading}
              aria-current={currentPage === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-semibold transition-all',
                currentPage === page
                  ? isDark
                    ? 'text-white'
                    : 'bg-[color:var(--tokens-color-text-text-seconary)] text-white shadow-[0_4px_12px_rgba(31,23,64,0.25)]'
                  : isDark
                    ? 'text-[color:var(--tokens-color-text-text-primary)]'
                    : 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[rgba(31,23,64,0.08)]',
                isLoading && 'opacity-50'
              )}
              style={isDark && currentPage === page ? {
                backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
              } : isDark && currentPage !== page ? {
                backgroundColor: 'transparent'
              } : {}}
            >
              {page}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

