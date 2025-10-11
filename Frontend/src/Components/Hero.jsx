import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, MessageCircle, Shield } from "lucide-react";

export default function Hero() {
  const features = [
    { icon: Search, text: "Smart Search", color: "text-blue-500" },
    { icon: MapPin, text: "Location Tracking", color: "text-green-500" },
    { icon: MessageCircle, text: "Real-time Chat", color: "text-purple-500" },
    { icon: Shield, text: "Secure Platform", color: "text-orange-500" }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
            >
              <span className="gradient-text">Lost Something?</span>
              <br />
              <span className="text-gray-800 dark:text-white">We'll Help You Find It!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Connect with your community to report lost items, discover found belongings, and reunite people with what matters most to them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12"
            >
              {features.map(({ icon: Icon, text, color }, index) => (
                <div key={text} className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-3 sm:px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link to="/report-lost" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3">
              <span>📢</span>
              <span>Report Lost Item</span>
            </Link>

            <Link to="/report-found" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3">
              <span>🎯</span>
              <span>Report Found Item</span>
            </Link>

            <Link to="/view-found" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3">
              <span>🔍</span>
              <span>Browse Found Items</span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-40 left-20 w-10 h-10 sm:w-12 sm:h-12 bg-green-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 sm:w-24 sm:h-24 bg-orange-400/20 rounded-full animate-float"></div>
      </section>

      {/* How TracePoint Works Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">How TracePoint Works</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Simple steps to reunite you with your lost items
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Lost Something Process */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8"
            >
              <div className="text-center mb-6">
                <div className="inline-flex p-3 sm:p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Lost Something?
                </h3>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Report Your Lost Item</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get a unique verification code</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Browse Found Items</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Check if someone found your item</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Chat & Claim</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Use verification code to claim</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Admin Verification & Collection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Collect from office after approval</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Found Something Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8"
            >
              <div className="text-center mb-6">
                <div className="inline-flex p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Found Something?
                </h3>
              </div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Report Found Item</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Upload details and photos</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Submit to Office</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Required for claims to be made</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Chat with Potential Owners</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Verify ownership through chat</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Admin Handles Claims</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Coordinates item collection</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Office Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="card p-6 sm:p-8 text-center"
          >
            <div className="inline-flex p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              TracePoint Collection Office
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📍 Address</h4>
                <p className="text-gray-600 dark:text-gray-300">TracePoint Office<br/>Surya Nagar, Rohtak, Haryana</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📞 Contact</h4>
                <p className="text-gray-600 dark:text-gray-300">+91 9728647308<br/>office@tracepoint.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🕒 Hours</h4>
                <p className="text-gray-600 dark:text-gray-300">Monday - Friday<br/>9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}