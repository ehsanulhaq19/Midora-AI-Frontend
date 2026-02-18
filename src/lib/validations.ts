import { z } from 'zod'

/**
 * Common validation schemas for the application
 */

// User validation schema
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

// Registration validation schema
export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
})

// API response validation schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape,
})

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().optional(), // in bytes
  allowedTypes: z.array(z.string()).optional(),
})

// Form field validation helpers
export const fieldValidations = {
  required: (value: any) => !isEmpty(value) || 'This field is required',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
  minLength: (min: number) => (value: string) => value.length >= min || `Must be at least ${min} characters`,
  maxLength: (max: number) => (value: string) => value.length <= max || `Must be no more than ${max} characters`,
  url: (value: string) => /^https?:\/\/.+/.test(value) || 'Invalid URL',
  phone: (value: string) => /^[\+]?[1-9][\d]{0,15}$/.test(value) || 'Invalid phone number',
}

// Helper function to check if value is empty
function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// Export types
export type User = z.infer<typeof userSchema>
export type LoginData = z.infer<typeof loginSchema>
export type RegistrationData = z.infer<typeof registrationSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
export type SearchParams = z.infer<typeof searchSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
