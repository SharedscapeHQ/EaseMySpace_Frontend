import { useState, useEffect } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiVolumeX,
  FiVolume2,
} from "react-icons/fi";

export function ReelModal({
  reel,
  prevReel,
  nextReel,
  onClose,
  onPrev,
  onNext,
}) {
  const [muted, setMuted] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [displayReels, setDisplayReels] = useState({
    curr: reel,
    prev: prevReel,
    next: nextReel,
  });

  useEffect(() => {
    if (!isAnimating) {
      setDisplayReels({ curr: reel, prev: prevReel, next: nextReel });
    }
  }, [reel.id, isAnimating, prevReel, nextReel]);

  const CARD_WIDTH = 420;
  const GAP = 10;
  const TOTAL_MOVE = CARD_WIDTH + GAP;

  const handleNav = (dir) => {
    if (isAnimating) return;
    if (dir === "next" && !displayReels.next) return;
    if (dir === "prev" && !displayReels.prev) return;

    setIsAnimating(true);
    setDirection(dir === "next" ? -1 : 1);

    setTimeout(() => {
      dir === "next" ? onNext() : onPrev();
    }, 500);
  };

  useEffect(() => {
    if (isAnimating && reel.id !== displayReels.curr.id) {
      setDirection(0);
      setDisplayReels({ curr: reel, prev: prevReel, next: nextReel });

      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }
  }, [reel, isAnimating, displayReels.curr.id, prevReel, nextReel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/85 ">
      <div className="absolute top-6 right-6 z-[100]">
        <button
          onClick={onClose}
          className="
    text-black bg-white rounded-full transition-all
    p-2 md:p-3
    hover:bg-transparent md:hover:bg-white/80
  "
        >
          <FiX className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      </div>

      {displayReels.prev && (
        <button
          onClick={() => handleNav("prev")}
          disabled={isAnimating}
          className={`
    absolute z-[100] text-black bg-white rounded-full transition-opacity duration-300
    left-4 md:left-10
    p-2 md:p-4
    hover:bg-transparent md:hover:bg-white/80
    ${isAnimating ? "opacity-0" : "opacity-100"}
  `}
        >
          <FiChevronLeft className="w-4 h-4 md:w-[30px] md:h-[30px]" />
        </button>
      )}

      {displayReels.next && (
        <button
          onClick={() => handleNav("next")}
          disabled={isAnimating}
          className={`
    absolute z-[100] text-black bg-white rounded-full transition-opacity duration-300
    right-4 md:right-10
    p-2 md:p-4
    hover:bg-transparent md:hover:bg-white/80
    ${isAnimating ? "opacity-0" : "opacity-100"}
  `}
        >
          <FiChevronRight className="w-4 h-4 md:w-[30px] md:h-[30px]" />
        </button>
      )}

      <div
        className={`flex items-center justify-center ${
          direction !== 0 ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(${direction * TOTAL_MOVE}px)` }}
      >
        {displayReels.prev ? (
          <div
            className={`hidden md:block shrink-0 rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-500 ${
              direction === 1 ? "scale-100" : "scale-75"
            }`}
            style={{
              width: CARD_WIDTH,
              height: "85vh",
              marginRight: GAP,
            }}
          >
            <video
              src={displayReels.prev.src}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          </div>
        ) : (
          <div className="shrink-0 opacity-0 pointer-events-none w-0 md:w-[420px] md:h-[85vh] md:ml-[10px]" />
        )}

        <div
          className={`relative shrink-0 rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-500 ${
            direction === 0 ? "scale-100" : "scale-75"
          }
  w-[75vw] h-[65vh] md:w-[420px] md:h-[85vh]`}
        >
         <button
  onClick={(e) => {
    e.stopPropagation();
    setMuted(!muted);
  }}
  className={`
    absolute z-[60] text-black bg-white rounded-full backdrop-blur-md transition-colors
    top-3 right-3 md:top-4 md:right-4
    p-2 md:p-3
    hover:bg-transparent md:hover:bg-white/80
  `}
>
  {muted ? (
    <FiVolumeX className="w-4 h-4 md:w-5 md:h-5" />
  ) : (
    <FiVolume2 className="w-4 h-4 md:w-5 md:h-5" />
  )}
</button>


          <video
            key={displayReels.curr.id}
            src={displayReels.curr.src}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
          />
        </div>

        {displayReels.next ? (
          <div
            className={`hidden md:block shrink-0 rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-500 ${
              direction === -1 ? "scale-100" : "scale-75"
            }`}
            style={{
              width: CARD_WIDTH,
              height: "85vh",
              marginLeft: GAP,
            }}
          >
            <video
              src={displayReels.next.src}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          </div>
        ) : (
          <div className="shrink-0 opacity-0 pointer-events-none w-0 md:w-[420px] md:h-[85vh] md:mr-[10px]" />
        )}
      </div>
    </div>
  );
}
