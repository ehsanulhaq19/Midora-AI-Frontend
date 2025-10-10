'use client'

import React, { useEffect } from 'react'
import { useAIModels } from '@/hooks'
import { Dropdown } from '@/components/ui'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons/logo-only'

interface ModelSelectionProps {
  className?: string
  divClassName?: string
}

export const ModelSelection: React.FC<ModelSelectionProps> = ({ 
  className,
  divClassName 
}) => {
  // Using t function from i18n
  const {
    serviceProviders,
    selectedProvider,
    isAutoMode,
    isLoading,
    fetchServiceProviders,
    selectProvider,
    setAuto
  } = useAIModels()

  useEffect(() => {
    if (!serviceProviders) {
      fetchServiceProviders()
    }
  }, [])

  // Auto mode is now the default, no need for this effect

  const handleProviderChange = (value: string) => {
    if (value === 'auto') {
      setAuto(true)
    } else {
      const provider = serviceProviders.find(p => p.uuid === value)
      selectProvider(provider || null)
    }
  }

  const getCurrentValue = () => {
    if (isAutoMode) return 'auto'
    return selectedProvider?.uuid || ''
  }

  const getDropdownOptions = () => {
    const options = [
      {
        value: 'auto',
        label: 'Midroa AI',
        icon: <LogoOnly color="#FFFFFF" className="w-4 h-4" />
      }
    ]

    serviceProviders.forEach(provider => {
      const firstModel = provider.active_models[0]
      options.push({
        value: provider.uuid,
        label: provider.name,
        image: firstModel?.image_path || '/images/providers/default.png'
      })
    })

    return options
  }

  if (isLoading) {
    return (
      <div 
        className={`inline-flex items-center justify-center gap-1 p-2 relative rounded-[var(--premitives-corner-radius-corner-radius-2)] ${className}`}
        style={{ background: 'linear-gradient(109deg, #1F1740 3.33%, #503CA6 127.07%)' }}
      >
        <div className="text-tokens-color-text-text-neutral font-text-medium text-[length:var(--text-medium-font-size)]">Loading...</div>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center gap-1 p-2 relative rounded-[var(--premitives-corner-radius-corner-radius-2)] ${className}`}
      style={{ background: 'linear-gradient(109deg, #1F1740 3.33%, #503CA6 127.07%)' }}
    >
      <div className="inline-flex items-center gap-1.5 p-1 relative flex-[0_0_auto] bg-tokens-color-surface-surface-tertiary rounded-[var(--premitives-corner-radius-corner-radius-2)]">
        <Dropdown
          options={getDropdownOptions()}
          value={getCurrentValue()}
          onChange={handleProviderChange}
          className="min-w-[120px]"
          modeText={isAutoMode ? 'Auto' : 'Manual'}
        />
      </div>
    </div>
  )
}
