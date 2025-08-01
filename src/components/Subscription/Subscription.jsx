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

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      {/* Heading Section */}
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
  <p  className="mt-3 text-xs lg:text-base text-zinc-700">
    Get started with verified properties and premium support your perfect match is one step away.
  </p>
</section>


      {/* Plans Section */}
      <section className="max-w-7xl mx-auto lg:px-20 px-3 pb-10 lg:pt-10 pt-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standard Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all"
        >
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs  px-3 py-1 rounded-full shadow uppercase tracking-wider">
            Standard
          </span>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
            <div className="lg:w-1/3">
              <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">EMS Basic Plan</h2>
              <p className="text-sm mb-1">Freedom to Find Your Perfect Match</p>
              <p className="text-xs italic mb-4">Limited Access Plan for Trial Users</p>
              <div className="mb-4">
                <p className="line-through text-zinc-500 text-lg">₹599</p>
                <p className="text-3xl font-extrabold text-indigo-600">
                  ₹399 <span className="text-xl font-normal">+ GST</span>
                </p>
                <p className="text-green-500 font-semibold text-sm">Save ₹200!</p>
              </div>
            </div>

            <div className="lg:w-2/3">
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-start gap-2"><CheckIcon /> Access up to 5 contacts for 15 days</li>
                <li className="flex items-start gap-2"><CrossIcon /> Help in scheduling visit</li>
                <li className="flex items-start gap-2"><CrossIcon />Priority Support (Call/WhatsApp)</li>
                <li className="flex items-start gap-2"><CheckIcon /> 100% Verified Listings</li>
                <li className="flex items-start gap-2"><CheckIcon /> Smart Match Recommendations</li>
                <li className="flex items-start gap-2"><CheckIcon /> Save Hours - Match Quickly</li>
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
                  planName="Basic Plan"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all"
        >
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider">
            Premium
          </span>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
            <div className="lg:w-1/3">
              <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">EMS Starter Plan</h2>
              <p className="text-sm mb-1">Everything you need to find your ideal space</p>
              <p className="text-xs italic mb-4">Full access for 30 days</p>
              <div className="mb-4">
                <p className="line-through text-zinc-500 text-lg">₹1699</p>
                <p className="text-3xl font-extrabold text-yellow-500">
                  ₹1499 <span className="text-xl font-normal">+ GST</span>
                </p>
                <p className="text-green-500 font-semibold text-sm">Save ₹200!</p>
              </div>
            </div>

            <div className="lg:w-2/3">
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-start gap-2"><CheckIcon /> Unlimited Contact Access</li>
                <li className="flex items-start gap-2"><CheckIcon /> Scheduling Visit Assistance</li>
                <li className="flex items-start gap-2"><CheckIcon /> Priority Support (Call/WhatsApp)</li>
                <li className="flex items-start gap-2"><CheckIcon /> 100% Verified Listings</li>
                <li className="flex items-start gap-2"><CheckIcon /> Smart Match Recommendations</li>
                <li className="flex items-start gap-2"><CheckIcon /> Curated Suggestions</li>
                <li className="flex items-start gap-2"><CheckIcon /> Save Hours - Match Quickly</li>
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
                  planName="EMS Starter Plan"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
