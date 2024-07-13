'use client'

import ChatRoom from '@/components/chatRoom'
import { useSearchParams } from 'next/navigation';

export default function ChatPage({ params }) {
  const searchParams = useSearchParams()
  const userName = searchParams.get('user')
  return <ChatRoom roomId={params.roomId} userName={userName}/>
}