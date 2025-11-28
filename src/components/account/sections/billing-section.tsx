'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Filters, Search02, MoreOptions, InvoiceIcon } from '@/icons'
import { Pagination } from '@/components/ui'
import { cn } from '@/lib/utils'

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
      <button className="inline-flex h-5 w-5 items-center justify-center rounded-lg border border-transparent text-[color:var(--tokens-color-text-text-seconary)] transition-colors hover:border-gray-200 hover:bg-gray-50">
        <MoreOptions className="w-5 h-5" />
      </button>
    )
  }
]

export const BillingSection: React.FC = () => {
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
            <div className="w-full max-w-[335px] bg-[color:var(--account-section-card-bg)] rounded-[24px] p-6 border border-gray-200">
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          Billing History
            </h1>
            
            {/* Controls */}
            <div className="flex flex-col lg:flex-row items-stretch sm:items-stat gap-3 w-full md:w-auto">
              <button
                onClick={handleFilter}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
              >
                <Filters className="w-5 h-5 text-[color:var(--tokens-color-text-text-seconary)]" />
                <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Filter
                </span>
              </button>
              
              <div className="relative flex-1 sm:flex-none">
                <Search02 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--premitives-color-brand-purple-1000)] focus:border-[color:var(--premitives-color-brand-purple-1000)] font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                />
              </div>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[color:var(--premitives-color-brand-purple-1000)] text-white rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] w-full sm:w-auto"
              >
                Download
              </button>
            </div>
          </div>

          {/* Billing History Table */}
          <div className="w-full overflow-hidden rounded-[24px] border border-gray-200 bg-[color:var(--account-section-card-bg)]">
            <div role="table" className="w-full">
              <div
                role="rowgroup"
                className="hidden border-b border-gray-200 px-6 py-4 lg:grid lg:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto]"
              >
                {billingColumns.map((column) => (
                  <span
                    key={column.key}
                    className="text-left text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--tokens-color-text-text-inactive-2)]"
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
                  paginatedHistory.map((item) => (
                    <div
                      role="row"
                      key={item.id}
                      className="grid grid-cols-1 gap-4 border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50 lg:grid-cols-[2fr_repeat(3,minmax(0,1fr))_auto] lg:px-6"
                    >
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
                            className={cn('flex flex-col gap-2', column.className)}
                          >
                            {!column.hideMobileLabel && (
                              <span className="text-xs font-medium uppercase tracking-[0.08em] text-[color:var(--tokens-color-text-text-inactive-2)] lg:hidden">
                                {column.label}
                              </span>
                            )}
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