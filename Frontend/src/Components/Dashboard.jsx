import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

export default function Dashboard() {
  const [myLostItems, setMyLostItems] = useState([]);
  const [myFoundItems, setMyFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = getBaseURL();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      fetch(`${BASE_URL}/lost/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/found/my-found-items`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
      .then(async ([lostRes, foundRes]) => {
        const lostData = await lostRes.json();
        const foundData = await foundRes.json();
        setMyLostItems(lostData.items || []);
        setMyFoundItems(foundData.items || []);
      })
      .catch(err => {
        console.error("Failed to fetch reports:", err);
        setMyLostItems([]);
        setMyFoundItems([]);
      })
      .finally(() => setLoading(false));
  }, [navigate, BASE_URL]);

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', text: 'Active' },
      claimed: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', text: 'Claimed' },
      resolved: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', text: 'Resolved' },
      reported: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', text: 'Reported' },
      submitted_to_office: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', text: 'Submitted' },
      verified_by_admin: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', text: 'Verified' },
    };
    
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const FoundItemCard = ({ item, index, onSubmit }) => {
    const [submitting, setSubmitting] = useState(false);
    const token = localStorage.getItem("token");

    const submitToOffice = async () => {
      setSubmitting(true);
      try {
        const res = await fetch(`${BASE_URL}/found/submit-to-office/${item._id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          alert('Item submitted to office successfully!');
          onSubmit();
        } else {
          const error = await res.json();
          alert(error.message || 'Failed to submit');
        }
      } catch (error) {
        console.error('Submit error:', error);
        alert('Error submitting to office');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-xl shadow-md backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(item.status)}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        {item.image && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={item.image}
              alt={item.itemName}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {item.itemName}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {item.description}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{item.location}</span>
            </div>
          </div>

          {item.officeSubmissionStatus === 'pending_submission' && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">
                ⚠️ Action Required
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-400 mb-3">
                Please submit this item to our office so claimers can collect it after verification.
              </p>
              <button
                onClick={submitToOffice}
                disabled={submitting}
                className="w-full btn-primary text-sm py-2"
              >
                {submitting ? 'Submitting...' : '📦 Submit to Office'}
              </button>
            </div>
          )}

          {item.officeSubmissionStatus === 'submitted_to_office' && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                ⏳ Pending Admin Verification
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                Your item is at the office awaiting admin verification.
              </p>
            </div>
          )}

          {item.officeSubmissionStatus === 'verified_by_admin' && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                ✅ Verified & Available for Claims
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                Your item is verified and available for legitimate claimers.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4 animate-pulse-glow">
            📋
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">My Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track your reported lost and found items
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link to="/report-lost" className="card p-6 text-center hover:shadow-2xl group">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Report Lost Item
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Lost something? Report it here</p>
          </Link>

          <Link to="/report-found" className="card p-6 text-center hover:shadow-2xl group">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Report Found Item
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Found something? Report it here</p>
          </Link>

          <Link to="/view-found" className="card p-6 text-center hover:shadow-2xl group">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Browse Found Items
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Find items reported by others</p>
          </Link>

          <Link to="/inbox" className="card p-6 text-center hover:shadow-2xl group">
            <div className="text-4xl mb-4">📩</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Messages
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Check your conversations</p>
          </Link>
        </div>

        {/* My Lost Items */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Lost Item Reports</h2>
          
          {myLostItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No lost items reported
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't reported any lost items yet
              </p>
              <Link to="/report-lost" className="btn-primary">
                Report Lost Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myLostItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-xl shadow-md backdrop-blur-sm transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt || item.date).toLocaleDateString()}
                    </span>
                  </div>

                  {item.image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.itemName}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {item.verificationCode && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                          🔐 Verification Code: {item.verificationCode}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Share this code with someone who found your item
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* My Found Items */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Found Item Reports</h2>
          
          {myFoundItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No found items reported
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't reported any found items yet
              </p>
              <Link to="/report-found" className="btn-primary">
                Report Found Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFoundItems.map((item, index) => (
                <FoundItemCard key={item._id} item={item} index={index} onSubmit={() => window.location.reload()} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}