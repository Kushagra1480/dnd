import { addUserToRoom, createRoom } from '@/app/lib/chatStore';

export async function POST(request) {
  const { roomId,user } = await request.json();
  createRoom(roomId, user);
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}