import React, { useEffect, useState } from "react";

export default function EditModal({
  editForm,
  setEditForm,
  editingProperty,
  setEditingProperty,
  handleEditChange,
  handleEditSubmit,
}) {
  if (!editingProperty) return null;

  const [draggedIndex, setDraggedIndex] = useState(null);

  // File handling (unchanged)
  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    const base64Files = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    setEditForm((prev) => ({
      ...prev,
      [`${type}_base64`]: [...(prev[`${type}_base64`] || []), ...base64Files],
    }));
  };

  const handleRemoveImage = (img, idx) => {
    const updated = (editForm.image || []).filter((_, i) => i !== idx);
    setEditForm((prev) => ({
      ...prev,
      image: updated,
      remove_image_urls: [...(prev.remove_image_urls || []), img],
    }));
    setEditingProperty((prev) => ({ ...prev, image: updated }));
  };

  const handleRemoveVideo = (idx) => {
    const updated = (editForm.video || []).filter((_, i) => i !== idx);
    setEditForm((prev) => ({
      ...prev,
      video: updated,
      remove_video_urls: [
        ...(prev.remove_video_urls || []),
        ...(editForm.video[idx] ? [editForm.video[idx]] : []),
      ],
    }));
    setEditingProperty((prev) => ({ ...prev, video: updated }));
  };

  // ---------------- Pricing Handlers ----------------
  const addRoom = () => {
    setEditForm((prev) => ({
      ...prev,
      pricing: [
        ...(prev.pricing || []),
        { room_name: `Room ${prev.pricing?.length + 1}`, occupancies: [] },
      ],
    }));
  };

  const removeRoom = (roomIdx) => {
    setEditForm((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== roomIdx),
    }));
  };

  const handleRoomNameChange = (roomIdx, value) => {
    setEditForm((prev) => {
      const updated = [...(prev.pricing || [])];
      updated[roomIdx].room_name = value;
      return { ...prev, pricing: updated };
    });
  };

  const addOccupancy = (roomIdx) => {
    setEditForm((prev) => {
      const updated = [...(prev.pricing || [])];
      updated[roomIdx].occupancies.push({
        occupancy: "",
        price: "",
        deposit: "",
      });
      return { ...prev, pricing: updated };
    });
  };

  const removeOccupancy = (roomIdx, occIdx) => {
    setEditForm((prev) => {
      const updated = [...(prev.pricing || [])];
      updated[roomIdx].occupancies = updated[roomIdx].occupancies.filter(
        (_, i) => i !== occIdx
      );
      return { ...prev, pricing: updated };
    });
  };

  const handleOccupancyChange = (roomIdx, occIdx, field, value) => {
    setEditForm((prev) => {
      const updated = [...(prev.pricing || [])];
      updated[roomIdx].occupancies[occIdx][field] =
        field === "price" || field === "deposit"
          ? value.replace(/[^0-9]/g, "")
          : value;
      return { ...prev, pricing: updated };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Edit Property</h3>

        {/* === Basic Info === */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-indigo-600">Basic Info</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["title", "Title"],
              ["location", "Location"],
              ["flat_status", "Flat Status"],
              ["status", "Status", "select", ["pending", "approved", "rejected"]],
              [
                "bhk_type",
                "BHK Type",
                "select",
                ["1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "4 BHK"],
              ],
              [
                "looking_for",
                "Looking For",
                "select",
                ["flatmate", "vacant", "pg"],
              ],
              ["gender", "Gender", "select", ["male", "female", "Any"]],
              ["owner_code", "Owner Code"],
              ["owner_phone", "Owner Phone"],
              ["bathrooms", "Bathrooms"],
              ["distance_from_station", "Distance from Station"],
            ].map(([field, label, type = "text", options = []]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    name={field}
                    value={editForm[field] || ""}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={field}
                    value={editForm[field] || ""}
                    onChange={handleEditChange}
                    disabled={field === "owner_code"}
                    className={`w-full border px-3 py-2 rounded ${
                      field === "owner_code"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === Rent per Room & Occupancy === */}
        <div className="mb-6 border-t pt-4">
          <h4 className="font-semibold mb-3 text-indigo-600">
            Rent & Deposit per Room & Occupancy
          </h4>

          {(editForm.pricing || []).map((room, roomIdx) => (
            <div
              key={roomIdx}
              className="border p-3 rounded mb-4 bg-gray-50 relative"
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  placeholder="Room Name"
                  value={room.room_name || ""}
                  onChange={(e) =>
                    handleRoomNameChange(roomIdx, e.target.value)
                  }
                  className="border px-2 py-1 rounded w-1/2"
                />
                <button
                  onClick={() => removeRoom(roomIdx)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove Room
                </button>
              </div>

              {(room.occupancies || []).map((occ, occIdx) => (
                <div
                  key={occIdx}
                  className="flex flex-wrap gap-3 items-center mb-2"
                >
                  <input
                    type="text"
                    placeholder="Occupancy (e.g. single/double)"
                    value={occ.occupancy || ""}
                    onChange={(e) =>
                      handleOccupancyChange(
                        roomIdx,
                        occIdx,
                        "occupancy",
                        e.target.value
                      )
                    }
                    className="border px-2 py-2 rounded w-32"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Rent (₹)"
                    value={occ.price || ""}
                    onChange={(e) =>
                      handleOccupancyChange(
                        roomIdx,
                        occIdx,
                        "price",
                        e.target.value
                      )
                    }
                    className="border px-2 py-2 rounded w-32"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Deposit (₹)"
                    value={occ.deposit || ""}
                    onChange={(e) =>
                      handleOccupancyChange(
                        roomIdx,
                        occIdx,
                        "deposit",
                        e.target.value
                      )
                    }
                    className="border px-2 py-2 rounded w-32"
                  />
                  <button
                    onClick={() => removeOccupancy(roomIdx, occIdx)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => addOccupancy(roomIdx)}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Occupancy
              </button>
            </div>
          ))}

          <button
            onClick={addRoom}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Room
          </button>
        </div>

        {/* === Amenities === */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-indigo-600">Amenities</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Array.isArray(editForm.amenities)
                    ? editForm.amenities.includes(amenity)
                    : false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEditForm((prev) => {
                      const current = Array.isArray(prev.amenities)
                        ? [...prev.amenities]
                        : [];
                      const updated = checked
                        ? [...new Set([...current, amenity])]
                        : current.filter((a) => a !== amenity);
                      return { ...prev, amenities: updated };
                    });
                  }}
                />
                {amenity}
              </label>
            ))}
            <input
              type="text"
              placeholder="Add custom amenities (comma separated)"
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
                      new Set([
                        ...(Array.isArray(prev.amenities) ? prev.amenities : []),
                        ...custom,
                      ])
                    ),
                  }));
                }
              }}
            />
          </div>
        </div>

        {/* === Description === */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-indigo-600">Description</h4>
          <textarea
            name="description"
            value={editForm.description || ""}
            onChange={handleEditChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        {/* === Toggles === */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
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
            Mark as Featured property
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="verified"
              checked={!!editForm.verified}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, verified: e.target.checked }))
              }
            />
            {editForm.verified ? (
              <span className="text-green-700">
                Verified (click to unverify)
              </span>
            ) : (
              <span className="text-gray-700">Mark as Verified</span>
            )}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="phone_visible"
              checked={!!editForm.phone_visible}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  phone_visible: e.target.checked,
                }))
              }
            />
            {editForm.phone_visible ? (
              <span className="text-green-700">Phone Visible</span>
            ) : (
              <span className="text-gray-700">Hide Owner Phone</span>
            )}
          </label>
        </div>

        {/* === Media (Images & Videos) === */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-indigo-600">Media</h4>

          {/* Images */}
          {(editForm.image || []).length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Current Images
              </label>
              <div className="flex flex-wrap gap-3">
                {editForm.image.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 border rounded overflow-hidden cursor-move"
                    draggable
                    onDragStart={() => setDraggedIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex === null || draggedIndex === idx) return;
                      const updated = [...editForm.image];
                      const [moved] = updated.splice(draggedIndex, 1);
                      updated.splice(idx, 0, moved);
                      setEditForm((prev) => ({ ...prev, image: updated }));
                      setDraggedIndex(null);
                    }}
                  >
                    <img
                      src={img}
                      alt={`img-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(img, idx)}
                      className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1 rounded-bl hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
          />

          {/* Videos */}
          {(editForm.video || []).length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Current Videos
              </label>
              <div className="flex flex-wrap gap-3">
                {editForm.video.map((vid, idx) => (
                  <div
                    key={idx}
                    className="relative w-48 h-32 border rounded overflow-hidden"
                  >
                    <video
                      src={vid}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveVideo(idx)}
                      className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1 rounded-bl hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="video/*"
            className="mt-2"
            onChange={(e) => handleFileChange(e, "video")}
          />
        </div>

        {/* Newly Listed Position */}
        {editForm.is_newly_listed && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Newly Listed Position
            </label>
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
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
