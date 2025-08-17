import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import Hero_vid from "/heroImg/Hero_vid.webm";
import Poster from "/heroImg/Poster.jpg";

export default function HeroDesktop() {
  const videoRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
  // Play video
  const playVideo = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch((err) => console.log("Autoplay blocked:", err));
    }
  };
  playVideo();
  window.addEventListener("touchstart", playVideo, { once: true });
  window.addEventListener("click", playVideo, { once: true });

  // Heading animation
  const heading = headingRef.current;
  const span = heading.querySelector("span");
  gsap.fromTo(
    span,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );

  // Cards animation (page load)
  gsap.fromTo(
    cardsRef.current,
    { y: 40, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.15,
      delay: 0.3,
    }
  );

  // Button animation
  gsap.fromTo(
    buttonRef.current,
    { y: 30, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.9,
    }
  );


  cardsRef.current.forEach((card) => {
    if (!card) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(card, { y: -10, scale: 1.03, duration: 0.3, ease: "power2.out" });

    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());
  });

  return () => {
    window.removeEventListener("touchstart", playVideo);
    window.removeEventListener("click", playVideo);
  };
}, []);


  const cards = [
    { title: "PGs", value: "pg", img: pgImg, bg: "bg-blue-200/60", hover: "hover:bg-blue-100" },
    { title: "Flatmate", value: "flatmate", img: sharedImg, bg: "bg-green-200/60", hover: "hover:bg-green-100" },
    { title: "Flat", value: "vacant", img: vacantImg, bg: "bg-purple-200/60", hover: "hover:bg-purple-100" },
  ];

  return (
    <section
      className="hidden lg:block w-full bg-white px-6"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center h-full">
        {/* Left */}
        <div>
          <h1
            ref={headingRef}
            style={{ fontFamily: "heading_font" }}
            className="text-3xl sm:text-5xl text-zinc-800 mb-10 overflow-hidden"
          >
            <span
              className="inline-block"
              style={{
                paddingLeft: "calc((100% - (3 * 160px + 2 * 1.5rem)) / 2)",
              }}
            >
              Find your next home with ease
            </span>
          </h1>

          <div className="flex gap-6 justify-center mb-8">
  {cards.map((item, idx) => (
    <Link
      key={item.value}
      to={`/view-properties?looking_for=${item.value}`}
      ref={(el) => (cardsRef.current[idx] = el)}
      className="group relative border-2 border-zinc-200 px-10 rounded-lg py-3 flex flex-col items-center justify-center gap-3 opacity-0 overflow-hidden"
    >
      {/* Hover overlay */}
      <span
        className={`absolute inset-0 ${item.bg} transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-in-out`}
      />

      <div
        className={`relative z-10 w-20 group-hover:bg-transparent h-20 flex items-center justify-center rounded-full mb-2 ${item.bg}`}
      >
        <img
          src={item.img}
          alt={item.title}
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      <span className="relative z-10 text-base font-semibold text-zinc-700 group-hover:text-blue-600">
        {item.title}
      </span>
    </Link>
  ))}
</div>


          {/* Button */}
          <div style={{ fontFamily: "para_font" }} className="text-center">
            <Link
              ref={buttonRef}
              to="/view-properties"
              className="bg-blue-600 hover:text-blue-600 hover:bg-white hover:border border-zinc-400 text-white px-6 py-2 rounded-full shadow-md transform transition-all duration-300 "
            >
              View All properties
            </Link>
          </div>
        </div>

        {/* Right Video */}
<div className="w-full overflow-hidden rounded-lg h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[70vh] 2xl:h-[90vh]">
  <video
    ref={videoRef}
    src={Hero_vid}
    poster={Poster}
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
