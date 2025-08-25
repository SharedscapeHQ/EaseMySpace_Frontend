import React, { useState } from "react";
import { motion } from "framer-motion";
import RentalMatchSection from "./MatchSection";
import VibeSection from "./KnowTheVibe";
import { FaHome, FaSmile, FaRegPaperPlane } from "react-icons/fa";
import Card from "./ExplorSectionCard";
import { Link } from "react-router-dom";

export default function ExploreSection() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full text-gray-900"
    >
      <div className="lg:px-10 px-3 max-w-7xl mx-auto">
        {/* Header */}
        {!selectedFeature && (
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "heading_font" }}
            className="text-2xl lg:text-3xl font-semibold text-black mb-10"
          >
            Explore Your Perfect Match
          </motion.h2>
        )}

        {/* Cards */}
        {!selectedFeature && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="Find Your Ideal Rental"
              text="Answer 5 quick questions. See matching homes."
              icon={<FaHome className="svg" />}
              buttonLabel="Start"
              onClick={() => setSelectedFeature("rental")}
            />
            <Card
              title="Discover Your Vibe"
              text="Take a quick quiz to explore spaces matching your lifestyle."
              icon={<FaSmile className="svg" />}
              buttonLabel="Start"
              onClick={() => setSelectedFeature("vibe")}
            />
           <Card
  title="Post Your Requirement"
  text="Tell us your exact requirements and we’ll find the right property for you."
  icon={<FaRegPaperPlane className="svg" />}
  buttonLabel="Post"
  link="/demand-form"
/>
          </div>
        )}

        {/* Feature Display */}
        <div className="mt-12">
          {selectedFeature === "rental" && <RentalMatchSection />}
          {selectedFeature === "vibe" && <VibeSection />}
        </div>

        {/* Back Button */}
        {selectedFeature && (
          <div className="mt-10 flex justify-start">
            <button
              onClick={() => setSelectedFeature(null)}
              className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl text-gray-800 font-medium shadow-sm transition"
            >
              ← Back to Options
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
