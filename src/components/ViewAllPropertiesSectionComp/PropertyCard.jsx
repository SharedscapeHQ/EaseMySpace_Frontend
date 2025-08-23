import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Stat from "./Stat";
import Feature from "./Feature";

const PropertyCard = ({ p, setShowOtpPopup, setSelectedPropertyId, isOtpVerified, isLoggedIn }) => {
  const navigate = useNavigate();
  const thumbs = p.images.filter((img) => img !== p.cover).slice(0, 3);
  const extra = p.images.length - 1 - thumbs.length;

  const handleViewDetailsClick = (event) => {
    if (!isLoggedIn && !isOtpVerified) {
      event.preventDefault();
      setSelectedPropertyId(p.id);
      setShowOtpPopup(true);
      return;
    }
    navigate(`/properties/${p.id}`, { state: { property: p } });
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10">
      <Link
        to={isLoggedIn || isOtpVerified ? `/properties/${p.id}` : "#"}
        state={isLoggedIn || isOtpVerified ? { property: p } : null}
        onClick={(e) => handleViewDetailsClick(e, p)}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-300 w-full overflow-x-hidden flex flex-col md:flex-row p-4 gap-4"
      >
        {/* Main Image */}
        <div className="w-full md:w-64 flex-shrink-0">
          {p.cover ? (
            <img src={p.cover} alt={p.title} loading="lazy" className="w-full h-48 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center italic text-gray-400 rounded-lg">No Image</div>
          )}

          {/* Thumbnails */}
          <div className="flex gap-2 mt-2">
            {thumbs.map((t, i) => (
              <div key={i} className="relative h-20 w-1/3">
                <img src={t} alt="" loading="lazy" className="h-full w-full object-cover rounded-lg" />
                {i === thumbs.length - 1 && extra > 0 && (
                  <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs rounded-lg">+{extra}</span>
                )}
              </div>
            ))}
            {Array.from({ length: 3 - thumbs.length }).map((_, i) => (
              <div key={i} className="h-20 w-1/3 bg-gray-50 border border-dashed border-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="flex flex-col justify-start flex-1 gap-3">
          <div className="flex items-start justify-between flex-wrap gap-y-1">
            <div>
              <h2 className="text-lg flex items-center gap-1 text-gray-800 leading-snug">
                {p.looking_for === "pg" ? `${p.title || "Untitled Property"}'s PG` : p.title || "Untitled Property"}{" "}
                {p.verified && (
                  <span className="bg-green-500 text-white text-[8px] px-2 py-1 rounded-full flex items-center gap-1">
                    <FiCheckCircle className="text-[10px]" />
                    Verified
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 truncate">📍 {p.location}</p>
            </div>
            <Link
              to={isLoggedIn || isOtpVerified ? `/properties/${p.id}` : "#"}
              state={isLoggedIn || isOtpVerified ? { property: p } : null}
              onClick={(e) => handleViewDetailsClick(e, p)}
              className="text-indigo-600 text-sm font-medium border border-indigo-600 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition whitespace-nowrap"
            >
              View Details
            </Link>
          </div>

          {p.looking_for && (
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-[2px] rounded-full w-max">
              {p.looking_for === "flatmate" ? "Flatmate" : p.looking_for === "pg" ? "Paying Guest" : "Vacant Flat"}
            </span>
          )}

          <div className="grid grid-cols-3 text-center text-xs">
            <Stat label="Rent" value={`₹ ${p.price?.toLocaleString() || "N/A"}`} />
            <Stat label="Deposit" value={`₹ ${p.deposit?.toLocaleString() || "-"}`} />
            <Stat label="Built‑up" value={`${p.sqft || "-"} sqft`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Feature icon="🛋️" label="Occupancy" value={p.occupancy || "-"} />
            <Feature icon="🏠" label="BHK Type" value={p.bhk_type || "-"} />
            <Feature icon="📍" label="Distance" value={p.distance_from_station || "-"} />
            <Feature icon="🔑" label="Available" value={p.flat_status || "-"} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
