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
    <section className="bg-gradient-to-r from-sky-100 to-indigo-100 py-16 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-10 text-gray-800"
      >
        What Our Users Say
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl relative border border-gray-200"
      >
        <img
          src={testimonials[index].image}
          alt={testimonials[index].name}
          className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-blue-400 object-cover shadow-md"
        />
        <p className="text-gray-700 italic text-lg">"{testimonials[index].text}"</p>
        <h3 className="mt-4 font-semibold text-blue-700 text-xl">{testimonials[index].name}</h3>

        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-blue-600 border border-blue-400 p-2 rounded-full shadow-md hover:bg-blue-100"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-blue-600 border border-blue-400 p-2 rounded-full shadow-md hover:bg-blue-100"
        >
          <ChevronRight size={24} />
        </button>
      </motion.div>
    </section>
  );
}