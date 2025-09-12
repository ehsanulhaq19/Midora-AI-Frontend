import React from 'react'
import { t } from '@/i18n'
import { Buttons } from '../../ui/buttons'

interface WelcomeStepProps {
  onNext: () => void
  className?: string
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, className }) => {
  return (
    <div className={`flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto] ${className}`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="relative w-full max-w-[400px] mt-[-1.00px] font-heading-primary font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl tracking-[-1.80px] leading-9">
          <span className="font-light tracking-[-0.65px]">
            {t('auth.welcomeTitle')}
          </span>
        </h1>
        
        <p className="relative w-full max-w-[350px] font-body-primary font-normal text-[#a0a0a0] text-base tracking-[-0.48px] leading-6">
          {t('auth.welcomeSubtitle')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-[-6px_4px_33.2px_#4d30711a]">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-6">
              Email verified successfully!
            </p>
          </div>
        </div>

        <div className="w-full">
          <Buttons 
            property1="pressed" 
            onClick={onNext}
            text={t('common.next')}
          />
        </div>
      </div>
    </div>
  )
}
