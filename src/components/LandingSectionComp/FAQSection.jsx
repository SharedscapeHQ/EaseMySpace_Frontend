import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Is listing a property on EaseMySpace free?",
    answer:
      "Yes! Listing your property is completely free with no hidden charges.",
      button: {
      text: "Add Property",
      link: "/add-property",
    },
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
      button: {
      text: "Add Property",
      link: "/add-property",
    },
  },
  {
    question: "Is there any commission or service fee?",
    answer:
      "No commission. Subscribe a plan fee for Starter, Premium or Ultimate plans covering property visits, video tours, relocation help, and priority listings.",
    button: {
      text: "Explore Plans",
      link: "/subscription",
    },
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full py-10 bg-white"
      aria-label="Frequently Asked Questions about EaseMySpace"
      role="region"
    >
      <div className="max-w-7xl lg:px-10 px-3 mx-auto">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg sm:text-3xl mb-5 text-left"
        >
          Got Questions? We’ve Got Answers.
        </h2>

        <div className="space-y-1 divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <h3>
                <button
                  className="w-full flex justify-between items-center py-4 text-left"
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
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
              </h3>

              <div
                id={`faq-answer-${idx}`}
                className={`text-sm text-zinc-600 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                <p>{faq.answer}</p>
                {faq.button && openIndex === idx && (
                  <Link
                    to={faq.button.link}
                    className="mt-2 text-xs hover:underline sm:text-sm text-blue-600 rounded-md transition"
                  >
                    {faq.button.text} {">"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
