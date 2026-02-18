import { render, screen } from '@testing-library/react'
import WelcomeStep from '@/components/chat/WelcomeStep'
import { WelcomeStep as WelcomeStepType } from '@/types/chat'

const mockStep: WelcomeStepType = {
  id: 1,
  title: 'Test Step',
  description: 'This is a test step description',
  icon: '🚀',
  delay: 1000
}

describe('WelcomeStep', () => {
  it('renders step information correctly', () => {
    render(
      <WelcomeStep
        step={mockStep}
        index={0}
        currentStep={0}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('🚀')).toBeInTheDocument()
    expect(screen.getByText('Test Step')).toBeInTheDocument()
    expect(screen.getByText('This is a test step description')).toBeInTheDocument()
  })

  it('applies active styling when step is current', () => {
    render(
      <WelcomeStep
        step={mockStep}
        index={0}
        currentStep={0}
      />
    )

    const stepElement = screen.getByText('Test Step').closest('div')
    expect(stepElement).toHaveClass('border-primary-200', 'bg-white')
  })

  it('applies inactive styling when step is not current', () => {
    render(
      <WelcomeStep
        step={mockStep}
        index={1}
        currentStep={0}
      />
    )

    const stepElement = screen.getByText('Test Step').closest('div')
    expect(stepElement).toHaveClass('border-neutral-200', 'bg-neutral-50')
  })

  it('shows progress bar when step is active', () => {
    render(
      <WelcomeStep
        step={mockStep}
        index={0}
        currentStep={0}
      />
    )

    const progressBar = document.querySelector('.animate-progress-bar')
    expect(progressBar).toBeInTheDocument()
  })

  it('hides progress bar when step is inactive', () => {
    render(
      <WelcomeStep
        step={mockStep}
        index={1}
        currentStep={0}
      />
    )

    const progressBar = document.querySelector('.animate-progress-bar')
    expect(progressBar).not.toBeInTheDocument()
  })
})
