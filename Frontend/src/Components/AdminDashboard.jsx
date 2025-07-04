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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  const fetchLost = async () => {
    try {
      const res = await fetch("https://tracepoint-usj3.onrender.com/admin/lost-items", {
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
      const res = await fetch("https://tracepoint-usj3.onrender.com/admin/found-items", {
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

  const deleteItem = async (type, id) => {
    try {
      await fetch(`https://tracepoint-usj3.onrender.com/admin/${type}-items/${id}`, {
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
      const res = await fetch("https://tracepoint-usj3.onrender.com/admin/lost-items", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
      } else {
        fetchLost();
        fetchFound();
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://tracepoint-usj3.onrender.com/admin/logout", {
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
    { key: "lost", label: "Report Lost", icon: <FaBoxOpen /> },
    { key: "found", label: "View Found", icon: <FaEye /> },
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
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Overview</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Total Lost Items</h2>
                <p className="text-4xl font-bold text-blue-600 mt-2">{lostItems.length}</p>
              </div>
              <div className="p-6 rounded-lg bg-white shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-600">Total Found Items</h2>
                <p className="text-4xl font-bold text-green-600 mt-2">{foundItems.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Analytics (Line Chart)</h2>
              <Line data={lineData} />
            </div>
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
                        src={`https://tracepoint-usj3.onrender.com/${item.image}`}
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
