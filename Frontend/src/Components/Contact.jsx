import { useState } from "react";
import { motion } from "framer-motion";

const getBaseURL = () => {
  const localURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const prodURL = import.meta.env.VITE_BACKEND_URL_PROD || "https://tracepoint-usj3.onrender.com";
  return window.location.hostname === 'localhost' ? localURL : prodURL;
};

const BASE_URL = getBaseURL();


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/email/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      setError("Failed to send email. Try again later.");
    }

    setLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Let's Connect</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Whether you need help with the platform, want to report a bug, or have suggestions for improvement, we're here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Email Us</h4>
                  <p className="text-gray-600 dark:text-gray-300">nakulbhar13@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xl">🕰️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Response Time</h4>
                  <p className="text-gray-600 dark:text-gray-300">Usually within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">💬</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Support</h4>
                  <p className="text-gray-600 dark:text-gray-300">24/7 Community Support</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-800 dark:text-green-300 font-medium">✓ {successMessage}</p>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-800 dark:text-red-300 font-medium">⚠ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👤 Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-style"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-style"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📝 Your Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input-style resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
