import React, { useRef, useState, useEffect } from "react";
import { FiPlay } from "react-icons/fi";

const videos = [
  {
    id: 1,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Team Outing",
    poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
  },
  {
    id: 2,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Office Fun",
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephants_Dream_s1_proog.jpg/320px-Elephants_Dream_s1_proog.jpg",
  },
  {
    id: 3,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    title: "Hackathon Day",
    poster: "https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_poster.jpg",
  },
  {
    id: 4,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    title: "Celebration",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
  },
];

export default function CustomerVidReview() {
  const videoRefs = useRef([]);
  const [active, setActive] = useState(null);

  // Whenever active changes, play the corresponding video
  useEffect(() => {
    if (active !== null && videoRefs.current[active]) {
      videoRefs.current[active].play();
    }
  }, [active]);

  const handlePlay = (index) => {
    // pause the previous one
    if (active !== null && videoRefs.current[active]) {
      videoRefs.current[active].pause();
    }
    setActive(index);
  };

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full py-10 bg-white"
      aria-label="Life at EaseMySpace"
    >
      <div className="max-w-7xl mx-auto px-3 lg:px-10 relative">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-xl sm:text-3xl mb-8 font-bold text-left"
        >
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="relative rounded-lg overflow-hidden shadow-md group"
            >
              {active === index ? (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={video.src}
                  poster={video.poster}
                  className="w-full h-48 md:h-40 lg:h-48 object-cover"
                  controls
                />
              ) : (
                <div className="relative">
                  <img
                    src={video.poster}
                    alt={video.title}
                    className="w-full h-48 md:h-40 lg:h-48 object-cover"
                  />
                  <button
                    onClick={() => handlePlay(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
                  >
                    <div className="bg-white text-blue-600 rounded-full p-4 shadow-lg hover:scale-110 transition">
                      <FiPlay size={24} />
                    </div>
                  </button>
                </div>
              )}
              <div className="p-2 text-center">
                <h3 className="text-sm sm:text-base font-medium text-gray-700">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
