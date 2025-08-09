import React from "react";
import { FaBullseye, FaUsers, FaEye } from "react-icons/fa";

export default function AboutHighlights() {
  const highlights = [
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      description:
        "At EaseMySpace, we believe a great life begins with a great space. Our mission is to help people find the perfect place and the right people to share it with, making every city feel like home.",
      list: null,
    },
    {
      icon: <FaUsers />,
      title: "Why Choose Us?",
      list: [
        "Authentic Listings",
        "24/7 Customer Assistance",
        "Seamless Service",
      ],
      description: null,
    },
    {
      icon: <FaEye />,
      title: "Our Vision",
      description:
        "To become Mumbai’s most trusted flat-sharing platform, ensuring a secure and reliable housing experience for all.",
      list: null,
    },
  ];

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="bg-white py-24 px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto mb-10">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black leading-tight"
        >
          What Drives Us
        </h2>
        <p className="text-xs lg:text-base mb-5">
          We’re here to redefine urban living — transparent, trusted, and
          tailored to you.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-xl">{item.icon}</div>
              <h3 className="font-bold text-zinc-900 text-base sm:text-lg ">{item.title}</h3>
            </div>

            {item.description && (
              <p className="text-xs lg:text-sm text-zinc-800 lg:leading-relaxed mt-2">
                {item.description}
              </p>
            )}

           {item.list && (
  <ul className="mt-2 space-y-1">
    {item.list.map((point, i) => (
      <li 
        key={i} 
        className="text-xs lg:text-sm text-zinc-800 lg:leading-relaxed"
      >
        {point}
      </li>
    ))}
  </ul>
)}

          </div>
        ))}
      </div>
    </section>
  );
}
