import React from "react";
import { motion } from "framer-motion";

export default function AboutUsHero() {
  return (
    <section
      style={{ fontFamily: "universal_font" }}
      className="w-full min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Overlay for text clarity */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 z-[2]" />

      {/* Main Text Content */}
      <motion.div
        className="text-center max-w-3xl z-10 mt-[-70px] sm:mt-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 style={{ fontFamily: "para_font" }} className="text-3xl sm:text-5xl text-zinc-800 dark:text-white leading-tight mb-6">
          About EaseMySpace™
        </h1>
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 text-center mb-10">
          EaseMySpace™ is a trusted platform in Mumbai for finding{" "}
          <strong>verified flatmates</strong>,{" "}
          <strong>shared accommodations</strong>, <strong>PGs</strong>, and{" "}
          <strong>vacant rooms</strong>. Our mission is to simplify urban living
          by connecting compatible flatmates and offering a secure, reliable,
          and efficient rental discovery experience. Whether you are looking for
          a <strong>PG in Mumbai</strong> or want to find the perfect{" "}
          <strong>shared flat</strong>, EaseMySpace™ helps you do it faster and
          smarter. As a growing startup, we are committed to expanding our
          services to help more Mumbai residents find their ideal home.
        </p>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="lg:flex flex-col items-center justify-center h-1/3 md:block z-10">
        <p className="text-gray-400 dark:text-gray-500 mb-2 text-xl">
          Scroll down to explore
        </p>
        <div className="animate-bounce">
          <svg
            className="w-full h-10 text-blue-500 rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 5.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0110 3z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 10a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 12.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0110 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
