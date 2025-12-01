import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const AmenitiesMediaDescription = ({ formData, setFormData }) => {
  const amenityOptions = [
    "wifi",
    "parking",
    "air conditioning",
    "refrigerator",
    "washing machine",
    "cctv",
    "security",
    "geyser",
    "lift",
    "power backup",
    "furniture",
    "tv",
    "gas connection",
  ];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFileChange = async (e, type) => {
  const files = Array.from(e.target.files);
  try {
    const base64s = await Promise.all(files.map(toBase64));
    setFormData((prev) => ({
      ...prev,
      [`${type}_base64`]: [...(prev[`${type}_base64`] || []), ...base64s],
    }));
    e.target.value = "";
  } catch {
    alert(`Failed to process ${type} file(s)`);
  }
};


  // ✅ Render separate file inputs for each image category
  const imageCategories = [
    { label: "Bedroom Images", key: "bedroom_images" },
    { label: "Kitchen Images", key: "kitchen_images" },
    { label: "Bathroom Images", key: "bathroom_images" },
    { label: "Hall Images", key: "hall_images" },
    { label: "Additional Images", key: "additional_images" },
  ];

  return (
    <>
      {/* Amenities */}
      <div className="border-t pt-4">
        <h2 className="font-bold mb-2 text-indigo-600">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={(e) => {
                  const selected = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    amenities: selected
                      ? [...prev.amenities, amenity]
                      : prev.amenities.filter((a) => a !== amenity),
                  }));
                }}
              />
              {amenity}
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Add other amenities (comma separated)"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              const input = e.target.value.trim();
              if (input) {
                const newAmenities = input
                  .split(",")
                  .map((a) => a.trim().toLowerCase())
                  .filter((a) => a && !formData.amenities.includes(a));
                if (newAmenities.length) {
                  setFormData((prev) => ({
                    ...prev,
                    amenities: [...prev.amenities, ...newAmenities],
                  }));
                }
                e.target.value = "";
              }
            }
          }}
          className="w-full px-3 py-2 border rounded-md text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.amenities.map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
            >
              {amenity}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.filter((a) => a !== amenity),
                  }))
                }
                className="font-bold text-xs text-indigo-600 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="border-t pt-4">
        <label className="font-semibold block mb-1">Short Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Write something about the property..."
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows="4"
        />
      </div>

      {/* Media Upload */}
     <div className="border-t pt-4">
  <h2 className="font-bold mb-2 text-indigo-600">Media Upload</h2>

  {/* Responsive Grid: 1 column on mobile, 2 on desktop */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Separate Image Uploads */}
    {imageCategories.map((cat) => (
      <div className="mb-2" key={cat.key}>
        <label className="block font-semibold mb-1">{cat.label}</label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, cat.key)}
          className="w-full file:px-4 file:py-2 file:bg-indigo-100 file:text-indigo-700 file:rounded-lg"
        />

        {formData[`${cat.key}_base64`]?.length > 0 && (
          <p className="text-green-600 flex items-center mt-1 gap-2">
            <FaCheckCircle />
            {formData[`${cat.key}_base64`].length} image(s) selected
          </p>
        )}
      </div>
    ))}

    {/* Videos */}
    <div className="mb-2">
      <label className="block font-semibold mb-1">Videos</label>

      <input
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleFileChange(e, "video")}
        className="w-full file:px-4 file:py-2 file:bg-indigo-100 file:text-indigo-700 file:rounded-lg"
      />

      {formData.video_base64.length > 0 && (
        <p className="text-green-600 flex items-center mt-1 gap-2">
          <FaCheckCircle />
          {formData.video_base64.length} video(s) selected
        </p>
      )}
    </div>
  </div>
</div>

    </>
  );
};

export default AmenitiesMediaDescription;
