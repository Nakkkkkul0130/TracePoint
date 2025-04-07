import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Signup Successful!");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-indigo-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl dark:bg-gray-900">
        <h2 className="text-3xl font-extrabold text-center text-black dark:text-white mb-6 animate-pulse">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}