import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentButtonSubs from "../../components/Subscription/PaymentButtonSbs";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2 ">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative scrollbar-hide"
        style={{ fontFamily: "para_font" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <section className="pt-3 pb-6 lg:px-4 ">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "heading_font" }}
            className="text-2xl lg:text-3xl font-bold text-zinc-900 "
          >
            Choose Your Plan
          </motion.h1>
          <p className="mt-2 text-sm text-zinc-700">
            Get started with verified properties and premium support – your perfect match is one step away.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4 ">
          {/* EMS Basic Plan */}
          <PlanCard
            title="EMS Basic Plan"
            badge="Standard"
            badgeColor="indigo"
            bgFrom="from-indigo-50"
            borderColor="border-indigo-400"
            price="₹499"
            originalPrice="₹699"
            savings="₹200"
            features={[
              { text: "Access to any 2 contact of your choice", included: true },
              { text: "Help in scheduling visit", included: false },
              { text: "Priority Support (Call/WhatsApp)", included: false },
              { text: "100% Verified Listings", included: true },
              { text: "Smart Match Recommendations", included: false },
              { text: "Save Hours - Match Quickly", included: true },
            ]}
            planName="standard"
            hasPaid={hasPaid}
            setHasPaid={setHasPaid}
          />

          {/* EMS Starter Plan */}
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
              { text: "Access to any 8 contact of your choice", included: true },
              { text: "Scheduling Visit Assistance", included: false },
              { text: "Priority Support (Call/WhatsApp)", included: true },
              { text: "100% Verified Listings", included: true },
              { text: "Smart Match Recommendations", included: true },
              { text: "Curated Suggestions", included: true },
              { text: "Save Hours - Match Quickly", included: true },
            ]}
            planName="premium"
            hasPaid={hasPaid}
            setHasPaid={setHasPaid}
          />

          {/* EMS Premium Plan */}
          <PlanCard
            title="EMS Premium Plan"
            badge="Ultimate"
            badgeColor="red"
            bgFrom="from-red-50"
            borderColor="border-red-400"
            price="₹2499"
            originalPrice="₹2799"
            savings="₹300"
            features={[
              { text: "Unlimited Contact Access", included: true },
              { text: "Scheduling Visit Assistance", included: true },
              { text: "Dedicated Relationship Manager", included: true },
              { text: "100% Verified Listings", included: true },
              { text: "Smart Match Recommendations", included: true },
              { text: "Curated Suggestions", included: true },
              { text: "Save Hours - Match Quickly", included: true },
            ]}
            planName="ultimate"
            hasPaid={hasPaid}
            setHasPaid={setHasPaid}
          />
        </section>
      </motion.div>
    </div>
  );
}

// PlanCard component
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
  setHasPaid,
}) => {
  const subtitles = {
    Standard: "Freedom to Find Your Perfect Match",
    Premium: "Everything you need to find your ideal space",
    Ultimate: "Unlimited Access + Personal Guidance",
  };

  const descriptions = {
    Standard: "Limited Access Plan for Trial Users",
    Premium: "Full access for 25 days",
    Ultimate: "All benefits for 30 days",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative border-2 ${borderColor} bg-gradient-to-br ${bgFrom} to-white p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all `}
    >
      <span
        className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-${badgeColor}-500 text-white text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider`}
      >
        {badge}
      </span>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
        <div className="lg:w-1/3">
          <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{title}</h2>
          <p className="text-sm mb-1">{subtitles[badge]}</p>
          <p className="text-xs italic mb-4">{descriptions[badge]}</p>
          <div className="mb-4">
            <p className="line-through text-zinc-500 text-sm">{originalPrice}</p>
            <p className={`text-2xl font-extrabold text-${badgeColor}-500`}>
              {price} <span className="text-base font-normal">+ GST</span>
            </p>
            <p className="text-green-500 font-semibold text-xs">{savings}</p>
          </div>
        </div>

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
              setHasPaid={setHasPaid}
              planName={planName}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
