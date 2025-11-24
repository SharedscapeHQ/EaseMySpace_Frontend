import React, { useState, useEffect } from "react";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "60px",
          width: "50px",
          height: "50px",
          backgroundColor: "#007bff", // blue
          color: "#ffffff", // white
          border: "none",
          borderRadius: "50%",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
          transition: "background-color 0.3s ease, transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
}

export default ScrollToTopButton;
