'use client'

import React from 'react'
import { CheckBroken4 } from '@/icons'
import { PricingPlan } from '@/types/pricing'

interface EnhancedPricingCardProps {
  plan: PricingPlan
  isCurrentPlan?: boolean
  isSelected?: boolean
  onClick?: () => void
  onButtonClick?: () => void
  onCancelClick?: () => void
  showCancelButton?: boolean
}

export const EnhancedPricingCard: React.FC<EnhancedPricingCardProps> = ({ 
  plan, 
  isCurrentPlan = false,
  isSelected = false,
  onClick,
  onButtonClick,
  onCancelClick,
  showCancelButton = false
}) => {
  const baseClasses = "flex flex-col items-start gap-6 p-6 sm:p-9 relative rounded-3xl w-full max-w-[383px] min-h-[500px] sm:min-h-[616px] box-border cursor-pointer transition-all duration-300";
  
  // Card styling based on selection
  const cardClasses = isSelected
    ? `${baseClasses} bg-[color:var(--tokens-color-surface-surface-button-pressed)] text-white`
    : `${baseClasses} bg-[color:var(--tokens-color-surface-surface-sidebar-shrunk)]`;

  const textColorClasses = isSelected ? 'text-white' : 'text-[color:var(--tokens-color-text-text-seconary)]';

  // Button text
  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan'
    return `Get ${plan.name} Plan`
  }

  // Button styling
  const buttonClasses = isSelected
    ? 'w-full flex items-center justify-center gap-2 h-[40px] p-2 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:opacity-90 transition-all'
    : 'w-full flex items-center justify-center gap-2 h-[40px] p-2 bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors';

  const buttonTextClasses = isSelected 
    ? 'text-white' 
    : 'text-[color:var(--tokens-color-text-text-brand)]';

  const checkmarkColor = isSelected 
    ? '#ffffff' 
    : 'var(--light-mode-colors-dark-gray-900)';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
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
          <button 
            className={buttonClasses}
            onClick={(e) => {
              e.stopPropagation()
              if (onButtonClick) {
                onButtonClick()
              }
            }}
          >
            <div className={`relative w-fit font-SF-Pro text-[16px] tracking-[var(--text-extra-large-letter-spacing)] leading-[var(--h02-heading02-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)] ${buttonTextClasses}`}>
              {getButtonText()}
            </div>
          </button>
          {showCancelButton && isCurrentPlan && (
            <button
              className="w-full flex items-center justify-center gap-2 h-[40px] p-2 bg-red-600 hover:bg-red-700 rounded-[var(--premitives-corner-radius-corner-radius-2)] transition-all text-white"
              onClick={(e) => {
                e.stopPropagation()
                if (onCancelClick) {
                  onCancelClick()
                }
              }}
            >
              <div className="relative w-fit font-SF-Pro text-[16px] tracking-[var(--text-extra-large-letter-spacing)] leading-[var(--h02-heading02-line-height)] whitespace-nowrap">
                Cancel Subscription
              </div>
            </button>
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