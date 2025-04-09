import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { useRef } from "react";
import nakulimg from "../assets/nakul.jpg";
import resimg from "../assets/res.png";
import Lost from "../assets/lost.png";
import wellbeing from "../assets/wellbeing.png";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]); // reduced to avoid blur effect

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black py-20 px-6 md:px-20 text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Blobs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-800 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-10 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-800 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />

        {/* Glassmorphism Box */}
        <div className="relative z-10 backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl p-10 shadow-2xl max-w-6xl mx-auto">
          <motion.div style={{ scale }}>
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img
                src={nakulimg}
                alt="Nakul's Profile"
                className="w-40 h-40 mx-auto rounded-full shadow-lg object-cover border-4 border-blue-500"
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              About Me
            </motion.h2>

            {/* Bio */}
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Hi, I'm <strong>Nakul</strong> — a passionate <strong>Full Stack Developer</strong> dedicated to building dynamic, scalable, and user-centric applications. I specialize in <strong>React.js, Node.js, MongoDB, and Express</strong>.
            </motion.p>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              I've developed various real-world web apps that solve actual problems and create impact. Here's a glimpse of my work:
            </p>

            {/* Project Cards */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {[
                {
                  name: "Lost & Found Hub",
                  link: "https://github.com/Nakkkkkul0130/TracePoint",
                  image: Lost,
                },
                {
                  name: "Restaurant Website",
                  link: "https://github.com/Nakkkkkul0130/restaurant-website",
                  image: resimg,
                },
                {
                  name: "WellBeing",
                  link: "https://github.com/Nakkkkkul0130/WellBeing",
                  image: wellbeing,
                },
              ].map((project, idx) => (
                <motion.a
                  key={idx}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white/90 dark:bg-gray-800/80 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-lg"
                >
                  <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {project.name}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Resume Download */}
            <div className="mt-10 flex justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/nakul bhar updated cv1.pdf"
                download
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              >
                <Download size={18} /> Download Resume
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
