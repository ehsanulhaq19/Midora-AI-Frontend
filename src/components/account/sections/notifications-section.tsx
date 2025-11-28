'use client'

import React, { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'

interface NotificationSettings {
  responses: {
    push: boolean
  }
  tasks: {
    push: boolean
    email: boolean
  }
  alerts: {
    push: boolean
    email: boolean
  }
}

export const NotificationsSection: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    responses: {
      push: true
    },
    tasks: {
      push: true,
      email: false
    },
    alerts: {
      push: true,
      email: false
    }
  })

  const updateSetting = (
    category: keyof NotificationSettings,
    type: 'push' | 'email',
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }))
  }

  const notificationDescription =
    'Get notified when midora responds to requests that take time, like research or image generation.'

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-9">
      <div className="flex flex-col mt-9 bg-[color:var(--account-section-card-bg)] gap-9 p-6 sm:p-9 rounded-xl border">
        <h1 className="text-[length:var(--text-large-font-size)] leading-[100%] tracking-[-1px] font-[number:var(--h05-heading05-font-weight)] font-[family-name:var(--h02-heading02-font-family)] text-[color:var(--tokens-color-text-text-seconary)]">
          Notifications
        </h1>

        {/* Responses Section */}
        <div className="flex flex-col gap-4 pb-9 border-b border-gray-200">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                Responses
              </h2>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {notificationDescription}
              </p>
            </div>
            <div className="flex items-center lg:justify-end">
              <Toggle
                checked={settings.responses.push}
                onChange={(checked) => updateSetting('responses', 'push', checked)}
                label="Push"
              />
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex flex-col gap-4 pb-9 border-b border-gray-200">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                Tasks
              </h2>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {notificationDescription}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Toggle
                checked={settings.tasks.push}
                onChange={(checked) => updateSetting('tasks', 'push', checked)}
                label="Push"
              />
              <Toggle
                checked={settings.tasks.email}
                onChange={(checked) => updateSetting('tasks', 'email', checked)}
                label="Email"
              />
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="font-[family-name:var(--h05-heading05-font-family)] text-[length:var(--text-font-size)] font-[number:var(--h05-heading05-font-weight)] leading-[140%] tracking-[-0.8px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-primary)]">
                Alerts
              </h2>
              <p className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                {notificationDescription}
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Toggle
                checked={settings.alerts.push}
                onChange={(checked) => updateSetting('alerts', 'push', checked)}
                label="Push"
              />
              <Toggle
                checked={settings.alerts.email}
                onChange={(checked) => updateSetting('alerts', 'email', checked)}
                label="Email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
