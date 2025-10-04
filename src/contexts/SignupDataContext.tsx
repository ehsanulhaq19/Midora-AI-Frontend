'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface SignupData {
  email: string
  fullName: string
  profession: string
  password: string
}

interface SignupDataContextType {
  data: SignupData
  updateData: (updates: Partial<SignupData>) => void
  clearData: () => void
  isComplete: () => boolean
}

const SignupDataContext = createContext<SignupDataContextType | undefined>(undefined)

const STORAGE_KEY = 'signupData'

interface SignupDataProviderProps {
  children: ReactNode
}

export const SignupDataProvider: React.FC<SignupDataProviderProps> = ({ children }) => {
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

  const updateData = useCallback((updates: Partial<SignupData>) => {
    console.log('Updating signup data:', updates)
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const clearData = useCallback(() => {
    console.log('Clearing signup data')
    setData({ email: '', fullName: '', profession: '', password: '' })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const isComplete = useCallback(() => {
    return data.email && data.fullName && data.profession && data.password
  }, [data])

  const value: SignupDataContextType = {
    data,
    updateData,
    clearData,
    isComplete
  }

  return (
    <SignupDataContext.Provider value={value}>
      {children}
    </SignupDataContext.Provider>
  )
}

export const useSignupData = (): SignupDataContextType => {
  const context = useContext(SignupDataContext)
  if (context === undefined) {
    throw new Error('useSignupData must be used within a SignupDataProvider')
  }
  return context
}
