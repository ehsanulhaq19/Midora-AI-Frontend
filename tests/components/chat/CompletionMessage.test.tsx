import { render, screen } from '@testing-library/react'
import CompletionMessage from '@/components/chat/CompletionMessage'

describe('CompletionMessage', () => {
  it('renders completion message when visible', () => {
    render(<CompletionMessage isVisible={true} />)

    expect(screen.getByText('🎉 Welcome Complete!')).toBeInTheDocument()
    expect(screen.getByText(/You're all set!/)).toBeInTheDocument()
    expect(screen.getByText(/Our AI features will be launching soon/)).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    render(<CompletionMessage isVisible={false} />)

    expect(screen.queryByText('🎉 Welcome Complete!')).not.toBeInTheDocument()
    expect(screen.queryByText(/You're all set!/)).not.toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<CompletionMessage isVisible={true} />)

    const messageElement = screen.getByText('🎉 Welcome Complete!').closest('div')
    expect(messageElement).toHaveClass(
      'mt-12',
      'p-6',
      'bg-gradient-to-r',
      'from-primary-500',
      'to-secondary-500',
      'rounded-2xl',
      'text-white',
      'shadow-xl',
      'animate-bounce-in'
    )
  })
})
