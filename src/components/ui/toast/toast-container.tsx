'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Toast from './toast'

const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
