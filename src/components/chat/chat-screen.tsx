'use client'

import React, { useState } from 'react'
import { useAuthRedux } from '@/hooks/useAuthRedux'
import { MainContainer } from './sidebar/main-container'
import { ModelSelection } from './model-selection'
import { NewChat } from './sidebar/new-chat'
import { AudioSettings, ArrowUpSm, Menu } from '@/icons'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons/logo-only'

export const ChatScreen: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [message, setMessage] = useState('')
  
  // Get user data from Redux store using custom hook
  const { userName } = useAuthRedux()

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-tokens-color-surface-surface-primary">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-tokens-color-surface-surface-tertiary rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-6 h-6 text-tokens-color-text-text-primary" />
      </button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        fixed lg:relative
        top-0 left-0
        w-72 lg:w-80
        h-full
        z-40
        transition-transform duration-300 ease-in-out
        lg:transition-none
      `}>
        <MainContainer
          className="h-full w-full"
          headerClassName="!bg-transparent"
          imagesImage="/img/image-26-2.svg"
          profileInfoAvatarSizeLgTypeImageClassName="!h-9 !aspect-[1] bg-[url(/img/avatar-3.png)] !left-[unset] !w-9 !top-[unset]"
          property1="expanded"
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header with Model Selection */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 lg:p-6 gap-4">
          <div className="w-full lg:w-auto">
            <ModelSelection
              className="w-full lg:w-auto"
              divClassName="!tracking-[0] !text-base ![font-style:unset] !font-normal ![font-family:'Poppins',Helvetica] !leading-[22.4px]"
              property1="frame-105"
            />
          </div>
          
          {/* Upgrade Button - Hidden on mobile, visible on larger screens */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center justify-center gap-2 p-3 bg-tokens-color-surface-surface-neutral rounded-[var(--premitives-corner-radius-corner-radius-2)]">
              <div className="relative w-fit font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                {t('chat.upgradeToPro')}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-4xl flex flex-col items-center gap-6 lg:gap-8">
            {/* Welcome Header */}
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <LogoOnly
                  className="w-8 h-8 lg:w-10 lg:h-10"
                  color="white"
                />
              </div>
              <h1 className="text-xl lg:text-3xl font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-center lg:text-left [font-style:var(--h02-heading02-font-style)]">
                {t('chat.welcomeBack', { name: userName })}
              </h1>
            </div>

            {/* Chat Input Area */}
            <div className="w-full max-w-2xl">
              <div className="flex flex-col gap-6 lg:gap-8 p-4 lg:p-6 bg-tokens-color-surface-surface-tertiary rounded-[var(--premitives-corner-radius-corner-radius-3)]">
                {/* Text Input Field */}
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chat.howCanIHelp')}
                    className="w-full min-h-[120px] p-4 bg-transparent border-none outline-none resize-none text-lg lg:text-xl font-text-large font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-primary)] placeholder-[color:var(--tokens-color-text-text-brand)] [font-style:var(--text-large-font-style)]"
                    style={{ fontFamily: 'inherit' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <button className="flex w-9 h-9 items-center justify-center p-2.5 rounded-[var(--premitives-corner-radius-corner-radius)] border border-solid border-tokens-color-border-border-inactive hover:bg-tokens-color-surface-surface-neutral transition-colors">
                      <ArrowUpSm
                        className="w-5 h-5"
                        color="#5E4D74"
                      />
                    </button>

                    <button className="flex w-9 h-9 items-center justify-center p-2.5 rounded-[var(--premitives-corner-radius-corner-radius)] border border-solid border-tokens-color-border-border-inactive hover:bg-tokens-color-surface-surface-neutral transition-colors">
                      <AudioSettings
                        className="w-5 h-5"
                        color="#5E4D74"
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex w-9 h-9 items-center justify-center p-2.5 rounded-[var(--premitives-corner-radius-corner-radius)] bg-tokens-color-surface-surface-brand disabled:bg-tokens-color-surface-surface-disabled disabled:opacity-50 hover:bg-opacity-90 transition-all"
                  >
                    <ArrowUpSm
                      className="w-5 h-5"
                      color="white"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Upgrade Button */}
            <div className="lg:hidden w-full max-w-xs">
              <div className="inline-flex w-full items-center justify-center gap-2 p-3 bg-tokens-color-surface-surface-neutral rounded-[var(--premitives-corner-radius-corner-radius-2)]">
                <div className="font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] [font-style:var(--h05-heading05-font-style)]">
                  {t('chat.upgradeToPro')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
