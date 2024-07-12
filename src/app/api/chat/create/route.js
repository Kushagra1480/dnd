import { createRoom } from '@/lib/chatStore';

export async function POST(request) {
  const { roomId } = await request.json();
  createRoom(roomId);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}