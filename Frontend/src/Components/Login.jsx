import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Try local first, fallback to production
const getBaseURL = () => {
  const localURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const prodURL = import.meta.env.VITE_BACKEND_URL_PROD || "https://tracepoint-usj3.onrender.com";
  
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

const BASE_URL = getBaseURL();

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loginMode, setLoginMode] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${BASE_URL}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setIsLoggedIn(true);
            setUserName(data.user.name);
          } else {
            setIsLoggedIn(false);
            localStorage.clear();
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          localStorage.clear();
        });
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);

        alert("Login Successful!");
        setIsLoggedIn(true);
        setUserName(data.user.name);
        navigate("/dashboard"); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setLoginMode("");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const goToAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 animate-pulse-glow">
            🔐
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">{isLoggedIn ? `Welcome Back!` : "Sign In"}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isLoggedIn ? `Hello, ${userName}` : "Access your TracePoint account"}
          </p>
        </div>

        {/* Main Card */}
        <div className="card p-8">
          {isLoggedIn ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  ✓ You are successfully logged in
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/view-found')}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>🔍</span>
                  <span>Browse Items</span>
                </button>
                <button
                  onClick={() => navigate('/report-lost')}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>📢</span>
                  <span>Report Lost</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <>
              {!loginMode ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                    Choose Login Type
                  </h3>
                  
                  <button
                    onClick={() => setLoginMode("user")}
                    className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4"
                  >
                    <span>👤</span>
                    <span>Continue as User</span>
                    <span>→</span>
                  </button>
                  
                  <button
                    onClick={goToAdminLogin}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
                  >
                    <span>🔒</span>
                    <span>Admin Access</span>
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      required
                      className="input-style"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🔑 Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      required
                      className="input-style"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Sign In</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setLoginMode("")}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
