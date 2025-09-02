import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaBed, FaUsers, FaMapMarkerAlt, FaRupeeSign, FaBuilding } from "react-icons/fa";
import Footer from "../components/Footer";

export default function BlogPage() {
  const categories = [
    {
      title: "PGs in Mumbai",
      description:
        "Verified and affordable PGs across Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Options for male, female, and co-living rooms including 1BHK, 1.5BHK, 2BHK, 2.5BHK. Ideal for students and working professionals.",
      icon: <FaBuilding className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=pg",
    },
    {
      title: "Flatmates & Shared Rooms",
      description:
        "Connect with verified flatmates in Goregaon, Andheri, Powai, Chandivali, Dadar, and other prime locations. Budget-friendly shared rooms for 1BHK, 1.5BHK, 2BHK, 2.5BHK apartments. Male, female, and co-living options available.",
      icon: <FaUsers className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=flatmate",
    },
    {
      title: "Vacant Flats & Rentals",
      description:
        "Rental flats including 1BHK, 1.5BHK, 2BHK, 2.5BHK in Mumbai’s top neighborhoods like Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Affordable, budget-friendly options for students and professionals.",
      icon: <FaBed className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=vacant",
    },
  ];

  const featureIcons = [
    { icon: <FaBed />, text: "1BHK, 1.5BHK, 2BHK, 2.5BHK" },
    { icon: <FaUsers />, text: "Male, Female, Co-living" },
    { icon: <FaMapMarkerAlt />, text: "Andheri, Goregaon, Powai, Chandivali, Thane, Dadar" },
    { icon: <FaRupeeSign />, text: "Affordable & Budget-Friendly" },
  ];

  return (
    <>
      <Helmet>
        <title>EaseMySpace – PGs, Flats, Flatmates & Rentals in Mumbai</title>
        <meta
          name="description"
          content="Explore verified PGs, flatmates, and rental flats in Mumbai including Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Affordable 1BHK, 1.5BHK, 2BHK, 2.5BHK and shared living options for students and professionals."
        />
        <meta
          name="keywords"
          content="PG Mumbai, flatmates Mumbai, rental flats Mumbai, 1BHK Mumbai, 1.5BHK Mumbai, 2BHK Mumbai, 2.5BHK Mumbai, affordable rooms Mumbai, shared apartments Mumbai, male female PG Mumbai, budget flats Mumbai, rooms Andheri, rooms Goregaon, rooms Powai, rooms Chandivali"
        />
        <link rel="canonical" href="https://easemyspace.in/blog" />
      </Helmet>

      <section className="max-w-7xl mx-auto px-4 lg:py-12 py-6">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-8 text-center text-zinc-800"
          style={{ fontFamily: "heading_font" }}
        >
          Explore PGs, Flats & Flatmates in Mumbai
        </h1>
        <p
          className="text-zinc-700 text-center mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "para_font" }}
        >
          Discover verified PGs, rental flats, and flatmates across Mumbai including Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Affordable 1BHK, 1.5BHK, 2BHK, 2.5BHK rooms, budget-friendly options, and hassle-free shared living for students and working professionals.
        </p>

        {/* Features Icons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {featureIcons.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="text-blue-600 text-2xl">{feature.icon}</div>
              <span className="text-zinc-700 text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.url}
              className="relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 group bg-gradient-to-br from-blue-50 to-white p-6"
            >
              <div className="flex justify-center mb-4">{cat.icon}</div>
              <h2 className="text-xl font-bold mb-2 text-zinc-800 text-center">{cat.title}</h2>
              <p className="text-zinc-600 text-sm mb-4 text-center">{cat.description}</p>
              <div className="flex justify-center">
                <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition">
                  Explore Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer/>
    </>
  );
}
