// components/admin/OldProperties.jsx
import React, { useEffect, useState } from "react";
import { getOldProperties, deleteProperty } from "../../api/propertiesApi";
import PropertyCard from "./PropertyCard";

export default function OldProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOldProperties();
  }, []);

  const fetchOldProperties = async () => {
    try {
      setLoading(true);
      const res = await getOldProperties();

      // Normalize pricing & image
      const safeProps = Array.isArray(res.data.data)
        ? res.data.data.map((prop) => ({
            ...prop,
            pricing: Array.isArray(prop.pricing) ? prop.pricing : [],
            image: Array.isArray(prop.image) ? prop.image : prop.image ? [prop.image] : ["/default-property.jpg"],
          }))
        : [];

      setProperties(safeProps);
    } catch (err) {
      console.error("Failed to fetch old properties:", err);
      setError("Failed to fetch old properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property");
    }
  };

  const handleViewDetails = (id) => {
    window.open(`/properties/${id}`, "_blank");
  };

  // Filter properties based on search input
  const filteredProperties = properties.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "universal_font" }} className="p-4">
      {/* Heading + Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 style={{ fontFamily: "universal_font" }} className="text-2xl mb-2 md:mb-0">
          Properties Older Than 30 Days
        </h2>

        <input
          type="text"
          placeholder="Search by title, location, or owner code"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Messages */}
      {loading && <p>Loading properties...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Property Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onDelete={handleDelete}
              onEdit={null}
              onApprove={null}
              onView={() => handleViewDetails(prop.id)}
            />
          ))
        ) : (
          !loading && <p className="text-gray-500 col-span-full">No properties found.</p>
        )}
      </div>
    </div>
  );
}
