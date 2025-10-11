import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaEye, FaChartLine, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [collectionItems, setCollectionItems] = useState([]);
  const [officeSubmissions, setOfficeSubmissions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const BASE_URL = getBaseURL();

  const fetchLost = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/lost-items`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch lost items:", error.message);
        return;
      }
      const data = await res.json();
      setLostItems(data);
    } catch (err) {
      console.error("Error fetching lost items:", err);
    }
  };

  const fetchFound = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/found-items`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch found items:", error.message);
        return;
      }
      const data = await res.json();
      setFoundItems(data);
    } catch (err) {
      console.error("Error fetching found items:", err);
    }
  };

  const fetchPendingClaims = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/pending-claims`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPendingClaims(data);
      }
    } catch (err) {
      console.error("Error fetching pending claims:", err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/statistics`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setStatistics(data);
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const fetchCollectionItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/collection-items`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCollectionItems(data);
      }
    } catch (err) {
      console.error("Error fetching collection items:", err);
    }
  };

  const verifyClaim = async (messageId, approved) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/verify-claim/${messageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        // Refresh all data
        await Promise.all([
          fetchPendingClaims(),
          fetchCollectionItems(),
          fetchStatistics(),
          fetchLost(),
          fetchFound()
        ]);
        alert(approved ? "Claim verified! Item ready for collection." : "Claim rejected!");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Error verifying claim:", err);
      alert("Error processing verification");
    }
  };

  const markAsCollected = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/mark-collected/${itemId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        fetchCollectionItems();
        fetchStatistics();
        alert("Item marked as collected!");
      }
    } catch (err) {
      console.error("Error marking as collected:", err);
    }
  };

  const fetchOfficeSubmissions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/office-submissions`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOfficeSubmissions(data);
      }
    } catch (err) {
      console.error("Error fetching office submissions:", err);
    }
  };

  const verifySubmission = async (itemId, approved, notes = '') => {
    try {
      const res = await fetch(`${BASE_URL}/admin/verify-submission/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approved, notes }),
      });
      if (res.ok) {
        fetchOfficeSubmissions();
        fetchStatistics();
        alert(approved ? "Item verified and available for claims!" : "Item rejected!");
      }
    } catch (err) {
      console.error("Error verifying submission:", err);
    }
  };

  const viewChat = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/chat/${itemId}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const messages = await res.json();
        setChatMessages(messages);
        setSelectedChat(itemId);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await fetch(`${BASE_URL}/admin/${type}-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      type === "lost" ? fetchLost() : fetchFound();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${BASE_URL}/admin/lost-items`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
      } else {
        fetchLost();
        fetchFound();
        fetchPendingClaims();
        fetchCollectionItems();
        fetchOfficeSubmissions();
        fetchStatistics();
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { key: "submissions", label: "Office Submissions", icon: <FaBoxOpen /> },
    { key: "claims", label: "Verify Claims", icon: <FaBoxOpen /> },
    { key: "collection", label: "Office Collection", icon: <FaBoxOpen /> },
    { key: "lost", label: "Lost Items", icon: <FaBoxOpen /> },
    { key: "found", label: "Found Items", icon: <FaEye /> },
  ];

  const lineData = {
    labels: ["Lost Items", "Found Items"],
    datasets: [
      {
        label: "Total Items",
        data: [lostItems.length, foundItems.length],
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <aside className="w-64 bg-white shadow-xl border-r flex flex-col">
        <div className="text-2xl font-bold px-6 py-6 bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-md">
          Admin Panel
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-200 transition 
                ${activeTab === item.key ? "bg-gray-200 font-semibold" : ""}`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Total Lost Items</h2>
                <p className="text-4xl font-bold text-blue-600 mt-2">{statistics.totalLost || 0}</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Total Found Items</h2>
                <p className="text-4xl font-bold text-green-600 mt-2">{statistics.totalFound || 0}</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Verified Items</h2>
                <p className="text-4xl font-bold text-purple-600 mt-2">{statistics.verifiedItems || 0}</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Success Rate</h2>
                <p className="text-4xl font-bold text-orange-600 mt-2">{statistics.successRate || 0}%</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Office Submissions</h2>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{officeSubmissions.length}</p>
                <p className="text-sm text-gray-500 mt-2">Items to verify</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Ready for Collection</h2>
                <p className="text-4xl font-bold text-orange-600 mt-2">{statistics.readyForCollection || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Items at office</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Successfully Collected</h2>
                <p className="text-4xl font-bold text-green-600 mt-2">{statistics.collectedItems || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Completed cases</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "claims" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Pending Claims Verification</h1>
            
            {selectedChat && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Chat Messages</h3>
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      msg.messageType === 'claim_request' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <div className="font-semibold text-sm">{msg.senderId.name}</div>
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pendingClaims.length === 0 ? (
              <p className="text-gray-500 italic">No pending claims for verification.</p>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map((claim) => (
                  <div key={claim._id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Claim by {claim.senderId.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{claim.content}</p>
                        <div className="text-sm text-gray-500">
                          <p>📧 Claimer: {claim.senderId.name}</p>
                          <p>📧 Item Reporter: {claim.receiverId.name}</p>
                          <p>🔐 Verification Code: {claim.claimData.verificationCode}</p>
                          <p>📅 Claim Date: {new Date(claim.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => viewChat(claim.itemId)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        >
                          💬 View Chat
                        </button>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => verifyClaim(claim._id, true)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                          >
                            ✅ Verify
                          </button>
                          <button
                            onClick={() => verifyClaim(claim._id, false)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "submissions" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Office Submissions - Items to Verify</h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
              <p className="text-blue-700 dark:text-blue-400">
                <strong>Process:</strong> Founders submit found items to office → Admin verifies → Items become available for claims
              </p>
            </div>
            
            {officeSubmissions.length === 0 ? (
              <p className="text-gray-500 italic">No items submitted to office for verification.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {officeSubmissions.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        ⏳ PENDING VERIFICATION
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.submittedToOfficeAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.itemName}</h2>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>👤 Submitted by: {item.userId?.name}</p>
                      <p>📞 Contact: {item.contactInfo}</p>
                      <p>📍 Found at: {item.location}</p>
                      <p>📅 Found on: {new Date(item.foundDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => verifySubmission(item._id, true)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition"
                      >
                        ✅ Verify & Accept
                      </button>
                      <button
                        onClick={() => verifySubmission(item._id, false)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "collection" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                🏢 TracePoint Collection Office
              </h2>
              <p className="text-blue-700 dark:text-blue-400">
                <strong>Address:</strong> surya nagar, rohtak, haryana<br/>
                <strong>Contact:</strong> +91 9728647308<br/>
                <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
              </p>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Items Ready for Collection</h1>
            {collectionItems.length === 0 ? (
              <p className="text-gray-500 italic">No items ready for collection.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collectionItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        ✅ VERIFIED
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.verifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.itemName}</h2>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>👤 Owner: {item.userId?.name}</p>
                      <p>📍 Location Found: {item.location}</p>
                      <p>🔐 Verification Code: {item.verificationCode}</p>
                    </div>
                    
                    <button
                      onClick={() => markAsCollected(item._id)}
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition flex items-center justify-center gap-2"
                    >
                      📦 Mark as Collected
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {(activeTab === "lost" || activeTab === "found") && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {activeTab === "lost" ? "Reported Lost Items" : "Reported Found Items"}
            </h1>

            {(activeTab === "lost" ? lostItems : foundItems).length === 0 ? (
              <p className="text-gray-500 italic">No items reported yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "lost" ? lostItems : foundItems).map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition"
                  >
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.itemName}</h2>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                    <p className="text-sm text-gray-500">📅 {item.date}</p>
                    <p className="text-sm text-gray-500">
                      👤 {item.founderName || "N/A"} | 📞 {item.contact || "N/A"}
                    </p>
                    <button
                      onClick={() => deleteItem(activeTab === "lost" ? "lost" : "found", item._id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
