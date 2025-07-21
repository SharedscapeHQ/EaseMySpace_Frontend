import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const plans = [
  {
    name: "Free",
    price: "₹-/monthly",
    features: ["1 Property Listing", "Basic Support", "Limited Visibility"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹-/monthly",
    features: ["10 Property Listings", "Priority Support", "High Visibility"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹-/monthly",
    features: [
      "Unlimited Listings",
      "24/7 Support",
      "Top Visibility",
      "Featured Badge",
    ],
    highlight: false,
  },
];

export default function SubscriptionPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-zinc-800">
      {/* Hero */}
      <section className="text-center py-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent"
        >
          Our Subscription Plans
        </motion.h1>
        <p className="mt-4 text-lg text-zinc-600 max-w-xl mx-auto">
          Choose a plan that fits your property listing goals. More exposure.
          Better results.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i, duration: 0.5 }}
            className={`relative rounded-2xl p-8 border shadow-xl bg-white ${
              plan.highlight ? "border-teal-500 scale-105 z-10" : "border-zinc-200"
            } transition hover:shadow-2xl`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 text-sm rounded-full shadow">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">
              {plan.name}
            </h2>
            <p className="text-3xl font-extrabold text-indigo-600 mb-6">
              {plan.price}
            </p>
            <ul className="space-y-3 text-zinc-700 mb-6">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  ✅ {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="block text-center font-medium text-white bg-teal-500 hover:bg-teal-600 transition px-6 py-2 rounded-full"
            >
              Choose {plan.name}
            </Link>
          </motion.div>
        ))}
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
        <Footer/>
    </div>
  );
}
