import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { LogoutButton } from '@/components/ui/buttons/logout-button'
import { useLogout } from '@/hooks/useLogout'

// Mock the useLogout hook
jest.mock('@/hooks/useLogout')
const mockUseLogout = useLogout as jest.MockedFunction<typeof useLogout>

// Mock the i18n
jest.mock('@/i18n', () => ({
  t: (key: string) => key
}))

describe('LogoutButton', () => {
  const mockLogoutUser = jest.fn()

  beforeEach(() => {
    mockUseLogout.mockReturnValue({
      logoutUser: mockLogoutUser
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders logout button with text and icon', () => {
    render(<LogoutButton />)
    
    expect(screen.getByText('auth.logout')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls logoutUser when clicked', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockLogoutUser).toHaveBeenCalledTimes(1)
  })

  it('renders with custom variant and size', () => {
    render(<LogoutButton variant="destructive" size="sm" />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('can hide icon or text', () => {
    render(<LogoutButton showIcon={false} showText={false} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.queryByText('auth.logout')).not.toBeInTheDocument()
  })
})
