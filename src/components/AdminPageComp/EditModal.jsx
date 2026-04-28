import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function EditModal({
  editForm,
  setEditForm,
  editingProperty,
  setEditingProperty,
  handleEditChange,
  handleEditSubmit,
  removedOccupancies,
  setRemovedOccupancies,
}) {
  if (!editingProperty) return null;

  const [draggedImage, setDraggedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ---------------- File Handling ----------------
  const handleFileChange = async (e, type, category = null) => {
    const files = Array.from(e.target.files);

    const base64Files = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );

    // ✅ VIDEOS
    if (type === "video") {
      setEditForm((prev) => ({
        ...prev,
        video_base64: [...(prev.video_base64 || []), ...base64Files],
      }));
      return;
    }

    // ✅ CATEGORY IMAGES
    if (category) {
      setEditForm((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), ...base64Files],
      }));
      return;
    }

    // ✅ MAIN IMAGES
    setEditForm((prev) => ({
      ...prev,
      image: [...(prev.image || []), ...base64Files],
    }));
  };

  const handleRemoveImage = (img, idx, category = null) => {
    const target = category || "image";
    const updated = (editForm[target] || []).filter((_, i) => i !== idx);
    setEditForm((prev) => ({
      ...prev,
      [target]: updated,
      remove_image_urls: [...(prev.remove_image_urls || []), img],
    }));
    setEditingProperty((prev) => ({
      ...prev,
      [target]: updated,
    }));
  };

  const handleRemoveVideo = (idx) => {
    const updated = (editingProperty.video || []).filter((_, i) => i !== idx);

    setEditForm((prev) => ({
      ...prev,
      video: updated,
      remove_video_urls: [
        ...(prev.remove_video_urls || []),
        editingProperty.video[idx],
      ],
    }));

    setEditingProperty((prev) => ({
      ...prev,
      video: updated,
    }));
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
    const roomToRemove = editForm.pricing[roomIdx];

    if (roomToRemove?.occupancies?.length) {
      const newRemoved = roomToRemove.occupancies.map((occ) => ({
        room_name: roomToRemove.room_name,
        occupancy: occ.occupancy,
      }));
      setRemovedOccupancies((prevRemoved) => [...prevRemoved, ...newRemoved]);
    }

    setEditForm((prev) => {
      const updated = prev.pricing.filter((_, i) => i !== roomIdx);
      return { ...prev, pricing: updated };
    });
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
        locking_options: [],
      });
      return { ...prev, pricing: updated };
    });
  };

  const removeOccupancy = (roomIdx, occIdx) => {
    // ✅ Read the value BEFORE setEditForm, not inside it
    const pricing = editForm.pricing || [];
    const room = pricing[roomIdx];
    const removedOcc = room?.occupancies?.[occIdx];

    if (removedOcc?.occupancy) {
      setRemovedOccupancies((prev) => [
        ...prev,
        {
          room_name: room.room_name,
          occupancy: removedOcc.occupancy,
        },
      ]);
    }

    // Now safely update the form
    setEditForm((prev) => {
      const updated = prev.pricing.map((r, rIdx) => {
        if (rIdx !== roomIdx) return r;
        return {
          ...r,
          occupancies: r.occupancies.filter((_, i) => i !== occIdx),
        };
      });
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

  const handleLockingChange = (roomIdx, occIdx, values) => {
    setEditForm((prev) => {
      const updated = [...(prev.pricing || [])];

      updated[roomIdx].occupancies[occIdx].locking_options = values.map(
        (val) => ({
          period: val,
          deduction: 0,
        }),
      );

      return { ...prev, pricing: updated };
    });
  };

  // ---------------- Drag & Drop ----------------
  const handleDropToCategory = (category, dropIndex) => {
    if (!draggedImage) return;

    const fromCategory = draggedImage.fromCategory;
    const img = draggedImage.img;

    // Copy original array
    const fromArr = [...(editForm[fromCategory] || [])];

    // Remove the dragged image
    fromArr.splice(draggedImage.index, 1);

    // If same category, insert at the dropIndex
    if (fromCategory === category) {
      fromArr.splice(dropIndex, 0, img);
      setEditForm((prev) => ({
        ...prev,
        [category]: fromArr,
      }));
    } else {
      // Moving to a different category
      const toArr = [...(editForm[category] || [])];
      toArr.splice(dropIndex, 0, img);
      setEditForm((prev) => ({
        ...prev,
        [fromCategory]: fromArr,
        [category]: toArr,
      }));
    }

    setDraggedImage(null);
  };

  const renderImages = (images = [], category = null) => (
    <div className="flex flex-wrap gap-3">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative w-24 h-24 border rounded overflow-hidden cursor-move"
          draggable
          onDragStart={() =>
            setDraggedImage({
              img,
              fromCategory: category || "image",
              index: idx,
            })
          }
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDropToCategory(category || "image", idx)}
        >
          <img src={img} className="w-full h-full object-cover" />
          <button
            onClick={() => handleRemoveImage(img, idx, category)}
            className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1 rounded-bl hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  const categories = [
    { key: "bedroom_images", label: "Bedroom Images" },
    { key: "kitchen_images", label: "Kitchen Images" },
    { key: "bathroom_images", label: "Bathroom Images" },
    { key: "hall_images", label: "Hall Images" },
    { key: "additional_images", label: "Additional Images" },
  ];

  const handleSave = async () => {
    if (!editForm.display_location || !editForm.display_location.trim()) {
      toast.error("Display location is required");
      return;
    }
    if (isSaving) return;

    try {
      setIsSaving(true);
      await handleEditSubmit();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl  mb-6 text-center">Edit Property</h3>

        {/* === Basic Info === */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-1">
            Basic Info
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["title", "Title"],
              ["location", "Location"],
              ["pincode", "Pincode"],
              ["display_location", "Display Location"],
              ["commission_percent", "Commission %"],
              [
                "status",
                "Status",
                "select",
                ["pending", "approved", "rejected"],
              ],
              [
                "bhk_type",
                "BHK Type",
                "select",
                [
                  "1 RK",
                  "2 RK",
                  "1 BHK",
                  "1.5 BHK",
                  "2 BHK",
                  "2.5 BHK",
                  "3 BHK",
                  "4 BHK",
                ],
              ],
              [
                "looking_for",
                "Looking For",
                "select",
                ["flatmate", "vacant", "pg"],
              ],
              ["gender", "Gender", "select", ["male", "female", "any"]],
              [
                "food_preference",
                "Food Preference",
                "select",
                ["any", "veg", "nonveg", "vegan"],
              ],
              // ["owner_code", "Owner Code"],
              ["added_by_email", "Owner Email"],
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
                    disabled={field === "added_by_email"}
                    className={`w-full border px-3 py-2 rounded ${
                      field === "added_by_email"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                  />
                )}
              </div>
            ))}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">Source:</span>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 border">
                {editForm.source || "mainwebsite"}
              </span>
            </div>
          </div>
        </div>

        {/* === Rent per Room & Occupancy === */}
        <div className="mb-6 border-t pt-4">
          <h4 className=" mb-3 text-indigo-600">
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
                        e.target.value,
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
                        e.target.value,
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
                        e.target.value,
                      )
                    }
                    className="border px-2 py-2 rounded w-32"
                  />
                  {/* 🔽 Lock-in UI BELOW rent & deposit */}
                  <div className="w-full mt-2">
                    {(occ.locking_options || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {(occ.locking_options || []).map((lock, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 border px-3 py-1 rounded-full bg-gray-100"
                          >
                            {/* Dropdown */}
                            <select
                              value={lock.period || lock.lockin}
                              onChange={(e) => {
                                const val = Number(e.target.value);

                                setEditForm((prev) => {
                                  const updated = [...prev.pricing];
                                  updated[roomIdx].occupancies[
                                    occIdx
                                  ].locking_options[idx].period = val;
                                  return { ...prev, pricing: updated };
                                });
                              }}
                              className="bg-transparent text-sm outline-none"
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (val) => (
                                  <option key={val} value={val}>
                                    {val} month{val > 1 ? "s" : ""}
                                  </option>
                                ),
                              )}
                            </select>

                            {/* Remove button */}
                            <button
                              onClick={() => {
                                setEditForm((prev) => {
                                  const updated = [...prev.pricing];
                                  updated[roomIdx].occupancies[
                                    occIdx
                                  ].locking_options = updated[
                                    roomIdx
                                  ].occupancies[occIdx].locking_options.filter(
                                    (_, i) => i !== idx,
                                  );
                                  return { ...prev, pricing: updated };
                                });
                              }}
                              className="text-red-500 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {/* Add more */}
                        <button
                          onClick={() => {
                            setEditForm((prev) => {
                              const updated = [...prev.pricing];
                              updated[roomIdx].occupancies[
                                occIdx
                              ].locking_options.push({
                                period: 6,
                                deduction: 0,
                              });
                              return { ...prev, pricing: updated };
                            });
                          }}
                          className="text-sm text-blue-600 hover:underline ml-2"
                        >
                          + Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditForm((prev) => {
                            const updated = [...prev.pricing];
                            updated[roomIdx].occupancies[
                              occIdx
                            ].locking_options = [{ period: 6, deduction: 0 }];
                            return { ...prev, pricing: updated };
                          });
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        + Add Lock-in
                      </button>
                    )}
                  </div>
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
          <h4 className=" mb-3 text-indigo-600">Amenities</h4>
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
                  checked={
                    Array.isArray(editForm.amenities)
                      ? editForm.amenities.includes(amenity)
                      : false
                  }
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
                        ...(Array.isArray(prev.amenities)
                          ? prev.amenities
                          : []),
                        ...custom,
                      ]),
                    ),
                  }));
                }
              }}
            />
          </div>
        </div>

        {/* === Description === */}
        <div className="mb-6">
          <h4 className=" mb-2 text-indigo-600">Description</h4>
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
          {/* Listing Payment Required */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Listing Payment Required
            </label>

            <select
              value={editForm.listing_payment_required ? "yes" : "no"}
              onChange={(e) => {
                const isRequired = e.target.value === "yes";

                setEditForm((prev) => ({
                  ...prev,
                  listing_payment_required: isRequired,
                  listing_fee_percent: isRequired
                    ? prev.listing_fee_percent || 5
                    : null,
                }));
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* Percentage field (only if YES) */}
         {editForm.listing_payment_required && (
  <>
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">Fee Type</label>
      <select
        value={editForm.listing_fee_type || "percent"}
        onChange={(e) =>
          setEditForm((prev) => ({ ...prev, listing_fee_type: e.target.value }))
        }
        className="border px-3 py-2 rounded"
      >
        <option value="percent">% of Rent</option>
        <option value="fixed">Fixed Amount (₹)</option>
      </select>
    </div>

    {editForm.listing_fee_type === "fixed" ? (
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Listing Fee (₹)</label>
        <input
          type="number" min="0"
          value={editForm.listing_fee_amount ?? ""}
          onChange={(e) =>
            setEditForm((prev) => ({
              ...prev,
              listing_fee_amount: e.target.value.replace(/[^0-9]/g, ""),
            }))
          }
          className="border px-3 py-2 rounded"
          placeholder="e.g. 399"
        />
      </div>
    ) : (
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Listing Fee (%)</label>
        <input
          type="number" min="0" max="100"
          value={editForm.listing_fee_percent ?? ""}
          onChange={(e) =>
            setEditForm((prev) => ({
              ...prev,
              listing_fee_percent: e.target.value.replace(/[^0-9]/g, ""),
            }))
          }
          className="border px-3 py-2 rounded"
          placeholder="e.g. 5"
        />
      </div>
    )}
  </>
)}
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

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="meals_included"
              checked={!!editForm.meals_included}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  meals_included: e.target.checked,
                }))
              }
            />
            Meal Included
          </label>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Additional Charges Text */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Additional Charges
            </label>
            <input
              type="text"
              placeholder="E.g., Parking ₹500, Electricity extra"
              value={editForm.additional_charges || ""}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  additional_charges: e.target.value,
                }))
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        {/* === Main Images Section === */}
        <div className="mb-6">
          <h4 className=" mb-3 text-indigo-600">Current Images</h4>
          {renderImages(editForm.image || [], null)}
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-2"
            onChange={(e) => handleFileChange(e, "image")}
          />
        </div>

        {/* === Category Sections === */}
        {categories.map(({ key, label }) => (
          <div
            key={key}
            className="mb-4 border p-3 rounded"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropToCategory(key)}
          >
            <h5 className=" mb-2">{label}</h5>
            {renderImages(editForm[key] || [], key)}
            <input
              type="file"
              multiple
              accept="image/*"
              className="mt-2"
              onChange={(e) => handleFileChange(e, "image", key)}
            />
          </div>
        ))}

        {/* === Videos Section === */}
        <div className="mb-6">
          <h4 className=" mb-3 text-indigo-600">Videos</h4>

          {/* EXISTING VIDEOS */}
          {(editingProperty.video || []).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {editingProperty.video.map((vid, idx) => (
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
          )}

          {/* NEW VIDEOS PREVIEW */}
          {(editForm.video_base64 || []).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {editForm.video_base64.map((vid, idx) => (
                <video
                  key={idx}
                  src={vid}
                  controls
                  className="w-48 h-32 border rounded object-cover"
                />
              ))}
            </div>
          )}

          {/* UPLOAD INPUT */}
          <input
            type="file"
            multiple
            accept="video/*"
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
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                />
              </svg>
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
