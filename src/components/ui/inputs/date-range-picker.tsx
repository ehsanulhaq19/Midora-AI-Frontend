'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Close } from '@/icons'
import { useTheme } from '@/hooks/use-theme'
import { ActionButton } from '@/components/ui/buttons'
import { t } from '@/i18n'

interface DateRangePickerProps {
  isOpen: boolean
  onClose: () => void
  onApply: (startDate: string, endDate: string) => void
  initialStartDate?: string
  initialEndDate?: string
  title?: string
}

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: string
  maxDate?: string
  isDark: boolean
  position: 'start' | 'end'
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  isDark
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      setCurrentMonth(date)
      setViewYear(date.getFullYear())
      setViewMonth(date.getMonth())
    }
  }, [selectedDate])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date)
    if (minDate && dateStr < minDate) return true
    if (maxDate && dateStr > maxDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    return formatDate(date) === selectedDate
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleDateClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    if (!isDateDisabled(date)) {
      onDateSelect(formatDate(date))
    }
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className={`rounded-lg border p-4 ${
      isDark
        ? 'bg-[color:var(--tokens-color-surface-surface-card-default)] border-[color:var(--tokens-color-border-border-subtle)]'
        : 'bg-[color:var(--tokens-color-surface-surface-primary)] border-[color:var(--tokens-color-border-border-subtle)]'
    }`}>
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className={`p-1 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors ${
            isDark ? 'text-[color:var(--tokens-color-text-text-primary)]' : 'text-[color:var(--tokens-color-text-text-primary)]'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] text-[color:var(--tokens-color-text-text-primary)]">
          {monthNames[viewMonth]} {viewYear}
        </div>
        <button
          onClick={handleNextMonth}
          className={`p-1 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors ${
            isDark ? 'text-[color:var(--tokens-color-text-text-primary)]' : 'text-[color:var(--tokens-color-text-text-primary)]'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[color:var(--tokens-color-text-text-inactive-2)] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="aspect-square" />
          }

          const date = new Date(viewYear, viewMonth, day)
          const dateStr = formatDate(date)
          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const today = isToday(date)

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                disabled
                  ? 'text-[color:var(--tokens-color-text-text-inactive-2)] cursor-not-allowed opacity-50'
                  : selected
                  ? 'bg-[color:var(--premitives-color-brand-purple-1000)] text-white'
                  : today
                  ? 'bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)] border border-[color:var(--premitives-color-brand-purple-1000)]'
                  : 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate = '',
  initialEndDate = '',
  title
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [error, setError] = useState<string>('')
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const startInputRef = useRef<HTMLDivElement>(null)
  const endInputRef = useRef<HTMLDivElement>(null)
  const startCalendarRef = useRef<HTMLDivElement>(null)
  const endCalendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setStartDate(initialStartDate)
      setEndDate(initialEndDate)
      setError('')
      setShowStartCalendar(false)
      setShowEndCalendar(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, initialStartDate, initialEndDate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startInputRef.current &&
        !startInputRef.current.contains(event.target as Node) &&
        startCalendarRef.current &&
        !startCalendarRef.current.contains(event.target as Node)
      ) {
        setShowStartCalendar(false)
      }
      if (
        endInputRef.current &&
        !endInputRef.current.contains(event.target as Node) &&
        endCalendarRef.current &&
        !endCalendarRef.current.contains(event.target as Node)
      ) {
        setShowEndCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleApply = () => {
    if (!startDate || !endDate) {
      setError(t('account.usage.dateRangeError') || 'Please select both start and end dates')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      setError(t('account.usage.dateRangeInvalid') || 'Start date must be before end date')
      return
    }

    setError('')
    onApply(startDate, endDate)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowStartCalendar(false)
      setShowEndCalendar(false)
      onClose()
    }
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (!isOpen) return null

  const today = new Date().toISOString().split('T')[0]
  const isApplyDisabled = !startDate || !endDate

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative rounded-[24px] shadow-xl w-full max-w-md mx-4 ${
          isDark
            ? ''
            : 'bg-[color:var(--account-section-card-bg)]'
        }`}
        style={
          isDark
            ? {
                backgroundColor: 'var(--tokens-color-surface-surface-card-default)',
                borderColor: 'var(--tokens-color-border-border-subtle)',
                border: '1px solid var(--tokens-color-border-border-subtle)'
              }
            : {}
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
          <h2 className="font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[length:var(--text-large-font-size)] tracking-[var(--h02-heading02-letter-spacing)] leading-[100%] text-[color:var(--tokens-color-text-text-primary)]">
            {title || t('account.usage.selectCustomRange')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Start Date */}
          <div className="flex-1 relative" ref={startInputRef}>
            <label className="block font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-2">
              {t('account.usage.startDate')}
            </label>
            <div
              onClick={() => {
                setShowStartCalendar(!showStartCalendar)
                setShowEndCalendar(false)
              }}
              className={`w-full px-4 py-2 rounded-lg border cursor-pointer ${
                isDark
                  ? "bg-[color:var(--tokens-color-surface-surface-card-hover)] border-[color:var(--tokens-color-border-border-subtle)] text-[color:var(--tokens-color-text-text-primary)]"
                  : "bg-[color:var(--tokens-color-surface-surface-primary)] border-[color:var(--tokens-color-border-border-subtle)] text-[color:var(--tokens-color-text-text-primary)]"
              } font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] focus:outline-none focus:ring-2 focus:ring-[color:var(--premitives-color-brand-purple-1000)] transition-all`}
            >
              {startDate ? formatDisplayDate(startDate) : 'Select start date'}
            </div>
            {showStartCalendar && (
              <div
                ref={startCalendarRef}
                className="absolute z-10 mt-2 left-0 right-0"
              >
                <Calendar
                  selectedDate={startDate}
                  onDateSelect={(date) => {
                    setStartDate(date)
                    setShowStartCalendar(false)
                    setError('')
                  }}
                  minDate={undefined}
                  maxDate={endDate || today}
                  isDark={isDark}
                  position="start"
                />
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="flex-1 relative" ref={endInputRef}>
            <label className="block font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-2">
              {t('account.usage.endDate')}
            </label>
            <div
              onClick={() => {
                setShowEndCalendar(!showEndCalendar)
                setShowStartCalendar(false)
              }}
              className={`w-full px-4 py-2 rounded-lg border cursor-pointer ${
                isDark
                  ? "bg-[color:var(--tokens-color-surface-surface-card-hover)] border-[color:var(--tokens-color-border-border-subtle)] text-[color:var(--tokens-color-text-text-primary)]"
                  : "bg-[color:var(--tokens-color-surface-surface-primary)] border-[color:var(--tokens-color-border-border-subtle)] text-[color:var(--tokens-color-text-text-primary)]"
              } font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] focus:outline-none focus:ring-2 focus:ring-[color:var(--premitives-color-brand-purple-1000)] transition-all`}
            >
              {endDate ? formatDisplayDate(endDate) : 'Select end date'}
            </div>
            {showEndCalendar && (
              <div
                ref={endCalendarRef}
                className="absolute z-10 mt-2 left-0 right-0"
              >
                <Calendar
                  selectedDate={endDate}
                  onDateSelect={(date) => {
                    setEndDate(date)
                    setShowEndCalendar(false)
                    setError('')
                  }}
                  minDate={startDate}
                  maxDate={today}
                  isDark={isDark}
                  position="end"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 font-h02-heading02 font-[number:var(--text-font-weight)]">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[color:var(--tokens-color-border-border-subtle)]">
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onClose}
            className={
              isDark
                ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)] hover:!bg-[color:var(--tokens-color-surface-surface-card-default)]"
                : "!bg-[color:var(--tokens-color-surface-surface-primary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
            }
          >
            {t('account.usage.cancel')}
          </ActionButton>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={isApplyDisabled}
          >
            {t('account.usage.apply')}
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
