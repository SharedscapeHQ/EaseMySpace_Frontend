import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "Is listing a property on EaseMySpace™ free?",
    answer:
      "Yes! Listing your property is completely free with no hidden charges. Reach thousands of PG, flat, and flatmate seekers in Mumbai.",
    button: {
      text: "Add Property",
      link: "/add-property",
    },
  },
  {
    question: "Can I contact renters or owners directly?",
    answer:
      "Absolutely. Our in-app chat system allows secure and direct communication with PG, flat, and flatmate seekers in Mumbai.",
  },
  {
    question: "How do I verify my property?",
    answer:
      "After submission, our team reviews and verifies the listing within 24–48 hours, ensuring trusted and verified PGs and flats.",
    button: {
      text: "Add Property",
      link: "/add-property",
    },
  },
  {
    question: "Is there any commission or service fee?",
    answer:
      "No commission. Subscribe to Trial or Ultimate plans covering property visits, video tours, relocation help, and priority listings for PGs and flats.",
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
      style={{ fontFamily: "universal_font" }}
      className="w-full py-10 bg-white dark:bg-zinc-900 dark:text-white"
      aria-label="Frequently Asked Questions about EaseMySpace™"
      role="region"
    >
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": ${JSON.stringify(
              faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              }))
            )}
          }
        `}</script>
      </Helmet>

      <div className="max-w-7xl lg:px-10 px-3 mx-auto">
       <h2
          style={{ fontFamily: "para_font" }}
          className="text-lg sm:text-3xl mb-5 text-left"
        >
  FAQs on PGs, Flats & Flatmates in Mumbai
</h2>


        <dl className="space-y-1 divide-y divide-zinc-200">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <dt>
                <button
                  className="w-full flex justify-between items-center py-4 text-left"
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-sm lg:text-lg font-medium text-zinc-900 dark:text-white">
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
              </dt>

              <dd
                id={`faq-answer-${idx}`}
                className={`text-sm text-zinc-600 dark:text-zinc-200 transition-all duration-300 ease-in-out overflow-hidden ${
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
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
