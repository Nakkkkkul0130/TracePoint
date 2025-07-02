import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewFound = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view items.");
      navigate("/login");
      return;
    }

    Promise.all([
      fetch("https://tracepoint-usj3.onrender.com/view-found", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("https://tracepoint-usj3.onrender.com/lost/report-lost", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([foundRes, lostRes]) => {
        const foundData = await foundRes.json();
        const lostData = await lostRes.json();

        const foundItems = (foundData.items || []).map((item) => ({
          ...item,
          type: "found",
        }));

        const lostItems = (lostData.items || []).map((item) => ({
          ...item,
          type: "lost",
        }));

        const combined = [...foundItems, ...lostItems].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setItems(combined);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Error fetching items.");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 transition-colors duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-center sm:text-left text-gray-900 dark:text-white"
        >
          Lost & Found Items
        </motion.h1>

        <Link
          to="/inbox"
          className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          📩 Your Messages
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
          No items reported yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white/70 dark:bg-gray-900/50 p-6 rounded-xl shadow-md backdrop-blur-md transition-all hover:scale-105 hover:shadow-2xl"
            >
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
                  item.type === "lost"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {item.type.toUpperCase()}
              </span>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-48 object-cover rounded-md mb-4 border"
                />
              )}

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {item.itemName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                📍 {item.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📅 {new Date(item.createdAt || item.date).toLocaleDateString()}
              </p>

              {item.founderName && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Found by: <strong>{item.founderName}</strong>
                  <br />
                  📞 Contact: <strong>{item.founderContact || "N/A"}</strong>
                </p>
              )}

              {item.userId && (
                <Link to={`/chat/${item._id}/${item.userId}`}>
                  <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
                    Chat with {item.type === "lost" ? "Reporter" : "Finder"}
                  </button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFound;
