import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'w-4 h-4 border-2',
        default: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
        xl: 'w-12 h-12 border-4',
      },
      color: {
        default: 'border-primary-600',
        secondary: 'border-secondary-600',
        white: 'border-white',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  }
)

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export function LoadingSpinner({ size, color, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, color, className }))}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
