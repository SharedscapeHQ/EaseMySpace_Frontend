import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hero_vid from "/heroImg/Hero_vid.mp4";
import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import PosterImg from "/heroImg/Poster.jpg";
import "./Hero.css";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch((err) => {
          console.log("Autoplay blocked:", err);
        });
      }
    };

    playVideo();
    window.addEventListener("touchstart", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });

    return () => {
      window.removeEventListener("touchstart", playVideo);
      window.removeEventListener("click", playVideo);
    };
  }, []);

  const propertyTypes = [
    {
      title: "Paying Guest",
      value: "pg",
      icon: <img src={pgImg} alt="Paying Guest" className="w-[55px] sm:w-10 md:w-20" />,
      bg: "bg-blue-100/50",
      hover: "hover:bg-blue-100",
    },
    {
      title: "Shared Flat",
      value: "flatmate",
      icon: <img src={sharedImg} alt="Shared Flat" className="w-[55px] sm:w-10 md:w-20" />,
      bg: "bg-green-100/50",
      hover: "hover:bg-green-100",
    },
    {
      title: "Fully Vacant",
      value: "vacant",
      icon: <img src={vacantImg} alt="Fully Vacant" className="w-[55px] sm:w-10 md:w-20" />,
      bg: "bg-purple-100/50",
      hover: "hover:bg-purple-100",
    },
  ];

  return (
    <section
      className="w-full bg-white pt-5 px-6 min-h-[calc(100vh-5rem)] flex items-center"
      style={{ fontFamily: "para_font" }}
      aria-label="Hero section with search and video"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1
            className="text-2xl sm:text-4xl lg:text-5xl text-zinc-800 mb-6 lg:mb-10 leading-tight"
            style={{ fontFamily: "heading_font" }}
          >
            Find Your Ideal <span className="underline-animate">Flat</span>,{" "}
            <span className="underline-animate">PGs</span>, or{" "}
            <span className="underline-animate">Roommate</span> in Mumbai
          </h1>

          <p className="text-xs lg:text-sm text-zinc-600 mb-6 lg:mb-10">
            Explore verified listings — Simple, secure, and smart urban housing.
          </p>

          <nav
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible px-1"
            aria-label="Property Type Navigation"
          >
            {propertyTypes.map((item) => (
              <Link
                key={item.value}
                to={`/view-properties?looking_for=${item.value}`}
                className={`group border border-zinc-200 bg-white transition-all rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg flex flex-col items-center gap-3 ${item.hover}`}
                aria-label={`Browse ${item.title} listings`}
              >
                <div className="text-xs text-center lg:text-base text-zinc-600 group-hover:text-blue-600 tracking-tight" style={{ fontFamily: "heading_font" }}>
                  {item.title}
                </div>
                <div className={`w-16 h-10 sm:w-14 sm:h-14 md:w-24 md:h-24 flex items-center justify-center rounded-full ${item.bg}`}>
                  {item.icon}
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-6 text-center">
            <Link
              to="/view-properties"
              className="hidden lg:inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
              aria-label="View all available properties"
            >
              View All Properties
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
            aria-label="Promotional video showcasing properties"
          />
        </div>
      </div>
    </section>
  );
}
