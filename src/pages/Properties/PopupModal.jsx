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

// Plans data
const plans = [
  // {
  //   type: "standard",
  //   title: "EMS Basic Plan",
  //   subtitle: "Freedom to Find Your Perfect Match",
  //   description: "Limited Access Plan for Trial Users",
  //   originalPrice: "₹699",
  //   price: "₹499",
  //   gst: "+ GST",
  //   savings: "Save ₹200!",
  //   color: "indigo",
  //   features: [
  //     { text: "Access to any 2 contact of your choice", included: true },
  //     { text: "Help in scheduling visit", included: false },
  //     { text: "Priority Support (Call/WhatsApp)", included: false },
  //     { text: "100% Verified Listings", included: true },
  //     { text: "Smart Match Recommendations", included: false },
  //     { text: "Save Hours - Match Quickly", included: true },
  //   ],
  // },
  // {
  //     type: "trial",
  //     title: "Trial Plan",
  //     description: "7 days validity with essential services",
  //     originalPrice: "₹599",
  //     price: "₹399",
  //     gst: "+ GST",
  //     savings: "Save ₹200!",
  //     color: "yellow",
  //     features: [
  //       { text: "Up to 1 contact access", included: true },
  //       { text: "1 Property Owner Contact Unlocks", included: true },
  //       { text: "Dedicated Relationship Manager", included: true },
  //       { text: "Accompanied Property Visits (With EMS Executive)", included: true },
  //       { text: "Up to 1 Video Tours Before Visit", included: true },
  //       { text: "Relocation Assistance (On-call)", included: true },
  //       { text: "Post-shifting Support - Standard", included: true },
  //       { text: "Match Recommendations - Basic", included: true },
  //     ],
  //   },
    {
     type: "ultimate",
title: "Ultimate Plan",
description: "45 days validity with all premium services",
originalPrice: "₹3,799",
price: "₹1,299",
gst: "+18% GST",
savings: "Save ₹2,500!",
color: "red",
      features: [
  { text: "Up to 20 contact access", included: true },
  { text: "Personalised Dashboard", included: true },
  { text: "Post Requirement", included: true },
  { text: "Re-location assistance (on call)", included: true },
  { text: "Dedicated Customer Support", included: true },
  { text: "New listed property alert", included: true },
  { text: "Post-shifting basic support (If needed)", included: true },
],

    },
];

export default function PopupModal({ onClose }) {
  const [hasPaid, setHasPaid] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-2">
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
          {plans.map((plan, idx) => (
            <PlanCard
              key={idx}
              title={plan.title}
              badge={plan.type === "premium" ? "Premium" : plan.type === "ultimate" ? "Ultimate" : "Standard"}
              badgeColor={plan.color}
              bgFrom={`from-${plan.color}-50`}
              borderColor={`border-${plan.color}-400`}
              price={plan.price}
              originalPrice={plan.originalPrice}
              savings={plan.savings}
              features={plan.features}
              planName={plan.type}
              hasPaid={hasPaid}
              setHasPaid={setHasPaid}
              subtitle={plan.subtitle}
              description={plan.description}
              gst={plan.gst}
            />
          ))}
        </section>
      </motion.div>
    </div>
  );
}

// PlanCard Component
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
  subtitle,
  description,
  gst,
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
        <div className="lg:w-1/3">
          <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">
            {title}
          </h2>
          <p className="text-sm mb-1">{subtitle}</p>
          <p className="text-xs italic mb-4">{description}</p>
          <div className="mb-4">
            <p className="line-through text-zinc-500 text-sm">{originalPrice}</p>
            <p className={`text-2xl font-extrabold text-${badgeColor}-500`}>
              {price} <span className="text-base font-normal">{gst}</span>
            </p>
            <p className="text-green-500 font-semibold text-xs">{savings}</p>
          </div>
        </div>

        <div className="lg:w-2/3">
          <ul className="space-y-2 text-sm mb-4">
            {features.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                {item.included ? <CheckIcon /> : <CrossIcon />}
                {item.text}
              </li>
            ))}
          </ul>
          <div className="flex justify-center lg:justify-end">
            <PaymentButtonSubs hasPaid={hasPaid} setHasPaid={setHasPaid} planName={planName} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
