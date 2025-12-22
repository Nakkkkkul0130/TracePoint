import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

const BASE_URL = getBaseURL();
const socket = io(BASE_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default function ChatRoom() {
  const { itemId, receiverId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserName, setOtherUserName] = useState("");
  const [itemInfo, setItemInfo] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const senderId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const endRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    socket.emit("joinRoom", itemId);

    // Fetch messages and item info
    Promise.all([
      fetch(`${BASE_URL}/messages/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/lost/report-lost`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/found/browse`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
    .then(async ([messagesRes, lostRes, foundRes]) => {
      const messagesData = await messagesRes.json();
      const lostData = await lostRes.json();
      const foundData = await foundRes.json();
      
      setMessages(messagesData);
      
      // Find the specific item in both lost and found items
      let item = lostData.items?.find(i => i._id === itemId);
      if (!item) {
        item = foundData.items?.find(i => i._id === itemId);
      }
      if (item) {
        setItemInfo(item);
      }
      
      // Get other user name from messages
      if (messagesData.length > 0) {
        const otherUser = messagesData[0].senderId._id === senderId 
          ? messagesData[0].receiverId 
          : messagesData[0].senderId;
        setOtherUserName(otherUser.name);
      }
    })
    .catch(console.error);

    // Mark messages as read
    fetch(`${BASE_URL}/messages/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, otherUserId: receiverId }),
    });

    socket.on("receiveMessage", (msg) => {
      // Only add message if it's not from current user (to avoid duplicates)
      if (msg.senderId._id !== senderId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId !== senderId) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.emit("leaveRoom", itemId);
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, [itemId, token, senderId, receiverId, navigate]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      itemId,
      receiverId,
      content: input,
      messageType: 'text',
    };

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(msg),
      });

      if (response.ok) {
        const newMessage = await response.json();
        // Immediately add message to local state
        setMessages(prev => [...prev, newMessage]);
        socket.emit("sendMessage", newMessage);
        setInput("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const sendClaimRequest = async (verificationCode) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/claim-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          receiverId,
          verificationCode,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const claimMessage = result.message || result;
        
        // Add claim message to local state
        setMessages(prev => [...prev, claimMessage]);
        socket.emit("sendMessage", claimMessage);
        setShowClaimModal(false);
        
        // Show match details if available
        if (result.matchDetails) {
          const { score, confidence } = result.matchDetails;
          alert(`Claim request sent successfully!\n\nMatch Confidence: ${confidence} (${score}%)\n\nAdmin will verify your claim by reviewing the conversation.`);
        } else {
          alert('Claim request sent successfully! Admin will verify your claim.');
        }
      } else {
        const error = await response.json();
        
        // Handle detailed error response
        if (error.details) {
          const { yourLostItem, foundItem, matchScore, conflicts } = error.details;
          let errorMessage = `Claim rejected - Items don't appear to match\n\n`;
          errorMessage += `Your lost item: ${yourLostItem}\n`;
          errorMessage += `Found item: ${foundItem}\n`;
          errorMessage += `Match score: ${matchScore}%\n\n`;
          
          if (conflicts && conflicts.length > 0) {
            errorMessage += `Conflicts detected:\n${conflicts.map(c => `• ${c}`).join('\n')}`;
          }
          
          alert(errorMessage);
        } else {
          alert(error.message || 'Failed to send claim request');
        }
      }
    } catch (error) {
      console.error("Failed to send claim request:", error);
      alert('Error sending claim request. Please try again.');
    }
  };

  const respondToClaim = async (messageId, approved, response) => {
    try {
      const res = await fetch(`${BASE_URL}/messages/claim-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId,
          approved,
          response,
        }),
      });

      if (res.ok) {
        const responseMessage = await res.json();
        // Immediately add response message to local state
        setMessages(prev => [...prev, responseMessage]);
        socket.emit("sendMessage", responseMessage);
      }
    } catch (error) {
      console.error("Failed to respond to claim:", error);
    }
  };

  const handleTyping = (value) => {
    setInput(value);
    socket.emit("typing", { itemId, userId: senderId, isTyping: value.length > 0 });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (msg, index) => {
    const isOwn = msg.senderId._id === senderId;
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
        }`}>
          {msg.messageType === 'claim_request' && (
            <div className="mb-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                🔐 Claim Request - Pending Admin Verification
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Admin will verify this claim by reviewing your conversation.
              </p>
            </div>
          )}
          
          {msg.messageType === 'claim_response' && (
            <div className={`mb-2 p-2 rounded-lg ${
              msg.claimData?.status === 'approved' 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <p className={`text-xs font-semibold ${
                msg.claimData?.status === 'approved'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {msg.claimData?.status === 'approved' ? '✅ Claim Approved' : '❌ Claim Rejected'}
              </p>
            </div>
          )}
          
          <p className="text-sm">{msg.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {new Date(msg.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {otherUserName || 'Chat'}
              </h2>
              {itemInfo && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  About: {itemInfo.itemName}
                </p>
              )}
            </div>
          </div>
          
          {itemInfo && itemInfo.userId !== senderId && itemInfo.status !== 'claimed' && itemInfo.status !== 'collected' && (
            <div>
              {(itemInfo.officeSubmissionStatus === 'submitted_to_office' || itemInfo.officeSubmissionStatus === 'verified_by_admin') ? (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  🔐 Claim Item
                </button>
              ) : (
                <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                  ⏳ Item not yet submitted to office for claims
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="card p-6 h-96 overflow-y-auto mb-4">
          {messages.map(renderMessage)}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>

        {/* Input */}
        <div className="card p-4">
          <div className="flex space-x-4">
            <input
              value={input}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="input-style flex-1"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="btn-primary px-6"
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>

        {/* Claim Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Claim This Item</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To claim this item, you need to provide the verification code that was given to you when you lost it.
              </p>
              <input
                type="text"
                placeholder="Enter verification code"
                className="input-style mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    sendClaimRequest(e.target.value.trim());
                  }
                }}
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const code = document.querySelector('input[placeholder="Enter verification code"]').value.trim();
                    if (code) {
                      sendClaimRequest(code);
                    } else {
                      alert('Please enter your verification code');
                    }
                  }}
                  className="flex-1 btn-primary"
                >
                  Send Claim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}