import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import Hero_vid from "/heroImg/Hero_vid.webm";
import Poster from "/heroImg/Poster.jpg";
import FunnyQuotes from "./FunnyQuotes";

export default function HeroDesktop() {
  const videoRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const buttonRef = useRef(null);
  const flipButtonRef = useRef(null);

  useEffect(() => {
    // Try playing video (fix autoplay on mobile)
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
    if (heading) {
      const span = heading.querySelector("span");
      gsap.fromTo(
        span,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );
    }

    // Cards animation
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

    // Buttons animation
    [buttonRef.current, flipButtonRef.current].forEach((btn, i) => {
      if (btn) {
        gsap.fromTo(
          btn,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.9 + i * 0.1,
          }
        );
      }
    });

    // Hover animation for cards
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const tl = gsap.timeline({ paused: true });
      tl.to(card, {
        yPercent: -10,
        scale: 1.03,
        duration: 0.3,
        ease: "power2.out",
      });
      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });

    return () => {
      window.removeEventListener("touchstart", playVideo);
      window.removeEventListener("click", playVideo);
    };
  }, []);

  const cards = [
    { title: "PGs", value: "pg", img: pgImg, bg: "bg-blue-200/60" },
    { title: "Flatmate", value: "flatmate", img: sharedImg, bg: "bg-green-200/60" },
    { title: "Flat", value: "vacant", img: vacantImg, bg: "bg-purple-200/60" },
  ];

  return (
    <>

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
        className="text-3xl lg:text-5xl text-zinc-800 mb-14 overflow-hidden"
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

      {/* 🔑 SEO hidden intro (for crawlers, not visible to users) */}
      <p className="sr-only">
        EaseMySpace helps you find affordable PGs, flatmates, and rental flats
        across India. Browse shared accommodations, paying guest housing, and
        vacant apartments near you.
      </p>

      {/* Property Cards */}
      <div className="flex gap-6 justify-center mb-12">
        {cards.map((item, idx) => (
          <Link
            key={item.value}
            to={`/view-properties?looking_for=${item.value}`}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="group relative border-2 border-zinc-200 px-10 rounded-lg py-3 flex flex-col items-center justify-center gap-3 opacity-0 overflow-hidden"
            aria-label={`Explore ${item.title} rental properties, PGs and shared flats`}
          >
            {/* Hover overlay */}
            <span
              className={`absolute inset-0 ${item.bg} transform scale-y-0 group-hover:scale-y-100  origin-bottom transition-transform duration-300 ease-in-out`}
            />
            <div
              className={`relative z-10 w-20 h-20 flex items-center justify-center rounded-full mb-2 ${item.bg} group-hover:bg-transparent`}
            >
              <img
                src={item.img}
                alt={`Find ${item.title} listings, shared accommodations, and rental options`}
                className="max-w-[80%] max-h-[80%] object-contain"
                loading="lazy"
              />
            </div>
            <span className="relative z-10 text-base font-semibold text-zinc-700 group-hover:text-blue-600">
              {item.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{ fontFamily: "para_font" }}
        className="text-center flex gap-4 justify-center"
      >
        {/* View All */}
        <Link
          ref={buttonRef}
          to="/view-properties"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-blue-600 px-6 py-2 text-white transition-colors duration-300"
          aria-label="View all PG, flatmate and rental flat listings on EaseMySpace"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-600">
            View All Properties
          </span>
          <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
        </Link>

        {/* Add Property */}
        <Link
          ref={flipButtonRef}
          to="/add-properties"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-blue-600 bg-white px-6 py-2 text-blue-600 transition-colors duration-300"
          aria-label="Add your PG, shared flat or rental property listing for free"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Add Property{" "}
            <span className="text-green-700 group-hover:text-green-300">
              Free
            </span>
          </span>
          <span className="absolute left-0 top-0 h-full w-0 bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full" />
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
        aria-label="Video showcasing PGs, flatmates and rental flats available on EaseMySpace"
      />
      {/* Hidden video description */}
      <p className="sr-only">
        Watch how EaseMySpace makes it simple to find PGs, flatmates and
        furnished rental flats near you.
      </p>
    </div>
  </div>
   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full px-4">
    <FunnyQuotes />
  </div>
</section>

    </>
  );
}
