import React from "react";
import PropertyCard from "./PropertyCard";

const PropertyList = ({ properties, loading, error }) => {
  if (loading) return <p>Loading your properties...</p>;
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
