import { addMessage } from '@/lib/chatStore';

export async function POST(request) {
  const { roomId, message } = await request.json();
  addMessage(roomId, { text: message, user: 'Anonymous' }); // You might want to add user identification later
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}  