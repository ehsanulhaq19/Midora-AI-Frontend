import React, { useState } from 'react'
import { t } from '@/i18n'
import { Search, Star, Lightbulb, Stars, Scale, Code } from '@/icons'
import { TopicCard, NameInput, Buttons } from '../../ui'
import { LogoOnly } from '@/icons'
import { useToast } from '@/hooks/use-toast'

interface ProfessionStepProps {
  onNext: (finalTopics: string[], rawSelectedTopics: string[], otherInput?: string) => void
  onBack: () => void
  className?: string
  initialSelectedTopics?: string[]
  initialOtherInput?: string
}

export const ProfessionStep = ({ 
  onNext, 
  onBack, 
  className,
  initialSelectedTopics = [],
  initialOtherInput = ''
}: ProfessionStepProps) => {
  const { error: showErrorToast } = useToast()
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelectedTopics)
  const [otherInput, setOtherInput] = useState(initialOtherInput)
  const [otherError, setOtherError] = useState<string | null>(null)

  const OTHER_TOPIC_ID = 'Others'

  const topics = [
    { id: "Research & Analysis", icon: Search, text: "Research & Analysis" },
    { id: "Content & Creativity", icon: Star, text: "Content & Creativity" },
    { id: "Strategy & Problem Solving", icon: Lightbulb, text: "Strategy & Problem Solving" },
    { id: "Productivity & Automation", icon: Stars, text: "Productivity & Automation" },
    { id: "Design & Creativity", icon: Scale, text: "Design & Creativity" },
    { id: "Coding & Developing", icon: Code, text: "Coding & Developing" },
    { id: OTHER_TOPIC_ID, icon: Stars, text: "Others" },
  ]

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev: string[]) => {
      if (prev.indexOf(topicId) !== -1) {
        if (topicId === OTHER_TOPIC_ID) {
          setOtherInput('')
          setOtherError(null)
        }
        return prev.filter((id: string) => id !== topicId)
      } else if (prev.length < 3) {
        return [...prev, topicId]
      }
      showErrorToast(
        'Selection limit reached',
        'You can only select up to three topics.',
        { duration: 3000 }
      )
      return prev
    })
  }

  const handleContinue = () => {
    const hasOtherSelected = selectedTopics.includes(OTHER_TOPIC_ID)
    const trimmedOther = otherInput.trim()

    if (hasOtherSelected && !trimmedOther) {
      setOtherError('Please enter other interests (comma-separated).')
      return
    }

    if (selectedTopics.length === 3) {
      setOtherError(null)
      const finalTopics = selectedTopics.map(topic =>
        topic === OTHER_TOPIC_ID ? trimmedOther : topic
      )
      onNext(finalTopics, selectedTopics, hasOtherSelected ? trimmedOther : undefined)
    }
  }

  const hasOtherSelected = selectedTopics.includes(OTHER_TOPIC_ID)
  const isFormValid = selectedTopics.length === 3 && (!hasOtherSelected || !!otherInput.trim())

  return (
    <div className={`relative bg-tokens-color-surface-surface-primary ${className}`}>
      <div className="flex flex-col items-start gap-4">
      <div className="flex justify-start md:justify-center mb-2">
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
        <div className="flex items-center gap-2.5 relative self-stretch w-full mb-2">
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

        {hasOtherSelected && (
          <div className="flex flex-col gap-3 w-full max-w-[475px]">
            <p className="text-sm text-tokens-color-text-text-brand">
              Enter other areas of interest (comma-separated). We’ll treat this as one category.
            </p>
            <NameInput
              value={otherInput}
              onChange={(value) => {
                setOtherInput(value)
                if (value.trim()) {
                  setOtherError(null)
                }
              }}
              placeholder="e.g., Marketing, HR, Finance"
              error={otherError || undefined}
            />
          </div>
        )}

        <div className="text-sm [color:var(--tokens-color-text-text-inactive-2)] mt-2">
          {selectedTopics.length}/3 topics selected
        </div>
        <Buttons
          className={`w-full sm:w-36 mt-2 ${!isFormValid ? '!bg-tokens-color-surface-surface-button opacity-50' : '!bg-tokens-color-surface-surface-button-pressed'}`}
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
