'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const joinRoom = (e) => {
    e.preventDefault();
    router.push(`/chat/${roomCode}`);
  };

  const createRoom = async () => {
    const newRoomCode = Math.random().toString(36).substring(7);
    const response = await fetch('/api/chat/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: newRoomCode }),
    });
    if (response.ok) {
      router.push(`/chat/${newRoomCode}`);
    }
  };

  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <form onSubmit={joinRoom}>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          required
        />
        <button type="submit">Join Room</button>
      </form>
      <button onClick={createRoom}>Create New Room</button>
    </div>
  );
}