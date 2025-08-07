import React from "react";
import { FaBullseye, FaUsers, FaEye } from "react-icons/fa";

export default function AboutHighlights() {
  return (
    <section style={{fontFamily:"para_font"}} className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto mb-10">
        <h2 style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black leading-tight">
          What Drives Us
        </h2>
        <p className=" text-gray-800 tracking-wider text-shadow">
          We’re here to redefine urban living — transparent, trusted, and tailored to you.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
        {/* Mission Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">
              <FaBullseye />
            </div>
            <h3 className="text-2xl font-bold ">Our Mission</h3>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            At EaseMySpace, we believe a great life begins with a great space. Our mission is to help people find the perfect place and the right people to share it with, making every city feel like home.
          </p>
        </div>

        {/* Why Choose Us Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-bold ">Why Choose Us?</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li><strong>Authentic Listings</strong></li>
            <li><strong>24/7 Customer Assistance</strong></li>
            <li><strong>Seamless Service</strong></li>
          </ul>
        </div>

        {/* Vision Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">
              <FaEye />
            </div>
            <h3 className="text-2xl font-bold">Our Vision</h3>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            To become Mumbai’s most trusted flat-sharing platform, ensuring a secure and reliable housing experience for all.
          </p>
        </div>
      </div>
    </section>
  );
}
