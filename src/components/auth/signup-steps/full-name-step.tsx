import { useState } from 'react'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons'
import { InputWithButton } from '../../ui'

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

  return (
    <div className={`relative w-full bg-tokens-color-surface-surface-primary flex flex-col justify-center ${className}`}>
      <div className="inline-flex flex-col items-start gap-9 max-w-[475px] w-full px-4">   
        <LogoOnly
            className="!h-14 !aspect-[1.02] !w-[57px] mx-auto ml-0"
        />     
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <h1 className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-[24px] tracking-[-1.80px] leading-[36px]">
            Before we get started what we call you?
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5 relative self-stretch w-full">
            <p className="relative w-full font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-inactive-2 text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
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
