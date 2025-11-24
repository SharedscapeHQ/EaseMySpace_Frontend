import React from 'react';
import { motion } from "framer-motion";

function AboutStory() {
  return (
    <section
      style={{fontFamily:"para_font"}}
      className="flex items-center justify-center pb-20 bg-zinc-100 dark:bg-zinc-900"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      {/* JSON-LD structured data for About Us page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "EaseMySpace - About Us",
          "url": "https://easemyspace.in/about-us",
          "description": "EaseMySpace, founded in 2025 by Rakesh Goswami, is a Mumbai-based startup helping people find verified flatmates, PGs, shared accommodations, and vacant rooms.",
          "founder": {
            "@type": "Person",
            "name": "Rakesh Goswami",
            "jobTitle": "Founder & Entrepreneur"
          },
          "foundingDate": "2025",
          "foundingLocation": "Mumbai, India"
        })}
      </script>

      <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9 }}
  className="mt-10 rounded-2xl lg:px-10 px-4 max-w-7xl mx-auto relative"
>
  {/* Section Heading */}
  <div className="mb-8 text-left">
    <h2
      style={{ fontFamily: "heading_font" }}
      className="text-lg lg:text-3xl mb-0 text-black dark:text-white leading-tight"
    >
      <span itemProp="headline">Our Story</span>
    </h2>
    <p
      className="text-xs lg:text-base mb-5 text-gray-600 dark:text-gray-300"
      itemProp="description"
    >
      Where It All Began: A Smarter Way to Find a Space
    </p>
  </div>

  {/* About Story Text Block */}
  <div
    className="relative bg-white dark:bg-zinc-800 rounded-3xl p-4 sm:p-6 md:p-10 shadow-md border border-zinc-100 dark:border-zinc-700"
    itemProp="articleBody"
  >
    <div className="relative z-10 text-left">
      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-base leading-relaxed space-y-4">
        <span className="block mb-4">
          Founded in{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            2025
          </span>{" "}
          by{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Rakesh Goswami
          </span>{" "}
          a young Chartered Accountant and passionate entrepreneur, EaseMySpace
          was born out of a simple idea: to make urban living easier.
        </span>

        <span className="block mb-4">
          Starting in Mumbai, India’s most vibrant and fast-paced metro, we’ve
          built a platform that helps people find rental spaces and like-minded
          flatmates with ease and confidence.
        </span>

        <span className="block mb-4">
          Currently serving only Mumbai, our mission is to eliminate the stress
          of moving by offering verified listings, flatmate matching, and a
          completely broker-free experience.
        </span>

        <span className="block">
          Our team’s combined professional expertise and skills drive to address
          a real gap in the housing market providing young professionals and
          students with a smarter, more supportive way to find shared
          accommodations.
        </span>
      </p>
    </div>
  </div>
</motion.div>

    </section>
  );
}

export default AboutStory;
