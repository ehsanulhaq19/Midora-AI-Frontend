'use client'

import React from 'react'
import { CheckBroken4 } from '@/icons'
import { PricingPlan } from '@/types/pricing'
import { useTheme } from '@/hooks/use-theme'
import { ActionButton } from '@/components/ui/buttons'
import { t, tWithParams } from '@/i18n'

interface EnhancedPricingCardProps {
  plan: PricingPlan
  isCurrentPlan?: boolean
  isSelected?: boolean
  onClick?: () => void
  onButtonClick?: () => void
  onCancelClick?: () => void
  showCancelButton?: boolean
  renewalDate?: string | null
  subscriptionStatus?: string | null
}

export const EnhancedPricingCard: React.FC<EnhancedPricingCardProps> = ({ 
  plan, 
  isCurrentPlan = false,
  isSelected = false,
  onClick,
  onButtonClick,
  onCancelClick,
  showCancelButton = false,
  renewalDate = null,
  subscriptionStatus = null
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isHovered, setIsHovered] = React.useState(false);
  
  const baseClasses = "flex flex-col items-start gap-6 p-6 sm:p-9 relative rounded-3xl w-full max-w-[383px] min-h-[500px] sm:min-h-[616px] box-border cursor-pointer transition-all duration-300";
  
  // Card styling based on hover and current plan
  let cardClasses = baseClasses;
  let cardStyle: React.CSSProperties = {};
  
  // Add dark mode border
  if (isDark) {
    cardStyle.border = '1px solid var(--tokens-color-surface-surface-card-purple)';
  }
  
  // Use CSS variables for better maintainability
  if (isHovered) {
    cardStyle.backgroundColor = 'var(--tokens-color-surface-surface-card-hover)';
    cardClasses = `${baseClasses} text-white`;
  } else if (isCurrentPlan) {
    // Current plan gets a border highlight
    cardClasses = `${baseClasses} border-2 border-green-500 ${isDark ? 'text-white' : ''}`;
    cardStyle.backgroundColor = 'var(--tokens-color-surface-surface-card-default)';
    // Override dark mode border for current plan with green border
    if (isDark) {
      cardStyle.border = '2px solid #10b981'; // green-500
    }
  } else {
    cardStyle.backgroundColor = 'var(--tokens-color-surface-surface-card-default)';
    cardClasses = `${baseClasses} ${isDark ? 'text-white' : ''}`;
  }

  const textColorClasses = isDark 
    ? 'text-white' 
    : (isHovered ? 'text-white' : 'text-[color:var(--tokens-color-text-text-seconary)]');

  /**
   * Format renewal or end date based on subscription status.
   * For FUTURE_COMPLETE subscriptions, displays "Ends on" instead of "Renews on".
   */
  const formatRenewalDate = (dateString: string | null, status?: string | null): string => {
    if (!dateString) return t('pricing.renewsSoon')
    try {
      const date = new Date(dateString)
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
      
      // Check if subscription is marked for cancellation
      if (status === 'FUTURE_COMPLETE') {
        return `${t('pricing.endsOn')} ${formattedDate}`
      }
      
      return `${t('pricing.renewsOn')} ${formattedDate}`
    } catch (error) {
      return t('pricing.renewsSoon')
    }
  }

  /**
   * Determine button text based on plan status.
   * Shows renewal/end date for current plans.
   */
  const getButtonText = () => {
    if (isCurrentPlan) {
      if (plan.name === 'Free') {
        return t('pricing.currentPlan')
      }
      return formatRenewalDate(renewalDate, subscriptionStatus)
    }
    return tWithParams('pricing.getPlan', { planName: plan.name })
  }

  // Button variant determination
  const getButtonVariant = () => {
    if (isCurrentPlan || plan.name === 'Free') {
      return 'secondary' // Disabled state
    }
    if (isHovered) {
      return 'primary'
    }
    return 'secondary'
  }

  const buttonTextClasses = isHovered 
    ? 'text-white' 
    : 'text-[color:var(--tokens-color-text-text-brand)]';

  const checkmarkColor = isDark 
    ? '#ffffff' 
    : (isHovered ? '#ffffff' : 'var(--light-mode-colors-dark-gray-900)');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div 
      className={cardClasses}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full z-10">
          Current Plan
        </div>
      )}
      
      <div className="flex flex-col items-start gap-4 sm:gap-6 relative self-stretch w-full flex-[0_0_auto]">
        {/* Title */}
        <div className={`relative self-stretch mt-[-1.00px] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] ${textColorClasses} app-text-3xl tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)]`}>
          {plan.name}
        </div>

        {/* Price */}
        <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto]">
            <div className={`relative w-fit font-h02-heading02 font-[number:var(--text-large-font-weight)] ${textColorClasses} text-[length:var(--text-large-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] whitespace-nowrap [font-style:var(--text-large-font-style)]`}>
              {plan.currency}
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
            <p className={`relative w-fit mt-[-1.00px] font-h02-heading02 font-normal ${textColorClasses} text-4xl leading-9 whitespace-nowrap`}>
              <span className="tracking-[var(--h05-heading05-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h01-heading-01-font-weight)] leading-[var(--h05-heading05-line-height)] text-[length:var(--h01-heading-01-font-size)]">
                {plan.price}
              </span>
              <span className="font-h02-heading02 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)]">
                {plan.period}
              </span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className={`relative self-stretch font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}>
          {plan.description}
        </div>

        {/* Button */}
        <div className="flex flex-col gap-2 w-full">
          <ActionButton
            variant={getButtonVariant()}
            size="sm"
            fullWidth
            disabled={isCurrentPlan || plan.name === 'Free'}
            className={`h-[40px] rounded-[var(--premitives-corner-radius-corner-radius-2)] ${isCurrentPlan || plan.name === 'Free' ? 'opacity-60' : ''}`}
            onClick={() => {
              if (!isCurrentPlan && onButtonClick) {
                onButtonClick()
              }
            }}
          >
            <div className={`relative w-fit font-SF-Pro text-[16px] tracking-[var(--text-extra-large-letter-spacing)] leading-[var(--h02-heading02-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)] ${buttonTextClasses}`}>
              {getButtonText()}
            </div>
          </ActionButton>
          {showCancelButton && isCurrentPlan && plan.name !== 'Free' && (
            <ActionButton
              variant="danger"
              size="sm"
              fullWidth
              className="h-[40px] rounded-[var(--premitives-corner-radius-corner-radius-2)]"
              onClick={() => {
                if (onCancelClick) {
                  onCancelClick()
                }
              }}
            >
              <div className="relative w-fit font-SF-Pro text-[16px] tracking-[var(--text-extra-large-letter-spacing)] leading-[var(--h02-heading02-line-height)] whitespace-nowrap">
                {t('pricing.cancelSubscription')}
              </div>
            </ActionButton>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-col items-start gap-3 sm:gap-5 relative self-stretch w-full flex-[0_0_auto]">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <CheckBroken4
                className="!relative !w-[18px] !h-[18px] !aspect-[1] flex-shrink-0"
                color={checkmarkColor}
              />
              <p className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}