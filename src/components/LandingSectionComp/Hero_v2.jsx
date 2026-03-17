import React from "react";
import playBadge from "/app_assets/GetItOnGooglePlay_Badge_Web_color_English.svg";
import AppleBadge from "/app_assets/AppleStoreButton.webp";
import AppHome from "/app_assets/Hero.webp";
import pgImg from "/landing-assets/pgImg.webp";
import sharedImg from "/landing-assets/sharedImg.webp";
import vacantImg from "/landing-assets/vacantImg.webp";
import redCircle from "/landing-assets/red_circle.png";
import { Link } from "react-router-dom";
import HeroSearchBar from "./HeroSearchBar";


const cards = [
  { title: "PGs", value: "pg", img: pgImg },
  { title: "Flatmates", value: "flatmate", img: sharedImg },
  { title: "Flats", value: "vacant", img: vacantImg },
];

function Hero_v2() {
  return (
   <section className="w-full min-h-[calc(100vh-120px)] flex items-start bg-white dark:bg-zinc-900 overflow-hidden">

  <div className="max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center">

    {/* LEFT SIDE */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center py-10 lg:py-20">

  {/* CONTENT WIDTH CONTROLLER */}
  <div className="max-w-[520px]">
<h1
  style={{ fontFamily: "para_font" }}
  className="text-[27px] md:text-[42px] z-10 lg:text-[50px] whitespace-nowrap lg:leading-[1.7] font-semibold text-[#0f172a] dark:text-white"
>
  Trusted shared homes
  <br />
  <span className="text-[#2664eb] mr-4">With </span>
  <div className="relative inline-block">
    {/* Red circle behind the text */}
    <img
      src={redCircle}
      alt="red circle"
      className="absolute top-1/2 left-1/2 mt-1 -translate-x-1/2 -translate-y-1/2 w-[10rem] h-[10rem] lg:w-[20rem] lg:h-[23rem] lg:scale-[1.4] scale-[1.5] pointer-events-none"
    />

    {/* Text on top of the circle */}
    <span className="relative lg:text-[45px] text-[23px] z-10 text-[#2664eb]">Zero brokerage</span>
  </div>
</h1>

    <p
      style={{ fontFamily: "universal_font" }}
      className="lg:hidden block mt-5 text-[13px] lg:text-base leading-[1.7] text-slate-600 dark:text-zinc-400"
    >
      Find verified flatmates, PGs & flats with <br /> zero brokerage.
     
    </p>
    <p
      style={{ fontFamily: "universal_font" }}
      className="lg:block hidden mt-5 text-[16px] lg:text-base leading-[1.7] text-slate-600 dark:text-zinc-400"
    >
      Find verified flatmates, PGs & flats with zero brokerage.
     
    </p>

    {/* Cards */}
    <div className="flex justify-between mt-8">
      {cards.map((item) => (
        <Link
          key={item.value}
          to={`/view-properties?looking_for=${item.value}`}
          className="group flex flex-col items-center gap-3 hover:-translate-y-1 transition"
        >
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-zinc-700 flex items-center justify-center group-hover:scale-110 transition">
            <img
              src={item.img}
              alt={item.title}
              className="w-8 h-8 object-contain"
            />
          </div>

          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {item.title}
          </span>
        </Link>
      ))}
    </div>

    {/* Search */}
    <div className="mt-8">
      <HeroSearchBar />
    </div>

    {/* Download buttons */}
    <div className="flex justify-center gap-7">
      <a target="_blank" href="https://play.google.com/store/apps/details?id=com.easemyspace.app" className="hover:opacity-80 transition">
        <img src={playBadge} alt="Google Play" className="h-10 md:h-12 w-auto lg:mt-10" />
      </a>

      <a target="_blank" href="https://apps.apple.com/in/app/easemyspace/id6758399361" className="hover:opacity-80 transition">
        <img src={AppleBadge} alt="App Store" className="h-10 md:h-12 w-auto lg:mt-10" />
      </a>
    </div>

  </div>
</div>

  {/* RIGHT SIDE IMAGE */}
<div className="w-full lg:w-1/2 float-animation lg:flex justify-end items-center overflow-visible">

  <img
    src={AppHome}
    alt="App preview"
className="w-full scale-[1.2] lg:scale-[1.6] lg:translate-x-7 object-contain pointer-events-none"
  />

</div>

  </div>
</section>
  );
}

export default Hero_v2;