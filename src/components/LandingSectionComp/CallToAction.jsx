import React from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="relative md:py-24 py-10 px-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden rounded-3xl shadow-2xl mt-20 mx-4 md:mx-12 lg:mx-auto max-w-7xl">
      {/* Decorative Background Shapes */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-2xl animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to list or find your perfect space?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10">
          Join thousands using <span className="font-semibold text-white">EaseMSpace</span> to connect, rent, and live smarter.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/add-properties"
            className="bg-white text-blue-600 hover:bg-blue-100 font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
          >
            List Your Property
          </Link>
          <Link
            to="/view-properties"
            className="border border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Explore Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
