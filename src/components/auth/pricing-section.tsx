import React from 'react'
import { CheckBroken4 } from '@/icons'
import { pricingData } from '@/lib/pricing-data'
import { PricingPlan } from '@/types/pricing'
import { Slider } from '@/components/ui'

interface PricingSectionProps {
  className?: string
}

interface PricingCardProps {
  plan: PricingPlan
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  
  const baseClasses = "flex flex-col items-start gap-[88px] p-12 relative rounded-[var(--premitives-corner-radius-corner-radius-5)] transition-all duration-300 ease-in-out cursor-pointer group max-h-[525px] w-full max-w-[383px] hover:scale-110 transform origin-center"
  
  const cardClasses = `${baseClasses} bg-premitives-color-light-gray-1000 hover:bg-[linear-gradient(150deg,rgba(31,23,64,1)_0%,rgba(94,77,116,1)_100%)] hover:bg-tokens-color-surface-surface-button`

  const textColorClasses = "text-tokens-color-text-text-primary group-hover:text-tokens-color-text-text-neutral transition-colors duration-300"

  const iconColor = isHovered ? "white" : "#293241"
  const iconOpacity = "0.9"

  const priceColorClasses = "text-tokens-color-text-text-primary group-hover:text-tokens-color-text-text-neutral transition-colors duration-300"

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-start gap-12 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-[7px] relative self-stretch w-full flex-[0_0_auto]">
          <div className={`relative self-stretch mt-[-1.00px] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] ${textColorClasses} text-[length:var(--h02-heading02-font-size)] tracking-[var(--h02-heading02-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)]`}>
            {plan.name}
          </div>

          <div className={`relative self-stretch font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}>
            {plan.description}
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
              <CheckBroken4
                className="!relative !w-[18px] !h-[18px] !aspect-[1] transition-colors duration-300"
                color={iconColor}
                opacity={iconOpacity}
              />
              <p className={`relative flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-font-weight)] ${textColorClasses} text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]`}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto]">
          <div className={`relative w-fit mt-[-1.00px] font-h02-heading02-large font-[number:var(--text-large-font-weight)] ${priceColorClasses} text-[length:var(--text-large-font-size)] tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] whitespace-nowrap [font-style:var(--text-large-font-style)]`}>
            {plan.currency}
          </div>
        </div>

        <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]">
          <p className={`relative w-fit mt-[-1.00px] font-h02-heading02 font-normal ${priceColorClasses} text-4xl leading-9 whitespace-nowrap`}>
            <span className="tracking-[var(--h02-heading02-letter-spacing)] font-h02-heading02 [font-style:var(--h02-heading02-font-style)] font-[number:var(--h02-heading02-font-weight)] leading-[var(--h02-heading02-line-height)] text-[length:var(--h02-heading02-font-size)]">
              {plan.price}
            </span>

            <span className="font-h02-heading02 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] font-[number:var(--text-font-weight)]">
              {plan.period}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export const PricingSection: React.FC<PricingSectionProps> = ({ className }) => {
  return (
    <div className={`flex flex-col w-full items-center gap-8 lg:gap-[88px] ${className}`}>
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative self-stretch  font-h01-heading-01 font-[number:var(--h01-heading-01-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-2xl sm:text-3xl lg:text-[length:var(--h01-heading-01-font-size)] text-center tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)]">
          {pricingData.title}
        </p>

        <div className="flex items-center justify-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-full max-w-[930px] font-h02-heading02 font-[number:var(--text-large-font-weight)] text-tokens-color-text-text-primary text-base sm:text-lg lg:text-[length:var(--text-large-font-size)] text-center tracking-[var(--text-large-letter-spacing)] leading-[var(--text-large-line-height)] [font-style:var(--text-large-font-style)]">
            {pricingData.subtitle}
          </p>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden lg:flex flex-wrap items-center justify-center gap-[48px_48px] relative self-stretch w-full flex-[0_0_auto]">
        {pricingData.plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Tablet Slider Layout - Center mode with partial adjacent cards */}
      <div className="hidden md:block lg:hidden w-full">
        <Slider
          slidesToShow={1}
          slidesToScroll={1}
          showArrows={true}
          infinite={true}
          centerMode={true}
          centerPadding="60px"
          className="px-4"
        >
          {pricingData.plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </Slider>
      </div>

      {/* Mobile Slider Layout - Single card per slide */}
      <div className="md:hidden w-full">
        <Slider
          slidesToShow={1}
          slidesToScroll={1}
          showArrows={true}
          infinite={true}
          className="px-4"
        >
          {pricingData.plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </Slider>
      </div>
    </div>
  )
}