import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
        setFormData({
          itemName: "",
          description: "",
          location: "",
          date: "",
          image: null,
        });
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 animate-fade-in">
      <div className="w-full max-w-lg p-8 bg-white/40 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-black dark:text-white mb-6 animate-bounce">
          Report Lost Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="input-style"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input-style"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="input-style"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-style"
          />

          <label className="block w-full px-4 py-2 text-center bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 text-black dark:text-white rounded-lg cursor-pointer hover:from-purple-400 hover:to-pink-400 transition-all">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </label>

          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border mt-2 shadow-md"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;
