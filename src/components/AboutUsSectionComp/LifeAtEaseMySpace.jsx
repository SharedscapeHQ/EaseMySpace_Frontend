import React, { useRef, useEffect } from "react";
import Arvind_vid from "/life_at_ems/Arvind.mov";
import Taniya_vid from "/life_at_ems/Taniya.mov";
import Rakesh_vid from "/life_at_ems/Rakesh.mp4";
import Yogita_vid from "/life_at_ems/Yogita.mp4";
import Arvind_thumbnail from "/life_at_ems/thumbnails/Arvind.jpg";
import Taniya_thumbnail from "/life_at_ems/thumbnails/Taniya.jpg";
import Rakesh_thumbnail from "/life_at_ems/thumbnails/Rakesh.jpg";
import Yogita_thumbnail from "/life_at_ems/thumbnails/Yogita.jpg";
import "./About.css";
import Footer from "../Footer";

const videos = [
  {
    id: 1,
    src: Rakesh_vid,
    title: "Rakesh Goswami",
    desc: "As the Founder of EaseMySpace, Rakesh envisions a workplace where ambition meets collaboration. His journey reflects the determination to build a culture of growth, innovation, and inclusivity. Through his leadership, he inspires the team to push boundaries and transform ideas into meaningful impact.",
    poster: Rakesh_thumbnail,
    bg: "bg-blue-50", // Founder → Light Blue
  },
  {
    id: 2,
    src: Yogita_vid,
    title: "Yogita Rathi",
    desc: "Handling Social Media at EaseMySpace, Yogita brings creativity and strategy together to amplify the brand’s voice. She thrives on connecting with audiences through fresh content and engaging campaigns. Her perspective shows how communication and culture shape the vibrant identity of the company.",
    poster: Yogita_thumbnail,
    bg: "bg-pink-50", // Social Media → Light Pink
  },
  {
    id: 3,
    src: Taniya_vid,
    title: "Taniya Sarkar",
    desc: "As a Business Data Analyst, Taniya blends numbers with insights to guide smarter decisions at EaseMySpace. Her analytical mindset and innovative ideas help transform raw data into actionable strategies. She showcases how curiosity and teamwork fuel continuous improvement in a dynamic workplace.",
    poster: Taniya_thumbnail,
    bg: "bg-yellow-50", // Analyst → Light Yellow
  },
  {
    id: 4,
    src: Arvind_vid,
    title: "Arvind Vishwakarma",
    desc: "Working as a Full Stack Developer, Arvind turns concepts into seamless digital experiences. His problem-solving skills and adaptability ensure that every project is both functional and user-friendly. Arvind’s role highlights how technology and creativity come together to drive the company’s vision forward.",
    poster: Arvind_thumbnail,
    bg: "bg-green-50", // Developer → Light Green
  },
];

export default function LifeAtEaseMySpace() {
  const videoRefs = useRef({});

  useEffect(() => {
    const handlePlay = (id) => {
      Object.keys(videoRefs.current).forEach((key) => {
        if (parseInt(key) !== id) {
          videoRefs.current[key].pause();
        }
      });
    };

    // attach event listeners
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video) {
        video.addEventListener("play", () => handlePlay(parseInt(id)));
      }
    });

    // cleanup
    return () => {
      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (video) {
          video.removeEventListener("play", () => handlePlay(parseInt(id)));
        }
      });
    };
  }, []);

  return (
    <>
      <section
        style={{ fontFamily: "para_font" }}
        className="lg:px-10 px-3 max-w-7xl mx-auto py-10"
      >
        {/* Heading */}
        <div className="mb-6 text-left">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-lg lg:text-3xl mb-0 text-black leading-tight"
          >
            Life at EaseMySpace
          </h2>
          <p
            className="text-sm lg:text-lg text-gray-600 mt-2 max-w-2xl"
            itemProp="description"
          >
            A Glimpse Into Our Vibrant Work Culture
          </p>
        </div>

        {/* Alternating Sections with Background */}
        <div className="space-y-10">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`flex flex-col lg:flex-row items-center gap-8 rounded-2xl p-6 ${video.bg} ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Video */}
              <div className="relative w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[450px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-black">
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    src={video.src}
                    poster={video.poster}
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
                  className="text-lg lg:text-2xl text-black mb-3"
                >
                  {video.title}
                </h3>
                <p className="text-sm lg:text-base text-gray-700">
                  {video.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
