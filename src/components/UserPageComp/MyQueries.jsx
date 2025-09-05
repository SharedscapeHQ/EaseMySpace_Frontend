import React, { useEffect, useState } from "react";
import { fetchMyQueries } from "../../api/userApi";
import { FaCheckCircle, FaHourglassHalf, FaBuilding } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

export default function MyQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getQueries() {
      try {
        const data = await fetchMyQueries();
        setQueries(data);
      } catch (error) {
        console.error("Failed to fetch queries:", error);
      } finally {
        setLoading(false);
      }
    }
    getQueries();
  }, []);

  if (loading)
    return (
      <div className="text-left text-gray-700 font-medium py-6 flex items-center justify-center gap-2">
        <FiClock className="animate-spin text-xl" /> Loading queries...
      </div>
    );

  return (
    <div className=" max-w-4xl">
     

      {queries.length === 0 ? (
       <div className="flex flex-col items-center justify-center py-10 space-y-4">

  {/* Heading */}
  <h3 className="text-xl font-semibold text-gray-700">
    No Queries Submitted
  </h3>

  {/* Subtext */}
  <p className="text-gray-500 italic text-center max-w-xs">
    You haven’t submitted any queries yet.
  </p>

 
</div>

      ) : (
        <ul className="space-y-6">
          {queries.map((q) => (
            <li
              key={q.id}
              className={`relative rounded-lg p-6  border  ${
                q.resolved
                  ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300"
                  : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaBuilding className="text-indigo-500" /> {q.property_title}
                </h3>
                <span
                  className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                    q.resolved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {q.resolved ? (
                    <>
                      <FaCheckCircle className="text-green-500" /> Resolved
                    </>
                  ) : (
                    <>
                      <FaHourglassHalf className="text-yellow-500 animate-pulse" /> Pending
                    </>
                  )}
                </span>
              </div>

              <p className="text-gray-700 mb-2 text-left">
                <strong>Message:</strong> {q.message}
              </p>

              <p className="text-sm text-gray-500 text-left flex items-center gap-1">
                <FiClock /> Submitted on: {new Date(q.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
