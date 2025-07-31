import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentButtonSubs from "../../components/Subscription/PaymentButtonSbs";

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

export default function PopupModal({ onClose }) {
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [userMobile, setUserMobile] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpPopupPurpose, setOtpPopupPurpose] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative"
        style={{ fontFamily: "para_font" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Heading Section */}
        <section className="pt-3 pb-6 lg:px-4">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "heading_font" }}
            className="text-2xl lg:text-3xl font-bold text-zinc-900"
          >
            Choose Your Plan
          </motion.h1>
          <p className="mt-2 text-sm text-zinc-700">
            Get started with verified properties and premium support – your perfect match is one step away.
          </p>
        </section>

        {/* Plans Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
          {/* Basic Plan */}
          <PlanCard
            title="EMS Basic Plan"
            badge="Standard"
            badgeColor="indigo"
            bgFrom="from-indigo-50"
            borderColor="border-indigo-400"
            price="₹399"
            originalPrice="₹599"
            savings="₹200"
            features={[
              "Access up to 5 contacts for 15 days",
              { text: "Help in scheduling visit", included: false },
              { text: "Priority Support (Call/WhatsApp)", included: false },
              "100% Verified Listings",
              "Smart Match Recommendations",
              "Save Hours - Match Quickly",
            ]}
            planName="Basic Plan"
            hasPaid={hasPaid}
            isLoggedIn={isLoggedIn}
            isOtpVerified={isOtpVerified}
            userMobile={userMobile}
            setHasPaid={setHasPaid}
            setShowOtpPopup={setShowOtpPopup}
            setOtpPopupPurpose={setOtpPopupPurpose}
          />

          {/* Premium Plan */}
          <PlanCard
            title="EMS Starter Plan"
            badge="Premium"
            badgeColor="yellow"
            bgFrom="from-yellow-50"
            borderColor="border-yellow-400"
            price="₹1499"
            originalPrice="₹1699"
            savings="₹200"
            features={[
              "Unlimited Contact Access",
              "Scheduling Visit Assistance",
              "Priority Support (Call/WhatsApp)",
              "100% Verified Listings",
              "Smart Match Recommendations",
              "Curated Suggestions",
              "Save Hours - Match Quickly",
            ]}
            planName="EMS Starter Plan"
            hasPaid={hasPaid}
            isLoggedIn={isLoggedIn}
            isOtpVerified={isOtpVerified}
            userMobile={userMobile}
            setHasPaid={setHasPaid}
            setShowOtpPopup={setShowOtpPopup}
            setOtpPopupPurpose={setOtpPopupPurpose}
          />
        </section>
      </motion.div>
    </div>
  );
}

// Reusable Plan Card Component
const PlanCard = ({
  title,
  badge,
  badgeColor,
  bgFrom,
  borderColor,
  price,
  originalPrice,
  savings,
  features,
  planName,
  hasPaid,
  isLoggedIn,
  isOtpVerified,
  userMobile,
  setHasPaid,
  setShowOtpPopup,
  setOtpPopupPurpose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative border-2 ${borderColor} bg-gradient-to-br ${bgFrom} to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all`}
    >
      <span
        className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-${badgeColor}-500 text-white text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider`}
      >
        {badge}
      </span>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
        {/* Left: Info */}
        <div className="lg:w-1/3">
          <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{title}</h2>
          <p className="text-sm mb-1">{badge === "Standard" ? "Freedom to Find Your Perfect Match" : "Everything you need to find your ideal space"}</p>
          <p className="text-xs italic mb-4">{badge === "Standard" ? "Limited Access Plan for Trial Users" : "Full access for 30 days"}</p>
          <div className="mb-4">
            <p className="line-through text-zinc-500 text-sm">{originalPrice}</p>
            <p className={`text-2xl font-extrabold text-${badgeColor}-500`}>
              {price} <span className="text-base font-normal">+ GST</span>
            </p>
            <p className="text-green-500 font-semibold text-xs">Save {savings}!</p>
          </div>
        </div>

        {/* Right: Features + Button */}
        <div className="lg:w-2/3">
          <ul className="space-y-2 text-sm mb-4">
            {features.map((item, idx) => {
              const text = typeof item === "string" ? item : item.text;
              const included = typeof item === "string" || item.included !== false;
              return (
                <li key={idx} className="flex items-start gap-2">
                  {included ? <CheckIcon /> : <CrossIcon />}
                  {text}
                </li>
              );
            })}
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
              planName={planName}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
