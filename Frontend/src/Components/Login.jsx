import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      alert("Login Successful!");
      navigate("/report-lost");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white/40 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-black dark:text-white mb-6 animate-bounce">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
