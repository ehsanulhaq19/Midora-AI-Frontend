'use client'

import { useState, useEffect } from 'react'

interface SignupData {
  email: string
  fullName: string
  profession: string
}

const STORAGE_KEY = 'signupData'

export const useSignupData = () => {
  const [data, setData] = useState<SignupData>({
    email: '',
    fullName: '',
    profession: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setData(JSON.parse(stored))
        } catch (error) {
          console.error('Error parsing signup data:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  const updateData = (updates: Partial<SignupData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const clearData = () => {
    setData({ email: '', fullName: '', profession: '' })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  const isComplete = () => {
    return data.email && data.fullName && data.profession
  }

  return {
    data,
    updateData,
    clearData,
    isComplete
  }
}
