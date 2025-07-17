import React from "react";

export default function PropertyCard({ property, onApprove, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <img
        src={Array.isArray(property.image) ? property.image[0] : property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-1">
       <div className="flex items-center justify-between">
  <h3 className="text-lg font-bold text-indigo-700">{property.title}</h3>
  {property.verified && (
    <span className="text-green-600 bg-green-100 text-xs font-semibold px-2 py-1 rounded-full">
      Verified
    </span>
  )}
</div>
        <p className="text-gray-600">{property.location}</p> <span className="bg-yellow-400 text-zinc-900 font-semibold px-3 py-0.5 text-sm rounded-md">{property.owner_code}</span>
        <p className="text-indigo-900 font-semibold">₹{property.price}</p>

        <div className="flex gap-2 mt-2 flex-wrap">
          {property.status === "pending" && (
            <button
              onClick={() => onApprove(property.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          )}

          <button
            onClick={() => onEdit(property)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(property.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
