import React, { useEffect, useState } from "react";
import { requirementReq } from "../../api/requestApi";

function RequirementReq() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  // ✅ Get today's date in local timezone (YYYY-MM-DD)
  const today = new Date();
  const localToday = today.toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = await requirementReq();
        setRequirements(requests);
      } catch (err) {
        console.error("Failed to fetch requirements:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Show only exact match for selected date
  const filteredRequirements = requirements.filter((req) => {
    if (!filterDate) return true;
    const reqDate = new Date(req.created_at).setHours(0, 0, 0, 0);
    const selectedDate = new Date(filterDate).setHours(0, 0, 0, 0);
    return reqDate === selectedDate;
  });

  return (
    <div className="max-w-5xl mx-auto p-6" style={{ fontFamily: "universal_font" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontFamily: "para_font" }} className="text-2xl" style={{ fontFamily: "universal_font" }}>
          Posted Requirements
        </h2>

        {/* Calendar Filter */}
        <input
          type="date"
          value={filterDate}
          max={localToday} // ✅ restricts to today & past
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <p style={{ color: "#6B7280" }}>Loading requirements...</p>
      ) : filteredRequirements.length === 0 ? (
        <p style={{ color: "#6B7280" }}>
          No requirements found for selected date.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              style={{ lineHeight: 1.6 }}
            >
              <h3
                className="text-lg mb-2"
                style={{ fontFamily: "heading_font", color: "#111827" }}
              >
                {req.firstName} {req.lastName}{" "}
                <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                  ({req.gender})
                </span>
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                📧 {req.email} | 📞 {req.phone}
              </p>

              <div
                className="mt-3 space-y-1"
                style={{ color: "#4B5563", fontSize: "0.9rem" }}
              >
                <p>
                  <span style={{ fontFamily: "universal_font" }}>Location:</span>{" "}
                  {req.location}
                </p>
                <p>
                  <span style={{ fontFamily: "universal_font" }}>Budget:</span> ₹
                  {req.budget_min} – ₹{req.budget_max}
                </p>
                <p>
                  <span style={{ fontFamily: "universal_font" }}>BHK:</span>{" "}
                  {req.bhk}
                </p>
                <p>
                  <span style={{ fontFamily: "universal_font" }}>Move In:</span>{" "}
                  {req.move_in}
                </p>
                <p>
                  <span style={{ fontFamily: "universal_font" }}>Urgency:</span>{" "}
                  {req.urgency}
                </p>

                {req.lifestyle && (
                  <div className="mt-2">
                    <p
                      style={{
                        fontFamily: "heading_font",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Lifestyle:
                    </p>
                    <div
                      className="flex flex-wrap gap-4 text-sm"
                      style={{ color: "#4B5563" }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Pure Veg:</span>{" "}
                        {req.lifestyle.pureVeg ? "✅" : "❌"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Furnished:</span>{" "}
                        {req.lifestyle.furnished ? "✅" : "❌"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Pet Friendly:</span>{" "}
                        {req.lifestyle.petFriendly ? "✅" : "❌"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9CA3AF",
                  marginTop: "0.75rem",
                }}
              >
                Posted on {new Date(req.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequirementReq;
