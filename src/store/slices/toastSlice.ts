import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    // Add a new toast
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const toast: Toast = {
        id,
        duration: 5000, // Default 5 seconds
        ...action.payload,
      }
      state.toasts.push(toast)
    },

    // Remove a toast by id
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },

    // Clear all toasts
    clearToasts: (state) => {
      state.toasts = []
    },

    // Update a toast
    updateToast: (state, action: PayloadAction<{ id: string; updates: Partial<Toast> }>) => {
      const { id, updates } = action.payload
      const index = state.toasts.findIndex(toast => toast.id === id)
      if (index !== -1) {
        state.toasts[index] = { ...state.toasts[index], ...updates }
      }
    },
  },
})

export const {
  addToast,
  removeToast,
  clearToasts,
  updateToast,
} = toastSlice.actions

// Action creators for common toast types
export const showSuccessToast = (title: string, message: string, options?: Partial<Toast>) =>
  addToast({ type: 'success', title, message, ...options })

export const showErrorToast = (title: string, message: string, options?: Partial<Toast>) =>
  addToast({ type: 'error', title, message, duration: 7000, ...options }) // Error toasts last longer

export const showWarningToast = (title: string, message: string, options?: Partial<Toast>) =>
  addToast({ type: 'warning', title, message, ...options })

export const showInfoToast = (title: string, message: string, options?: Partial<Toast>) =>
  addToast({ type: 'info', title, message, ...options })

export default toastSlice.reducer
