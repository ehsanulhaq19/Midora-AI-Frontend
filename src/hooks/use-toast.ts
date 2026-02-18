import { useDispatch } from 'react-redux'
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast,
  addToast,
  removeToast,
  clearToasts
} from '@/store/slices/toastSlice'
import { Toast } from '@/store/slices/toastSlice'

export const useToast = () => {
  const dispatch = useDispatch()

  const success = (title: string, message: string, options?: Partial<Toast>) => {
    dispatch(showSuccessToast(title, message, options))
  }

  const error = (title: string, message: string, options?: Partial<Toast>) => {
    dispatch(showErrorToast(title, message, options))
  }

  const warning = (title: string, message: string, options?: Partial<Toast>) => {
    dispatch(showWarningToast(title, message, options))
  }

  const info = (title: string, message: string, options?: Partial<Toast>) => {
    dispatch(showInfoToast(title, message, options))
  }

  const custom = (toast: Omit<Toast, 'id'>) => {
    dispatch(addToast(toast))
  }

  const remove = (id: string) => {
    dispatch(removeToast(id))
  }

  const clear = () => {
    dispatch(clearToasts())
  }

  return {
    success,
    error,
    warning,
    info,
    custom,
    remove,
    clear,
  }
}
