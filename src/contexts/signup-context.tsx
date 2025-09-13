'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SignupData {
  email: string
  fullName: string
  profession: string
  password: string
}

interface SignupContextType {
  data: SignupData
  updateData: (updates: Partial<SignupData>) => void
  clearData: () => void
  isComplete: () => boolean
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

const STORAGE_KEY = 'signupData'

interface SignupProviderProps {
  children: ReactNode
}

export const SignupProvider: React.FC<SignupProviderProps> = ({ children }) => {
  const [data, setData] = useState<SignupData>({
    email: '',
    fullName: '',
    profession: '',
    password: ''
  })

  // Load data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsedData = JSON.parse(stored)
          setData(parsedData)
          console.log('Loaded signup data from storage:', parsedData)
        } catch (error) {
          console.error('Error parsing signup data:', error)
        }
      }
    }
  }, [])

  // Save data to sessionStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Saving signup data to storage:', data)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  const updateData = (updates: Partial<SignupData>) => {
    console.log('Updating signup data:', updates)
    setData(prev => ({ ...prev, ...updates }))
  }

  const clearData = () => {
    console.log('Clearing signup data')
    setData({ email: '', fullName: '', profession: '', password: '' })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  const isComplete = () => {
    return data.email && data.fullName && data.profession && data.password
  }

  const value: SignupContextType = {
    data,
    updateData,
    clearData,
    isComplete
  }

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  )
}

export const useSignupData = (): SignupContextType => {
  const context = useContext(SignupContext)
  if (context === undefined) {
    throw new Error('useSignupData must be used within a SignupProvider')
  }
  return context
}
