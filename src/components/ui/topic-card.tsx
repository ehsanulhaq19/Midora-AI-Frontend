import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface TopicCardProps {
  icon: React.ComponentType<{ className?: string; color?: string }>
  text: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

export const TopicCard = ({ 
  icon: Icon, 
  text, 
  isSelected, 
  onClick,
  className 
}: TopicCardProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 sm:gap-3 p-2 sm:p-3 relative flex-[0_0_auto] rounded-xl border border-solid transition-all duration-200 hover:scale-105 min-w-0",
        isSelected
          ? isDark 
            ? "bg-[color:var(--tokens-color-surface-surface-card-purple)] border-[color:var(--tokens-color-surface-surface-card-purple)] text-white"
            : "bg-tokens-color-surface-surface-button border-tokens-color-surface-surface-button text-white"
          : "bg-tokens-color-surface-surface-tertiary border-tokens-color-border-border-inactive hover:border-tokens-color-surface-surface-button",
        className
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0",
          isSelected ? "text-white" : "text-tokens-color-text-text-brand"
        )}
        color={isSelected ? '#FFFFFF' : undefined}
      />
      <div
        className={cn(
          "relative w-fit mt-[-1.00px] font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)] truncate",
          isSelected ? "text-white" : "text-tokens-color-text-text-brand"
        )}
      >
        {text}
      </div>
    </button>
  )
}
