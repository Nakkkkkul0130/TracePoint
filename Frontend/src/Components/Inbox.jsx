import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = getBaseURL();

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
      })
      .finally(() => setLoading(false));
  }, [navigate, BASE_URL]);

  const openChat = (itemId, otherUserId) => {
    navigate(`/chat/${itemId}/${otherUserId}`);
  };

  const getMessageTypeIcon = (messageType) => {
    switch (messageType) {
      case 'claim_request': return '🔐';
      case 'claim_response': return '✅';
      default: return '💬';
    }
  };

  const getItemStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', text: 'Active' },
      claimed: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', text: 'Claimed' },
      resolved: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', text: 'Resolved' },
    };
    
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4 animate-pulse-glow">
            📩
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Your Messages</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Stay connected with your community
          </p>
        </motion.div>

        {/* Chats List */}
        {chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start chatting by browsing lost and found items
            </p>
            <button
              onClick={() => navigate('/view-found')}
              className="btn-primary"
            >
              Browse Items
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                onClick={() => openChat(chat.itemId, chat.otherUserId)}
                className="card p-6 cursor-pointer hover:shadow-2xl group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {chat.otherUserName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {chat.otherUserName || "Unknown User"}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            About: <span className="font-semibold">{chat.itemName || "Unnamed Item"}</span>
                          </p>
                          {getItemStatusBadge(chat.itemStatus)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-lg">{getMessageTypeIcon(chat.lastMessageType)}</span>
                      <p className="flex-1 truncate">{chat.lastMessage}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {chat.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </div>
                    )}
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}