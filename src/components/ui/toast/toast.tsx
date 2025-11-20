'use client'

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { removeToast } from '@/store/slices/toastSlice'
import { Toast as ToastType } from '@/store/slices/toastSlice'
import { Check, X, AlertTriangle, AlertOctagon, Info } from 'lucide-react'

interface ToastProps {
  toast: ToastType
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id))
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, dispatch])

  const handleClose = () => {
    dispatch(removeToast(toast.id))
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTitleColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  const getMessageColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-700'
      case 'error':
        return 'text-red-700'
      case 'warning':
        return 'text-yellow-700'
      case 'info':
        return 'text-blue-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${getBackgroundColor()}
        animate-in slide-in-from-right-full duration-300
        max-w-sm w-full
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${getTitleColor()}`}>
          {toast.title}
        </h4>
        <p className={`text-sm mt-1 ${getMessageColor()}`}>
          {toast.message}
        </p>
        
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

export default Toast
