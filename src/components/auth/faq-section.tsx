import React from 'react'
import { Faqs } from './faqs'

interface FaqSectionProps {
  className?: string
}

export const FaqSection: React.FC<FaqSectionProps> = ({ className }) => {
  return (
    <div className={`flex flex-col w-full items-center gap-8 lg:gap-[88px] ${className}`}>
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] font-h01-heading-01 font-[number:var(--h01-heading-01-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-2xl sm:text-3xl lg:text-[length:var(--h01-heading-01-font-size)] text-center tracking-[var(--h01-heading-01-letter-spacing)] leading-[var(--h01-heading-01-line-height)] [font-style:var(--h01-heading-01-font-style)]">
          Frequently Asked Questions
        </div>

        <div className="inline-flex flex-col items-center gap-6 relative flex-[0_0_auto]">
          <Faqs className="!flex-[0_0_auto]" property1="idle" />
          <img
            className="relative w-full max-w-[538px] h-px object-cover"
            alt="Line"
            src="/img/line-4.svg"
          />

          <Faqs className="!flex-[0_0_auto]" property1="expanded" />
          <img
            className="relative w-full max-w-[538px] h-px object-cover"
            alt="Line"
            src="/img/line-4.svg"
          />

          <Faqs className="!flex-[0_0_auto]" property1="idle" />
        </div>
      </div>
    </div>
  )
}
