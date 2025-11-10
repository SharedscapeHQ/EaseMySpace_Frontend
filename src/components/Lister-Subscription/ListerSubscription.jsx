import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../Footer";
import InvoiceModal from "../Subscription/InvoiceModal";
import { getCurrentUser } from "../../api/authApi";
import ListerPaymentButton from "./ListerPaymentButton";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export default function ListerSubscription() {
  const [userData, setUserData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const plans = [
    {
      id: "standard",
    type: "Standard",
    title: "Standard Lister",
    description: "Access all essential services for property owners.",
    originalPrice: "₹2,999",
    price: "₹999",
    numericPrice: 999,
    savings: "Save ₹2,000!",
    gst: "+18% GST",
    duration: "45 Days",
    color: "indigo",
      features: [
        { text: "Up to 2 property listings", included: true },
        { text: "Unlimited edits & updates", included: true },
        { text: "WhatsApp lead notifications", included: true },
        { text: "Standard visibility", included: true },
        { text: "Dedicated support", included: true },
        { text: "Personalised Dashboard", included: true },
      ],
    },
  ];

  const borderColors = { indigo: "border-indigo-400" };
  const bgColors = { indigo: "from-indigo-50" };
  const badgeColors = { indigo: "bg-indigo-500" };

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch {
        setUserData(null);
      }
    })();
  }, []);

  return (
    <div style={{ fontFamily: "para_font" }} className="min-h-screen bg-white font-inter">
      <Helmet>
        <title>Lister Subscription | EaseMySpace</title>
        <meta
          name="description"
          content="Choose the Standard Lister plan to access essential property listing services with EaseMySpace."
        />
      </Helmet>

      <section className="pb-10 lg:px-10 pt-3 px-3">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "heading_font" }}
          className="text-2xl lg:text-4xl lg:mt-5 text-zinc-900"
        >
          Lister Subscription
        </motion.h1>
        <p className="mt-3 text-xs lg:text-base text-zinc-700">
          Get started with our subscription plans. Manage your properties efficiently.
        </p>
      </section>

      <section
        className={`mx-auto lg:px-10 px-3 pb-10 grid grid-cols-1 lg:gap-6 ${
          plans.length === 1 ? "lg:grid-cols-1 justify-items-center" : "lg:grid-cols-2"
        }`}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`relative border-2 ${borderColors[plan.color]} bg-gradient-to-br ${bgColors[plan.color]} to-white p-4 rounded-2xl shadow-lg lg:hover:scale-[1.02] transition-all`}
          >
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 ${badgeColors[plan.color]} text-white text-xs px-2 py-1 rounded-full shadow uppercase tracking-wider`}
            >
              {plan.type}
            </span>

          {/* Mobile Layout */}
<div className="flex flex-col gap-2 lg:hidden">
  <h2 style={{ fontFamily: "heading_font" }} className="text-lg font-semibold">
    {plan.title}
  </h2>
  <p className="line-through text-zinc-500 text-base">{plan.originalPrice}</p>
  <p className="text-sm text-zinc-700">
    {plan.price} <span className="text-xs">{plan.gst}</span>
  </p>
  <p className="text-green-500 text-xs">{plan.savings}</p>
  <button
    className={`mt-2 w-full py-2 rounded-lg text-white ${badgeColors[plan.color]}`}
    onClick={() => setSelectedPlan(plan)}
  >
    More Details
  </button>
</div>


           {/* Desktop Layout */}
<div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-4">
  <div className="lg:w-1/3">
    <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-1">{plan.title}</h2>
    <p className="text-xs italic mb-4">{plan.description}</p>
    <div className="mb-4">
      <p className="line-through text-zinc-500 text-lg">{plan.originalPrice}</p>
      <p className="text-3xl font-extrabold text-zinc-900">
        {plan.price} <span className="text-xl font-normal">{plan.gst}</span>
      </p>
      <p className="text-green-500 font-semibold text-sm">{plan.savings}</p>
    </div>
  </div>
  <div className="lg:w-2/3 flex flex-col justify-start">
    <ul className="space-y-3 text-sm mb-6">
      {plan.features.map((feat, i) => (
        <li key={i} className="flex items-start gap-2">
          <CheckIcon /> {feat.text}
        </li>
      ))}
    </ul>
    <div className="flex justify-center lg:justify-end">
      <ListerPaymentButton plan={plan} userData={userData} onInvoiceGenerated={(url) => setInvoiceUrl(url)} />
    </div>
  </div>
</div>

          </motion.div>
        ))}
      </section>

      {selectedPlan && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end"
          onClick={() => setSelectedPlan(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button className="text-right w-full mb-4 text-gray-500 font-bold" onClick={() => setSelectedPlan(null)}>Close</button>
            <h2 style={{ fontFamily: "heading_font" }} className="text-xl mb-2">{selectedPlan.title}</h2>
            <p className="text-sm italic mb-4">{selectedPlan.description}</p>
            <p className="text-2xl font-bold text-zinc-900 mb-2">{selectedPlan.price} <span className="text-xs">{selectedPlan.gst}</span></p>
            <p className="text-green-500 text-sm mb-4">{selectedPlan.duration}</p>
            <ul className="space-y-2 text-sm mb-4">
              {selectedPlan.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2"><CheckIcon /> {feat.text}</li>
              ))}
            </ul>
            <ListerPaymentButton plan={selectedPlan} userData={userData} onInvoiceGenerated={(url) => setInvoiceUrl(url)} />
          </motion.div>
        </motion.div>
      )}

      <InvoiceModal isOpen={!!invoiceUrl} invoiceUrl={invoiceUrl} onClose={() => setInvoiceUrl(null)} />
      <Footer />
    </div>
  );
}
