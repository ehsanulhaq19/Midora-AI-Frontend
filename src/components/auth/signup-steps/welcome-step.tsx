'use client'

import { t } from '@/i18n'
import { Buttons } from '../../ui'
import { Paperclip, Lightbulb, Lightning, Grid, LogoOnly } from '@/icons'

interface WelcomeStepProps {
  onNext: () => void
  className?: string
}

export const WelcomeStep = ({ 
  onNext, 
  className 
}: WelcomeStepProps) => {
  const handleContinueClick = () => {
    onNext()
  }

  const handlePrivacyClick = () => {
    console.log("Privacy Policy clicked")
    // Add your privacy policy navigation logic here
  } 

  return (
    <div className={`flex flex-col w-full items-center justify-between bg-tokens-color-surface-surface-primary ${className}`}>
      <div className="flex flex-col w-full max-w-[430px] items-start gap-[30px]">
        <LogoOnly
            className="!h-14 !aspect-[1.02] !w-[57px] mx-auto ml-0"
        />
        <div className="flex items-center gap-2.5 relative self-stretch w-full">
          <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-[36px] tracking-[-1.80px] leading-[36px]">
            {t('auth.welcomeOnboardingTitle')}
          </h1>
        </div>
        
        <div className="flex items-center gap-2.5 relative self-stretch w-full">
          <p className="relative w-full font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {t('auth.welcomeOnboardingSubtitle')}
          </p>
        </div>

        <div className="flex flex-col w-full items-start gap-[18px] relative">
          <div className="inline-flex items-start gap-[13px] relative">
            <Paperclip className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureDocumentSummary')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Lightbulb className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureCreativeContent')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Lightning className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureTaskAutomation')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Grid className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureAICollaboration')}
            </p>
          </div>
        </div>

        <p className="relative w-full [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a0a0a0] text-[14px] tracking-[0] leading-[normal]">
          <span className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a0a0a0] tracking-[0]">
            {t('auth.privacyNoticeText')}{' '}
          </span>
          <button 
            onClick={handlePrivacyClick}
            className="underline hover:text-gray-700 transition-colors cursor-pointer"
          >
            {t('auth.privacySection')}
          </button>
        </p>

        <Buttons 
          className="!self-stretch !w-full !max-w-none" 
          property1="pressed"
          onClick={handleContinueClick}
          text={t('auth.continueWithEmail')}
        />
      </div>
    </div>
  )
}
