'use client'

import React from 'react'

interface DropdownItemProps {
  value: string
  label: string
  icon?: React.ReactNode
  image?: string
  isSelected?: boolean
  onClick: (value: string) => void
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  value,
  label,
  icon,
  image,
  isSelected = false,
  onClick
}) => {
  return (
    <button
      type="button"
      className={`
        w-full px-3 py-2 text-left flex items-center gap-2 
        hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]
        transition-colors duration-200
        ${isSelected ? 'bg-[color:var(--tokens-color-surface-surface-tertiary)]' : ''}
      `}
      onClick={() => onClick(value)}
    >
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}
      {image && (
        <img
          src={image}
          alt={label}
          className="w-4 h-4 rounded flex-shrink-0"
        />
      )}
      <span className="font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
        {label}
      </span>
    </button>
  )
}
