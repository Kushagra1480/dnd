import { roomExists } from '@/app/lib/chatStore'

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  
  if (roomExists(roomId)) {
    return new Response(JSON.stringify({ exists: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ exists: false }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}