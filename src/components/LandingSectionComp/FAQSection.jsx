import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "Is listing a property on EaseMySpace free?",
    answer:
      "Yes! Listing your property is completely free with no hidden charges.",
  },
  {
    question: "Can I contact renters or owners directly?",
    answer:
      "Absolutely. Our in-app chat system allows secure and direct communication.",
  },
  {
    question: "How do I verify my property?",
    answer:
      "After submission, our team reviews and verifies the listing within 24–48 hours.",
  },
  {
    question: "Is there any commission or service fee?",
    answer:
      "We don’t charge commissions. We simply charge a platform and convenience fee of ₹1499, which includes a pack of many services.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(index === openIndex ? null : index);

  return (
    <section style={{ fontFamily: "para_font" }} className="w-full px-3 lg:px-20 py-10 bg-white">
      <div className="w-full mx-auto">
        <h2 style={{ fontFamily: "heading_font" }} className="text-2xl sm:text-3xl  mb-5 text-left">
          Got Questions? We’ve Got
          Answers.
        </h2>

        <div className="space-y-1 divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
  className="w-full flex justify-between items-center py-4 text-left"
  onClick={() => toggle(idx)}
>
  <span className="text-sm lg:text-lg font-medium text-zinc-900">
    {faq.question}
  </span>
  <span
    className={`text-2xl transition-transform duration-300 ${
      openIndex === idx ? "rotate-180" : ""
    }`}
  >
    <FiChevronDown />
  </span>
</button>

              <div
                className={`text-sm text-zinc-600 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
