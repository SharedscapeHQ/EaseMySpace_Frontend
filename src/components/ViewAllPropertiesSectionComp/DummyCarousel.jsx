import React, { useRef, useState, useEffect } from "react";

const DummyCarousel = () => {
  const images = [
    "https://picsum.photos/id/1018/600/400",
    "https://picsum.photos/id/1025/600/400",
    "https://picsum.photos/id/1037/600/400",
    "https://picsum.photos/id/1043/600/400",
    "https://picsum.photos/id/1050/600/400",
  ];

  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const isDragging = useRef(false);

  // Update container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        prevTranslate.current = -currentIndex * containerRef.current.offsetWidth;
        currentTranslate.current = prevTranslate.current;
        trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [currentIndex]);

  // Snap to current index
  useEffect(() => {
    if (!containerWidth) return;
    prevTranslate.current = -currentIndex * containerWidth;
    currentTranslate.current = prevTranslate.current;
    trackRef.current.style.transition = "transform 0.3s ease-out";
    trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
  }, [currentIndex, containerWidth]);

  // Handle touch/mouse start
  const startDrag = (x) => {
    isDragging.current = true;
    startX.current = x;
    trackRef.current.style.transition = "none";
  };

  const moveDrag = (x) => {
    if (!isDragging.current) return;
    const diff = x - startX.current;
    currentTranslate.current = prevTranslate.current + diff;
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const movedBy = currentTranslate.current - prevTranslate.current;

    if (movedBy < -50 && currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    else if (movedBy > 50 && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else {
      trackRef.current.style.transition = "transform 0.3s ease-out";
      trackRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    }
  };

  return (
 <div
  ref={containerRef}
  className="relative w-full max-w-md mx-auto mt-10 overflow-hidden"
  style={{ touchAction: "pan-x" }} 
>
  <div
    ref={trackRef}
    className="flex h-56 rounded-2xl"
    onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    onTouchMove={(e) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    }}
    onTouchEnd={endDrag}
    onMouseDown={(e) => startDrag(e.clientX)}
    onMouseMove={(e) => {
      if (!isDragging.current) return;
      moveDrag(e.clientX);
    }}
    onMouseUp={endDrag}
    onMouseLeave={endDrag}
    style={{ cursor: "grab" }}
  >
    {images.map((img, idx) => (
      <img
        key={idx}
        src={img}
        className="flex-shrink-0 w-full h-full object-cover"
        alt={`Slide ${idx + 1}`}
      />
    ))}
  </div>

  {/* Dots */}
  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
    {images.map((_, idx) => (
      <span
        key={idx}
        className={`w-2 h-2 rounded-full transition-transform ${
          idx === currentIndex ? "bg-white scale-125" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>

  );
};

export default DummyCarousel;
