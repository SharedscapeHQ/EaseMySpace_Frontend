import React from "react";
import { motion } from "framer-motion";

export default function AboutUsHero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex items-center justify-center px-6 -mt-10 md:mt-0 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-5xl text-center md:-mt-20 mt-10"
      >
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 leading-tight mb-6 tracking-wide drop-shadow-lg">
          Discover Who We Are
        </h1>

        {/* Subheading */}
        <p className="text-zinc-800 text-lg md:text-xl font-semibold mb-5 md:max-w-lg max-w-2xl mx-auto drop-shadow-sm">
          We help people find the perfect flatmate with ease, safety, and simplicity.
        </p>

        {/* Card-like About Us block */}
        <div
          className="
            bg-white rounded-3xl 
            shadow-xl hover:shadow-2xl 
            p-10 md:p-5
            mx-auto
            text-left border border-indigo-200 
            hover:border-indigo-300
            transition-shadow  duration-300
            relative
            "
          style={{ 
            borderImageSlice: 1,
            borderImageSource: "linear-gradient(to bottom, #6366f1, #8b5cf6)" 
          }}
        >
          {/* Vertical accent line */}
          <div
            className="absolute top-0 left-0 h-full w-1 rounded-l-3xl bg-gradient-to-b from-indigo-600 to-indigo-400"
          />
          <h2 className="text-3xl font-bold text-blue-700 mb-5 tracking-wide relative z-10">
            About Us
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg md:text-lg relative z-10">
            Founded in <span className="font-semibold text-indigo-600">2025</span> by{" "}
            <span className="font-semibold text-indigo-600">Rakesh Goswami</span> — a young Chartered Accountant and passionate entrepreneur — EaseMySpace was born out of a simple idea: to make city living easier.
            <br />
            <br />
            Starting in Mumbai, India’s most vibrant and fast-paced metro, we’ve built a platform that helps people find rental spaces and like-minded flatmates with ease and confidence.
            <br />
            <br />
            Currently serving only Mumbai, our mission is to eliminate the stress of moving by offering verified listings, flatmate matching, and a completely broker-free experience.
            <br />
            <br />
            Our team’s combined professional expertise and skills drive to address a real gap in the housing market—providing young professionals and students with a smarter, more supportive way to find shared accommodations.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
