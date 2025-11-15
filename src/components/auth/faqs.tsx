import React from 'react'
import { Plus01_5 } from '@/icons'

interface FaqsProps {
  property1?: 'expanded' | 'idle'
  className?: string
}

export const Faqs: React.FC<FaqsProps> = ({ property1, className }) => {
  return (
    <div
      className={`flex flex-col items-start gap-4 justify-center relative w-full ${className}`}
    >
      <button 
        type="button"
        className="inline-flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={() => {}}
        aria-expanded={property1 === "expanded"}
        aria-label="Toggle FAQ: What is midora and how does it work?"
      >
        <p className="font-h03-heading03 w-full max-w-[509px]  tracking-[var(--text-large-letter-spacing)] text-lg sm:text-xl lg:text-[length:var(--text-large-font-size)] [font-style:var(--text-large-font-style)] text-tokens-color-text-text-primary font-[number:var(--text-large-font-weight)] leading-[var(--text-large-line-height)] relative text-left">
          What is midora and how does it work?
        </p>

        <Plus01_5
          className="relative w-6 h-6 flex-shrink-0 ml-4"
          color="#1F1740"
          opacity="0.9"
        />
      </button>

      {property1 === "expanded" && (
        <p className="relative w-full max-w-[544px] font-h03-heading03 font-[number:var(--text-font-weight)] text-tokens-color-text-text-primary text-sm sm:text-base lg:text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] text-left">
          If you can dream it, Claude can help you do it. Claude can process
          large amounts of information, brainstorm ideas, generate text and
          code, help you understand subjects, coach you through difficult
          situations, simplify your busywork so you can focus on what matters
          most, and so much more.
        </p>
      )}
    </div>
  )
}
