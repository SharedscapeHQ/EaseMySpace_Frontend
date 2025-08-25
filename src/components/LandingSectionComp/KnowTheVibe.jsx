import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCoffee, FaBeer, FaBook, FaGem, FaTree, FaMusic, FaBicycle, FaLaptop } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function VibeSection() {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState({});

  const questions = [
    {
      q: "What’s your vibe?",
      options: [
        { label: "Chill", icon: <FaCoffee size={28} />, type: "Peaceful Soul" },
        { label: "Party", icon: <FaBeer size={28} />, type: "Night Owl" },
        { label: "Focus", icon: <FaBook size={28} />, type: "Go-Getter" },
        { label: "Luxury", icon: <FaGem size={28} />, type: "Trendsetter" },
      ],
    },
    {
      q: "Preferred neighborhood energy?",
      options: [
        { label: "Quiet", icon: <FaTree size={28} />, type: "Peaceful Soul" },
        { label: "Trendy", icon: <FaMusic size={28} />, type: "Trendsetter" },
        { label: "Student Friendly", icon: <FaBook size={28} />, type: "Go-Getter" },
        { label: "Professional", icon: <FaLaptop size={28} />, type: "Early Bird" },
      ],
    },
    {
      q: "Commute preference?",
      options: [
        { label: "Bike", icon: <FaBicycle size={28} />, type: "Explorer" },
        { label: "Walk", icon: <FaTree size={28} />, type: "Peaceful Soul" },
        { label: "Metro", icon: <FaLaptop size={28} />, type: "Go-Getter" },
        { label: "Work From Home", icon: <FaLaptop size={28} />, type: "Trendsetter" },
      ],
    },
  ];

  const handleAnswer = (selectedType) => {
    setScore((prev) => ({
      ...prev,
      [selectedType]: (prev[selectedType] || 0) + 1,
    }));
    if (step < questions.length - 1) setStep(step + 1);
    else setFinished(true);
  };

  const getFinalVibe = () => {
    const maxScore = Math.max(...Object.values(score));
    const topTypes = Object.keys(score).filter((type) => score[type] === maxScore);
    return topTypes[Math.floor(Math.random() * topTypes.length)];
  };

  return (
  <section className="w-full bg-white text-gray-900 flex items-center justify-center">
  {!finished ? (
    <div className="w-11/12 max-w-7xl mx-auto lg:px-10 px-3 flex flex-col lg:flex-row items-start gap-12">
      {/* Left: Heading + Progress */}
      <div className="lg:w-1/2">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Discover Your Vibe
        </motion.h2>
        <p className="mb-2 text-lg">Answer a few questions to find spaces that match your style.</p>
        <p className="mb-6 text-sm font-medium">Question {step + 1}/{questions.length}</p>
      </div>

      {/* Right: Question Card Buttons */}
      <div className="lg:w-1/2 w-full">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 text-gray-900 rounded-2xl shadow-md flex flex-wrap justify-center gap-6 p-8"
        >
          {questions[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.type)}
              className="flex flex-col items-center justify-center bg-white hover:bg-gray-100 text-gray-800 py-6 px-8 rounded-xl shadow-md transition max-w-[200px]"
            >
              <div className="mb-3">{opt.icon}</div>
              <span className="font-medium text-lg">{opt.label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 bg-gray-50 rounded-2xl shadow-lg"
    >
      <h3 className="text-3xl font-bold mb-4">Your Vibe Type</h3>
      <p className="text-xl mb-3">
        You are a <span className="font-semibold">{getFinalVibe()}</span>!
      </p>
      <p className="text-sm text-gray-700 mb-6">
        Explore listings that match your style and energy.
      </p>
      <Link
        to="/view-properties"
        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Explore Listings
      </Link>
    </motion.div>
  )}
</section>


  );
}
