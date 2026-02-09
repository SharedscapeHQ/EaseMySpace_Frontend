import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequirement } from "../../api/userApi";
import FlipUINavbar from "./FlipUINavbar";
import MatchesPage from "./MatchesPage";

export default function RequirementDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("dashboard"); // dashboard | matches
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRequirement() {
      try {
        setLoading(true);
        const res = await getMyRequirement();
        setData(res?.requirement || null);
      } catch (err) {
        setError("Failed to load requirement.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequirement();
  }, []);

  const Pill = ({ children }) => (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
      {children}
    </span>
  );

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 pt-20 font-sans">
        <p className="text-gray-600 text-center">Loading your requirement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 pt-20 font-sans">
        <p className="text-red-600 text-center">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-7xl mx-auto px-6 pt-20 font-sans">
        <p className="text-gray-600 text-center">No requirement found.</p>
      </main>
    );
  }

  return (
    <>
      <FlipUINavbar onPostRequirementClick={() => navigate("/demand-form")} />

      {/* ==== Dashboard View ==== */}
      {view === "dashboard" && (
        <main className="max-w-7xl lg:min-h-[calc(100vh-3rem)] mx-auto px-6 pt-20 font-sans">
          <section className="grid gap-12">
            <div className="grid md:grid-cols-[2fr,1fr] gap-10">
              <div className="grid gap-6">
                <h2 style={{ fontFamily: "para_font" }} className="lg:text-3xl text-xl font-bold text-gray-900">
                  My Posted Requirement
                </h2>
                <p className="text-gray-600 lg:text-sm text-xs mt-1">
                  Demand-first: Algorithm applies to fulfill your need
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 px-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-xs text-gray-500 mb-1">Location</div>
                    <div className="font-semibold text-gray-700">
                      {data.location}
                    </div>
                  </div>

                  <div className="p-4 px-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-xs text-gray-500 mb-1">Budget</div>
                    <div className="font-semibold text-gray-700">
                      ₹{data.budget_min} – ₹{data.budget_max}
                    </div>
                  </div>

                  <div className="p-4 px-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-xs text-gray-500 mb-1">BHK</div>
                    <div className="font-semibold text-gray-700">{data.bhk}</div>
                  </div>

                  <div className="p-4 px-6 rounded-lg bg-white border border-zinc-200">
                    <div className="text-xs text-gray-500 mb-1">Move-in</div>
                    <div className="font-semibold text-gray-700">
                      {data.moveIn}
                    </div>
                  </div>

                  <div className="p-4 px-6 rounded-lg bg-white border border-zinc-200 md:col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Preferences</div>
                    <div className="font-semibold flex flex-wrap gap-3 mt-2">
                      {data.lifestyle?.pureVeg && <Pill>Pure Veg</Pill>}
                      {data.lifestyle?.furnished && <Pill>Furnished</Pill>}
                      {data.lifestyle?.petFriendly && (
                        <Pill>Pet Friendly</Pill>
                      )}
                      <Pill>Urgency: {data.urgency}</Pill>
                    </div>
                  </div>
                </div>

                <div className="w-1/3 mt-6 flex flex-row items-center lg:gap-10 gap-5">
  <button
    onClick={() =>
      navigate("/demand-form", { state: { initialData: data } })
    }
    className="flex-1 lg:text-base text-xs whitespace-nowrap bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white border-2 border-blue-600 transition"
  >
    Edit Requirement
  </button>

  <button
    onClick={() => setView("matches")}
    className="flex-1 lg:text-base text-xs whitespace-nowrap bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
  >
    Track Matches
  </button>
</div>

              </div>

              <aside className="h-fit flex flex-col justify-start">
                <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
                <ul className="text-sm list-disc pl-6 space-y-2 text-gray-700">
                  <li>Trusted EMS agents receive your requirement.</li>
                  <li>They submit available flats that fit your brief.</li>
                  <li>You’ll get curated matches here to review.</li>
                  <li>Book visits in 1 tap. We auto-confirm via WhatsApp.</li>
                </ul>
              </aside>
            </div>
          </section>
        </main>
      )}

      {/* ==== Matches View ==== */}
      {view === "matches" && <MatchesPage userRequirement={data} />}
    </>
  );
}
