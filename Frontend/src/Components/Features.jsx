import { motion } from "framer-motion";

export default function Features() {
  const features = [
    "Report your lost or found item.",
    "User must be login.",
    "Claim item by verification."
  ];

  return (
    <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <motion.h2 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-gray-800 dark:text-white"
      >
        How It Works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {features.map((text, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-2xl text-center hover:scale-105 transition-transform border-t-4 border-blue-500"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Step {index + 1}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
