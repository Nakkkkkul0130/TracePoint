import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import ankurImg from "../assets/ankur2.jpg";
import mayankimg from "../assets/mayank.jpg";
import vikkiImg from "../assets/vishvendra.jpg";
import aakashimg from "../assets/aakash.jpg";
import sahilImg from "../assets/sahil.jpg";
import abhiImg from "../assets/abhishek.jpg";

const testimonials = [
  {
    name: "Ankur kumar Kasana",
    image: ankurImg,
    text: "This platform helped me find my lost wallet within hours! Highly recommended.",
  },
  {
    name: "Mayank Bhar",
    image: mayankimg,
    text: "Easy to use and effective. Found my lost keys thanks to this!",
  },
  {
    name: "Vishvendra Singh",
    image: vikkiImg,
    text: "Lost my phone at a cafe, and someone returned it via this app. Amazing!",
  },
  {
    name: "Aakash Prajapati",
    image: aakashimg,
    text: "Very useful service. Helped me recover my stolen bag.",
  },
  {
    name: "Sahil Tanwar",
    image: sahilImg,
    text: "Quick and easy. Reported my lost laptop, and it was found in a day!",
  },
  {
    name: "Abhishek Tanwar",
    image: abhiImg,
    text: "This community is incredible. I found my pet dog through this!",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  const prevTestimonial = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextTestimonial = () => {
    setIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real experiences from our community members who found their lost items
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="card p-8 md:p-12 text-center relative"
          >
            {/* Quote Icon */}
            <div className="text-6xl text-blue-200 dark:text-blue-800 mb-6">"
            </div>

            {/* Profile Image */}
            <div className="relative inline-block mb-6">
              <img
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
              {testimonials[index].text}
            </p>

            {/* Name */}
            <h3 className="text-xl font-bold gradient-text">
              {testimonials[index].name}
            </h3>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}