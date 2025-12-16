import React, { useRef, useEffect } from "react";
import Rakesh_vid from "/life_at_ems/Rakesh.mp4";
import Rakesh_thumbnail from "/life_at_ems/thumbnails/Rakesh.jpg";

export default function MsgFromFounder() {
  const videoRef = useRef(null);

  useEffect(() => {
    const handlePlay = () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    };
    const video = videoRef.current;
    if (video) {
      video.addEventListener("play", handlePlay);
    }
    return () => {
      if (video) {
        video.removeEventListener("play", handlePlay);
      }
    };
  }, []);

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="lg:px-10  max-w-7xl mx-auto lg:pt-3 pt-7"
    >
      {/* Heading */}
      <div className="mb-6 text-left">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black pl-3 lg:pl-0 dark:text-white leading-tight"
        >
          Message from the Founder
        </h2>
        <p className="text-sm lg:text-lg text-gray-600 pl-3 lg:pl-0 dark:text-gray-300 mt-2 max-w-2xl">
          A Note of Vision, Growth & Inspiration
        </p>
      </div>

      {/* Founder Section */}
      <div
        className={`flex flex-col lg:flex-row items-center gap-8 rounded-2xl p-6 px-3 bg-blue-50 dark:bg-blue-600`}
      >
        {/* Video */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[365px] sm:max-w-[400px] lg:max-w-[450px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-black">
            <video
              ref={videoRef}
              src={Rakesh_vid}
              poster={Rakesh_thumbnail}
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2 text-left">
          <h3
            style={{ fontFamily: "heading_font" }}
            className="text-lg lg:text-2xl text-black dark:text-white mb-3"
          >
            Rakesh Goswami
          </h3>
          <p className="text-sm lg:text-base text-gray-700 text-justify dark:text-gray-300">
            As the Founder of EaseMySpace™, Rakesh envisions a workplace where
            ambition meets collaboration. His journey reflects the determination
            to build a culture of growth, innovation, and inclusivity. Through
            his leadership, he inspires the team to push boundaries and
            transform ideas into meaningful impact.
          </p>
        </div>
      </div>
    </section>
  );
}
