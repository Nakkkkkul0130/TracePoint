import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
const CHAT_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(CHAT_URL, {
  transports: ['websocket'],
  withCredentials: true,
});


export default function ChatRoom() {
  const { itemId, receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const senderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const endRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socket.emit("joinRoom", itemId);

    fetch(`${BASE_URL}/messages/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error);

    socket.on("receiveMessage", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", itemId);
      socket.off("receiveMessage");
    };
  }, [itemId, token]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { itemId, senderId, receiverId, content: input, timestamp: new Date().toISOString() };

    socket.emit("sendMessage", msg);
    fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(msg)
    });

    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Chat Room</h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg max-w-2xl mx-auto h-[60vh] overflow-y-auto flex flex-col gap-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-xs p-2 rounded-md text-sm ${
              m.senderId === senderId
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-start'
            }`}
          >
            {m.content}
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="flex max-w-2xl mx-auto mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

