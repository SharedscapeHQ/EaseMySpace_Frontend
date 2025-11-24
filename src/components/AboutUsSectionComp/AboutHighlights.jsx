import React from "react";
import { FaBullseye, FaUsers, FaEye } from "react-icons/fa";

export default function AboutHighlights() {
  const highlights = [
    {
      icon: <FaBullseye />,
      title: "Our Mission",
      description:
        "At EaseMySpace, we believe a great life begins with a great space. Our mission is to help Mumbai residents find verified shared accommodations and the right flatmates, making city living easier, safer, and more connected.",
      list: null,
    },
    {
      icon: <FaUsers />,
      title: "Why Choose Us?",
      list: [
        "Authentic and verified listings",
        "24/7 Customer Assistance for PGs and flats",
        "Seamless service for finding Mumbai shared accommodations",
      ],
      description: null,
    },
    {
      icon: <FaEye />,
      title: "Our Vision",
      description:
        "To become Mumbai’s most trusted flat-sharing platform, offering secure, broker-free experiences and helping users connect with compatible flatmates for PGs and shared flats.",
      list: null,
    },
  ];

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="bg-white dark:bg-zinc-900 py-24 lg:px-10 pb-24 px-3 max-w-7xl mx-auto"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "EaseMySpace - About Highlights",
          "url": "https://easemyspace.in/about-us",
          "description": "EaseMySpace helps Mumbai residents find verified flatmates, PGs, shared accommodations, and vacant rooms, offering a trusted and seamless rental experience.",
        })}
      </script>

      <div className="max-w-7xl mx-auto mb-10">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black dark:text-white leading-tight"
          itemProp="headline"
        >
          What Drives Us
        </h2>
        <p className="text-xs lg:text-base mb-5 dark:text-white" itemProp="description">
          We’re here to redefine urban living in Mumbai transparent, trusted,
          and tailored for PGs, verified shared accommodations, and flatmates.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto" itemProp="mainEntity">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition"
            itemScope
            itemType="https://schema.org/Thing"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-xl">{item.icon}</div>
              <h3
                className="font-bold text-zinc-900 text-base sm:text-lg"
                itemProp="name"
              >
                {item.title}
              </h3>
            </div>

            {item.description && (
              <p
                className="text-xs lg:text-sm text-zinc-800 lg:leading-relaxed mt-2"
                itemProp="description"
              >
                {item.description}
              </p>
            )}

            {item.list && (
              <ul className="mt-2 space-y-1">
                {item.list.map((point, i) => (
                  <li
                    key={i}
                    className="text-xs lg:text-sm text-zinc-800 lg:leading-relaxed"
                    itemProp="about"
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
