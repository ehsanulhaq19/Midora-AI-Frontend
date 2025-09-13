import React, { useState, useEffect } from 'react'
import { WelcomeStep, FullNameStep, ProfessionStep } from './'
import { LogoOnly } from '@/icons/logo-only';

interface MultiStepContainerProps {
  onComplete: (data: { email: string; fullName: string; profession: string }) => void
  initialEmail?: string
  className?: string
}

type Step = 'email' | 'welcome' | 'fullName' | 'profession'

export const MultiStepContainer: React.FC<MultiStepContainerProps> = ({ 
  onComplete, 
  initialEmail = '',
  className 
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [formData, setFormData] = useState({
    email: initialEmail,
    fullName: '',
    profession: ''
  })

  const handleEmailSubmit = (email: string) => {
    setFormData(prev => ({ ...prev, email }))
    setSlideDirection('right')
    setCurrentStep('welcome')
  }

  const handleWelcomeNext = () => {
    setSlideDirection('right')
    setCurrentStep('fullName')
  }

  const handleFullNameNext = (fullName: string) => {
    setFormData(prev => ({ ...prev, fullName }))
    setSlideDirection('right')
    setCurrentStep('profession')
  }

  const handleFullNameBack = () => {
    setSlideDirection('left')
    setCurrentStep('welcome')
  }

  const handleProfessionNext = (profession: string) => {
    setFormData(prev => ({ ...prev, profession }))
    onComplete({ ...formData, profession })
  }

  const handleProfessionBack = () => {
    setSlideDirection('left')
    setCurrentStep('fullName')
  }

  const getStepComponent = () => {
    const baseClasses = "w-full transition-transform duration-500 ease-in-out"
    const slideClasses = slideDirection === 'right' 
      ? "transform translate-x-full opacity-0" 
      : "transform -translate-x-full opacity-0"
    
    switch (currentStep) {
      case 'welcome':
        return (
          <div key="welcome" className={`${baseClasses} ${slideClasses}`}>
            <WelcomeStep onNext={handleWelcomeNext} />
          </div>
        )
      case 'fullName':
        return (
          <div key="fullName" className={`${baseClasses} ${slideClasses}`}>
            <FullNameStep 
              onNext={handleFullNameNext} 
              onBack={handleFullNameBack}
            />
          </div>
        )
      case 'profession':
        return (
          <div key="profession" className={`${baseClasses} ${slideClasses}`}>
            <ProfessionStep 
              onNext={handleProfessionNext} 
              onBack={handleProfessionBack}
            />
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.querySelector('.w-full.transition-transform')
      if (element) {
        element.classList.remove('translate-x-full', '-translate-x-full', 'opacity-0')
        element.classList.add('translate-x-0', 'opacity-100')
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="relative w-full">
      <LogoOnly
          className="!h-14 !aspect-[1.02] !w-[57px] mx-auto"
        />
        {getStepComponent()}
      </div>
    </div>
  )
}
