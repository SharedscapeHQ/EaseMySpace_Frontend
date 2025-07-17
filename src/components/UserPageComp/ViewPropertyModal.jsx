import React from "react";
import { IoClose } from "react-icons/io5";

const ViewPropertyModal = ({ property, onClose }) => {
  if (!property) return null;

  const images = Array.isArray(property.image)
    ? property.image
    : [property.image];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl z-10"
        >
          <IoClose />
        </button>

        {/* Images */}
        <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl bg-gray-100">
  {images && images.length > 0 && images[0] ? (
    <img
      src={images[0]}
      alt={property.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
      No Image Available
    </div>
  )}
</div>


        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-indigo-700">
              {property.title}
            </h2>
            {property.verified && (
              <span className="text-green-600 bg-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Price:</strong> ₹{Number(property.price).toLocaleString()}</p>
            <p><strong>Status:</strong> {property.flat_status}</p>
            <p><strong>Type:</strong> {property.type || "N/A"}</p>
            <p><strong>Size:</strong> {property.size || "N/A"}</p>
            <p>
              <strong>Listed At:</strong>{" "}
              {property.created_at ? new Date(property.created_at).toLocaleString() : "N/A"}
            </p>
            <p className="md:col-span-2">
              <strong>Description:</strong> {property.description || "N/A"}
            </p>
            <p className="md:col-span-2">
              <strong>Amenities:</strong>{" "}
              {Array.isArray(property.amenities)
                ? property.amenities.join(", ")
                : property.amenities || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyModal;
