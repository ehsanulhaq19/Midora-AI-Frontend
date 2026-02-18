/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Midora AI Frontend',
  VERSION: '0.1.0',
  DESCRIPTION: 'A modern Next.js application with AI capabilities',
  AUTHOR: 'Midora AI Team',
  LICENSE: 'MIT',
  REPOSITORY: 'https://github.com/midora-ai/frontend',
} as const

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#3b82f6',
    SECONDARY_COLOR: '#64748b',
    SUCCESS_COLOR: '#10b981',
    WARNING_COLOR: '#f59e0b',
    ERROR_COLOR: '#ef4444',
    INFO_COLOR: '#3b82f6',
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      LINEAR: 'linear',
      IN: 'cubic-bezier(0.4, 0, 1, 1)',
      OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const

// Validation Configuration
export const VALIDATION_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    ALLOWED_CHARS: /^[a-zA-Z0-9_-]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
} as const

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// Error Messages
export const ERROR_MESSAGES = {
  COMMON: {
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password is too weak. Please choose a stronger password.',
  },
  FORM: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_URL: 'Please enter a valid URL.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    TERMS_NOT_ACCEPTED: 'You must accept the terms and conditions.',
  },
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  COMMON: {
    OPERATION_SUCCESSFUL: 'Operation completed successfully.',
    DATA_SAVED: 'Data saved successfully.',
    DATA_DELETED: 'Data deleted successfully.',
    DATA_UPDATED: 'Data updated successfully.',
  },
  AUTH: {
    LOGIN_SUCCESSFUL: 'Login successful.',
    LOGOUT_SUCCESSFUL: 'Logout successful.',
    REGISTRATION_SUCCESSFUL: 'Registration successful. Please check your email.',
    PASSWORD_RESET_SENT: 'Password reset email sent successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  RELATIVE: 'relative', // for relative time display
} as const
