/**
 * Common TypeScript types for the application
 */

// Basic types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// User types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  bio?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'user' | 'admin' | 'moderator'

// Authentication types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
  acceptTerms: boolean
}

// API types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  timestamp: string
  statusCode?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
  timestamp: string
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
  defaultValue?: any
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'url' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// UI types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Modal {
  id: string
  title: string
  content: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onClose?: () => void
  showCloseButton?: boolean
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  name: string
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value?: string | number
  onChange?: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
}

// Layout types
export interface LayoutConfig {
  sidebar: {
    collapsed: boolean
    width: number
    collapsedWidth: number
  }
  header: {
    height: number
    showUserMenu: boolean
  }
  footer: {
    show: boolean
    height: number
  }
}

// Theme types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    info: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
  dark: boolean
}

// File types
export interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  uploadedBy: string
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  priceRange?: {
    min: number
    max: number
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Event types
export interface AppEvent {
  id: string
  type: string
  payload: any
  timestamp: Date
  userId?: string
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

// Performance types
export interface PerformanceMetrics {
  pageLoadTime: number
  timeToFirstByte: number
  timeToInteractive: number
  bundleSize: number
  lighthouseScore: number
}

// Re-export specific types
export type { AIModelsState } from './ai-models'
export type { ConversationState } from './conversation'

// Export all types
export type {
  User,
  UserRole,
  AuthState,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  FormField,
  ValidationRule,
  SelectOption,
  Toast,
  Modal,
  Notification,
  BaseComponentProps,
  ButtonProps,
  InputProps,
  LayoutConfig,
  Theme,
  FileInfo,
  SearchFilters,
  AppEvent,
  ErrorBoundaryState,
  PerformanceMetrics,
}
