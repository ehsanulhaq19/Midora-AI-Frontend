import { useState } from 'react'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons'
import { useTheme } from '@/hooks/use-theme'
import { InputWithButton, BackButton } from '../../ui'

interface FullNameStepProps {
  onNext: (fullName: string) => void
  onBack: () => void
  className?: string
  initialName?: string
}

export const FullNameStep = ({ 
  onNext, 
  onBack, 
  className,
  initialName = ''
}: FullNameStepProps) => {
  const [fullName, setFullName] = useState(initialName)

  const handleNameSubmit = (name: string) => {
    if (name.trim()) {
      onNext(name.trim())
    }
  }

  const handlePrivacyPolicyClick = () => {
    console.log("Privacy Policy clicked")
    // Add your privacy policy navigation logic here
  }
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div className={`relative w-full bg-tokens-color-surface-surface-primary flex flex-col justify-center ${className}`}>
      <div className="inline-flex flex-col items-start gap-6 w-full max-w-[480px] px-1 sm:px-2 mx-auto">   
      <div className="flex relativeitems-center gap-3 justify-start w-full">
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
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-lg sm:text-xl md:text-2xl tracking-[-1.80px] leading-tight">
            Before we get started what we call you?
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            Tell your name to start your journey with us.
            </p>
          </div>
        </div>

        <InputWithButton
          className="!self-stretch !w-full"
          placeholder={t('auth.fullNamePlaceholder')}
          onSubmit={handleNameSubmit}
          value={fullName}
          onChange={setFullName}
        />
      </div>
    </div>
  )
}
