import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

export default function ReportFound() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    foundDate: '',
    contactInfo: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = getBaseURL();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitData.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${BASE_URL}/found/report-found`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        alert('Failed to submit found item report');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 animate-pulse-glow">
            🎯
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Report Found Item</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Help someone find their lost item
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              <span>📋</span>
              <span>Go to Dashboard</span>
            </button>
          </div>
        </motion.div>

        <div className="card p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Found item reported successfully! 
              <br />
              <strong>Next Step:</strong> Please submit this item to the office so claimers can collect it after verification.
              <br />
              <div className="mt-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary mr-2"
                >
                  Go to Dashboard
                </button>
                <span className="text-sm">Auto-redirecting in 2 seconds...</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="input-style"
                placeholder="What did you find?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-style h-32"
                placeholder="Describe the item in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Where did you find it? *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input-style"
                placeholder="Location where you found the item"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                When did you find it? *
              </label>
              <input
                type="date"
                name="foundDate"
                value={formData.foundDate}
                onChange={handleInputChange}
                className="input-style"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Contact Info *
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                className="input-style"
                placeholder="Phone number or email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-style"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Submitting...' : 'Report Found Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}