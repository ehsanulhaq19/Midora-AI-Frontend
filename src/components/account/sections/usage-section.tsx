"use client";

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, CalendarIcon, ExternalLinkIcon, Logout, TickIcon, ChevronDown, FileUpload } from '@/icons'
import { Toggle } from '@/components/ui'
import { useTheme } from '@/hooks/use-theme'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useAuth } from '@/contexts/AuthContext'
import { useUserCredits } from '@/hooks/use-user-credits'
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans'
import { useQueryUsageAnalytics } from '@/hooks/use-query-usage-analytics'
import { useQueryUsageList } from '@/hooks/use-query-usage-list'
import { t, tWithParams } from '@/i18n'
import { ActionButton } from '@/components/ui/buttons'
import { cn } from '@/lib/utils'
import { DateRangePicker } from '@/components/ui/inputs'
import { PaymentMethodsModal } from './payment-methods-modal'

type UsageTab = "subscription" | "team" | "analytics";
type DateRange = "1" | "7" | "30" | "60" | "billing";

// Usage table item type
type UsageTableItem = {
  id: string;
  date: string;
  model: string;
  total_credits: number;
  total_cost: number;
  subscription_plan_name: string | null;
};

const formatUsageDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');
  return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(6)}`;
};

const getUsageColumns = (): Array<{
  key: keyof UsageTableItem;
  label: string;
  className?: string;
  valueClassName?: string;
}> => [
  {
    key: "date",
    label: t("account.usage.date"),
    valueClassName: "text-[color:var(--tokens-color-text-text-inactive-2)]",
  },
  {
    key: "subscription_plan_name",
    label: t("account.usage.subscription"),
    valueClassName: "text-[color:var(--tokens-color-text-text-inactive-2)]",
  },
  {
    key: "model",
    label: t("account.usage.model"),
    valueClassName: "text-[color:var(--tokens-color-text-text-inactive-2)]",
  },
  {
    key: "total_credits",
    label: t("account.usage.credits"),
    className: "text-right items-end",
    valueClassName: "text-[color:var(--tokens-color-text-text-inactive-2)]",
  },
  {
    key: "total_cost",
    label: t("account.usage.cost"),
    className: "text-right items-end",
    valueClassName: "text-[color:var(--tokens-color-text-text-inactive-2)]",
  },
];

// Daily Credit Consumption Chart Component
const DailyCreditChart: React.FC<{ isDark: boolean; data: Array<{ date: string; credits_used: number }> }> = ({ isDark, data }) => {
  const chartHeight = 200
  const chartWidth = 600
  const padding = { top: 10, right: 20, bottom: 40, left: 50 }

  // Format date for display (e.g., "Nov 28")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate()
    return `${month} ${day}`
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    date: formatDate(item.date),
    value: item.credits_used
  }))

  const maxCreditValue = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.value), 1000) 
    : 1000

  const getYPosition = (value: number) => {
    return (
      chartHeight -
      padding.bottom -
      (value / maxCreditValue) * (chartHeight - padding.top - padding.bottom)
    );
  };

  const getXPosition = (index: number) => {
    if (chartData.length === 0) return padding.left
    if (chartData.length === 1) return padding.left
    const availableWidth = chartWidth - padding.left - padding.right
    return padding.left + (index / (chartData.length - 1)) * availableWidth
  }

  // Create area path
  const createAreaPath = () => {
    if (chartData.length === 0) return ''
    let path = `M ${getXPosition(0)} ${chartHeight - padding.bottom}`
    chartData.forEach((point, index) => {
      path += ` L ${getXPosition(index)} ${getYPosition(point.value)}`
    })
    path += ` L ${getXPosition(chartData.length - 1)} ${chartHeight - padding.bottom} Z`
    return path
  }

  // Create line path
  const createLinePath = () => {
    if (chartData.length === 0) return ''
    let path = `M ${getXPosition(0)} ${getYPosition(chartData[0].value)}`
    chartData.forEach((point, index) => {
      if (index > 0) {
        path += ` L ${getXPosition(index)} ${getYPosition(point.value)}`;
      }
    });
    return path;
  };

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-[color:var(--tokens-color-text-text-inactive-2)]">
        No data available
      </div>
    )
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Y-axis labels */}
        {(() => {
          const steps = 5
          const stepValue = maxCreditValue / steps
          const labels = []
          for (let i = 0; i <= steps; i++) {
            labels.push(Math.round(i * stepValue))
          }
          return labels.map((value) => {
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
          })
        })()}

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
          <linearGradient
            id="dailyCreditAreaGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="var(--premitives-color-brand-purple-1000)"
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor="var(--premitives-color-brand-purple-1000)"
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>

        {/* X-axis labels (show every 5th date or all if less than 10) */}
        {chartData.map((point, index) => {
          const showLabel = chartData.length <= 10 || index % Math.ceil(chartData.length / 10) === 0 || index === chartData.length - 1
          if (showLabel) {
            const x = getXPosition(index)
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={chartHeight - padding.bottom}
                  x2={x}
                  y2={chartHeight - padding.bottom + 5}
                  stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 18}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}
                >
                  {point.date}
                </text>
              </g>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

// Model Usage Distribution Chart Component
const ModelUsageChart: React.FC<{ isDark: boolean; data: Array<{ model_name: string; percentage_used: number }> }> = ({ isDark, data }) => {
  // Color palette for models
  const colors = ['#FF6B35', '#4A90E2', '#F7931E', '#50C878', '#9B59B6', '#E74C3C', '#3498DB', '#1ABC9C']
  
  const modelData = data.map((item, index) => ({
    name: item.model_name,
    percentage: item.percentage_used,
    color: colors[index % colors.length]
  }))

  if (modelData.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="text-[color:var(--tokens-color-text-text-inactive-2)]">
          No model usage data available
        </div>
      </div>
    )
  }

  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 70;
  const innerRadius = 40;

  // Calculate angles for donut chart
  let currentAngle = -90; // Start from top
  const total = modelData.reduce((sum, item) => sum + item.percentage, 0);

  const createArc = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerRadius * Math.cos(start);
    const y1 = centerY + outerRadius * Math.sin(start);
    const x2 = centerX + outerRadius * Math.cos(end);
    const y2 = centerY + outerRadius * Math.sin(end);

    const x3 = centerX + innerRadius * Math.cos(end);
    const y3 = centerY + innerRadius * Math.sin(end);
    const x4 = centerX + innerRadius * Math.cos(start);
    const y4 = centerY + innerRadius * Math.sin(start);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Chart */}
      <div className="flex-shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="chart-svg"
        >
          {modelData.map((item, index) => {
            const startAngle = currentAngle;
            const endAngle = currentAngle + (item.percentage / total) * 360;
            const path = createArc(startAngle, endAngle, radius, innerRadius);
            currentAngle = endAngle;

            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke={isDark ? "#1a1a1a" : "#ffffff"}
                strokeWidth="2"
                style={{ fill: item.color }}
              />
            );
          })}
        </svg>
      </div>

      {/* Scrollable Model List */}
      <div className="w-full max-h-[300px] overflow-y-auto pr-2">
        <div className="flex flex-col gap-3">
          {modelData.map((item, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] truncate">
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
    </div>
  );
};

export const UsageSection: React.FC = () => {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { userEmail, user } = useAuthRedux()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<UsageTab>('subscription')
  const [autoTopUp, setAutoTopUp] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>('60')
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [showCustomDateRange, setShowCustomDateRange] = useState(false)
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const previousTabRef = useRef<UsageTab>('subscription')
  const { data: creditsData, loading: creditsLoading, error: creditsError } = useUserCredits()
  const { activeSubscription, loadActiveSubscription, isSubscriptionLoading } = useSubscriptionPlans()
  const hasLoadedSubscription = useRef(false)

  // Calculate date range for analytics
  const getDateRange = (range: DateRange, customStart?: string, customEnd?: string) => {
    // If custom dates are provided, use them
    if (customStart && customEnd) {
      const startDate = new Date(customStart)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(customEnd)
      endDate.setHours(23, 59, 59, 999)
      
      return {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      }
    }
    
    // Otherwise use the predefined range
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    let startDate = new Date()
    
    if (range === 'billing') {
      // For billing cycle, we'll use the subscription's billing period if available
      // For now, default to 30 days
      startDate.setDate(startDate.getDate() - 30)
    } else {
      const days = parseInt(range)
      startDate.setDate(startDate.getDate() - days)
    }
    startDate.setHours(0, 0, 0, 0)
    
    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString()
    }
  }

  const dateRangeParams = getDateRange(dateRange, customStartDate, customEndDate)
  const { data: analyticsData, loading: analyticsLoading } = useQueryUsageAnalytics({
    startTime: dateRangeParams.startTime,
    endTime: dateRangeParams.endTime,
    enabled: activeTab === 'analytics'
  })
  const { data: queryUsageList, loading: queryUsageListLoading } = useQueryUsageList({
    startTime: dateRangeParams.startTime,
    endTime: dateRangeParams.endTime,
    enabled: activeTab === 'team'
  })

  // Set default date range to 1 day when switching to team tab (if no custom dates are set)
  useEffect(() => {
    if (activeTab === 'team' && previousTabRef.current !== 'team' && !customStartDate && !customEndDate) {
      setDateRange('1')
    }
    previousTabRef.current = activeTab
  }, [activeTab, customStartDate, customEndDate])

  // Load active subscription on mount (only once)
  useEffect(() => {
    // Only load if we haven't already loaded it
    if (!hasLoadedSubscription.current) {
      hasLoadedSubscription.current = true;
      loadActiveSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Check if user has an active paid subscription (not Free and not null)
  const hasPaidSubscription =
    activeSubscription &&
    activeSubscription.plan &&
    activeSubscription.plan.name.toLowerCase() !== "free";

  // Extract data from API response
  const availableCredits = creditsData?.available_credits ?? 0;
  const usedCredits = creditsData?.used_credits ?? 0;
  const planName = creditsData?.plan_name ?? "";
  const nextBillingDate = creditsData?.next_billing_date
    ? new Date(creditsData.next_billing_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const planDetails = creditsData?.plan_details;
  const monthlyRenewal = planDetails?.credits_per_month ?? 0;
  const totalCredits = monthlyRenewal;
  const billingAmount = planDetails
    ? `$${planDetails.monthly_price.toFixed(2)}`
    : "$0.00";

  const usagePercentage =
    totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleViewUsage = () => {
    // TODO: Implement view usage functionality
    console.log("View usage clicked");
  };

  const [paymentMethodsModalOpen, setPaymentMethodsModalOpen] = useState(false)

  const handleUpdatePayment = () => {
    setPaymentMethodsModalOpen(true)
  };

  const handlePaymentHistory = () => {
    // TODO: Implement payment history functionality
    console.log("Payment history clicked");
  };

  const handleCancelSubscription = () => {
    // TODO: Implement cancel subscription functionality
    console.log("Cancel subscription clicked");
  };

  const handleChangePlan = () => {
    router.push("/pricing");
  };

  const handleCustomDateRangeClick = () => {
    if (activeTab === 'team') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDatePicker(true);
    }
  };

  const handleApplyCustomDateRange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    // Clear the predefined date range to indicate custom range is active
    setDateRange("1" as DateRange);
    // The dateRangeParams will automatically use custom dates when they're set
  };

  const handleCloseCustomDateRange = () => {
    setShowCustomDateRange(false);
  };

  const handleExportCSV = () => {
    if (!queryUsageList || queryUsageList.length === 0) {
      return;
    }

    const headers = ['Date', 'Model', 'Credits', 'Cost', 'Subscription Plan'];
    const csvRows = [headers.join(',')];

    queryUsageList.forEach((item) => {
      // Format date as ISO string for CSV (YYYY-MM-DD HH:MM:SS format)
      const date = new Date(item.created_at);
      const isoDate = date.toISOString().replace('T', ' ').substring(0, 19);
      
      const row = [
        `"${isoDate}"`,
        `"${item.model_name.replace(/"/g, '""')}"`,
        item.total_credits.toString(),
        item.total_cost.toFixed(6),
        `"${(item.subscription_plan_name || 'N/A').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    const startDate = dateRangeParams.startTime.split('T')[0];
    const endDate = dateRangeParams.endTime.split('T')[0];
    link.setAttribute('download', `query_usage_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDateRangeDisplay = (): string => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    const endDate = new Date();
    let startDate = new Date();
    
    if (dateRange === 'billing') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      const days = parseInt(dateRange);
      startDate.setDate(startDate.getDate() - days);
    }
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with Email and Logout */}
      <div className="flex text-start  w-full items-center justify-start sm:justify-end p-4 sm:p-6 border-b border-[color:var(--tokens-color-border-border-subtle)]">
        <div className="flex items-center gap-2 ">
          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] max-w-[170px] sm:max-w-full truncate sm:whitespace-normal before:sm:text-clip"></span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-0 lg:gap-8 px-4 sm:px-6 border-b border-[color:var(--tokens-color-border-border-subtle)]">
        {(["subscription", "team", "analytics"] as UsageTab[]).map((tab) => (
          <ActionButton
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant="ghost"
            size="sm"
            className={`relative !py-4 !px-2 !h-auto !rounded-none capitalize font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] ${
              activeTab === tab
                ? "!text-[color:var(--tokens-color-text-text-brand)] font-semibold"
                : "!text-[color:var(--tokens-color-text-text-inactive-2)] hover:!text-[color:var(--tokens-color-text-text-primary)]"
            }`}
          >
            {t(`account.usage.${tab}`)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--tokens-color-text-text-brand)]" />
            )}
          </ActionButton>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-9 overflow-y-auto">
        {activeTab === "subscription" && (
          <div className="flex flex-col gap-12">
            {/* Page Title */}
            <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
              {t("account.usage.subscriptionTitle")}
            </h1>

            {/* Credits and Billing Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credits Card */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    {t("account.usage.credits")}
                  </h2>
                  <ActionButton
                    onClick={handleViewUsage}
                    variant="ghost"
                    size="sm"
                    className="!p-0 !h-auto !text-[color:var(--tokens-color-text-text-brand)] hover:!opacity-80 font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                  >
                    {t("account.usage.viewUsage")}
                  </ActionButton>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Available Credits */}
                  <div className="flex items-center gap-3">
                    <span className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--text-large-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      {availableCredits.toLocaleString()}{" "}
                      {t("account.usage.available")}
                    </span>
                    <EyeIcon
                      className="w-5 h-5"
                      color="var(--tokens-color-text-text-inactive-2)"
                    />
                  </div>

                  {/* Monthly Renewal Info */}
                  {creditsLoading ? (
                    <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {t("account.usage.loading")}
                    </div>
                  ) : (
                    <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {monthlyRenewal.toLocaleString()}{" "}
                      {t("account.usage.renewMonthly")} {planName}
                    </div>
                  )}

                  {/* Usage Progress Bar */}
                  <div className="flex flex-col gap-2">
                    <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                      {tWithParams("account.usage.usedThisMonth", {
                        used: usedCredits.toLocaleString(),
                        total: totalCredits.toLocaleString(),
                      })}
                    </span>
                    <div
                      className={`h-3 rounded-full overflow-hidden ${
                        isDark
                          ? "bg-[rgba(255,255,255,0.1)]"
                          : "bg-[rgba(0,0,0,0.05)]"
                      }`}
                    >
                      <div
                        className="h-full bg-[color:var(--premitives-color-brand-purple-1000)] transition-all duration-300"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Card */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    {t("account.usage.billing")}
                  </h2>
                  <ActionButton
                    onClick={handlePaymentHistory}
                    variant="ghost"
                    size="sm"
                    className="!p-0 !h-auto !text-[color:var(--tokens-color-text-text-brand)] hover:!opacity-80 font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                    rightIcon={<ExternalLinkIcon className="w-4 h-4" />}
                  >
                    {t("account.usage.paymentHistory")}
                  </ActionButton>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Next Billing Date */}
                  <div className="flex items-center gap-3">
                    <CalendarIcon
                      className="w-5 h-5"
                      color="var(--tokens-color-text-text-primary)"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                        {t("account.usage.nextBillingDate")}
                      </span>
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                        {creditsLoading
                          ? t("account.usage.loading")
                          : nextBillingDate ?? "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Billing Amount */}
                  <div className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                    {tWithParams("account.usage.cardCharged", {
                      amount: billingAmount,
                    })}
                  </div>

                  {/* Update Payment Button */}
                  <ActionButton
                    onClick={handleUpdatePayment}
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {t("account.usage.updatePayment")}
                  </ActionButton>
                </div>
              </div>
            </div>

            {/* Manage Your Subscription Section */}
            <div
              className={`w-full rounded-[24px] p-6 border ${
                isDark
                  ? ""
                  : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
              }`}
              style={
                isDark
                  ? {
                      borderColor: "var(--tokens-color-border-border-subtle)",
                      backgroundColor:
                        "var(--tokens-color-surface-surface-card-default)",
                    }
                  : {}
              }
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                    {t("account.usage.manageSubscription")}
                  </h2>
                  <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                    {t("account.usage.manageSubscriptionDescription")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {hasPaidSubscription && (
                    <ActionButton
                      onClick={handleCancelSubscription}
                      variant="danger"
                      size="sm"
                    >
                      {t("account.usage.cancelSubscription")}
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={handleChangePlan}
                    variant="primary"
                    size="sm"
                  >
                    {t("account.usage.changePlan")}
                  </ActionButton>
                </div>
              </div>
            </div>

            {/* Current Plan Card */}
            {planDetails && (
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <h2 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)] mb-6">
                  {t("account.usage.currentPlan")}:{" "}
                  {creditsLoading ? t("account.usage.loading") : planName}
                </h2>

                <div className="flex flex-col gap-6">
                  {/* Features List */}
                  <div className="flex flex-col gap-3">
                    {planDetails && (
                      <>
                        <div className="flex items-center gap-3">
                          <TickIcon
                            className="w-5 h-5"
                            color="var(--premitives-color-brand-purple-1000)"
                          />
                          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                            {planDetails.credits_per_month.toLocaleString()}{" "}
                            {t("account.usage.creditsPerMonth")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <TickIcon
                            className="w-5 h-5"
                            color="var(--premitives-color-brand-purple-1000)"
                          />
                          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                            {planDetails.file_storage_gb.toLocaleString()}{" "}
                            {t("account.usage.fileStorageGB")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <TickIcon
                            className="w-5 h-5"
                            color="var(--premitives-color-brand-purple-1000)"
                          />
                          <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                            {planDetails.vector_storage_entries.toLocaleString()}{" "}
                            {t("account.usage.vectorStorageEntries")}
                          </span>
                        </div>
                        {planDetails.message_history_days !== null && (
                          <div className="flex items-center gap-3">
                            <TickIcon
                              className="w-5 h-5"
                              color="var(--premitives-color-brand-purple-1000)"
                            />
                            <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                              {planDetails.message_history_days.toLocaleString()}{" "}
                              {t("account.usage.messageHistoryDays")}
                            </span>
                          </div>
                        )}
                        {planDetails.priority_support && (
                          <div className="flex items-center gap-3">
                            <TickIcon
                              className="w-5 h-5"
                              color="var(--premitives-color-brand-purple-1000)"
                            />
                            <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                              {t("account.usage.prioritySupport")}
                            </span>
                          </div>
                        )}
                        {planDetails.api_access.toLocaleString() != "none" && (
                          <div className="flex items-center gap-3">
                            <TickIcon
                              className="w-5 h-5"
                              color="var(--premitives-color-brand-purple-1000)"
                            />
                            <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                              {t("account.usage.apiAccess")}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "team" && (
          <div className="flex flex-col gap-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Dropdown */}
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={handleCustomDateRangeClick}
                  className={
                    isDark
                      ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)] hover:!bg-[color:var(--tokens-color-surface-surface-card-default)]"
                      : "!bg-[color:var(--tokens-color-surface-surface-primary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  }
                  rightIcon={<ChevronDown className="w-4 h-4" />}
                >
                  {formatDateRangeDisplay()}
                </ActionButton>

                {/* Range Selectors */}
                <div className="flex items-center gap-1 bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg p-1 border border-[color:var(--tokens-color-border-border-subtle)]">
                  {(["1", "7", "30"] as DateRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setCustomStartDate("");
                        setCustomEndDate("");
                      }}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        dateRange === range && !customStartDate && !customEndDate
                          ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-primary)]"
                          : "text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--tokens-color-text-text-primary)]"
                      )}
                    >
                      {range}d
                    </button>
                  ))}
                </div>
              </div>

              <ActionButton
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!queryUsageList || queryUsageList.length === 0 || queryUsageListLoading}
                className={
                  isDark
                    ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)] hover:!bg-[color:var(--tokens-color-surface-surface-card-default)]"
                    : "!bg-[color:var(--tokens-color-surface-surface-primary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                }
                leftIcon={<FileUpload className="w-4 h-4" />}
              >
                Export CSV
              </ActionButton>
            </div>

            {/* Usage Table */}
            <div
              className={`w-full overflow-hidden rounded-[24px] border ${
                isDark
                  ? ""
                  : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
              }`}
              style={
                isDark
                  ? {
                      borderColor: "var(--tokens-color-border-border-subtle)",
                      backgroundColor:
                        "var(--tokens-color-surface-surface-card-default)",
                    }
                  : {}
              }
            >
              <div role="table" className="w-full">
                {/* Headers */}
                <div
                  role="rowgroup"
                  className="hidden border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr]"
                >
                  {getUsageColumns().map((column) => (
                    <span
                      key={column.key}
                      className={cn(
                        "text-left text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--tokens-color-text-text-inactive-2)]",
                        column.className
                      )}
                    >
                      {column.label}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <div role="rowgroup">
                  {queryUsageListLoading ? (
                    <div className="px-6 py-8 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {t("account.usage.loading")}
                    </div>
                  ) : !queryUsageList || queryUsageList.length === 0 ? (
                    <div className="px-6 py-8 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                      No data available
                    </div>
                  ) : (
                    queryUsageList.map((item, index) => {
                      const formattedItem: UsageTableItem = {
                        id: `usage-${index}`,
                        date: formatUsageDate(item.created_at),
                        model: item.model_name,
                        total_credits: item.total_credits,
                        total_cost: item.total_cost,
                        subscription_plan_name: item.subscription_plan_name || "N/A",
                      };

                      return (
                        <div
                          role="row"
                          key={formattedItem.id}
                          className={`flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 md:gap-8 border-b border-[color:var(--tokens-color-border-border-subtle)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] md:px-6 ${
                            index > 0 ? "mt-4 md:mt-0" : ""
                          }`}
                        >
                          {/* Mobile Layout */}
                          <div className="flex flex-col gap-2 md:hidden">
                            <div className="flex justify-between items-center">
                              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                                {formattedItem.date}
                              </span>
                              <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                                {formatCurrency(formattedItem.total_cost)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-[color:var(--tokens-color-text-text-inactive-2)]">
                                {formatNumber(formattedItem.total_credits)}
                              </span>
                              <span className="text-[color:var(--tokens-color-text-text-inactive-2)]">
                                {formattedItem.model}
                              </span>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          {getUsageColumns().map((column) => (
                            <div
                              key={column.key}
                              role="cell"
                              className={cn(
                                "hidden md:flex flex-col items-start",
                                column.className
                              )}
                            >
                              <span
                                className={cn(
                                  "font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]",
                                  column.valueClassName
                                )}
                              >
                                {column.key === "total_cost"
                                  ? formatCurrency(formattedItem.total_cost)
                                  : column.key === "total_credits"
                                  ? formatNumber(formattedItem.total_credits)
                                  : formattedItem[column.key]}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Custom Date Range Picker Modal for Team Tab */}
            <DateRangePicker
              isOpen={showCustomDateRange}
              onClose={handleCloseCustomDateRange}
              onApply={handleApplyCustomDateRange}
              initialStartDate={customStartDate}
              initialEndDate={customEndDate}
              title={t("account.usage.selectCustomRange")}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="flex flex-col gap-12">
            {/* Title Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[var(--h02-heading02-letter-spacing)] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
                  {t("account.usage.analyticsTitle")}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-[color:var(--tokens-color-surface-surface-card-hover)] text-[color:var(--tokens-color-text-text-primary)]"
                      : "bg-[rgba(107,67,146,0.1)] text-[color:var(--tokens-color-text-text-brand)]"
                  }`}
                >
                  {customStartDate && customEndDate
                    ? `${new Date(customStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(customEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : dateRange === "billing"
                    ? t("account.usage.billingCycle")
                    : `${dateRange} ${t("account.usage.days")}`}
                </span>
              </div>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)]">
                {t("account.usage.analyticsDescription")}
              </p>
            </div>

            {/* Date Range Selection */}
            <div className="flex flex-wrap items-center gap-3">
              {(["7", "30", "60", "billing"] as DateRange[]).map((range) => (
                <ActionButton
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setCustomStartDate("");
                    setCustomEndDate("");
                    setShowCustomDatePicker(false);
                  }}
                  variant={dateRange === range && !customStartDate && !customEndDate ? "primary" : "outline"}
                  size="sm"
                  className={
                    dateRange === range && !customStartDate && !customEndDate
                      ? ""
                      : isDark
                      ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)] hover:!bg-[color:var(--tokens-color-surface-surface-card-default)]"
                      : "!bg-[color:var(--tokens-color-surface-surface-primary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  }
                >
                  {range === "billing"
                    ? t("account.usage.currentBillingCycle")
                    : tWithParams("account.usage.lastDays", { days: range })}
                </ActionButton>
              ))}
              <ActionButton
                variant="outline"
                size="sm"
                onClick={handleCustomDateRangeClick}
                className={
                  isDark
                    ? "!bg-[color:var(--tokens-color-surface-surface-card-hover)] hover:!bg-[color:var(--tokens-color-surface-surface-card-default)]"
                    : "!bg-[color:var(--tokens-color-surface-surface-primary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                }
                leftIcon={<CalendarIcon className="w-4 h-4" />}
                rightIcon={<ChevronDown className="w-4 h-4" />}
              >
                {t("account.usage.selectCustomRange")}
              </ActionButton>
            </div>

            {/* Custom Date Range Picker Modal */}
            <DateRangePicker
              isOpen={showCustomDatePicker}
              onClose={handleCloseCustomDateRange}
              onApply={handleApplyCustomDateRange}
              initialStartDate={customStartDate}
              initialEndDate={customEndDate}
              title={t("account.usage.selectCustomRange")}
            />

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Credits Used */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-4">
                  {t("account.usage.totalCreditsUsed")}
                </h3>
                <div className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--h01-heading-01-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                  {analyticsLoading ? '...' : (analyticsData?.total_credits_used?.toLocaleString() ?? '0')}
                </div>
              </div>

              {/* Active Users */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] mb-4">
                  {t('account.usage.totalQueries')}
                </h3>
                <div className="font-h02-heading02 font-[number:var(--h01-heading-01-font-weight)] text-[length:var(--h01-heading-01-font-size)] tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                  {analyticsLoading ? '...' : (analyticsData?.total_queries?.toLocaleString() ?? '0')}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Credit Consumption Chart */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] mb-6">
                  {t("account.usage.dailyCreditConsumption")}
                </h3>
                {analyticsLoading ? (
                  <div className="w-full h-[200px] flex items-center justify-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                    Loading...
                  </div>
                ) : (
                  <DailyCreditChart 
                    isDark={isDark} 
                    data={analyticsData?.daily_credits_usage ?? []} 
                  />
                )}
              </div>

              {/* Model Usage Distribution Chart */}
              <div
                className={`w-full rounded-[24px] p-6 border ${
                  isDark
                    ? ""
                    : "border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--account-section-card-bg)]"
                }`}
                style={
                  isDark
                    ? {
                        borderColor: "var(--tokens-color-border-border-subtle)",
                        backgroundColor:
                          "var(--tokens-color-surface-surface-card-default)",
                      }
                    : {}
                }
              >
                <h3 className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-[color:var(--tokens-color-text-text-primary)] mb-6">
                  {t("account.usage.modelUsageDistribution")}
                </h3>
                {analyticsLoading ? (
                  <div className="flex items-center justify-center h-[200px] text-[color:var(--tokens-color-text-text-inactive-2)]">
                    Loading...
                  </div>
                ) : (
                  <ModelUsageChart 
                    isDark={isDark} 
                    data={analyticsData?.model_usage ?? []} 
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods Modal */}
      <PaymentMethodsModal
        isOpen={paymentMethodsModalOpen}
        onClose={() => setPaymentMethodsModalOpen(false)}
        onPaymentMethodAdded={() => {}}
        onPaymentMethodDeleted={() => {}}
      />
    </div>
  );
};
