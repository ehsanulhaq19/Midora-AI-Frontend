'use client'

import React, { useReducer } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { DownArrowSm } from '@/icons'

interface ProfileInfoProps {
  property1?: 'hovered' | 'idle'
  className?: string
  avatarSizeLgTypeImageClassName?: string
  icon?: React.ReactNode
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

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  property1 = 'idle',
  className = '',
  avatarSizeLgTypeImageClassName = '',
  icon = (
    <DownArrowSm
      className="!relative !w-6 !h-6"
      color="#1F1740"
      opacity="0.9"
    />
  ),
}) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1,
  })

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-[var(--premitives-corner-radius-corner-radius-5)] relative w-full ${state.property1 === "hovered" ? "bg-tokens-color-surface-surface-tertiary" : ""} ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave")
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter")
      }}
    >
      <Avatar
        className={avatarSizeLgTypeImageClassName}
        indicator="none"
        size="lg"
        type="image"
        src="/img/avatar-3.png"
        alt="User Avatar"
      />
      <div className="flex flex-col items-start grow gap-1 flex-1 relative">
        <div className="inline-flex items-center gap-2.5 flex-[0_0_auto] justify-center relative">
          <div className="font-h05-heading05 w-fit mt-[-1.00px] tracking-[var(--h05-heading05-letter-spacing)] text-[length:var(--h05-heading05-font-size)] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-brand)] font-[number:var(--h05-heading05-font-weight)] text-center whitespace-nowrap leading-[var(--h05-heading05-line-height)] relative">
            Irfan Khan
          </div>
        </div>

        <div className="w-full flex self-stretch items-center gap-2.5 flex-[0_0_auto] relative">
          <div className="font-text-small w-fit mt-[-1.00px] tracking-[var(--text-small-letter-spacing)] text-[length:var(--text-small-font-size)] [font-style:var(--text-small-font-style)] text-tokens-color-text-text-inactive-2 font-[number:var(--text-small-font-weight)] text-center whitespace-nowrap leading-[var(--text-small-line-height)] relative">
            Plus Member
          </div>
        </div>
      </div>

      {icon}
    </div>
  )
}
