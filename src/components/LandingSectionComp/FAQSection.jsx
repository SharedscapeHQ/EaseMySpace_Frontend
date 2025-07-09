import React, { useState } from "react";

const faqs = [
  {
    question: "Is listing a property on EaseMySpace free?",
    answer: "Yes! Listing your property is completely free with no hidden charges.",
  },
  {
    question: "Can I contact renters or owners directly?",
    answer: "Absolutely. Our in-app chat system allows secure and direct communication.",
  },
  {
    question: "How do I verify my property?",
    answer: "After submission, our team reviews and verifies the listing within 24–48 hours.",
  },
  {
    question: "Is there any commission or service fee?",
    answer: "We don’t charge commissions. Your deals are your own.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(index === openIndex ? null : index);

  return (
    <section className="relative px-6 py-28 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute w-[300px] h-[300px] bg-blue-100 rounded-full blur-[100px] opacity-30 -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-100 rounded-full blur-[120px] opacity-30 -bottom-32 -right-32"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="md:text-5xl text-3xl font-extrabold text-center text-zinc-800 mb-16 leading-tight">
          Got <span className="text-blue-500">Questions</span>? We’ve Got Answers.
        </h2>

        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group bg-white/80 border border-zinc-200 rounded-3xl shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-left cursor-pointer"
                onClick={() => toggle(idx)}
              >
                <span className="text-xl font-semibold text-zinc-800 group-hover:text-blue-600 transition-colors duration-300">
                  {faq.question}
                </span>
                <span className="text-blue-500 text-3xl transition-transform duration-300 transform group-hover:rotate-180">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>

              <div
                className={`px-8 pb-6 text-zinc-600 text-base leading-relaxed transition-all duration-300 ease-in-out ${
                  openIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
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
