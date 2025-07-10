import React from "react";
import { FaUserPlus, FaPlusCircle, FaComments } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={32} />,
    title: "Sign Up",
    description:
      "Create your account quickly and securely to access all features.",
  },
  {
    icon: <FaPlusCircle size={32} />,
    title: "Add or Browse Properties",
    description:
      "List your property with ease or explore available rentals in your area.",
  },
  {
    icon: <FaComments size={32} />,
    title: "Connect & Rent",
    description:
      "Chat safely with owners or renters and close deals with confidence.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className=" bg-blue-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <svg
        className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad1)" />
      </svg>

      <svg
        className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/2 translate-y-1/2 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad2)" />
      </svg>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <h1 className="md:text-5xl text-3xl font-extrabold text-zinc-900 mb-20 text-center max-w-3xl mx-auto leading-tight">
          How <span className="text-blue-600">EaseMySpace</span> Works
        </h1>

        <div className="space-y-16">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-center gap-10 md:gap-20 transform hover:scale-[1.03] transition-transform duration-300 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Background Step Number */}
                <span
                  aria-hidden="true"
                  className={`absolute select-none font-extrabold text-[12rem] md:text-[10rem] leading-none tracking-tight whitespace-nowrap opacity-25 pointer-events-none ${
                    isEven ? "text-blue-300" : "text-pink-300"
                  } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10`}
                >
                  0{idx + 1}
                </span>

                {/* Icon Circle with Animated Gradient Ring */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center bg-white shadow-lg text-white text-5xl cursor-default ${
                      isEven ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-pink-500 to-purple-600"
                    }`}
                  >
                    <div
                      className="relative w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center"
                      style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.1))" }}
                    >
                      {step.icon}
                    </div>

                  </div>
                  {/* Animated ring */}
                  <span
                    className={`absolute -inset-1 rounded-full ${
                      isEven
                        ? "animate-spin-slow border-4 border-t-blue-400 border-r-transparent border-b-blue-400 border-l-transparent"
                        : "animate-spin-slow border-4 border-t-pink-400 border-r-transparent border-b-pink-400 border-l-transparent"
                    }`}
                    style={{ animationDuration: "6s" }}
                  ></span>
                </div>

                {/* Text content */}
                <div className="max-w-xl text-center md:text-left">
                  <h2 className="text-3xl font-semibold text-zinc-900 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-zinc-700 leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
