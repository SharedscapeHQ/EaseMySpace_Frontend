import React from "react";
import PropertyCard from "./PropertyCard";
import { FiClock } from "react-icons/fi";

const PropertyList = ({ properties, loading, error }) => {
  if (loading) return <div className="text-center text-gray-700 font-medium py-6">
        <FiClock className="inline mr-2 animate-spin" /> Loading Properties
        details...
      </div>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (properties.length === 0)
    return <p className="text-center mt-20 text-gray-600">No properties listed yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
};

export default PropertyList;
