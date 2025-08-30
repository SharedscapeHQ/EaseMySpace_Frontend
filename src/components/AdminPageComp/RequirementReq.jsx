import React, { useEffect, useState } from "react";
import { requirementReq } from "../../api/requestApi";

function RequirementReq() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

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



  return (
   <div
  className="max-w-5xl mx-auto p-6"
  style={{ fontFamily: "para_font" }}
>
  <h2
    className="text-2xl mb-6"
    style={{ fontFamily: "heading_font" }}
  >
    Posted Requirements
  </h2>

  {loading ? (
    <p style={{ color: "#6B7280" }}>Loading requirements...</p>
  ) : requirements.length === 0 ? (
    <p style={{ color: "#6B7280" }}>No requirements posted yet.</p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2">
      {requirements.map((req) => (
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
          <p style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem" }}>
            📧 {req.email} | 📞 {req.phone}
          </p>

          <div className="mt-3 space-y-1" style={{ color: "#4B5563", fontSize: "0.9rem" }}>
            <p>
              <span style={{ fontFamily: "heading_font" }}>Location:</span> {req.location}
            </p>
            <p>
              <span style={{ fontFamily: "heading_font" }}>Budget:</span> ₹{req.budget_min} – ₹{req.budget_max}
            </p>
            <p>
              <span style={{ fontFamily: "heading_font" }}>BHK:</span> {req.bhk}
            </p>
            <p>
              <span style={{ fontFamily: "heading_font" }}>Move In:</span> {req.move_in}
            </p>
            <p>
              <span style={{ fontFamily: "heading_font" }}>Urgency:</span> {req.urgency}
            </p>
            {req.lifestyle && (
  <div className="mt-2">
    <p style={{ fontFamily: "heading_font", marginBottom: "0.25rem" }}>Lifestyle:</p>
    <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#4B5563" }}>
      <div className="flex items-center gap-1">
        <span>Pure Veg:</span> {req.lifestyle.pureVeg ? "✅" : "❌"}
      </div>
      <div className="flex items-center gap-1">
        <span>Furnished:</span> {req.lifestyle.furnished ? "✅" : "❌"}
      </div>
      <div className="flex items-center gap-1">
        <span>Pet Friendly:</span> {req.lifestyle.petFriendly ? "✅" : "❌"}
      </div>
    </div>
  </div>
)}
          </div>

          <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.75rem" }}>
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
