import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const getBaseURL = () => {
  const localURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const prodURL = import.meta.env.VITE_BACKEND_URL_PROD || "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

const BASE_URL = getBaseURL();

const ReportLost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    date: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // track if auth check is done

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to report a lost item.");
      navigate("/login");
      return;
    }

    // Verify token validity
    fetch(`${BASE_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.clear();
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          setAuthChecked(true); // Only show form after token is verified
        }
      })
      .catch(() => {
        alert("Token verification failed. Please login again.");
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(`${BASE_URL}/lost/report-lost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Lost item reported successfully!");
        navigate('/dashboard');
      } else {
        alert(result.message || "Failed to report lost item.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.");
      console.error("Error reporting item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600 dark:text-gray-300">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Link to="/dashboard" className="btn-secondary px-4 py-2 text-sm">
              📋 My Dashboard
            </Link>
          </div>
          <div className="inline-flex p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4 animate-pulse-glow">
            📢
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Report Lost Item</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help us help you find your lost belongings. Provide as much detail as possible.
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🏷️ Item Name *
              </label>
              <input
                type="text"
                name="itemName"
                placeholder="e.g., iPhone 13, Blue Backpack, Car Keys"
                value={formData.itemName}
                onChange={handleChange}
                required
                className="input-style"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📝 Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your item in detail - color, brand, size, distinctive features, etc."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-style resize-none"
              />
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📍 Last Seen Location *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Central Park, Coffee Shop on Main St"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📅 Date Lost *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-style"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📷 Upload Photo *
              </label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4 relative">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Submit Lost Item Report</span>
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Tips for better results:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Include multiple photos from different angles</li>
              <li>• Mention unique identifying features or serial numbers</li>
              <li>• Be specific about the location and time</li>
              <li>• Check back regularly for potential matches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;
