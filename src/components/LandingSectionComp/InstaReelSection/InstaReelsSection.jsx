import React, { useState } from "react";
import { ReelModal } from "./ReelModal";
import { ReelCard } from "./ReelCard";
import Instareels1 from "/Insta-reels/Rapid_Fire_Clip1.mp4";
import Instareels2 from "/Insta-reels/Rapid_Fire_Clip2.mp4";
import Instareels3 from "/Insta-reels/Rapid_Fire_Clip3.mp4";
import Woman_broker_issue1 from "/Insta-reels/Women_Broker_Issue_Clip1.mp4";
import Woman_broker_issue2 from "/Insta-reels/Women_Broker_Issue_Clip2.mp4";



const reels = [
  {
    id: 1,
    src: Instareels1,
    title: "Do you face issues finding flats?",
  },
  {
    id: 2,
    src: Instareels2,
    title: "Is PG hunting in Mumbai hard?",
  },
  {
    id: 3,
    src: Instareels3,
    title: "High rent & low transparency?",
  },
  {
    id: 4,
    src: Woman_broker_issue1,
    title: "Finding the right flatmate?",
  },
  {
    id: 5,
    src: Woman_broker_issue2,
    title: "What renters struggle with most",
  },
  
];


function InstaReelsSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const closeModal = () => setActiveIndex(null);
  const prevReel = () =>
    setActiveIndex((i) => (i === 0 ? reels.length - 1 : i - 1));
  const nextReel = () =>
    setActiveIndex((i) => (i === reels.length - 1 ? 0 : i + 1));

  return (
    <>
      <section className="w-full py-10">
        <div className="max-w-7xl lg:px-10 px-3 mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Unfiltered Stories from Real People
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {reels.map((reel, index) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <ReelModal
          reel={reels[activeIndex]}
          prevReel={activeIndex > 0 ? reels[activeIndex - 1] : null}
          nextReel={
            activeIndex < reels.length - 1 ? reels[activeIndex + 1] : null
          }
          onClose={closeModal}
          onPrev={prevReel}
          onNext={nextReel}
        />
      )}
    </>
  );
}

export default InstaReelsSection;
