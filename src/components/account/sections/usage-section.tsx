'use client'

import React, { useState } from 'react'
import { EyeIcon, CalendarIcon, ExternalLinkIcon, Logout, TickIcon, ChevronDown } from '@/icons'
import { Toggle } from '@/components/ui'
import { useTheme } from '@/hooks/use-theme'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useAuth } from '@/contexts/AuthContext'
import { useUserCredits } from '@/hooks/use-user-credits'

type UsageTab = 'subscription' | 'team' | 'analytics'
type DateRange = '7' | '30' | '60' | 'billing'

// Mock data for daily credit consumption
const dailyCreditData = [
  { date: 'Oct 28', value: 8500 },
  { date: 'Oct 29', value: 12000 },
  { date: 'Oct 30', value: 9800 },
  { date: 'Oct 31', value: 15000 },
  { date: 'Nov 1', value: 11000 },
  { date: 'Nov 2', value: 13500 },
  { date: 'Nov 3', value: 9200 },
  { date: 'Nov 4', value: 18000 },
  { date: 'Nov 5', value: 14000 },
  { date: 'Nov 6', value: 16000 },
  { date: 'Nov 7', value: 12500 },
  { date: 'Nov 8', value: 19000 },
  { date: 'Nov 9', value: 11000 },
  { date: 'Nov 10', value: 14500 },
  { date: 'Nov 11', value: 17000 },
  { date: 'Nov 12', value: 13000 },
  { date: 'Nov 13', value: 20000 },
  { date: 'Nov 14', value: 15000 },
  { date: 'Nov 15', value: 17500 },
  { date: 'Nov 16', value: 14000 },
  { date: 'Nov 17', value: 18500 },
  { date: 'Nov 18', value: 12000 },
  { date: 'Nov 19', value: 16000 },
  { date: 'Nov 20', value: 19500 },
  { date: 'Nov 21', value: 14500 },
  { date: 'Nov 22', value: 17000 },
  { date: 'Nov 23', value: 13500 },
  { date: 'Nov 24', value: 21000 },
  { date: 'Nov 25', value: 15500 },
  { date: 'Nov 26', value: 18000 },
  { date: 'Nov 27', value: 14000 },
  { date: 'Nov 28', value: 19500 },
  { date: 'Nov 29', value: 16000 }
]

const maxCreditValue = 25000

// Daily Credit Consumption Chart Component
const DailyCreditChart: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const chartHeight = 200
  const chartWidth = 600
  const padding = { top: 10, right: 20, bottom: 40, left: 50 }

  const getYPosition = (value: number) => {
    return chartHeight - padding.bottom - ((value / maxCreditValue) * (chartHeight - padding.top - padding.bottom))
  }

  const getXPosition = (index: number) => {
    const availableWidth = chartWidth - padding.left - padding.right
    return padding.left + (index / (dailyCreditData.length - 1)) * availableWidth
  }

  // Create area path
  const createAreaPath = () => {
    let path = `M ${getXPosition(0)} ${chartHeight - padding.bottom}`
    dailyCreditData.forEach((point, index) => {
      path += ` L ${getXPosition(index)} ${getYPosition(point.value)}`
    })
    path += ` L ${getXPosition(dailyCreditData.length - 1)} ${chartHeight - padding.bottom} Z`
    return path
  }

  // Create line path
  const createLinePath = () => {
    let path = `M ${getXPosition(0)} ${getYPosition(dailyCreditData[0].value)}`
    dailyCreditData.forEach((point, index) => {
      if (index > 0) {
        path += ` L ${getXPosition(index)} ${getYPosition(point.value)}`
      }
    })
    return path
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Y-axis labels */}
        {[0, 5000, 10000, 15000, 20000, 25000].map((value) => {
          const y = getYPosition(value)
          return (
            <g key={value}>
              <line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="8"
                fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
              >
                {value.toLocaleString()}
              </text>
            </g>
          )
        })}

        {/* Area */}
        <path
          d={createAreaPath()}
          fill="url(#dailyCreditAreaGradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={createLinePath()}
          fill="none"
          stroke="var(--premitives-color-brand-purple-1000)"
          strokeWidth="2"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="dailyCreditAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--premitives-color-brand-purple-1000)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--premitives-color-brand-purple-1000)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* X-axis labels (show every 5th date) */}
        {dailyCreditData.map((point, index) => {
          if (index % 5 === 0) {
            const x = getXPosition(index)
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={chartHeight - padding.bottom}
                  x2={x}
                  y2={chartHeight - padding.bottom + 5}
                  stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
                >
                  {point.date}
                </text>
              </g>
            )
          }
          return null
        })}
      </svg>
    </div>
  )
}

