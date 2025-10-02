import React, { useState } from "react";
import { FaHome, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addProperty } from "../../api/propertiesApi";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    gender: "",
    looking_for: "",
    bhk_type: "",
    distance_from_station: "",
    bathrooms: "",
    owner_phone: "",
    description: "",
    image_base64: [],
    video_base64: [],
    amenities: [],
    pricingOptions: [],
  });

  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  const bhkOptions = [
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "4 BHK",
    "1 RK",
    "2 RK",
  ];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
        [`${type}_base64`]: [...prev[`${type}_base64`], ...base64s],
      }));
      e.target.value = "";
    } catch {
      toast.error(`Failed to process ${type} file(s)`);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedLocation = formData.location.trim();

  // Basic validation
  const requiredFields = ["title", "location", "gender", "owner_phone"];
  for (const field of requiredFields) {
    const value = field === "location" ? trimmedLocation : formData[field];
    if (!value) {
      toast.error(`Please fill ${field.replace("_", " ")}`);
      return;
    }
  }

  if (!formData.image_base64.length) {
    toast.error("Please upload at least one image");
    return;
  }

  // Validate that each room has at least one occupancy with values
  const validRooms = formData.pricingOptions.filter(
    (room) =>
      room.room_name &&
      room.occupancies &&
      room.occupancies.some((occ) => occ.occupancy && occ.price && occ.deposit)
  );

  if (validRooms.length === 0) {
    toast.error("Please enter at least one pricing option with occupancy");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const owner_code = user?.owner_code;
  if (!owner_code) {
    toast.error("Owner code missing. Please log in again.");
    return;
  }

  setUploading(true);
  try {
    await addProperty({
      ...formData,
      location: trimmedLocation,
      pricingOptions: validRooms, // send nested array directly
      owner_code,
    });

    toast.success("Property Added Successfully!");
    setShowPopup(true);

    // Reset form
    setFormData({
      title: "",
      location: "",
      gender: "",
      looking_for: "",
      bhk_type: "",
      distance_from_station: "",
      bathrooms: "",
      owner_phone: "",
      description: "",
      image_base64: [],
      video_base64: [],
      amenities: [],
      pricingOptions: [],
    });
  } catch (err) {
    console.error("Add property error:", err);
    toast.error("Failed to upload property");
  } finally {
    setUploading(false);
  }
};



  const renderSelect = (name, label, options, required = false) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
      <label className="font-semibold block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <motion.select
        whileFocus={{ scale: 1.01 }}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </motion.select>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-10">
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 space-y-8 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-3 mb-6">
          <FaHome /> Add Property Details
        </h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["title", "Title", true],
            ["location", "Location", true],
            ["owner_phone", "Owner Phone", true],
            ["bathrooms", "Bathrooms", false],
            ["distance_from_station", "Distance from Station", false],
          ].map(([key, label, required]) => (
            <div key={key}>
              <label className="font-semibold block mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={["bathrooms"].includes(key) ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={(e) => {
                  let val = e.target.value;
                  if (key === "owner_phone") val = val.replace(/\D/g, "").slice(0, 10);
                  handleChange({ target: { name: key, value: val } });
                }}
                placeholder={label}
                required={required}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelect("gender", "Gender Preference", ["male", "female", "any"], true)}
          {renderSelect("bhk_type", "BHK & RK Type", bhkOptions)}
          {renderSelect("looking_for", "Looking For", ["flatmate","vacant","pg"])}
        </div>

        {/* Pricing Section */}
        <div className="border-t pt-4">
          <h2 className="font-bold mb-2 text-indigo-600">Rent per Room</h2>
          {formData.pricingOptions.map((room, rIdx) => (
            <div key={rIdx} className="border p-4 rounded mb-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={room.room_name}
                  placeholder="Room Name"
                  onChange={(e) => {
                    const updated = [...formData.pricingOptions];
                    updated[rIdx].room_name = e.target.value;
                    setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                  }}
                  className="border px-2 py-1 rounded w-32"
                />
                <button
                  type="button"
                  className="text-red-600 font-bold"
                  onClick={() => {
                    const updated = [...formData.pricingOptions];
                    updated.splice(rIdx, 1);
                    setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                  }}
                >
                  ×
                </button>
              </div>

              {room.occupancies?.map((occ, oIdx) => (
                <div key={oIdx} className="flex gap-2 items-center mb-2">
                  <select
                    value={occ.occupancy}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].occupancy = e.target.value;
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border px-2 py-1 rounded w-32"
                  >
                    <option value="">Occupancy</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Rent (₹)"
                    value={occ.price}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].price = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border px-2 py-1 rounded w-32"
                  />

                  <input
                    type="text"
                    placeholder="Deposit (₹)"
                    value={occ.deposit}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].deposit = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border px-2 py-1 rounded w-32"
                  />

                  <button
                    type="button"
                    className="text-red-600 font-bold"
                    onClick={() => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies.splice(oIdx, 1);
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="bg-indigo-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  const updated = [...formData.pricingOptions];
                  if (!updated[rIdx].occupancies) updated[rIdx].occupancies = [];
                  updated[rIdx].occupancies.push({ occupancy: "", price: "", deposit: "" });
                  setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                }}
              >
                Add Occupancy
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                pricingOptions: [...prev.pricingOptions, { room_name: `Room ${prev.pricingOptions.length + 1}`, occupancies: [] }],
              }))
            }
          >
            Add Room
          </button>
        </div>

        {/* Amenities Section */}
        <div className="border-t pt-4">
          <h2 className="font-bold mb-2 text-indigo-600">Amenities</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
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
            onChange={handleChange}
            placeholder="Write something about the property..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
          />
        </div>

        {/* Media Uploads */}
        <div className="border-t pt-4">
          <h2 className="font-bold mb-2 text-indigo-600">Media Upload</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="w-full file:px-4 file:py-2 file:bg-indigo-100 file:text-indigo-700 file:rounded-lg"
            />
            {formData.image_base64.length > 0 && (
              <p className="text-green-600 flex items-center mt-1 gap-2">
                <FaCheckCircle /> {formData.image_base64.length} image(s) selected
              </p>
            )}
          </div>

          <div className="mb-4">
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
                <FaCheckCircle /> {formData.video_base64.length} video(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={uploading}
          whileTap={{ scale: 0.97 }}
          className={`w-1/2 py-3 font-semibold rounded-xl transition duration-300 ${
            uploading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Uploading..." : "Submit Property"}
        </motion.button>
      </motion.form>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowPopup(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white shadow-2xl rounded-xl p-6 max-w-sm w-full border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg text-blue-600 font-bold">Property Submitted!</h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Your property is in the queue for admin approval. Once approved, it will be visible on{" "}
                  <a
                    href="https://easemyspace.in/view-properties"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    EaseMySpace.in
                  </a>
                </p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProperty;
