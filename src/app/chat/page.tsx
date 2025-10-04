'use client'

import React from 'react'
import { ChatScreen } from '@/components/chat/chat-screen'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { LoadingWrapper } from '@/components/ui/loaders'

export default function ChatPage() {
  return (
    <AuthGuard>
      <LoadingWrapper 
        message="Loading chat..."
        minLoadingTime={400}
        showInitially={true}
      >
        <ChatScreen />
      </LoadingWrapper>
    </AuthGuard>
  )
}