// Model Usage Distribution Chart Component
const ModelUsageChart: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const modelData = [
    { name: 'Claude Sonnet', percentage: 90.8, color: '#FF6B35' },
    { name: 'Claude Sonnet 4', percentage: 10.2, color: '#4A90E2' }
  ]

  const size = 200
  const centerX = size / 2
  const centerY = size / 2
  const radius = 70
  const innerRadius = 40

  // Calculate angles for donut chart
  let currentAngle = -90 // Start from top
  const total = modelData.reduce((sum, item) => sum + item.percentage, 0)

  const createArc = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const start = (startAngle * Math.PI) / 180
    const end = (endAngle * Math.PI) / 180

    const x1 = centerX + outerRadius * Math.cos(start)
    const y1 = centerY + outerRadius * Math.sin(start)
    const x2 = centerX + outerRadius * Math.cos(end)
    const y2 = centerY + outerRadius * Math.sin(end)

    const x3 = centerX + innerRadius * Math.cos(end)
    const y3 = centerY + innerRadius * Math.sin(end)
    const x4 = centerX + innerRadius * Math.cos(start)
    const y4 = centerY + innerRadius * Math.sin(start)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="chart-svg">
          {modelData.map((item, index) => {
            const startAngle = currentAngle
            const endAngle = currentAngle + (item.percentage / total) * 360
            const path = createArc(startAngle, endAngle, radius, innerRadius)
            currentAngle = endAngle

            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke={isDark ? '#1a1a1a' : '#ffffff'}
                strokeWidth="2"
                style={{ fill: item.color }}
              />
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-4">
        {modelData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col">
              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                {item.name}
              </span>
              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const UsageSection: React.FC = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { userEmail } = useAuthRedux()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<UsageTab>('subscription')
  const [autoTopUp, setAutoTopUp] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('60')
  const { data: creditsData, loading: creditsLoading, error: creditsError } = useUserCredits()

  // Extract data from API response
  const availableCredits = creditsData?.available_credits ?? 0
  const usedCredits = creditsData?.used_credits ?? 0
  const planName = creditsData?.plan_name ?? 'No Plan'
  const nextBillingDate = creditsData?.next_billing_date 
    ? new Date(creditsData.next_billing_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null
  
  const planDetails = creditsData?.plan_details
  const monthlyRenewal = planDetails?.credits_per_month ?? 0
  const totalCredits = monthlyRenewal
  const billingAmount = planDetails 
    ? `$${planDetails.monthly_price.toFixed(2)}` 
    : '$0.00'

  const usagePercentage = totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleViewUsage = () => {
    // TODO: Implement view usage functionality
    console.log('View usage clicked')
  }

  const handleUpdatePayment = () => {
    // TODO: Implement update payment functionality
    console.log('Update payment clicked')
  }

  const handlePaymentHistory = () => {
    // TODO: Implement payment history functionality
    console.log('Payment history clicked')
  }

  const handleCancelSubscription = () => {
    // TODO: Implement cancel subscription functionality
    console.log('Cancel subscription clicked')
  }

  const handleChangePlan = () => {
    // TODO: Implement change plan functionality
    console.log('Change plan clicked')
  }

  const handleDeleteIndexedCode = () => {
    // TODO: Implement delete indexed code functionality
    console.log('Delete indexed code clicked')
  }

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    console.log('Delete account clicked')
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with Email and Logout */}
      <div className="flex text-start  w-full items-center justify-start sm:justify-end p-4 sm:p-6 border-b border-[color:var(--tokens-color-border-border-subtle)]">
        <div className="flex items-center gap-2 ">
          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] max-w-[170px] sm:max-w-full truncate sm:whitespace-normal before:sm:text-clip">
            {userEmail || 'user@example.com'}
          </span>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
              isDark
                ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)] text-[color:var(--tokens-color-text-text-primary)]'
                : 'bg-[rgba(107,67,146,0.1)] text-[color:var(--tokens-color-text-text-brand)]'
            }`}
          >
            <Logout className="w-4 h-4" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-0 lg:gap-8 px-4 sm:px-6 border-b border-[color:var(--tokens-color-border-border-subtle)]">
        {(['subscription', 'team', 'analytics'] as UsageTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 px-2 font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] transition-colors capitalize ${
              activeTab === tab
                ? 'text-[color:var(--tokens-color-text-text-brand)] font-semibold'
                : 'text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--tokens-color-text-text-primary)]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--tokens-color-text-text-brand)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-9 overflow-y-auto">
        {activeTab === 'subscription' && (
          <div className="flex flex-col gap-12">
            {/* Page Title */}
            <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
              Subscription
            </h1>

            {/* Credits and Billing Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credits Card */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    Credits
                  </h2>
                  <button
                    onClick={handleViewUsage}
                    className="flex items-center gap-2 text-[color:var(--tokens-color-text-text-brand)] hover:opacity-80 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                  >
                    View usage
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Available Credits */}
                  <div className="flex items-center gap-3">
                    <span className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--text-large-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      {availableCredits.toLocaleString()} available
                    </span>
                    <EyeIcon className="w-5 h-5" color="var(--tokens-color-text-text-inactive-2)" />
                  </div>

                  {/* Monthly Renewal Info */}
                  {creditsLoading ? (
                    <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      Loading...
                    </div>
                  ) : (
                    <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {monthlyRenewal.toLocaleString()} renew monthly on {planName}
                    </div>
                  )}

                  {/* Usage Progress Bar */}
                  <div className="flex flex-col gap-2">
                    <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      Used {usedCredits.toLocaleString()} of {totalCredits.toLocaleString()} this month
                    </span>
                    <div
                      className={`h-3 rounded-full overflow-hidden ${
                        isDark ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(0,0,0,0.05)]'
                      }`}
                    >
                      <div
                        className="h-full bg-[color:var(--premitives-color-brand-purple-1000)] transition-all duration-300"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Auto Top-up Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <Toggle
                      checked={autoTopUp}
                      onChange={setAutoTopUp}
                      label="Automatically top-up credits"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Card */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    Billing
                  </h2>
                  <button
                    onClick={handlePaymentHistory}
                    className="flex items-center gap-2 text-[color:var(--tokens-color-text-text-brand)] hover:opacity-80 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                  >
                    Payment history
                    <ExternalLinkIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Next Billing Date */}
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5" color="var(--tokens-color-text-text-primary)" />
                    <div className="flex flex-col gap-1">
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                        Next Billing Date
                      </span>
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                        {creditsLoading ? 'Loading...' : (nextBillingDate ?? 'N/A')}
                      </span>
                    </div>
                  </div>

                  {/* Billing Amount */}
                  <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                    Your card will be charged {billingAmount}
                  </div>

                  {/* Update Payment Button */}
                  <button
                    onClick={handleUpdatePayment}
                    className={`px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] w-full sm:w-auto ${
                      isDark
                        ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)]'
                        : 'bg-[color:var(--premitives-color-brand-purple-1000)]'
                    } text-white`}
                  >
                    Update Payment Method & Billing Info
                  </button>
                </div>
              </div>
            </div>

            {/* Manage Your Subscription Section */}
            <div
              className={`w-full rounded-[24px] p-6 border ${
                isDark
                  ? ''
                  : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
              }`}
              style={
                isDark
                  ? {
                      borderColor: 'var(--tokens-color-border-border-subtle)',
                      backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                    }
                  : {}
              }
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    Manage Your Subscription
                  </h2>
                  <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                    Switch plans, cancel your subscription, or contact sales about Enterprise options
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] bg-red-600 text-white"
                  >
                    Cancel subscription
                  </button>
                  <button
                    onClick={handleChangePlan}
                    className={`px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
                      isDark
                        ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)]'
                        : 'bg-[color:var(--premitives-color-brand-purple-1000)]'
                    } text-white`}
                  >
                    Change plan
                  </button>
                </div>
              </div>
            </div>

            {/* Current Plan Card */}
            <div
              className={`w-full rounded-[24px] p-6 border ${
                isDark
                  ? ''
                  : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
              }`}
              style={
                isDark
                  ? {
                      borderColor: 'var(--tokens-color-border-border-subtle)',
                      backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                    }
                  : {}
              }
            >
              <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)] mb-6">
                Current Plan: {creditsLoading ? 'Loading...' : planName}
              </h2>

              <div className="flex flex-col gap-6">
                {/* Features List */}
                <div className="flex flex-col gap-3">
                  {planDetails && (
                    <div className="flex items-center gap-3">
                      <TickIcon className="w-5 h-5" color="var(--premitives-color-brand-purple-1000)" />
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                        {planDetails.credits_per_month.toLocaleString()} credits per month
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <TickIcon className="w-5 h-5" color="var(--premitives-color-brand-purple-1000)" />
                    <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      Context Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TickIcon className="w-5 h-5" color="var(--premitives-color-brand-purple-1000)" />
                    <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      MCP & Native Tools
                    </span>
                  </div>
                  <button className="text-left text-[color:var(--tokens-color-text-text-brand)] hover:opacity-80 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] mt-2">
                    Show more
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[color:var(--tokens-color-border-border-subtle)]">
                  {planDetails ? (
                    <>
                      <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                        ${planDetails.monthly_price.toFixed(2)}/user/mo • 1 seat purchased
                      </div>
                      <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                        Monthly total: ${planDetails.monthly_price.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {creditsLoading ? 'Loading pricing information...' : 'No pricing information available'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div
              className={`w-full rounded-[24px] p-6 border ${
                isDark
                  ? ''
                  : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
              }`}
              style={
                isDark
                  ? {
                      borderColor: 'var(--tokens-color-border-border-subtle)',
                      backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                    }
                  : {}
              }
            >
              <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-primary)] mb-6">
                Danger Zone
              </h2>

              <div className="flex flex-col">
                {/* Delete Indexed Code Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-red-600">
                      Delete Indexed Code
                    </h3>
                    <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      Permanently delete your indexed code
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteIndexedCode}
                    className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] bg-red-50 text-red-600 border border-red-200 w-full md:w-auto"
                    style={
                      isDark
                        ? {
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            color: '#ef4444',
                            borderColor: 'rgba(220, 38, 38, 0.3)'
                          }
                        : {}
                    }
                  >
                    Delete Indexed Code
                  </button>
                </div>

                {/* Delete Account Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-red-600">
                      Delete Account
                    </h3>
                    <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      Permanently delete your account
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] bg-red-50 text-red-600 border border-red-200 w-full md:w-auto"
                    style={
                      isDark
                        ? {
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            color: '#ef4444',
                            borderColor: 'rgba(220, 38, 38, 0.3)'
                          }
                        : {}
                    }
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[color:var(--tokens-color-text-text-inactive-2)]">Team section coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-12">
            {/* Title Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                  Analytics
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDark
                    ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)] text-[color:var(--tokens-color-text-text-primary)]'
                    : 'bg-[rgba(107,67,146,0.1)] text-[color:var(--tokens-color-text-text-brand)]'
                }`}>
                  Last {dateRange === 'billing' ? 'Billing Cycle' : `${dateRange} Days`}
                </span>
              </div>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                Monitor your credit usage and model consumption patterns. Data in UTC
              </p>
            </div>

            {/* Date Range Selection */}
            <div className="flex flex-wrap items-center gap-3">
              {(['7', '30', '60', 'billing'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg transition-colors font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
                    dateRange === range
                      ? isDark
                        ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)] text-white'
                        : 'bg-[color:var(--premitives-color-brand-purple-1000)] text-white'
                      : isDark
                        ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-card-default)]'
                        : 'bg-[color:var(--tokens-color-surface-surface-primary)] text-[color:var(--tokens-color-text-text-primary)] border border-[color:var(--tokens-color-border-border-subtle)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                  }`}
                >
                  {range === 'billing' ? 'Current Billing Cycle' : `Last ${range} Days`}
                </button>
              ))}
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
                  isDark
                    ? 'bg-[color:var(--tokens-color-surface-surface-card-hover)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-card-default)]'
                    : 'bg-[color:var(--tokens-color-surface-surface-primary)] text-[color:var(--tokens-color-text-text-primary)] border border-[color:var(--tokens-color-border-border-subtle)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Select custom range
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Credits Used */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-4">
                  Total credits used
                </h3>
                <div className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--h01-heading-01-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                  141,257
                </div>
              </div>

              {/* Active Users */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-4">
                  Active users
                </h3>
                <div className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--h01-heading-01-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                  1
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Credit Consumption Chart */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] mb-6">
                  Daily Credit Consumption
                </h3>
                <DailyCreditChart isDark={isDark} />
              </div>

              {/* Model Usage Distribution Chart */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ''
                    : 'border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]'
                }`}
                style={
                  isDark
                    ? {
                        borderColor: 'var(--tokens-color-border-border-subtle)',
                        backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] mb-6">
                  Model Usage Distribution
                </h3>
                <ModelUsageChart isDark={isDark} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

