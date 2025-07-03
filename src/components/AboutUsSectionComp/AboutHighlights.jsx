import React from "react";
import { FaBullseye, FaUsers, FaEye } from "react-icons/fa";

export default function AboutHighlights() {
  return (
    <section className="bg-white py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          What Drives Us
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We’re here to redefine urban living — transparent, trusted, and tailored to you.
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
        {/* Mission Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-blue-700 text-3xl">
              <FaBullseye />
            </div>
            <h3 className="text-2xl font-bold text-blue-700">Our Mission</h3>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            At EaseMySpace, we believe a great life begins with a great space. Our mission is to help people find the perfect place and the right people to share it with, making every city feel like home.
          </p>
        </div>

        {/* Why Choose Us Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-blue-700 text-3xl">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-bold text-blue-700">Why Choose Us?</h3>
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
            <div className="text-blue-700 text-3xl">
              <FaEye />
            </div>
            <h3 className="text-2xl font-bold text-blue-700">Our Vision</h3>
          </div>
          <p className="text-gray-700 text-base leading-relaxed">
            To become Mumbai’s most trusted flat-sharing platform, ensuring a secure and reliable housing experience for all.
          </p>
        </div>
      </div>
    </section>
  );
}
