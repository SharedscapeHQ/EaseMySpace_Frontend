import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newlyListedProperties } from "../../api/propertiesApi";
import { FiMapPin } from "react-icons/fi";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";

const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  return [];
};

export default function NewlyListedProperties() {
  const [newlyListed, setNewlyListed] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchNewlyListed() {
      setLoading(true);
      try {
        const { data } = await newlyListedProperties(); 
        const filtered = data
          .filter((p) => p.is_newly_listed && p.status === "approved")
          .sort(
            (a, b) =>
              (a.newly_listed_position || 9999) - (b.newly_listed_position || 9999)
          )
          .map((p) => ({ ...p, images: parseImages(p.image) }));
        setNewlyListed(filtered);
      } catch {}
      finally {
        setLoading(false);
      }
    }
    fetchNewlyListed();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg lg:text-3xl mb-0 text-black leading-tight"
        >
          Exclusive <span className="">Featured</span>
          <span className=" block lg:hidden">Properties</span>
          <span className=" hidden lg:inline"> Properties</span>
        </h2>

        <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-zinc-200 flex items-center justify-center rounded-t-2xl" />
              <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-zinc-200 rounded w-[60%]" />
                  <div className="h-4 bg-zinc-300 rounded w-[30%]" />
                </div>
                <div className="h-3 bg-zinc-200 rounded w-[40%] mb-2" />
                <div className="h-3 bg-zinc-300 rounded w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (newlyListed.length === 0)
    return (
      <p
        style={{ fontFamily: "para_font" }}
        className="text-center text-zinc-500 dark:text-zinc-400 mt-10"
      >
        No newly listed properties found.
      </p>
    );

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      <section
        style={{ fontFamily: "para_font" }}
        className="lg:py-10 pt-10 rounded-2xl lg:px-10 px-3 max-w-7xl mx-auto relative dark:bg-zinc-900 transition-colors duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-[16px] lg:text-3xl text-left text-black dark:text-white"
          >
            Top Sharing Rooms
          </h2>

          <div className="group inline-block relative">
  <Link
    to="/view-properties"
    className="relative text-blue-600 dark:text-blue-400 text-[13px] lg:text-base font-medium transition-all duration-300 ease-in-out hover:text-blue-700 dark:hover:text-blue-300"
    style={{ fontFamily: "para_font" }}
  >
    View All
    <span className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
  </Link>
</div>

        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            role="list"
          >
            {newlyListed.map((p) => (
              <Link
                to={`/properties/${p.id}`}
                key={p.id}
                className="min-w-[300px] max-w-[300px] group bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden shadow-md transition-colors duration-300"
              >
                <div className="relative w-full h-44">
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.title || "Property image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 italic">
                      No Image
                    </div>
                  )}
                  {p.verified && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      Verified
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-zinc-600 dark:text-zinc-300 text-sm gap-1">
                      <FiMapPin className="text-zinc-500" />
                      {p.location ? p.location.split(" ").slice(-2).join(" ") : "Unknown"}
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        p.looking_for
                          ? "bg-blue-100 text-blue-600"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {p.looking_for
                        ? p.looking_for === "flatmate"
                          ? "Flatmate"
                          : p.looking_for === "pg"
                          ? "PG"
                          : "Vacant Flat"
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex border-zinc-200 text-sm text-zinc-700 dark:text-zinc-200 py-2">
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        ₹{p.price?.toLocaleString() || "N/A"}
                      </div>
                      <div className="text-xs text-zinc-500">Rent</div>
                    </div>
                    <div className="w-[1px] bg-zinc-300"></div>
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        {p.deposit ? `₹${Number(p.deposit).toLocaleString()}` : "-"}
                      </div>
                      <div className="text-xs text-zinc-500">Deposit</div>
                    </div>
                    <div className="w-[1px] bg-zinc-300"></div>
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        {p.bhk_type || "-"}
                      </div>
                      <div className="text-xs text-zinc-500">BHK</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                        {p.title?.charAt(0) || "U"}
                      </div>
                      
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-200">
                        {p.title}
                      </span>
                      {(() => {
  if (!p.created_at) return null;

  const created = new Date(p.created_at);
  const now = new Date();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  if (diffDays > 10) return null; 

  let displayText = "";
  if (diffDays === 0) displayText = "Today";
  else if (diffDays >= 1 && diffDays <= 6) displayText = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  else displayText = "a week ago"; 

  return (
    <span className="text-blue-500 border-2 rounded-full border-blue-300 text-[9px] px-1 py-[0.5px]">
      Listed {displayText}
    </span>
  );
})()}

                    </div>
                    <div className="flex gap-3 text-blue-500">
                      <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                      <IoCall className="text-2xl cursor-pointer" />
                    </div>
                  </div>

                  <button
                    style={{ fontFamily: "heading_font" }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-md mt-2"
                  >
                    Book Visit Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
