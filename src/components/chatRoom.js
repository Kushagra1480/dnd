'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkRoom = async () => {
      const response = await fetch(`/api/chat/check?roomId=${roomId}`);
      if (!response.ok) {
        router.push('/');
      }
    };
    checkRoom();

    // Set up a polling mechanism to fetch new messages
    const interval = setInterval(async () => {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, router]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, message: newMessage }),
    });
    if (response.ok) {
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}