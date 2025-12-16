'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Filters, Search02, MoreOptions, InvoiceIcon } from '@/icons'
import { Pagination } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

type BillingHistoryItem = {
  id: number
  invoice: string
  date: string
  plan: string
  users: string
}

const PAGE_SIZE = 6

const MOCK_BILLING_HISTORY: BillingHistoryItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  invoice: `Invoice_March_${2025 - Math.floor(i / 6)}`,
  date: `March ${14 - (i % 5)}, 2025`,
  plan: i % 2 === 0 ? 'Lite Plan' : 'Pro Plan',
  users: `${8 + (i % 4)} Users`
}))

const billingColumns: Array<{
  key: keyof BillingHistoryItem | 'actions'
  label: string
  className?: string
  valueClassName?: string
  hideMobileLabel?: boolean
  render?: (item: BillingHistoryItem) => React.ReactNode
}> = [
  {
    key: 'invoice',
    label: 'Invoice',
    className: 'lg:items-start',
    hideMobileLabel: true,
    render: (item) => (
      <div className="flex items-start gap-3 lg:items-center">
        <InvoiceIcon className="w-5 h-5 text-[color:var(--premitives-color-brand-purple-1000)]" />
        <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          {item.invoice}
        </span>
      </div>
    )
  },
  {
    key: 'date',
    label: 'Date',
    valueClassName:
      'text-[color:var(--tokens-color-text-text-inactive-2)]'
  },
  {
    key: 'plan',
    label: 'Plan',
    valueClassName:
      'text-[color:var(--tokens-color-text-text-inactive-2)]'
  },
  {
    key: 'users',
    label: 'Users',
    valueClassName:
      'text-[color:var(--tokens-color-text-text-inactive-2)]'
  },
  {
    key: 'actions',
    label: 'Actions',
    className: 'lg:flex-row lg:items-center lg:justify-end',
    render: () => (
      <button className="inline-flex h-5 w-5 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-[color:var(--tokens-color-border-border-subtle)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]" style={{ color: 'var(--tokens-color-text-text-primary)' }}>
        <MoreOptions className="w-5 h-5" />
      </button>
    )
  }
]

