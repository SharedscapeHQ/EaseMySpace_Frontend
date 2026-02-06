import { useState, useEffect } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiVolumeX,
  FiVolume2,
} from "react-icons/fi";

export function ReelModal({ reel, prevReel, nextReel, onClose, onPrev, onNext }) {
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
          className="text-white bg-black p-3 rounded-full hover:bg-white/20 transition-all"
        >
          <FiX size={24} />
        </button>
      </div>

      {displayReels.prev && (
        <button
          onClick={() => handleNav("prev")}
          disabled={isAnimating}
          className={`absolute left-10 z-[100] text-white bg-black hover:bg-white/20 p-4 rounded-full transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <FiChevronLeft size={30} />
        </button>
      )}

      {displayReels.next && (
        <button
          onClick={() => handleNav("next")}
          disabled={isAnimating}
          className={`absolute right-10 z-[100] text-white bg-black hover:bg-white/20 p-4 rounded-full transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <FiChevronRight size={30} />
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
            className={`shrink-0 rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-500 ${
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
          <div
            style={{
              width: CARD_WIDTH,
              height: "85vh",
              marginRight: GAP,
            }}
            className="shrink-0 opacity-0 pointer-events-none"
          />
        )}

        <div
          className={`relative shrink-0 rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-500 ${
            direction === 0 ? "scale-100" : "scale-75"
          }`}
          style={{ width: CARD_WIDTH, height: "85vh" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted(!muted);
            }}
            className="absolute top-4 right-4 z-[60] p-3 bg-black hover:bg-white/20 text-white rounded-full backdrop-blur-md  transition-colors"
          >
            {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
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
            className={`shrink-0 rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-500 ${
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
          <div
            style={{
              width: CARD_WIDTH,
              height: "85vh",
              marginLeft: GAP,
            }}
            className="shrink-0 opacity-0 pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
