import React, { useState } from 'react'
import { t } from '@/i18n'
import { Buttons } from '../../ui/buttons'

interface ProfessionStepProps {
  onNext: (profession: string) => void
  onBack: () => void
  className?: string
}

export const ProfessionStep: React.FC<ProfessionStepProps> = ({ onNext, onBack, className }) => {
  const [profession, setProfession] = useState('')
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!profession.trim()) {
      setError(t('auth.professionRequired'))
      return
    }
    setError('')
    onNext(profession.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfession(e.target.value)
    if (error) setError('')
  }

  return (
    <div className={`flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto] ${className}`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="relative w-full max-w-[400px] mt-[-1.00px] font-heading-primary font-normal text-[color:var(--tokens-color-text-text-seconary)] text-3xl sm:text-4xl tracking-[-1.80px] leading-9">
          <span className="font-light tracking-[-0.65px]">
            {t('auth.professionTitle')}
          </span>
        </h1>
        
        <p className="relative w-full max-w-[350px] font-body-primary font-normal text-[#a0a0a0] text-base tracking-[-0.48px] leading-6">
          {t('auth.professionSubtitle')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-[color:var(--tokens-color-surface-surface-primary)] rounded-3xl shadow-[-6px_4px_33.2px_#4d30711a]">
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className={`flex h-[54px] items-center gap-3 relative self-stretch w-full rounded-xl border border-solid transition-all duration-200 focus-within:ring-offset-2 ${
            error 
              ? 'border-red-500 focus-within:ring-red-500' 
              : 'border-[#dbdbdb] focus-within:ring-blue-500'
          }`}>
            <input
              type="text"
              value={profession}
              onChange={handleInputChange}
              placeholder={t('auth.professionPlaceholder')}
              className="relative w-full font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal] bg-transparent border-none outline-none placeholder:text-[#a0a0a0] px-6 py-3"
              aria-label="Profession"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm font-body-primary font-normal tracking-[-0.48px] leading-[normal]">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 h-[54px] items-center justify-center rounded-xl border border-solid border-[#dbdbdb] hover:border-[#bbb] hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="font-body-primary font-normal text-black text-base tracking-[-0.48px] leading-[normal]">
              {t('common.back')}
            </span>
          </button>
          
          <div className="flex-1">
            <Buttons 
              property1="pressed" 
              onClick={handleNext}
              text={t('common.next')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
