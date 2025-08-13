import React from "react";
import { motion } from "framer-motion";
import insta1 from "/insta-assets/insta1.jpeg";
import insta2 from "/insta-assets/insta2.jpeg";
import insta3 from "/insta-assets/insta3.jpeg";
import insta4 from "/insta-assets/insta4.jpeg";
import insta5 from "/insta-assets/insta5.jpeg";
import insta6 from "/insta-assets/insta6.jpeg";

export default function AboutUsHero() {
  const images = [
    { src: insta1, top: "5%", left: "5%", rotate: "-12deg", alwaysShow: true },
    { src: insta2, top: "20%", right: "8%", rotate: "10deg", alwaysShow: true },
    {
      src: insta3,
      bottom: "15%",
      left: "10%",
      rotate: "8deg",
      alwaysShow: true,
    },
    {
      src: insta4,
      bottom: "10%",
      right: "6%",
      rotate: "-10deg",
      alwaysShow: true,
    },
    { src: insta5, top: "3%", left: "45%", rotate: "-5deg", alwaysShow: false },
    {
      src: insta6,
      bottom: "25%",
      right: "25%",
      rotate: "6deg",
      alwaysShow: false,
    },
  ];

  return (
    <section style={{fontFamily: "para_font"}} className="w-full  min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden ">
      {/* Scattered Animated Instagram Images */}
      {images.map((img, index) => (
        <motion.img
          key={index}
          src={img.src}
          alt={`insta${index + 1}`}
          className={`max-w-[150px] h-auto absolute rounded-lg lg:opacity-70 opacity-20 select-none pointer-events-none 
            ${img.alwaysShow ? "" : "hidden md:block"}`}
          style={{
            ...img,
            transform: `rotate(${img.rotate})`,
            zIndex: 1,
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Overlay for text clarity */}
      <div className="absolute inset-0 bg-white/10 z-[2]" />

      {/* Main Text Content */}
     <motion.div
  className="text-center max-w-3xl z-10 mt-[-70px] sm:mt-0"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  <h1 className="text-3xl sm:text-5xl font-bold text-zinc-800 leading-tight mb-6">
    About EaseMySpace
  </h1>
  <p className="text-base sm:text-lg text-zinc-700 text-center mb-20">
    EaseMySpace is a modern rental discovery platform built to simplify
    urban living. We help individuals find verified shared accommodations
    and connect with compatible flatmates making the process smarter,
    safer, and more aligned with today’s lifestyle.
  </p>
</motion.div>


      {/* Scroll Indicator */}
      <div className="lg:flex flex-col items-center justify-center h-1/3  md:block z-10">
        <p className="text-gray-400 mb-2 text-xl">
          Scroll down to explore more
        </p>
        <div className="animate-bounce ">
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
