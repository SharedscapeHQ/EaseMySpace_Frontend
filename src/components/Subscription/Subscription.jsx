import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import PaymentButtonSubs from "./PaymentButtonSbs";
import Footer from "../Footer";

// Icons
const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg
    className="w-4 h-4 text-red-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SubscriptionPlans() {
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [userMobile, setUserMobile] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpPopupPurpose, setOtpPopupPurpose] = useState("");

  const borderColors = {
    yellow: "border-yellow-400",
    red: "border-red-400",
    indigo: "border-indigo-400",
  };

  const bgColors = {
    yellow: "from-yellow-50",
    red: "from-red-50",
    indigo: "from-indigo-50",
  };

  const textColors = {
    yellow: "text-yellow-500",
    red: "text-red-500",
    indigo: "text-indigo-500",
  };

  const badgeColors = {
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
  };

  const plans = [
    {
      type: "premium",
      title: "Premium Plan",
      description: "15 days validity with essential services",
      originalPrice: "₹2,199",
      price: "₹1,999",
      gst: "+ GST",
      savings: "Save ₹200!",
      color: "yellow",
      features: [
        { text: "Up to 5 Property Visits (In-person)", included: true },
        { text: "5 Property Owner Contact Unlocks", included: true },
        { text: "Dedicated Relationship Manager", included: false },
        { text: "Accompanied Property Visits (With EMS Executive)", included: false },
        { text: "Up to 5 Video Tours Before Visit", included: true },
        { text: "Relocation Assistance (On-call)", included: false },
        { text: "Post-shifting Support - Standard", included: true },
        { text: "Match Recommendations - Basic", included: true },
      ],
    },
    {
      type: "ultimate",
      title: "Ultimate Plan",
      description: "45 days validity with all premium services",
      originalPrice: "₹3,799",
      price: "₹3,499",
      gst: "+ GST",
      savings: "Save ₹300!",
      color: "red",
      features: [
        { text: "Up to 20 Property Visits (In-person)", included: true },
        { text: "20 Property Owner Contact Unlocks", included: true },
        { text: "Dedicated Relationship Manager", included: true },
        { text: "Accompanied Property Visits (With EMS Executive)", included: true },
        { text: "Unlimited Video Tours Before Visit", included: true },
        { text: "Relocation Assistance (On-call)", included: true },
        { text: "Post-shifting Support - Extended & Priority", included: true },
        { text: "Match Recommendations - Hand-picked by RM", included: true },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      
      {/* Helmet for SEO */}
      <Helmet>
        <title>Subscription Plans Of EaseMySpace | Verified PGs, Flats & Flatmates in Mumbai</title>
        <meta
          name="description"
          content="Choose the perfect subscription plan to access verified PGs, shared flats, and flatmates in Mumbai areas like Andheri, Goregaon, Thane, and Ghatkopar. Get expert support and premium services to find your ideal rental space quickly and hassle-free."
        />
        <meta
          name="keywords"
          content="PG subscription Mumbai, Flatmates subscription Mumbai, Verified flats Mumbai, Premium property access, EaseMySpace plans, Andheri PGs, Goregaon flats, Thane shared flats, Ghatkopar rentals"
        />
        <link rel="canonical" href="https://easemyspace.in/subscription-plans" />
      </Helmet>

      <section className="pb-10 lg:px-10 pt-3 px-3">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-4xl lg:mt-5 text-zinc-900"
        >
          Choose Your Plan
        </motion.h1>
        <p className="mt-3 text-xs lg:text-base text-zinc-700">
          Get started with verified PGs, shared flats, flatmates, and expert support in Mumbai – your perfect rental space is one step away.
        </p>
      </section>

      <section className="mx-auto lg:px-10 px-3 pb-10 grid grid-cols-1 lg:mb-12 lg:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative border-2 ${borderColors[plan.color]} bg-gradient-to-br ${bgColors[plan.color]} to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all`}
          >
            <span
              className={`absolute -top-4 left-1/2 -translate-x-1/2 ${badgeColors[plan.color]} text-white text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider`}
            >
              {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
            </span>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
              <div className="lg:w-1/3">
                <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">
                  {plan.title}
                </h2>
                <p className="text-xs italic mb-4">{plan.description}</p>
                <div className="mb-4">
                  <p className="line-through text-zinc-500 text-lg">{plan.originalPrice}</p>
                  <p className={`text-3xl font-extrabold ${textColors[plan.color]}`}>
                    {plan.price} <span className="text-xl font-normal">{plan.gst}</span>
                  </p>
                  <p className="text-green-500 font-semibold text-sm">{plan.savings}</p>
                </div>
              </div>

              <div className="lg:w-2/3">
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feat.included ? <CheckIcon /> : <CrossIcon />} {feat.text}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center lg:justify-end">
                  <PaymentButtonSubs
                    hasPaid={hasPaid}
                    isLoggedIn={isLoggedIn}
                    isOtpVerified={isOtpVerified}
                    userMobile={userMobile}
                    setHasPaid={setHasPaid}
                    setShowOtpPopup={setShowOtpPopup}
                    setOtpPopupPurpose={setOtpPopupPurpose}
                    planName={plan.type}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
