import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import Hero_vid from "/heroImg/Hero_vid.webm";
import PosterImg from "/heroImg/Poster.jpg";
import "./Hero.css";

export default function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search) qs.append("location", search);
    navigate(`/view-properties?${qs.toString()}`);
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch((err) => {
          // Safari may still block it, so you could handle fallback here
          console.log("Autoplay blocked:", err);
        });
      }
    };

    // Try autoplay on mount
    playVideo();

    // Try again after user taps anywhere
    window.addEventListener("touchstart", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });

    return () => {
      window.removeEventListener("touchstart", playVideo);
      window.removeEventListener("click", playVideo);
    };
  }, []);

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full bg-white lg:pt-5 px-6 overflow-hidden"
    >
      <div className="max-w-7xl py-0 mx-auto mt-3 lg:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1
            style={{ fontFamily: "heading_font" }}
            className="text-2xl hidden lg:block sm:text-4xl lg:text-5xl text-zinc-800 mb-2 lg:mb-10 leading-tight"
          >
            Find Your Ideal <span className="underline-animate">Flat</span>,{" "}
            <span className="underline-animate">PGs</span>, or{" "}
            <span className="underline-animate">Roommate</span> in Mumbai
          </h1>
          {/* <p
            style={{ fontFamily: "para_font" }}
            className="text-xs lg:text-sm text-zinc-600 mb-6 lg:mb-10"
          >
            Explore verified listings : Simple, secure, and smart urban housing.
          </p> */}

          <div className="flex gap-2 px-1 justify-between lg:justify-center lg:gap-6">
  {[
    {
      title: "PGs",
      value: "pg",
      icon: (
        <img
          src={pgImg}
          alt="Paying Guest"
          className="w-[40px] sm:w-[36px] md:w-[48px]"
        />
      ),
      bg: "bg-blue-100/50",
      hoverBg: "hover:bg-blue-100",
    },
    {
      title: "Flatmate",
      value: "flatmate",
      icon: (
        <img
          src={sharedImg}
          alt="Shared Flat"
          className="w-[40px] sm:w-[36px] md:w-[48px]"
        />
      ),
      bg: "bg-green-100/50",
      hoverBg: "hover:bg-green-100",
    },
    {
      title: "Flat",
      value: "vacant",
      icon: (
        <img
          src={vacantImg}
          alt="Fully Vacant"
          className="w-[40px] sm:w-[36px] md:w-[48px]"
        />
      ),
      bg: "bg-purple-100/50",
      hoverBg: "hover:bg-purple-100",
    },
  ].map((item) => (
    <div
      key={item.value}
      className="w-36 aspect-square mt-2 lg:w- lg:aspect-auto" 
    >
      <Link
        to={`/view-properties?looking_for=${item.value}`}
        className={`group border-2 border-zinc-200 bg-white transition-all
        rounded-xl p-4 sm:p-6  flex flex-col items-center justify-center gap-3 w-full h-full ${item.hoverBg}`}
      >
        <div
          style={{ fontFamily: "heading_font" }}
          className="text-xs text-center lg:text-base text-zinc-700 group-hover:text-blue-600 tracking-tight"
        >
          {item.title}
        </div>
        <div
          className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ${item.bg}`}
        >
          {item.icon}
        </div>
      </Link>
    </div>
  ))}
</div>

          <div  className=" text-center">
            <Link
            
              to="/view-properties"
              className="lg:inline-block mt-7 hidden bg-blue-600 hover:bg-blue-700 text-white  px-6 py-2 rounded-full transition"
            >
              View All properties
            </Link>
          </div>
        </div>

        {/* Right Video */}
        <div className="w-full h-64 sm:h-80 lg:h-[520px] overflow-hidden rounded-xl">
          <video
            ref={videoRef}
            src={Hero_vid}
            poster={PosterImg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
