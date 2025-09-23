'use client'

import React from 'react'
import { ChatScreen } from '@/components/chat/chat-screen'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatScreen />
    </AuthGuard>
  )
}
