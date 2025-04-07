import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="text-center py-28 bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4"
      >
        Lost Something? We Can Help!
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-700 dark:text-gray-300"
      >
        Report lost items or find missing belongings easily.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 flex justify-center gap-6"
      >
        <Link 
          to="/report-lost" 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
        >
          Report Lost Item
        </Link>

        <Link 
          to="/view-found" 
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300"
        >
          View Found Items
        </Link>
      </motion.div>
    </section>
  );
}