'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomCode, setRoomCode] = useState('')
  const [userName, setUserName] = useState('')
  const router = useRouter()

  const joinRoom = async (e) => {
    e.preventDefault()
    await fetch(`/api/chat/check?roomId=${roomCode}`).
    then(async(res) => { await fetch(`/api/chat/join`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomCode, user: userName }),
    });
    return res}
    ).finally(() => {
        
          if (userName.trim()) {
            router.push(`/chat/${roomCode}?user=${encodeURIComponent(userName)}`)
          }
          else {
            alert('Enter a name!!＼(｀0´)／')
          }
  })
  };

  const createRoom = async () => {
    if (userName.trim()) {
      const newRoomCode = Math.random().toString(36).substring(7)
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: newRoomCode, user: userName }),
      }).then(async (response) => {
        if (response.ok) {

          await new Promise((resolve) => setTimeout(resolve, 2000))
          const roomExist = await fetch(`/api/chat/check?roomId=${newRoomCode}`)
          if (roomExist.ok) {
            router.push(`/chat/${newRoomCode}?user=${encodeURIComponent(userName)}`)
          }
          else {
            alert('Room does not exist!!＼(｀0´)／')
          }

        }
        else {
          alert('Enter a name!!＼(｀0´)／')
        }
      })}
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