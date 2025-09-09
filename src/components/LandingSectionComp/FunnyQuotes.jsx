import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Finding flatmates is harder than finding Virar fast empty seats. We fixed that.",
  "Your ex moved on... you still stuck with a broker? Try EMS.",
  "Pure veg, non-veg, or Netflix-only diet - we've got flatmates for all.",
  "Because asking 'room hai kya?' to every chaiwala is not a strategy.",
  "Tired of landlords saying 'Only families'? Don't worry, EMS is family now.",
  "Bandra rent? Kidney donation. EMS rent? Chill, boss.",
  "Finding a flatmate in Mumbai is like finding parking - impossible. Unless you're on EMS.",
  "Broker calls > Mom calls. Fix it with EMS.",
  "Your future flatmate is one swipe away. Just don't ghost after viewing.",
  "We don't just find you space. We save you from sleeping at CST platform.",
];

export default function FunnyQuotes() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return; 
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="w-full flex justify-center items-center py-6">
      <div
        className="relative flex items-center"
        onMouseEnter={() => setPaused(true)}  
        onMouseLeave={() => setPaused(false)}  
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="relative text-center text-lg sm:text-xl font-bold 
                       bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent
                       px-8 py-3 rounded-full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="absolute left-4 top-1 text-2xl text-blue-400">“</span>
            {quotes[index]}
            <span className="absolute right-4 bottom-1 text-2xl text-blue-400">”</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
