import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoChatboxEllipsesOutline, IoCall } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";

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

export default function RecentAddedProperties() {
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true);
      try {
        const res = await axios.get("https://api.easemyspace.in/api/properties/all");
        const sorted = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6)
          .map((p) => ({ ...p, images: parseImages(p.image) }));
        setRecentProperties(sorted);
      } catch {
        setRecentProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  if (loading)
    return (
      <section className="py-10 mt-10 lg:px-10 px-3 max-w-7xl mx-auto">
        <h2 className="text-lg lg:text-3xl mb-0 text-black leading-tight" style={{ fontFamily: "heading_font" }}>
          Discover the Latest Properties
        </h2>
        <div className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide mt-10">
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="min-w-[270px] max-w-[270px] group bg-white rounded-2xl border border-zinc-200 flex-shrink-0 overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-zinc-200 flex items-center justify-center rounded-t-2xl" />
              <div className="p-4 flex flex-col gap-1">
                <div className="h-4 bg-zinc-200 rounded w-[60%] mb-2" />
                <div className="h-4 bg-zinc-300 rounded w-[30%] mb-2" />
                <div className="h-3 bg-zinc-200 rounded w-[40%] mb-2" />
                <div className="h-3 bg-zinc-300 rounded w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  if (recentProperties.length === 0)
    return (
      <p className="text-center text-zinc-500 mt-10" style={{ fontFamily: "para_font" }}>
        No recently added properties found.
      </p>
    );

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 pb-5 transition-colors duration-300">
      <section
        className="lg:px-10 px-3 rounded-2xl max-w-7xl mx-auto relative dark:bg-zinc-900 transition-colors duration-300"
        style={{ fontFamily: "para_font" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-[16px] lg:text-3xl text-left text-black dark:text-white"
            style={{ fontFamily: "heading_font" }}
          >
            Recently Listed Shared Rooms
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
          >
            {recentProperties.map((p) => (
              <Link
                to={`/properties/${p.id}`}
                key={p.id}
                className="min-w-[300px] max-w-[300px] group bg-white dark:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-600 flex-shrink-0 overflow-hidden shadow-md transition-colors duration-300"
              >
                {/* Image Section */}
                <div className="relative w-full h-44">
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.title || "Property image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-600 flex items-center justify-center text-zinc-400 italic">
                      No Image
                    </div>
                  )}
                  {p.verified && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      Verified
                    </span>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col gap-4">
                  {/* Location + Looking For */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-zinc-600 dark:text-zinc-300 text-sm gap-1">
                      <FiMapPin className="text-zinc-500 dark:text-zinc-400" />
                      {p.location ? p.location.split(" ").slice(-2).join(" ") : "Unknown"}
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        p.looking_for
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-600 dark:text-zinc-300"
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

                  {/* Rent | Deposit | BHK */}
                  <div className="flex border-zinc-200 dark:border-zinc-600 text-sm text-zinc-700 dark:text-zinc-200 py-2">
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        ₹{p.price?.toLocaleString() || "N/A"}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Rent</div>
                    </div>
                    <div className="w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        {p.deposit ? `₹${Number(p.deposit).toLocaleString()}` : "-"}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Deposit</div>
                    </div>
                    <div className="w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>
                    <div className="flex-1 text-center py-2">
                      <div className="text-zinc-900 dark:text-white font-semibold">
                        {p.bhk_type || "-"}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">BHK</div>
                    </div>
                  </div>

                  {/* Title + Actions */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-xl">
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
  else if (diffDays === 1) displayText = "1d ago";
  else displayText = "a week ago"; 

  return (
    <span className="text-blue-500 border-2 rounded-full border-blue-300 text-[9px] px-1 py-[0.5px]">
      Listed {displayText}
    </span>
  );
})()}
                    </div>
                    <div className="flex gap-3 text-blue-500 dark:text-blue-400">
                      <IoChatboxEllipsesOutline className="text-2xl cursor-pointer" />
                      <IoCall className="text-2xl cursor-pointer" />
                    </div>
                  </div>

                  {/* Book Now Button */}
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
