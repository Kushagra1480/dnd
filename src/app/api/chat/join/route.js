import { addUserToRoom } from "@/app/lib/chatStore";

export async function POST(request) {
    const { roomId, user } = await request.json();
    addUserToRoom(roomId, user);
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
    }