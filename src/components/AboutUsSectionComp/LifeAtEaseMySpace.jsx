import React, { useState, useRef } from "react";
import { FiPlay } from "react-icons/fi";

const videos = [
  {
    id: 1,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Team Outing",
    poster:
      "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
  },
  {
    id: 2,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Office Fun",
    poster:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephants_Dream_s1_proog.jpg/320px-Elephants_Dream_s1_proog.jpg",
  },
  {
    id: 3,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    title: "Hackathon Day",
    poster:
      "https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_poster.jpg",
  },
  {
    id: 4,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    title: "Celebration",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
  },
];

export default function LifeAtEaseMySpace() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  const handlePlay = (id) => {
    setPlayingVideo(id);
    videoRefs.current[id]?.play();
  };

  return (
    <section style={{fontFamily:"para_font"}} className="my-10 rounded-2xl lg:px-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8 text-left">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-lg lg:text-3xl mb-0 text-black leading-tight"
          >
            <span itemProp="headline">Life at EaseMySpace</span>
          </h2>
          <p className="text-xs lg:text-base mb-5" itemProp="description">
           A Glimpse Into Our Vibrant Work Culture
          </p>
        </div>

      {/* Video Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative rounded-2xl overflow-hidden shadow-lg"
          >
            {playingVideo === video.id ? (
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                src={video.src}
                controls
                className="w-full h-[250px] sm:h-[300px] object-cover"
              />
            ) : (
              <div className="relative">
                <img
                  src={video.poster}
                  alt={video.title}
                  className="w-full h-[250px] sm:h-[300px] object-cover"
                />
                <button
                  onClick={() => handlePlay(video.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
                >
                  <div className="bg-white text-blue-600 rounded-full p-5 shadow-lg hover:scale-110 transition transform">
                    <FiPlay size={28} />
                  </div>
                </button>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </section>
  );
}
