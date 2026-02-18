import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export const CardHeader = ({ className, children }: CardHeaderProps) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
    >
      {children}
    </div>
  )
}

interface CardTitleProps {
  className?: string
  children: React.ReactNode
}

export const CardTitle = ({ className, children }: CardTitleProps) => {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
    >
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  className?: string
  children: React.ReactNode
}

export const CardDescription = ({ className, children }: CardDescriptionProps) => {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
    >
      {children}
    </p>
  )
}

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export const CardContent = ({ className, children }: CardContentProps) => {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
    >
      {children}
    </div>
  )
}
