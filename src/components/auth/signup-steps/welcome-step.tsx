'use client'

import { t } from '@/i18n'
import { Buttons, BackButton } from '../../ui'
import { Paperclip, Lightbulb, Lightning, Grid, LogoOnly } from '@/icons'
import { useTheme } from '@/hooks/use-theme'

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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <div className={`flex flex-col w-full items-center justify-between bg-tokens-color-surface-surface-primary ${className}`}>
      <div className="flex flex-col w-full max-w-[475px] items-start gap-[36px]">
             
           <div className="relative flex items-center gap-3 justify-start md:justify-center">
          <div className='absolute left-[-250px] top-0'> <BackButton /></div>
              <a 
                href="/" 
                className="flex flex-col w-[120px] sm:w-[140px] lg:w-[154px] items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
               {isDark ? (
                  <img
                    className="relative self-stretch w-full "
                    alt="Midora AI Logo"
                    src="/img/dark-logo-text.png"
                  />
                ) : (
                  <img
                    className="relative self-stretch w-full aspect-[5.19] object-cover"
                    alt="Midora AI Logo"
                    src="/img/logo.png"
                  />
                )}
              </a>
            </div>

          <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-[36px] tracking-[-1.80px] leading-[100%]">
            {t('auth.welcomeOnboardingTitle')}
          </h1>


          <div className="relative w-full [font-family:'Poppins',Helvetica] font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {t('auth.welcomeOnboardingSubtitle')}
          </div>


        <div className="flex flex-col w-full items-start gap-[18px] relative">
          <div className="inline-flex items-start gap-[13px] relative">
            <Paperclip className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-h02-heading02 font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureDocumentSummary')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Lightbulb className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-h02-heading02 font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureCreativeContent')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Lightning className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-h02-heading02 font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureTaskAutomation')}
            </p>
          </div>

          <div className="inline-flex items-start gap-[13px] relative">
            <Grid className="relative mt-[2px] flex-shrink-0" />
            <p className="relative w-fit font-h02-heading02 font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
              {t('auth.featureAICollaboration')}
            </p>
          </div>
        </div>

        <p className="relative [font-family:'SF_Pro-Regular',Helvetica] font-normal [color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[0] leading-[100%] w-full max-w-[410px]">
          <span className="[font-family:'SF_Pro-Regular',Helvetica] font-normal [color:var(--tokens-color-text-text-inactive-2)] tracking-[0]">
            {t('auth.privacyNoticeText')}{' '}
          </span>
          <button 
            onClick={handlePrivacyClick}
            className="underline hover:text-gray-700 [color:var(--tokens-color-text-text-inactive-2)] transition-colors cursor-pointer"
          >
            {t('auth.privacySection')}
          </button>
        </p>

        <Buttons 
          className="!self-stretch !w-full !max-w-none " 
          property1="pressed"
          onClick={handleContinueClick}
          text={t('auth.continueWithEmail')}
        />
      </div>
    </div>
  )
}
