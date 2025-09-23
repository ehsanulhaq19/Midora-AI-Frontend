'use client'

import React, { useReducer } from 'react'
import { Search } from '@/icons'
import { t } from '@/i18n'

interface SearchChatProps {
  property1?: 'hovered' | 'idle'
  className?: string
}

type State = {
  property1: 'hovered' | 'idle'
}

type Action = 'mouse_enter' | 'mouse_leave'

function reducer(state: State, action: Action): State {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        property1: "hovered",
      }

    case "mouse_leave":
      return {
        ...state,
        property1: "idle",
      }
    default:
      return state
  }
}

export const SearchChat: React.FC<SearchChatProps> = ({ 
  property1 = 'idle', 
  className = '' 
}) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1,
  })

  return (
    <div
      className={`w-full flex items-center gap-4 p-2 relative ${state.property1 === "hovered" ? "rounded-[var(--premitives-corner-radius-corner-radius)]" : ""} ${state.property1 === "hovered" ? "bg-tokens-color-surface-surface-secondary" : ""} ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave")
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter")
      }}
    >
      <Search className="!relative !w-6 !h-6" color="#5E4D74" />
      <div className="[font-family:'Poppins',Helvetica] w-fit flex tracking-[-0.80px] text-base items-center text-[color:var(--tokens-color-text-text-brand)] font-normal leading-4 whitespace-nowrap justify-center relative">
        {t('chat.searchChat')}
      </div>
    </div>
  )
}
