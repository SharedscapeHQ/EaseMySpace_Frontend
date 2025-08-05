import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentButtonSubs from "./PaymentButtonSbs";
import Footer from "../Footer";

// Icons
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const plans = [
    {
      type: "standard",
      title: "EMS Basic Plan",
      subtitle: "Freedom to Find Your Perfect Match",
      description: "Limited Access Plan for Trial Users",
      originalPrice: "₹699",
      price: "₹499",
      gst: "+ GST",
      savings: "Save ₹200!",
      color: "indigo",
      features: [
        { text: "Access to any 2 contact of your choice", included: true },
        { text: "Help in scheduling visit", included: false },
        { text: "Priority Support (Call/WhatsApp)", included: false },
        { text: "100% Verified Listings", included: true },
        { text: "Smart Match Recommendations", included: false },
        { text: "Save Hours - Match Quickly", included: true },
      ],
    },
    {
      type: "premium",
      title: "EMS Starter Plan",
      subtitle: "Everything you need to find your ideal space",
      description: "Full access for 25 days",
      originalPrice: "₹1699",
      price: "₹1499",
      gst: "+ GST",
      savings: "Save ₹200!",
      color: "yellow",
      features: [
        { text: "Access to any 8 contact of your choice", included: true },
        { text: "Scheduling Visit Assistance", included: false },
        { text: "Priority Support (Call/WhatsApp)", included: true },
        { text: "100% Verified Listings", included: true },
        { text: "Smart Match Recommendations", included: true },
        { text: "Curated Suggestions", included: true },
        { text: "Save Hours - Match Quickly", included: true },
      ],
    },
    {
      type: "ultimate",
      title: "EMS Premium Plan",
      subtitle: "Unlimited Access + Personal Guidance",
      description: "All benefits for 30 days",
      originalPrice: "₹2799",
      price: "₹2499",
      gst: "+ GST",
      savings: "Save ₹300!",
      color: "red",
      features: [
        { text: "Unlimited Contact Access", included: true },
        { text: "Scheduling Visit Assistance", included: true },
        { text: "Dedicated Relationship Manager", included: true },
        { text: "100% Verified Listings", included: true },
        { text: "Smart Match Recommendations", included: true },
        { text: "Curated Suggestions", included: true },
        { text: "Save Hours - Match Quickly", included: true },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      <section className="pb-10 pt-3 lg:px-20 px-3">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-4xl  text-zinc-900"
        >
          Choose Your Plan
        </motion.h1>
        <p className="mt-3 text-xs lg:text-base text-zinc-700">
          Get started with verified properties and premium support your perfect match is one step away.
        </p>
      </section>

      <section className="max-w-7xl mx-auto lg:px-20 px-3 pb-10 lg:pt-10 pt-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative border-2 border-${plan.color}-400 bg-gradient-to-br from-${plan.color}-50 to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all`}
          >
            <span className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-${plan.color}-500 text-white text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider`}>
              {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
            </span>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
              <div className="lg:w-1/3">
                <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{plan.title}</h2>
                <p className="text-sm mb-1">{plan.subtitle}</p>
                <p className="text-xs italic mb-4">{plan.description}</p>
                <div className="mb-4">
                  <p className="line-through text-zinc-500 text-lg">{plan.originalPrice}</p>
                  <p className={`text-3xl font-extrabold text-${plan.color}-500`}>
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
