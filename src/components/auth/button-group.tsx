import React from 'react'
import { CaretDown, FormatOutlineWeightBold } from '@/icons'

interface ButtonGroupProps {
  isIconRight?: boolean
  isIconLeft?: boolean
  text?: string
  isText?: boolean
  size?: 'sm'
  position?: 'first'
  hierarchy?: 'primary'
  color?: 'brand'
  state?: 'hover'
  className?: string
  textClassName?: string
  icon?: React.ReactNode
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  isIconRight = true,
  isIconLeft = true,
  text = "Button Text",
  isText = true,
  size,
  position,
  hierarchy,
  color,
  state,
  className,
  textClassName,
  icon = <CaretDown className="!relative !w-5 !h-5" color="white" />,
}) => {
  return (
    <div
      className={`inline-flex min-h-8 items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 relative bg-tokens-color-surface-surface-button rounded-[1234px_0px_0px_1234px] overflow-hidden border border-solid border-brand-80 ${className}`}
    >
      {isIconLeft && (
        <FormatOutlineWeightBold
          className="!relative !w-5 !h-5"
          color="white"
        />
      )}

      {isText && (
        <div
          className={`relative w-fit font-text-xs-bold font-[number:var(--text-xs-bold-font-weight)] text-gray0-white text-[length:var(--text-xs-bold-font-size)] tracking-[var(--text-xs-bold-letter-spacing)] leading-[var(--text-xs-bold-line-height)] whitespace-nowrap [font-style:var(--text-xs-bold-font-style)] ${textClassName}`}
        >
          {text}
        </div>
      )}

      {isIconRight && <>{icon}</>}
    </div>
  )
}
