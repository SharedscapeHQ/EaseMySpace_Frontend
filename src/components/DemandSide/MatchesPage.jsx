import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

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

export default function MatchesPage({ userRequirement }) {
  const [matches, setMatches] = useState([]);
  const [passedIds, setPassedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cardRefs = useRef({});

  useEffect(() => {
    fetch("https://api.easemyspace.in/api/properties/all")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePass = (id) => {
    // Animate vanish
    const card = cardRefs.current[id];
    if (card) {
      gsap.to(card, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => setPassedIds((prev) => [...prev, id]),
      });
    }
  };

  const filteredMatches = matches
    .filter((match) => {
      if (!match) return false;
      if (
        userRequirement.bhk &&
        match.bhk_type?.trim().toLowerCase() !==
          userRequirement.bhk?.trim().toLowerCase()
      )
        return false;
      if (
        userRequirement.location &&
        !match.location
          ?.toLowerCase()
          .includes(userRequirement.location?.toLowerCase())
      )
        return false;
      if (userRequirement.budgetMin && +match.price < +userRequirement.budgetMin)
        return false;
      if (userRequirement.budgetMax && +match.price > +userRequirement.budgetMax)
        return false;
      return true;
    })
    .filter((match) => !passedIds.includes(match.id));

  if (loading) return <div className="text-center h-screen p-20">Loading...</div>;

  return (
    <div className="bg-gradient-to-b from-zinc-50 max-w-7xl lg:px-20 px-3 to-white pt-16 min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h2>
        <p className="text-gray-600 mb-6">Curated by EMS Algorithm</p>

        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500">No matches found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => {
            const imageUrl =
              parseImages(match.images || match.image)[0] ||
              "https://via.placeholder.com/400x300";
            return (
              <div
                key={match.id}
                ref={(el) => (cardRefs.current[match.id] = el)}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden transition-transform duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={match.location}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-gray-800 truncate">
                      {match.bhk_type} • {match.location}
                    </div>
                    <div className="text-sm text-gray-600 font-bold">
                      ₹{Number(match.price).toLocaleString()}
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2 text-sm">
                    <span className="pill bg-gray-100 px-2 py-1 rounded-full text-xs">
                      MetroKey Agents
                    </span>
                    <span className="pill bg-yellow-100 px-2 py-1 rounded-full text-xs">
                      ⭐ {match.rating || 4.1}
                    </span>
                  </div> */}

                  <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                    {match.features?.map((feature, i) => (
                      <span
                        key={i}
                        className="pill bg-gray-100 px-2 py-1 rounded-full truncate"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/properties/${match.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold text-center hover:bg-blue-700 transition"
                    >
                      Book Visit
                    </Link>
                    <button
                      onClick={() => handlePass(match.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      Pass
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
