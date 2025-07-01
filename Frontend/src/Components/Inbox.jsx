import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;



export default function Inbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${BASE_URL}/chat-rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid data");
        setChats(data);
      })
      .catch(err => {
        console.error("Inbox fetch error:", err);
        setChats([]);
      });
  }, [navigate]);
  const openChat = (itemId, otherUserId) => {
    navigate(`/chat/${itemId}/${otherUserId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Your Chats
      </h2>
      <div className="max-w-3xl mx-auto grid gap-4">
        {chats.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No chats yet.
          </p>
        ) : (
          chats.map((chat, idx) => (
            <div
              key={idx}
              onClick={() => openChat(chat.itemId, chat.otherUserId)}
              className="cursor-pointer p-4 rounded bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {chat.otherUserName || "Unknown User"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Regarding: <strong>{chat.itemName || "Unnamed Item"}</strong>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last: {chat.lastMessage}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

