import { addMessage } from '@/app/lib/chatStore';

export async function POST(request) {
  const { roomId, message, user } = await request.json();
  addMessage(roomId, { text: message, user: user }); // You might want to add user identification later
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}  