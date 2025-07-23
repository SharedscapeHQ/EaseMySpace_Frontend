import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const plan = {
  name: "EMS Starter Plan",
  subheading: "Freedom to Find Your Perfect Match",
  description: "Full access to verified owners & properties for 30 days.",
  priceOriginal: "₹1699",
  priceDiscounted: "₹1499 + GST",
  savings: "Save ₹200!",
  features: [
    "Unlimited Contact Access for 30 days",
    "Help in scheduling visit at convenient time",
    "Priority WhatsApp & Call Support",
    "100% Verified Owner Listings",
    "Smart Match Recommendations",
    "Curated Property Suggestions",
    "Save Hours - Match Within Days",
  ],
};

export default function SubscriptionPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-zinc-800">
      {/* Hero */}
      <section className="text-center py-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent"
        >
          EMS Starter Plan
        </motion.h1>
        <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
          Freedom to Find Your Perfect Match – unlock full access to verified owners & properties with premium support for 30 days.
        </p>
      </section>

      {/* Pricing Card */}
      <section className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl p-8 border-2 shadow-xl bg-white border-teal-500 transition hover:shadow-2xl"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 text-sm rounded-full shadow">
            Best Value
          </div>
          <h2 className="text-2xl font-bold text-zinc-800 mb-1 text-center">{plan.name}</h2>
          <p className="text-md text-zinc-600 text-center mb-2">{plan.subheading}</p>
          <p className="text-sm text-zinc-500 text-center italic mb-6">{plan.description}</p>

          <div className="text-center mb-6">
            <p className="line-through text-zinc-400 text-xl">{plan.priceOriginal}</p>
            <p className="text-3xl font-extrabold text-indigo-600">{plan.priceDiscounted}</p>
            <p className="text-green-600 font-semibold mt-1">{plan.savings}</p>
          </div>

          <ul className="space-y-3 text-zinc-700 mb-8">
            {plan.features.map((f, idx) => (
              <li key={idx} className="flex items-start gap-2">
                ✅ <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className="block text-center font-medium text-white bg-teal-500 hover:bg-teal-600 transition px-6 py-3 rounded-full"
          >
           Contact Sales
          </Link>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform"
        >
          <Link to="/add-properties">Start Listing Now ✍️</Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
