import React from "react";
import { toast } from "react-hot-toast";

export default function NewlyListedCard({ property, markNewlyListed, fetchProperties }) {
  const handleRemove = async () => {
    try {
      await markNewlyListed(property.id, false, null);
      toast.success("Removed from newly listed");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleMark = async () => {
    const input = prompt("Enter position number to mark as newly listed:");
    const position = parseInt(input);

    if (isNaN(position)) return alert("Invalid number");
    if (!Number.isInteger(position) || position <= 0)
      return alert("Please enter a valid positive whole number");

    try {
      await markNewlyListed(property.id, true, position);
      toast.success("Marked as newly listed");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to mark");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <img
        src={Array.isArray(property.image) ? property.image[0] : property.image}
        alt={property.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold text-indigo-700 mt-2">{property.title}</h3>
      <p className="text-gray-600">{property.location}</p>
      <p className="text-indigo-900 font-bold">₹{property.price}</p>

      {property.is_newly_listed ? (
        <>
          <p className="text-sm text-green-600 mt-2">
            Listed Position: {property.newly_listed_position ?? "-"}
          </p>
          <button
            onClick={handleRemove}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Remove from Newly Listed
          </button>
        </>
      ) : (
        <button
          onClick={handleMark}
          className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Mark as Newly Listed
        </button>
      )}
    </div>
  );
}
