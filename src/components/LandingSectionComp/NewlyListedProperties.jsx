import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newlyListedProperties } from "../../API/propertiesApi";

export default function NewlyListedProperties() {
  const [newlyListed, setNewlyListed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNewlyListed = async () => {
    setLoading(true);
    try {
      const { data } = await newlyListedProperties();
      
      const filtered = data
      
        .filter((p) => p.is_newly_listed && p.status === "approved")
        // Sort: undefined or zero positions come last
        .sort((a, b) => {
          const posA = a.newly_listed_position || 9999;
          const posB = b.newly_listed_position || 9999;
          return posA - posB;
        });
      setNewlyListed(filtered);
    } catch (err) {
      console.error("Error fetching newly listed properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewlyListed();
  }, []);

  if (loading)
    return <p className="text-indigo-600">Loading newly listed properties...</p>;

  if (newlyListed.length === 0)
    return <p className="text-gray-500">No newly listed properties found.</p>;

  return (
    <section className="my-16 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Newly Listed Properties</h2>
       
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {newlyListed.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col cursor-pointer"
            onClick={() => navigate(`/property/${p.id}`)}
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-t-lg">
                No Image
              </div>
            )}
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-semibold text-lg text-indigo-800 truncate mb-1">{p.title}</h3>
              <p className="text-gray-600 text-sm mb-1">{p.location}</p>
              <p className="text-indigo-600 font-bold mt-auto">
                ₹ {Number(p.price).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
