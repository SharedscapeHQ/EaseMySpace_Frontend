import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { gsap } from "gsap";
import pgImg from "/landing-assets/pgImg.png";
import sharedImg from "/landing-assets/sharedImg.png";
import vacantImg from "/landing-assets/vacantImg.png";
import heroImg from "/heroImg/hero.jpg";

export default function HeroMobile({ properties }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location: "" });
  const [filtered, setFiltered] = useState(properties || []);
  const [scrolled, setScrolled] = useState(false);

  const headingRef = useRef(null);
  const optionsRef = useRef([]);
  const heroRef = useRef(null);
  const searchRef = useRef(null);

  const options = [
    { title: "PGs", value: "pg", subtitle: "Paying Guest Options", img: pgImg, color:"bg-blue-100/50" },
    { title: "Flatmate", value: "flatmate", subtitle: "Find a Room Partner", img: sharedImg, color: "bg-green-100/50" },
    { title: "Flat", value: "vacant", subtitle: "Full Flats for Rent", img: vacantImg, color: "bg-purple-100/50" },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setFiltered(applyFiltersSort(properties, { ...filters, [name]: value }, ""));
  };

  const handleSearch = () => {
    const query = filters.location.trim().toLowerCase();
    if (!query) return;

    const bhkMatch = query.match(/(\d)\s*bhk/);
    if (bhkMatch) {
      navigate(`/view-properties?bhk=${bhkMatch[1]}`);
    } else {
      navigate(`/view-properties?location=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  // Heading fade-down
  gsap.fromTo(
    headingRef.current,
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
  );

  // Options staggered fade & scale
  gsap.fromTo(
    optionsRef.current,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
  );

  // Hero image fade-up
  gsap.fromTo(
    heroRef.current,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
  );

  // Search bar fade-in
  gsap.fromTo(
    searchRef.current,
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
  );
}, []);


  return (
    <section
      className="lg:hidden w-full bg-white px-4 py-6 transition-all duration-200"
      style={{ height: scrolled ? "74vh" : "100vh" }}
    >
      {/* Heading */}
      <div className="w-full text-left" ref={headingRef}>
        <h1 style={{ fontFamily: "heading_font" }} className="text-3xl sm:text-4xl text-zinc-800 mb-8">
          Find your next home with ease
        </h1>
      </div>

      {/* Options */}
      <div className="flex justify-between gap-3 mb-10">
        {options.map((item, i) => (
          <Link
            key={item.value}
            to={`/view-properties?looking_for=${item.value}`}
            className="relative flex flex-col items-center justify-center p-4 rounded-xl shadow-md border border-zinc-50 bg-white w-1/3 transition-transform"
            ref={(el) => (optionsRef.current[i] = el)}
          >
            <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center`}>
              <img src={item.img} alt={item.title} className="w-14 h-14 object-contain" />
            </div>
            <span style={{ fontFamily: "heading_font" }} className="text-sm text-zinc-700 mt-2">{item.title}</span>
            <span className="text-xs text-zinc-500 mt-1 text-center">{item.subtitle}</span>
          </Link>
        ))}
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden" ref={heroRef}>
        <img src={heroImg} alt="Hero" className="w-full h-[110%] object-cover" />
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%]" ref={searchRef}>
          <div className="relative">
            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              onKeyDown={handleKeyDown}
              placeholder="Search by location or property"
              className="w-full bg-white rounded-full py-3 pl-12 pr-4 shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


// Helper function for filtering
const applyFiltersSort = (list, f, sort) => {
  let l = [...list];
  if (f.location.trim())
    l = l.filter((p) =>
      p.location.toLowerCase().includes(f.location.toLowerCase())
    );
  if (f.gender) l = l.filter((p) => p.gender?.toLowerCase() === f.gender);
  if (f.occupancy)
    l = l.filter((p) => p.occupancy?.toLowerCase() === f.occupancy);
  if (f.bhk) {
    const want = parseFloat(f.bhk);
    l = l.filter((p) => {
      const val = bhkNumber(p.bhk_type);
      if (val === null) return false;
      return want === 4 ? val >= 4 : Math.abs(val - want) < 0.01;
    });
  }
  if (f.looking_for) l = l.filter((p) => p.looking_for === f.looking_for);
  const min = parseInt(f.minPrice, 10);
  const max = parseInt(f.maxPrice, 10);
  if (!isNaN(min)) l = l.filter((p) => p.price >= min);
  if (!isNaN(max)) l = l.filter((p) => p.price <= max);
  if (sort === "price_asc") l.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") l.sort((a, b) => b.price - a.price);
  return l;
};

// Dummy helper (you can replace with your actual bhkNumber logic)
const bhkNumber = (bhk) => {
  const val = parseFloat(bhk);
  return isNaN(val) ? null : val;
};
