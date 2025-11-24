import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import OtpPopup from "../../pages/Properties/OtpPopup";

export default function RentalMatchSection() {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const otpVerified = localStorage.getItem("otp_verified") === "true";
  const [isOtpVerified, setIsOtpVerified] = useState(otpVerified);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const cache = localStorage.getItem("user");
    return !!cache;
  });

  const questions = [
    { q: "Looking for?", options: ["Flatmate", "Vacant", "PG"], key: "looking_for" },
    { q: "Preferred gender of flatmate?", options: ["Male", "Female", "Unisex"], key: "gender" },
    { q: "BHK Type?", options: ["1", "1.5", "2", "2.5", "3", "4"], key: "bhk_type" },
    { q: "Preferred location?", options: ["Andheri", "Bandra", "Powai", "Dadar"], key: "location" },
    { q: "Max budget (₹/month)?", options: ["10000", "20000", "30000", "50000"], key: "maxPrice" },
  ];

  useEffect(() => {
    // Fetch all properties
    fetch("https://api.easemyspace.in/api/properties/all")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Check current user login
    const cache = localStorage.getItem("user");
    setIsLoggedIn(!!cache);
    setIsOtpVerified(localStorage.getItem("otp_verified") === "true");

    const syncLogin = () => {
      const cache = localStorage.getItem("user");
      setIsLoggedIn(!!cache);
      setIsOtpVerified(localStorage.getItem("otp_verified") === "true");
    };

    window.addEventListener("storage", syncLogin);
    window.addEventListener("auth-change", syncLogin);
    return () => {
      window.removeEventListener("storage", syncLogin);
      window.removeEventListener("auth-change", syncLogin);
    };
  }, []);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[step].key]: option });
    if (step < questions.length - 1) setStep(step + 1);
    else setFinished(true);
  };

  const handlePropertyClick = (event, property) => {
    if (!isLoggedIn && !isOtpVerified) {
      event.preventDefault();
      setSelectedPropertyId(property.id);
      setShowOtpPopup(true);
      return;
    }
    navigate(`/properties/${property.id}`);
  };

  const filteredProperties = properties.filter((p) => {
    let match = true;

    const lookingFor = answers.looking_for?.toLowerCase();
    const gender = answers.gender?.toLowerCase();
    const location = answers.location?.toLowerCase();
    const bhkType = answers.bhk_type;
    const maxPrice = answers.maxPrice ? Number(answers.maxPrice.replace(/,/g, "")) : null;

    if (lookingFor) match = match && p.looking_for?.trim().toLowerCase() === lookingFor;
    if (gender && gender !== "unisex") match = match && p.gender?.trim().toLowerCase() === gender;
    if (bhkType) match = match && parseFloat(p.bhk_type) === parseFloat(bhkType);
    if (location) match = match && p.location?.trim().toLowerCase().includes(location);
    if (maxPrice) match = match && (Number(p.price?.toString().replace(/,/g, "")) || 0) <= maxPrice;

    return match;
  });

  return (
    <section className="w-full text-gray-900 dark:text-gray-200">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
    {/* Left: Intro / Questions */}
    {!finished && (
      <div className="lg:w-1/2">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4 text-black dark:text-white"
        >
          Find Your Ideal Rental
        </motion.h2>
        <p className="mb-2 text-lg">Answer a few questions to get the most suitable listings.</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {step + 1}/{questions.length}
        </p>
      </div>
    )}

    {/* Right: Questions / Property Cards */}
    <div className={`${finished ? "w-full" : "lg:w-1/2"} w-full flex flex-col`}>
      {!finished ? (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-200 rounded-2xl shadow-md flex flex-col gap-6 p-8"
        >
          <h3 className="text-xl font-semibold mb-4">{questions[step].q}</h3>
          <div className="grid grid-cols-2 gap-4">
            {questions[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-white dark:bg-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-600 text-gray-800 dark:text-gray-200 py-4 rounded-xl shadow-md transition duration-200"
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      ) : loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
      ) : filteredProperties.length ? (
        <>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold mb-6 w-full text-black dark:text-white"
          >
            Matching Properties
          </motion.h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {filteredProperties.map((p, idx) => (
              <Link
                to={`/properties/${p.id}`}
                key={idx}
                onClick={(e) => handlePropertyClick(e, p)}
                className="min-w-[270px] max-w-[270px] group bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex-shrink-0 overflow-hidden relative transition-all duration-300"
              >
                {/* Background Fill Overlay */}
                <div className="hidden lg:block absolute inset-x-0 bottom-0 bg-blue-500 h-0 group-hover:h-full transition-all duration-300 ease-in-out z-0 rounded-2xl"></div>

                {/* Image */}
                {p.image?.[0] ? (
                  <div className="relative h-48 w-full p-3 pt-3 pb-0 z-10">
                    <div className="h-full w-full overflow-hidden rounded-xl">
                      <img
                        src={p.image[0]}
                        alt={p.title || `Property image`}
                        className="h-full group-hover:scale-105 w-full object-cover group-hover:brightness-110 transition-transform duration-300"
                      />
                    </div>
                    {p.verified && (
                      <span className="absolute top-4 left-4 bg-green-500 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 shadow-md z-10">
                        <FiCheckCircle className="text-[12px]" />
                        Verified
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-400 italic rounded-t-2xl z-10">
                    No Media
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-1 z-10 relative">
                  <h3 className="font-semibold text-md truncate max-w-[160px] lg:group-hover:text-white transition-colors duration-300">
                    {p.bhk_type}
                  </h3>

                  <p className="text-zinc-800 dark:text-gray-200 font-bold text-xs lg:text-base whitespace-nowrap lg:group-hover:text-white transition-colors duration-300">
                    ₹ {Number(p.price).toLocaleString()}/mo
                  </p>

                  <p className="text-gray-600 dark:text-gray-400 text-xs lg:group-hover:text-white transition-colors duration-300">
                    {p.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center col-span-full">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No properties match your criteria.</p>
          <Link
            to="/demand-form"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Post Your Requirement
          </Link>
        </div>
      )}
    </div>
  </div>

  {showOtpPopup && (
    <OtpPopup
      otpPurpose="view property"
      onVerified={() => {
        setIsOtpVerified(true);
        setShowOtpPopup(false);
        if (selectedPropertyId) navigate(`/properties/${selectedPropertyId}`);
      }}
      onClose={() => {
        setShowOtpPopup(false);
        setSelectedPropertyId(null);
      }}
    />
  )}
</section>

  );
}
