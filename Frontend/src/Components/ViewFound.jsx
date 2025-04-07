import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ViewFound = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [claimIndex, setClaimIndex] = useState(null);
  const [claimData, setClaimData] = useState({ itemName: '', location: '', date: '' });

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert('Please login to view found items.');
      navigate('/login');
    }
    const savedItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    setItems(savedItems);
  }, [navigate]);

  const handleClaim = (index) => {
    setClaimIndex(index);
    setClaimData({ itemName: '', location: '', date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerification = () => {
    const original = items[claimIndex];
    const isMatch =
      claimData.itemName.trim().toLowerCase() === original.itemName.trim().toLowerCase() &&
      claimData.location.trim().toLowerCase() === original.location.trim().toLowerCase() &&
      claimData.date === original.date;

    if (isMatch) {
      alert(`✅ Claim verified for "${original.itemName}"!`);
      setClaimIndex(null);
    } else {
      alert('❌ Claim verification failed. Please enter matching details.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 transition-colors duration-500">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-white"
      >
        Found Items
      </motion.h1>

      {items.length === 0 ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">No items reported yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white/70 dark:bg-gray-900/50 p-6 rounded-xl shadow-md backdrop-blur-md transition-all hover:scale-105 hover:shadow-2xl"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-48 object-cover rounded-md mb-4 border"
                />
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{item.itemName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {item.location}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">📅 {item.date}</p>

              {claimIndex === index ? (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Enter item name"
                    value={claimData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-white/90 dark:bg-white/10 text-black dark:text-white placeholder-gray-700 dark:placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={claimData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-white/90 dark:bg-white/10 text-black dark:text-white placeholder-gray-700 dark:placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="date"
                    name="date"
                    value={claimData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md bg-white/90 dark:bg-white/10 text-black dark:text-white placeholder-gray-700 dark:placeholder-gray-300 border focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleVerification}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
                  >
                    Verify & Claim
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleClaim(index)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
                >
                  Claim this item
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFound;
