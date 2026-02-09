import React, { useState } from "react";
import { ReelModal } from "./ReelModal";
import { ReelCard } from "./ReelCard";
import Instareels1 from "/Insta-reels/Rapid_Fire_Clip1.mp4";
import Instareels2 from "/Insta-reels/Rapid_Fire_Clip2.mp4";
import Instareels3 from "/Insta-reels/Rapid_Fire_Clip3.mp4";
import Woman_broker_issue1 from "/Insta-reels/Women_Broker_Issue_Clip1.mp4";
import Woman_broker_issue2 from "/Insta-reels/Women_Broker_Issue_Clip2.mp4";
import QA_CLip1 from "/Insta-reels/Q&A_Clip1.mp4";

const reels = [
  {
    id: 1,
    src: Instareels1,
    title: "Listing vs Reality",
  },
  {
    id: 2,
    src: Instareels2,
    title: "Every Renter’s Nightmare ",
  },
  {
    id: 3,
    src: Instareels3,
    title: "Smart Budget, Easy Flat Hunt",
  },
  {
    id: 4,
    src: Woman_broker_issue1,
    title: "Flat Visit or Money Trap?",
  },
  {
    id: 5,
    src: Woman_broker_issue2,
    title: "Rude Broker Experience",
  },
  {
    id: 6,
    src: QA_CLip1,
    title: "Mumbai Home Hunt Struggles",
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
      <section className="w-full py-10 pt-20">
        <div className="max-w-7xl lg:px-10 px-3 mx-auto">
          <div className="mb-6">
            <h2
              style={{ fontFamily: "para_font" }}
              className="text-lg sm:text-3xl mb-5 text-left"
            >
              Real Renting Stories
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
