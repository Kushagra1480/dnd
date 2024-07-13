import ChatRoom from '@/components/chatRoom'

export default function ChatPage({ params }) {
  return <ChatRoom roomId={params.roomId} />;
}