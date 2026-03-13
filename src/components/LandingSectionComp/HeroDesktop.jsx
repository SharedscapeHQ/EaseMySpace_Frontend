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

  function handleDownload() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(ua)) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.easemyspace.app";
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      window.location.href =
        "https://apps.apple.com/in/app/easemyspace/id6758399361";
    } else {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.easemyspace.app";
    }
  }

  return (
    <section className="hidden bg-zinc-50 lg:block w-full bg-white dark:bg-zinc-900 px-6 py-7">
      <div className="max-w-6xl mx-auto text-center">

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

       <div className="flex justify-center gap-4">
  <Link
  to="/view-properties"
  className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium 
  hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600
  transform hover:-translate-y-0.5 hover:scale-105 
  hover:shadow-lg
  transition-all duration-300 ease-out"
>
  View Properties
</Link>

 <button
  onClick={handleDownload}
  className="px-6 py-2 rounded-full border border-blue-600 text-blue-600 font-medium 
  hover:bg-blue-600 hover:text-white 
  transform hover:scale-105 
  hover:shadow-md
  transition-all duration-300 ease-out"
>
  Download App
</button>
</div>

      </div>
    </section>
  );
}