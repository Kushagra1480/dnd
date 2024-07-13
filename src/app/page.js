'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomCode, setRoomCode] = useState('')
  const [userName, setUserName] = useState('')
  const router = useRouter()

  const joinRoom = (e) => {
    e.preventDefault()
    if (userName.trim()) {
      router.push(`/chat/${roomCode}?user=${encodeURIComponent(userName)}`)
    } else {
      alert('Enter a name!!＼(｀0´)／')
    }
  };

  const createRoom = async () => {
    if(userName.trim()) {
      const newRoomCode = Math.random().toString(36).substring(7)
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: newRoomCode }),
      });
      if (response.ok) {
        router.push(`/chat/${newRoomCode}?user=${encodeURIComponent(userName)}`)
      }
    } else {
        alert('Enter a name!!＼(｀0´)／')
    }
  };

  return (
    <div>
      <h1>DnD</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
        required
      />
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