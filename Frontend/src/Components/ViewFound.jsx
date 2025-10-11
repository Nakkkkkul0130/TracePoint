import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewFound = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view items.");
      navigate("/login");
      return;
    }

    const getBaseURL = () => {
      const localURL = "http://localhost:5000";
      const prodURL = "https://tracepoint-usj3.onrender.com";
      return window.location.hostname === 'localhost' ? localURL : prodURL;
    };
    
    const BASE_URL = getBaseURL();
    
    fetch(`${BASE_URL}/found/browse`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        const foundItems = (data.items || []).map((item) => ({
          ...item,
          type: "found",
        }));
        setItems(foundItems);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Error fetching items.");
      });
  }, [navigate]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4 animate-pulse-glow">
              🔍
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Browse Found Items</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse items found by others - maybe yours is here!
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search items, descriptions, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-style pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Link to="/report-found" className="btn-secondary flex items-center space-x-2">
                <span>🎯</span>
                <span>Report Found Item</span>
              </Link>
            </div>

            {/* Messages Link */}
            <Link to="/inbox" className="btn-secondary flex items-center space-x-2">
              <span>📩</span>
              <span>Your Messages</span>
            </Link>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {searchTerm ? 'No matching items found' : 'No items reported yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to report a lost or found item!'}
            </p>
            {!searchTerm && (
              <Link to="/report-lost" className="btn-primary">
                Report Lost Item
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card p-6 group hover:shadow-2xl"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    🔵 FOUND
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt || item.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Image */}
                {item.image && (
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.itemName}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                      🎯 Found by: {item.reporterName}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      📞 Contact: {item.contactInfo}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Found on: {new Date(item.foundDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status and Action */}
                  {(item.officeSubmissionStatus === 'submitted_to_office' || item.officeSubmissionStatus === 'verified_by_admin') && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-3">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                        ✅ Available for Claims - Item submitted to office
                      </p>
                    </div>
                  )}
                  
                  {item.officeSubmissionStatus === 'pending_submission' && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-3">
                      <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                        ⏳ Not yet available for claims
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                        Founder needs to submit item to office first
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {item.userId && (
                    <Link to={`/chat/${item._id}/${item.userId}`} className="block">
                      <button className="w-full btn-primary flex items-center justify-center space-x-2">
                        <span>💬</span>
                        <span>Chat with Finder</span>
                      </button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFound;