export const BillingSection: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredBillingHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_BILLING_HISTORY
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return MOCK_BILLING_HISTORY.filter((item) =>
      [item.invoice, item.date, item.plan, item.users]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredBillingHistory.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredBillingHistory.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, filteredBillingHistory])

  const hasResults = paginatedHistory.length > 0

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download clicked')
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className="flex flex-col mt-9 gap-12">
        <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
        Current Plan
        </h1>

        {/* Current Plan Section */}
        <div className="flex flex-col gap-6">
          {/* Plan Card */}
          <div className="w-full flex justify-center lg:justify-start">
            <div 
              className={`w-full max-w-[335px] rounded-[24px] p-6 border  ${
                isDark ? '!bg-[color:var(--tokens-color-surface-surface-card-hover)]' : 'bg-[color:var(--account-section-card-bg)] border-[color:var(--tokens-color-border-border-subtle)]'
              }`}
              style={isDark ? {
                backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                borderColor: 'var(--tokens-color-border-border-subtle)'
              } : {}}
            >
              <div className="flex flex-col gap-6">
              {/* Plan Name */}
              <div className="checkout-plan-name text-[color:var(--tokens-color-text-text-seconary)] ">
                Lite
              </div>
              
              {/* Price */}
              <div className="flex items-baseline ">
                 
                 <span className='relative w-fit font-h02-heading02 font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-large-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] whitespace-nowrap [font-style:var(--text-large-font-style)]'>$ </span>
                 <span className="tracking-[var(--h05-heading05-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h01-heading-01-font-weight)] leading-[var(--h05-heading05-line-height)] text-[length:var(--h01-heading-01-font-size)]">
                 15
                </span>
                <span className="font-h02-heading02 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)]">
                  /month
                </span>
              </div>
              
              {/* Description */}
              <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                Intelligence for everyday tasks
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Billing History Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-3 xl:flex-row items-center lg:items-start md:justify-between">
          <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          Billing History
            </h1>
            
            {/* Controls */}
            <div className="flex flex-col lg:flex-row items-stretch sm:items-stat gap-3 w-full md:w-auto">
              <button
                onClick={handleFilter}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isDark ? '' : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                }`}
                style={isDark ? {
                  borderColor: 'var(--tokens-color-border-border-subtle)',
                  backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                } : {}}
              >
                <Filters className="w-5 h-5 text-[color:var(--tokens-color-text-text-seconary)]" />
                <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Filter
                </span>
              </button>
              <div className="relative flex-1 sm:flex-none">
                <Search02 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--tokens-color-text-text-inactive-2)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[color:var(--premitives-color-brand-purple-1000)] focus:border-[color:var(--premitives-color-brand-purple-1000)] font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
                    isDark ? '' : ''
                  }`}
                  style={isDark ? {
                    borderColor: 'var(--tokens-color-border-border-subtle)',
                    backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                    color: 'var(--tokens-color-text-text-primary)'
                  } : {
                    borderColor: 'var(--tokens-color-border-border-subtle)',
                    backgroundColor: 'var(--tokens-color-surface-surface-primary)',
                    color: 'var(--tokens-color-text-text-primary)'
                  }}
                />
              </div>
              
              <button
                onClick={handleDownload}
                className={`px-4 py-2 ${isDark ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)]' : 'bg-[color:var(--premitives-color-brand-purple-1000)]'} text-white rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] w-full sm:w-auto`}
              >
                Download
              </button>
            </div>
          </div>

          {/* Billing History Table */}
          <div 
            className={`w-full overflow-hidden rounded-[24px] border ${
              isDark ? '' : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
            }`}
            style={isDark ? {
              borderColor: 'var(--tokens-color-border-border-subtle)',
              backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
            } : {}}
          >
            <div role="table" className="w-full">
              <div
                role="rowgroup"
                className="hidden border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 lg:grid lg:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto]"
              >
                {billingColumns.map((column) => (
                  <span
                    key={column.key}
                    className="text-left text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--tokens-color-text-text-inactive-2)] "
                  >
                    {column.label}
                  </span>
                ))}
              </div>

              <div role="rowgroup">
                {!hasResults ? (
                  <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                    <p className="font-h02-heading02 text-[length:var(--text-font-size)] font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)]">
                      No invoices found
                    </p>
                    <p className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                      Try adjusting your search or filters to see more results.
                    </p>
                  </div>
                ) : (
                  paginatedHistory.map((item, index) => (
                    <div
                      role="row"
                      key={item.id}
                      className={`flex flex-col md:grid md:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto] gap-3 md:gap-8 border-b border-[color:var(--tokens-color-border-border-subtle)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] md:px-6 ${index > 0 ? 'mt-4' : ''}`}
                    >
                      {/* Mobile Layout: Invoice Name + Action Button, Date on bottom */}
                      <div className="flex flex-col gap-3 md:hidden">
                        {/* Invoice Name + Action Button Row */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <InvoiceIcon className="w-5 h-5 text-[color:var(--premitives-color-brand-purple-1000)] flex-shrink-0" />
                            <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                              {item.invoice}
                            </span>
                          </div>
                          {/* Action Button */}
                          <button className="inline-flex h-5 w-5 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-[color:var(--tokens-color-border-border-subtle)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] flex-shrink-0" style={{ color: 'var(--tokens-color-text-text-primary)' }}>
                            <MoreOptions className="w-5 h-5" />
                          </button>
                        </div>
                        {/* Date on bottom left */}
                        <div className="flex items-start">
                          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout: All Columns */}
                      {billingColumns.map((column) => {
                        const content = column.render ? (
                          column.render(item)
                        ) : (
                          <span
                            className={cn(
                              'font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]',
                              column.valueClassName
                            )}
                          >
                            {item[column.key as keyof BillingHistoryItem]}
                          </span>
                        )

                        return (
                          <div
                            key={column.key}
                            role="cell"
                            className={cn('hidden md:flex flex-col gap-2', column.className)}
                          >
                            {content}
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  )
}