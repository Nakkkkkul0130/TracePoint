import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Statistics() {
  const [lostItems, setLostItems] = useState(0);
  const [foundItems, setFoundItems] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLostItems((prev) => (prev < 500 ? prev + 10 : 500));
      setFoundItems((prev) => (prev < 300 ? prev + 5 : 300));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10"
      >
        Our Impact
      </motion.h2>
      <div className="flex justify-center gap-10 flex-wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
        >
          <h3 className="text-5xl font-extrabold text-yellow-300">{lostItems}+</h3>
          <p className="mt-2 text-lg">Lost Items Reported</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
        >
          <h3 className="text-5xl font-extrabold text-green-300">{foundItems}+</h3>
          <p className="mt-2 text-lg">Items Returned</p>
        </motion.div>
      </div>
    </section>
  );
}
