import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getBaseURL = () => {
  const localURL = "http://localhost:5000";
  const prodURL = "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = getBaseURL();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/lost-items`, {
          method: "GET",
          credentials: "include",
        });
        
        if (res.ok) {
          // Already logged in, redirect to dashboard
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, BASE_URL]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", //  required for sending cookies
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Admin logged in successfully!");
      navigate("/admin/dashboard");
    } else {
      alert(data.message || "Login failed!");
    }
  } catch (error) {
    alert("Server error during login");
    console.error(error);
  }
};


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-gray-100 via-blue-200 to-gray-300">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-gray-100 via-blue-200 to-gray-300">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
