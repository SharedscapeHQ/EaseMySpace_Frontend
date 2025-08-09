import React from 'react';
import { motion } from "framer-motion";

function AboutStory() {
  return (
    <section style={{fontFamily:"para_font"}} className=" flex items-center justify-center pb-20 bg-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className=" mt-10 rounded-2xl lg:px-10 px-4 max-w-7xl mx-auto relative"
      >
        {/* Section Heading */}
        <div className="mb-8 text-left">
          <h2
            style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black leading-tight"
          >
            Our Story
          </h2>
          <p className=" text-xs lg:text-base mb-5">
            Where It All Began: A Smarter Way to Find a Space
          </p>
        </div>

        {/* About Story Text Block */}
        <div className="relative bg-white rounded-3xl p-4 sm:p-6 md:p-10 shadow-md border border-zinc-100">
  <div className="relative z-10 text-left">
    <p className="text-gray-700 text-xs sm:text-base leading-relaxed space-y-4">
      <span className="block mb-4">
        Founded in <span className="font-semibold text-indigo-600">2025</span> by{" "}
        <span className="font-semibold text-indigo-600">Rakesh Goswami</span> a young Chartered Accountant and passionate entrepreneur EaseMySpace was born out of a simple idea: to make city living easier.
      </span>

      <span className="block mb-4">
        Starting in Mumbai, India’s most vibrant and fast-paced metro, we’ve built a platform that helps people find rental spaces and like-minded flatmates with ease and confidence.
      </span>

      <span className="block mb-4">
        Currently serving only Mumbai, our mission is to eliminate the stress of moving by offering verified listings, flatmate matching, and a completely broker-free experience.
      </span>

      <span className="block">
        Our team’s combined professional expertise and skills drive to address a real gap in the housing market providing young professionals and students with a smarter, more supportive way to find shared accommodations.
      </span>
    </p>
  </div>
</div>

      </motion.div>
    </section>
  );
}

export default AboutStory;
