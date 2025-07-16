import React from "react";

export default function EditModal({
  editForm,
  setEditForm,
  editingProperty,
  setEditingProperty,
  handleEditChange,
  handleEditSubmit,
}) {
  if (!editingProperty) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Edit Property</h3>

        {/* Dynamic Form Fields */}
        {[
          ["title", "Title"],
          ["location", "Location"],
          ["price", "Price"],
          ["deposit", "Deposit"],
          ["flat_status", "Flat Status"],
          ["status", "Status", "select", ["pending", "approved", "rejected"]],
          ["bhk_type", "BHK Type", "select", ["1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "4 BHK"]],
          ["bathrooms", "Bathrooms"],
          ["floor_number", "Floor Number"],
          ["total_floors", "Total Floors"],
          ["property_size", "Property Size"],
          ["property_type", "Property Type"],
          ["furnishing", "Furnishing", "select", ["unfurnished", "semi-furnished", "fully-furnished"]],
          ["parking", "Parking"],
          ["facing", "Facing"],
          ["balcony", "Balcony"],
          ["age_of_property", "Age of Property"],
          ["owner_code", "Owner Code"],
          ["looking_for", "Looking For", "select", ["flatmate", "vacant"]],
          ["occupancy", "Occupancy", "select", ["single", "double", "triple"]],
          ["distance_from_station", "Distance from Station"],
          ["gender", "Gender", "select", ["male", "female", "others"]],
          ["owner_phone", "Owner Phone"]
        ].map(([field, label, type = "text", options = []]) => (
          <div key={field} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {type === "select" ? (
              <select
                name={field}
                value={editForm[field] || ""}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={field}
                value={editForm[field] || ""}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />
            )}
          </div>
        ))}

        {/* Amenities */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
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
            ].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(editForm.amenities)
                      ? editForm.amenities.includes(amenity)
                      : (editForm.amenities || "").split(",").map((a) => a.trim()).includes(amenity)
                  }
                  onChange={(e) => {
                    const selected = e.target.checked;
                    setEditForm((prev) => {
                      let current = Array.isArray(prev.amenities)
                        ? [...prev.amenities]
                        : (prev.amenities || "").split(",").map((a) => a.trim());

                      const updated = selected
                        ? [...new Set([...current, amenity])]
                        : current.filter((a) => a !== amenity);

                      return {
                        ...prev,
                        amenities: updated,
                      };
                    });
                  }}
                />
                {amenity}
              </label>
            ))}
            <input
  type="text"
  placeholder="Add amenities (comma separated)"
  className="w-full border px-3 py-2 rounded text-sm mt-2"
  onBlur={(e) => {
    const custom = e.target.value
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (custom.length) {
      setEditForm((prev) => ({
        ...prev,
        amenities: Array.from(
          new Set([...(Array.isArray(prev.amenities) ? prev.amenities : []), ...custom])
        ),
      }));
      e.target.value = "";
    }
  }}
/>

          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={editForm.description || ""}
            onChange={handleEditChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        {/* Newly Listed Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            name="is_newly_listed"
            checked={!!editForm.is_newly_listed}
            onChange={(e) =>
              setEditForm((prev) => ({
                ...prev,
                is_newly_listed: e.target.checked,
              }))
            }
          />
          <label className="text-sm">Mark as Newly Listed</label>
        </div>

        <div className="flex items-center gap-2 mb-3">
  <input
  type="checkbox"
  name="verified"
  checked={!!editForm.verified}
  onChange={(e) =>
    setEditForm((prev) => ({
      ...prev,
      verified: e.target.checked,
    }))
  }
/>
  <label className="text-sm font-medium">
  {editForm.verified ? (
    <span className="text-green-700">Verified (click to unverify)</span>
  ) : (
    <span className="text-gray-700">Mark as Verified</span>
  )}
</label>

</div>
<div className="mb-3">
  <label className="block text-sm font-medium mb-1">Upload New Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) =>
      setEditForm((prev) => ({
        ...prev,
        image_base64: Array.from(e.target.files),
      }))
    }
  />
</div>
<div className="mb-3">
  <label className="block text-sm font-medium mb-1">Upload New Videos</label>
  <input
    type="file"
    multiple
    accept="video/*"
    onChange={(e) =>
      setEditForm((prev) => ({
        ...prev,
        video_base64: Array.from(e.target.files),
      }))
    }
  />
</div>



        {editForm.is_newly_listed && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Newly Listed Position</label>
            <input
              type="number"
              name="newly_listed_position"
              value={editForm.newly_listed_position || ""}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setEditingProperty(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
