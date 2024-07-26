import { isRoomReady } from "@/app/lib/chatStore";
import { setUserState } from "@/app/lib/chatStore";
import { roomExists } from "@/app/lib/chatStore";
import { addGameMasterMessage } from "@/app/lib/gameMaster";

// HTTP GET /api/chat/state?roomId=<roomId>
// returns { state: <true|false> } 
// description: where true indicates all users are ready and false indicates at least one user is not ready

// HTTP POST /api/chat/state?roomId=<roomId>&user=<userId>&state=<state>
// returns { success: true } or throws an error if cant perform the operation
// description: sets the state of the user in the room

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const ready = isRoomReady(roomId);
    if(ready)
    {
        addGameMasterMessage(roomId);   /// IF ALL USERS ARE READY THEN ADD GAME MASTER MESSAGE
    }
    return new Response(JSON.stringify({ state : ready }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const user = searchParams.get('user');
    const state = searchParams.get('state');
    try{
    setUserState(roomId, user, state);
    }
    catch(e){
        return new Response(JSON.stringify({ error : e }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
    }
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
