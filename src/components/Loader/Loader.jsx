import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className="loader-container bg-gradient-to-b from-white to-blue-50 flex items-center justify-center h-screen w-screen">
      <svg
        className="house-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50 100 L 100 50 L 150 100"
          className="house-part stroke-animation"
        />
        <path
          d="M 60 100 L 60 150 L 140 150 L 140 100"
          className="house-part stroke-animation"
        />
        <path
          d="M 90 150 L 90 120 L 110 120 L 110 150"
          className="house-part stroke-animation"
        />
        <text
          x="100"
          y="180"
          textAnchor="middle"
          className="house-text text-xl font-semibold"
        >
          EaseMySpace
        </text>
      </svg>
    </div>
  );
}
