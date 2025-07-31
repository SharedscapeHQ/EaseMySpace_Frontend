import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiBedBold } from "react-icons/pi";
import { HiOutlineUserGroup, HiOutlineHomeModern } from "react-icons/hi2";
import Hero_vid from "/heroImg/Hero_vid.mp4";
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
    <section className="w-full bg-white pt-5 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1
            style={{ fontFamily: "heading_font" }}
            className="text-xl sm:text-4xl lg:text-5xl text-zinc-800 mb-6 lg:mb-10 leading-tight"
          >
            Find Your Ideal <span className="underline-animate">Flat</span>,{" "}
            <span className="underline-animate">PGs</span>, or{" "}
            <span className="underline-animate">Roommate</span> in Mumbai
          </h1>
          <p
            style={{ fontFamily: "para_font" }}
            className="text-xs lg:text-sm text-zinc-600 mb-5 lg:mb-10"
          >
            Explore verified listings : Simple, secure, and smart urban housing.
          </p>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible px-1">
            {[
              {
                title: "Paying Guest",
                value: "pg",
                icon: (
                  <PiBedBold className="text-2xl sm:text-3xl md:text-4xl text-blue-600" />
                ),
                bg: "bg-blue-100/50",
                hoverBg: "hover:bg-blue-100",
              },
              {
                title: "Shared Flat",
                value: "flatmate",
                icon: (
                  <HiOutlineUserGroup className="text-2xl sm:text-3xl md:text-4xl text-green-600" />
                ),
                bg: "bg-green-100/50",
                hoverBg: "hover:bg-green-100",
              },
              {
                title: "Fully Vacant",
                value: "vacant",
                icon: (
                  <HiOutlineHomeModern className="text-2xl sm:text-3xl md:text-4xl text-purple-600" />
                ),
                bg: "bg-purple-100/50",
                hoverBg: "hover:bg-purple-100",
              },
            ].map((item) => (
              <Link
                key={item.value}
                to={`/view-properties?looking_for=${item.value}`}
                className={`group border border-zinc-200 bg-white transition-all
      rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg flex flex-col items-center gap-3 ${item.hoverBg}`}
              >
                <div
                  style={{ fontFamily: "heading_font" }}
                  className="text-xs text-center lg:text-base text-zinc-600 group-hover:text-blue-600 tracking-tight"
                >
                  {item.title}
                </div>
                <div
                  className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ${item.bg}`}
                >
                  {item.icon}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/view-properties"
              className="lg:inline-block hidden bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
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
