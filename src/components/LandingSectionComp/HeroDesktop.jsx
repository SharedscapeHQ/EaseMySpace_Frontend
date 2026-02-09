import React from "react";
import { Link } from "react-router-dom";
import HeroSearchBar from "./HeroSearchBar";

import pgImg from "/landing-assets/pgImg.webp";
import sharedImg from "/landing-assets/sharedImg.webp";
import vacantImg from "/landing-assets/vacantImg.webp";

export default function HeroDesktop() {
  const cards = [
    { title: "PGs", value: "pg", img: pgImg },
    { title: "Flatmates", value: "flatmate", img: sharedImg },
    { title: "Flats", value: "vacant", img: vacantImg },
  ];

  return (
    <section className="hidden bg-zinc-50 lg:block w-full bg-white dark:bg-zinc-900 px-6 py-7">
      <div className="max-w-6xl mx-auto text-center">

        {/* <h1
          className="text-4xl lg:text-5xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6"
          style={{ fontFamily: "para_font" }}
        >
          Find your next home, without the hassle
        </h1> */}

        {/* ✅ Search Bar */}

        {/* Property Types */}
        <div className="grid grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
          {cards.map((item) => (
            <Link
              key={item.value}
              to={`/view-properties?looking_for=${item.value}`}
              className="group flex flex-col items-center gap-3 hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50/70 dark:bg-zinc-700/50 flex items-center justify-center group-hover:scale-110 transition">
                <img
  src={item.img}
  alt={item.title}
  className="w-9 h-9 object-contain"
/>

              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
        <HeroSearchBar />


        {/* CTAs */}
        <div className="flex justify-center gap-4">
          <Link
            to="/view-properties"
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            View Properties
          </Link>

          <Link
            to="/add-properties"
            className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
          >
            Add Property <span className="text-green-600">Free</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
