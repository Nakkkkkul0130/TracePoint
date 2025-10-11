import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Try local first, fallback to production
const getBaseURL = () => {
  const localURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const prodURL = import.meta.env.VITE_BACKEND_URL_PROD || "https://tracepoint-usj3.onrender.com";
  
  // Use local if available, otherwise production
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const BASE_URL = getBaseURL();
    console.log('Using backend URL:', BASE_URL); // Debug log
    
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Signup Successful! Please login with your credentials.");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(`Connection failed. Please check if the backend server is running on ${BASE_URL}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 animate-pulse-glow">
            ✨
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Join TracePoint</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create your account and start helping your community
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-800 dark:text-red-300 font-medium">⚠ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                className="input-style"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📞 Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                placeholder="Enter your phone number"
                onChange={handleChange}
                required
                className="input-style"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                onChange={handleChange}
                required
                className="input-style"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🔑 Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                onChange={handleChange}
                required
                minLength={6}
                className="input-style"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}