'use client'

import React from 'react'
import { Avatar } from '@/components/ui/avatar'
import { DownArrowSm, FolderOpen, FolderOpen02, Folders, Midoras, MinusSquare } from '@/icons'
import { NewChat } from './new-chat'
import { SearchChat } from './search-chat'
import { ProfileInfo } from './profile-info'
import { LogoutButton } from '@/components/ui/buttons'
import { t } from '@/i18n'
import { LogoOnly } from '@/icons/logo-only'

interface MainContainerProps {
  className?: string
  headerClassName?: string
  imagesImage?: string
  profileInfoAvatarSizeLgTypeImageClassName?: string
  profileInfoIcon?: React.ReactNode
  property1?: 'expanded'
}

export const MainContainer: React.FC<MainContainerProps> = ({
  property1,
  className = '',
  headerClassName = '',
  imagesImage = '/img/image-26.svg',
  profileInfoAvatarSizeLgTypeImageClassName = '',
  profileInfoIcon = (
    <DownArrowSm
      className="!relative !w-6 !h-6"
      color="#1F1740"
      opacity="0.9"
    />
  ),
}) => {
  return (
    <div
      className={`flex flex-col w-full h-full items-start justify-between px-2 py-6 bg-tokens-color-surface-surface-tertiary ${className}`}
    >
      <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
        <div
          className={`flex items-center justify-between px-3 py-0 relative self-stretch w-full flex-[0_0_auto] ${headerClassName}`}
        >
          <LogoOnly
            className="relative w-9 h-9 aspect-[1]"
            color="white"
          />

          <MinusSquare
            className="!relative !w-6 !h-6"
            color="#1F1740"
            opacity="0.9"
          />
        </div>

        <div className="flex flex-col items-start gap-12 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <NewChat
                className="!left-[unset] !bg-tokens-color-icon-surface-icon-2 !top-[unset]"
                property1="add"
              />
              <div className="relative flex items-center justify-center w-fit font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                {t('chat.newChat')}
              </div>
            </div>

            <SearchChat
              className="!self-stretch !flex-[0_0_auto] !px-3 !py-2 !left-[unset] !w-full !top-[unset]"
              property1="idle"
            />
            
            <div className="px-3 py-2 flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <Midoras className="!relative !w-6 !h-6" color="#5E4D74" />
              <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-brand)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                {t('chat.midoras')}
              </div>
            </div>

            <div className="px-3 py-1 flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex w-5 h-5 items-center justify-center">
                <img
                  className="w-full h-full object-cover rounded"
                  alt="AI Detector"
                  src="/img/6122191-1.png"
                />
              </div>
              <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-brand)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                {t('chat.aiDetection')}
              </div>
            </div>

            <div className="px-3 py-1 flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex w-5 h-5 items-center justify-center">
                <img
                  className="w-full h-full object-cover rounded"
                  alt="AI Humanizer"
                  src={imagesImage}
                />
              </div>
              <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-brand)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                {t('chat.aiHumanizer')}
              </div>
            </div>

            <div className="flex items-center gap-4 px-3 py-2 relative self-stretch w-full flex-[0_0_auto]">
              <Folders className="!relative !w-6 !h-6" color="#5E4D74" />
              <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-brand)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                {t('chat.newFolder')}
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <FolderOpen02 className="!relative !w-5 !h-5 !aspect-[1]" />
                  <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-seconary)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                    {t('chat.projectDiscussion')}
                  </div>
                </div>

                <div className="px-6 py-0 flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                    {t('chat.imageToPencilSketch')}
                  </p>
                </div>

                <div className="px-6 py-0 flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                    {t('chat.imageToPencilSketch')}
                  </p>
                </div>

                <div className="px-6 py-0 flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                    {t('chat.imageToPencilSketch')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <FolderOpen className="!relative !w-5 !h-5 !aspect-[1]" />
                <div className="relative flex items-center justify-center w-fit [font-family:'Poppins',Helvetica] font-normal text-[color:var(--tokens-color-text-text-brand)] text-base tracking-[-0.80px] leading-4 whitespace-nowrap">
                  {t('chat.mainStreamMedia')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 px-6 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                {t('chat.recents')}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.imageToPencilSketch')}
                </p>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.photoEnhancement')}
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.realTimeColorization')}
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative flex items-center justify-center w-fit mt-[-1.00px] mr-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.model3DGeneration')}
                </p>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.styleTransfer')}
                </div>
              </div>

              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t('chat.facialRecognition')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <ProfileInfo
          avatarSizeLgTypeImageClassName={profileInfoAvatarSizeLgTypeImageClassName}
          className="!self-stretch !flex-[0_0_auto] !px-3 !py-2 !left-[unset] !w-full !top-[unset]"
          icon={profileInfoIcon}
          property1="idle"
        />
        
        <div className="px-3 py-2 w-full">
          <LogoutButton
            variant="ghost"
            size="default"
            className="w-full justify-start px-3 py-2 text-left"
          />
        </div>
      </div>
    </div>
  )
}
