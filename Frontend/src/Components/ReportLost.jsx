import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportLost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    date: '',
    image: '',
  });

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert('Please login to report an item.');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    savedItems.push(formData);
    localStorage.setItem('foundItems', JSON.stringify(savedItems));
    alert('Lost item reported successfully!');
    setFormData({ itemName: '', description: '', location: '', date: '', image: '' });
  };

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
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-white/20 text-black dark:text-white placeholder-black dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <label className="block w-full px-4 py-2 text-center bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 text-black dark:text-white rounded-lg cursor-pointer hover:from-purple-400 hover:to-pink-400 transition-all">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border mt-2 shadow-md"
            />
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;