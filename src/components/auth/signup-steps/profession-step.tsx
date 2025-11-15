import React, { useState } from 'react'
import { t } from '@/i18n'
import { Search, Star, Lightbulb, Stars, Scale, Code } from '@/icons'
import { TopicCard, NameInput, Buttons } from '../../ui'
import { LogoOnly } from '@/icons'

interface ProfessionStepProps {
  onNext: (profession: string, selectedTopics?: number[]) => void
  onBack: () => void
  className?: string
}

export const ProfessionStep = ({ 
  onNext, 
  onBack, 
  className 
}: ProfessionStepProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const topics = [
    { id: "Research & Analysis", icon: Search, text: "Research & Analysis" },
    { id: "Content & Creativity", icon: Star, text: "Content & Creativity" },
    { id: "Strategy & Problem Solving", icon: Lightbulb, text: "Strategy & Problem Solving" },
    { id: "Productivity & Automation", icon: Stars, text: "Productivity & Automation" },
    { id: "Design & Creativity", icon: Scale, text: "Design & Creativity" },
    { id: "Coding & Developing", icon: Code, text: "Coding & Developing" },
  ]

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev: string[]) => {
      if (prev.indexOf(topicId) !== -1) {
        return prev.filter((id: string) => id !== topicId)
      } else if (prev.length < 3) {
        return [...prev, topicId]
      }
      return prev
    })
  }

  const handleContinue = () => {
    if (selectedTopics.length === 3) {
      onNext(selectedTopics)
    }
  }

  const isFormValid = selectedTopics.length === 3

  return (
    <div className={`relative bg-tokens-color-surface-surface-primary ${className}`}>
      <div className="flex flex-col items-start gap-6">
      <div className="flex justify-start md:justify-center">
              <a 
                href="/" 
                className="flex flex-col w-[120px] sm:w-[140px] lg:w-[154px] items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  className="relative self-stretch w-full aspect-[5.19] object-cover"
                  alt="Midora AI Logo"
                  src="/img/logo.png"
                />
              </a>
            </div>    
        <div className="flex items-center gap-2.5 relative self-stretch w-full">
          <h1 className="relative w-fit whitespace-nowrap [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-lg sm:text-xl md:text-2xl tracking-[-1.80px] leading-tight sm:leading-8 md:leading-9">
            What are you into? Pick any three topics to explore
          </h1>
        </div>
        
        <div className="flex items-center gap-2.5 relative self-stretch w-full">
          <p className="relative w-full font-text font-[number:var(--text-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
            {t('auth.professionTitle')}
          </p>
        </div>

        <div className="flex flex-wrap w-full max-w-[475px] items-start gap-3 relative flex-[0_0_auto]">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              icon={topic.icon}
              text={topic.text}
              isSelected={selectedTopics.indexOf(topic.id) !== -1}
              onClick={() => handleTopicToggle(topic.id)}
            />
          ))}
        </div>

        <div className="text-sm [color:var(--tokens-color-text-text-inactive-2)] mt-2">
          {selectedTopics.length}/3 topics selected
        </div>

        <Buttons
          className={`w-full sm:w-36 ${!isFormValid ? '!bg-tokens-color-surface-surface-button opacity-50' : '!bg-tokens-color-surface-surface-button-pressed'}`}
          divClassName="!mr-0 !ml-0 sm:!mr-[-48.00px] sm:!ml-[-48.00px]"
          property1="active"
          text={t('auth.letsGoNext')}
          onClick={handleContinue}
          disabled={!isFormValid}
        />
      </div>
    </div>
  )
}
