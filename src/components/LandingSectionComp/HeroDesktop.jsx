import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import Hero_vid from "/heroImg/hero_vid_crop.mp4";

export default function HeroDesktop() {
  const videoRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    // Play video on interaction
    const playVideo = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch((err) => console.log("Autoplay blocked:", err));
      }
    };
    playVideo();
    window.addEventListener("touchstart", playVideo, { once: true });
    window.addEventListener("click", playVideo, { once: true });

    // Animate heading
    const heading = headingRef.current;
    const span = heading.querySelector("span");
    gsap.fromTo(
      span,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    return () => {
      window.removeEventListener("touchstart", playVideo);
      window.removeEventListener("click", playVideo);
    };
  }, []);

  const cards = [
    { title: "PGs", value: "pg", img: pgImg, bg: "bg-blue-100/50", hover: "hover:bg-blue-100" },
    { title: "Flatmate", value: "flatmate", img: sharedImg, bg: "bg-green-100/50", hover: "hover:bg-green-100" },
    { title: "Flat", value: "vacant", img: vacantImg, bg: "bg-purple-100/50", hover: "hover:bg-purple-100" },
  ];

  return (
    <section
      className="hidden lg:block w-full bg-white px-6 pt-5"
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
            {cards.map((item) => (
              <Link
                key={item.value}
                to={`/view-properties?looking_for=${item.value}`}
                className={`group border-2 border-zinc-200 px-10 rounded-lg py-3 flex flex-col items-center justify-center gap-3 ${item.hover}`}
              >
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-full mb-2 ${item.bg}`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                </div>
                <span className="text-base font-semibold text-zinc-700 group-hover:text-blue-600">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>

          <div style={{ fontFamily: "para_font" }} className="text-center">
            <Link
              to="/view-properties"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              View All properties
            </Link>
          </div>
        </div>

        {/* Right Video */}
        <div className="w-full h-[520px] overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            src={Hero_vid}
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
