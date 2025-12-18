import { cn } from '@/lib/utils'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
}

export const NameInput = ({ 
  value, 
  onChange, 
  placeholder,
  className,
  error
}: NameInputProps) => {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 bg-tokens-color-surface-surface-tertiary border border-tokens-color-border-border-inactive rounded-xl font-text text-tokens-color-text-text-brand placeholder:[color:var(--tokens-color-text-text-inactive-2)] focus:outline-none focus:border-tokens-color-surface-surface-button focus:ring-2 focus:ring-tokens-color-surface-surface-button focus:ring-opacity-20 transition-all duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {error && (
        <p className="text-red-500 text-sm font-text font-normal tracking-[-0.48px] leading-[normal]">
          {error}
        </p>
      )}
    </div>
  )
}
