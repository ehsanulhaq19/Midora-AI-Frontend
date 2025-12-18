import { useState } from 'react'
import { ArrowRightSm } from '@/icons'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface InputWithButtonProps {
  placeholder?: string
  onSubmit?: (value: string) => void
  className?: string
  value?: string
  onChange?: (value: string) => void
  type?: string
  inputMode?: string
  maxLength?: number
  error?: string
  disabled?: boolean
  buttonText?: string
  variant?: 'light' | 'dark'
}

export const InputWithButton = ({
  placeholder,
  onSubmit,
  className,
  value: controlledValue,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  error,
  disabled = false,
  buttonText = "Continue",
  variant = 'light'
}: InputWithButtonProps) => {
  const [internalValue, setInternalValue] = useState("")
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'
  
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = onChange || setInternalValue
  const isDark = variant === 'dark'

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={cn(
          "flex h-[54px] items-center pl-4 pr-1 py-3 relative rounded-xl border border-solid",
          error 
            ? "border-red-500" 
            : "border-tokens-color-border-border-inactive",
          className
        )}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            "relative flex-1 bg-transparent outline-none font-text font-[number:var(--text-font-weight)] text-tokens-color-text-text-seconary text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] placeholder:[color:var(--tokens-color-text-text-inactive-2)] disabled:opacity-50",
            isDark && "text-white placeholder:text-white/70"
          )}
        />

        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={`flex w-[46px] h-[46px] items-center justify-center gap-2.5 px-3 py-[18px] relative mt-[-8.00px] mb-[-8.00px] rounded-xl hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)]' : 'bg-tokens-color-surface-surface-button'}`}
        >
          <ArrowRightSm className="text-white !mr-[-1.00px] !mt-[-7.00px] !ml-[-1.00px] !mb-[-7.00px] !relative !left-[unset] !top-[unset]" />
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
