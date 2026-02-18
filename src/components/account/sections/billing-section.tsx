'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Filters, Search02, InvoiceIcon, FileUpload } from '@/icons'
import { Pagination } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { t } from '@/i18n'
import { ActionButton } from '@/components/ui/buttons'
import { useInvoices } from '@/hooks/use-invoices'
import { Invoice } from '@/api/invoices/types'
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans'

type BillingHistoryItem = {
  id: string
  invoice: string
  date: string
  plan: string
  users: string
  invoiceSubscriptionUuid?: string
}

const PAGE_SIZE = 6

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const getBillingColumns = (
  onDownload: (invoiceSubscriptionUuid: string) => void
): Array<{
  key: keyof BillingHistoryItem | 'actions'
  label: string
  className?: string
  valueClassName?: string
  hideMobileLabel?: boolean
  render?: (item: BillingHistoryItem) => React.ReactNode
}> => [
  {
    key: 'invoice',
    label: t('account.billing.invoice'),
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
    label: t('account.billing.date'),
    valueClassName:
      'text-[color:var(--tokens-color-text-text-inactive-2)]'
  },
  {
    key: 'plan',
    label: t('account.billing.plan'),
    valueClassName:
      'text-[color:var(--tokens-color-text-text-inactive-2)]'
  },
  {
    key: 'actions',
    label: t('account.billing.actions'),
    className: 'lg:flex-row lg:items-center lg:justify-start',
    render: (item) => (
      <ActionButton
        variant="ghost"
        size="sm"
        onClick={() => item.invoiceSubscriptionUuid && onDownload(item.invoiceSubscriptionUuid)}
        className="!h-8 !px-3 !rounded-lg !border !border-transparent hover:!border-[color:var(--tokens-color-border-border-subtle)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
      >
        <FileUpload className="w-4 h-4 mr-2" />
        <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          {t('account.billing.download')}
        </span>
      </ActionButton>
    )
  }
]


export const BillingSection: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { invoices, isLoading, loadInvoices, downloadInvoice } = useInvoices()
  const { activeSubscription, isSubscriptionLoading, loadActiveSubscription } = useSubscriptionPlans()

  useEffect(() => {
    loadInvoices()
    loadActiveSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only load invoices and subscription once on mount

  const billingHistoryItems: BillingHistoryItem[] = useMemo(() => {
    return invoices.map((invoice: Invoice) => ({
      id: invoice.uuid,
      invoice: invoice.file_name.replace('.pdf', '') || 'Invoice',
      date: formatDate(invoice.created_at),
      plan: invoice.plan_name || 'N/A',
      users: '1 User', // Placeholder since user count is not available in invoice data
      invoiceSubscriptionUuid: invoice.invoice_subscription_uuid
    }))
  }, [invoices])

  const billingColumns = getBillingColumns(downloadInvoice)

  const filteredBillingHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return billingHistoryItems
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return billingHistoryItems.filter((item) =>
      [item.invoice, item.date, item.plan, item.users]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [searchQuery, billingHistoryItems])

  const totalPages = Math.max(1, Math.ceil(filteredBillingHistory.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage((prev: number) => Math.min(prev, totalPages))
  }, [totalPages])

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredBillingHistory.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, filteredBillingHistory])

  const hasResults = paginatedHistory.length > 0

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  const handleDownloadAll = () => {
    // TODO: Implement download all functionality
    console.log('Download all clicked')
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-4 sm:p-9">
        <div className="flex items-center justify-center py-12">
          <p className="font-h02-heading02 text-[length:var(--text-font-size)] font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)]">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className="flex flex-col mt-9 gap-12">
        <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
        {t('account.billing.title')}
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
              {isSubscriptionLoading ? (
                <div className="flex flex-col gap-6">
                  <div className="checkout-plan-name text-[color:var(--tokens-color-text-text-seconary)]">
                    {t('account.usage.loading')}
                  </div>
                </div>
              ) : activeSubscription?.plan ? (
                <div className="flex flex-col gap-6">
                  {/* Plan Name */}
                  <div className="checkout-plan-name text-[color:var(--tokens-color-text-text-seconary)]">
                    {activeSubscription.plan.name}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline">
                    <span className='relative w-fit font-h02-heading02 font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-large-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] whitespace-nowrap [font-style:var(--text-large-font-style)]'>
                      {activeSubscription.plan.currency || '$'} 
                    </span>
                    <span className="tracking-[var(--h05-heading05-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h01-heading-01-font-weight)] leading-[var(--h05-heading05-line-height)] text-[length:var(--h01-heading-01-font-size)]">
                      {activeSubscription.billing_cycle === 'annual' 
                        ? Math.round((activeSubscription.plan.annual_price / 12) * 100) / 100
                        : activeSubscription.plan.monthly_price}
                    </span>
                    <span className="font-h02-heading02 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)]">
                      {t('account.billing.perMonth')}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    {activeSubscription.plan.description || t('account.billing.planDescription')}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="checkout-plan-name text-[color:var(--tokens-color-text-text-seconary)]">
                    {t('account.billing.planName')}
                  </div>
                  <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    {t('account.billing.noActiveSubscription')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing History Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-3 xl:flex-row items-center lg:items-start md:justify-between">
          <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          {t('account.billing.billingHistory')}
            </h1>
            
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
                      {t('account.billing.noInvoices')}
                    </p>
                    <p className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {t('account.billing.noInvoicesDescription')}
                    </p>
                  </div>
                ) : (
                  paginatedHistory.map((item: BillingHistoryItem, index: number) => (
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
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            onClick={() => item.invoiceSubscriptionUuid && downloadInvoice(item.invoiceSubscriptionUuid)}
                            className="!h-8 !px-3 !rounded-lg !border !border-transparent hover:!border-[color:var(--tokens-color-border-border-subtle)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                          >
                            <FileUpload className="w-4 h-4 mr-2" />
                            <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                              {t('account.billing.download')}
                            </span>
                          </ActionButton>
                        </div>
                        {/* Date on bottom left */}
                        <div className="flex items-start">
                          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout: All Columns */}
                      {billingColumns.map((column: typeof billingColumns[0]) => {
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
