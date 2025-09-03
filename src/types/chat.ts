export interface WelcomeStep {
  id: number
  title: string
  description: string
  icon: string
  delay: number
}

export interface ChatPageProps {
  // Add any props if needed in the future
}

export interface WelcomeStepProps {
  step: WelcomeStep
  index: number
  currentStep: number
}

export interface CompletionMessageProps {
  isVisible: boolean
}
