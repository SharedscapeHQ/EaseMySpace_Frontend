import React, { useState } from "react";
import { FaHome, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { addProperty } from "../../API/propertiesApi";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    deposit: "",
    location: "",
    gender: "",
    looking_for: "",
    bhk_type: "",
    occupancy: "",
    distance_from_station: "",
    bathrooms: "",
    owner_phone: "",
    description: "",
    image_base64: [],
    video_base64: [],
    amenities: [], // ✅ added
  });

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

  const [uploading, setUploading] = useState(false);

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
      const base64s = await Promise.all(
        files.map(async (file) => {
          const result = await toBase64(file);
          const [, , data] = result.match(/^data:(.+);base64,(.*)$/);
          return data;
        })
      );
      setFormData((prev) => ({
        ...prev,
        [`${type}_base64`]: [...prev[`${type}_base64`], ...base64s],
      }));
    } catch {
      toast.error(`Failed to process ${type} file(s)`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "title",
      "price",
      "deposit",
      "location",
      "gender",
      "owner_phone",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill ${field.replace("_", " ")}`);
        return;
      }
    }
    if (!formData.image_base64.length) {
      toast.error("Please upload at least one image");
      return;
    }

    setUploading(true);
    try {
      await addProperty(formData);
      toast.success("Property Added Successfully!");
      setFormData({
        title: "",
        price: "",
        deposit: "",
        location: "",
        gender: "",
        looking_for: "",
        bhk_type: "",
        occupancy: "",
        distance_from_station: "",
        bathrooms: "",
        owner_phone: "",
        description: "",
        image_base64: [],
        video_base64: [],
        amenities: [], // ✅ reset
      });
    } catch {
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const renderSelect = (name, label, options, required = false) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <label className="font-semibold block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <motion.select
        whileFocus={{ scale: 1.01 }}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 border rounded-lg mb-4"
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
      <Toaster />
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
          <FaHome /> Add Property Details
        </h1>

        {/* Text Inputs */}
        {[
          ["title", "Your Name", true],
          ["location", "Location", true],
          ["price", "Rent (₹)", true],
          ["deposit", "Security Deposit (₹)", true],
          ["owner_phone", "Owner Phone Number", true],
          ["distance_from_station", "Distance from Station", false],
          ["bathrooms", "Number of Bathrooms", false],
        ].map(([key, label, required]) => (
          <div key={key}>
            <label className="font-semibold block mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              type={["price", "deposit", "bathrooms"].includes(key) ? "number" : "text"}
              placeholder={label}
              required={required}
              className="w-full px-4 py-3 border rounded-lg mb-4"
            />
          </div>
        ))}

        {/* Dropdowns */}
        {renderSelect("gender", "Gender Preference", ["male", "female", "others"], true)}
        {renderSelect("bhk_type", "BHK Type", [
          "1 BHK",
          "1.5 BHK",
          "2 BHK",
          "2.5 BHK",
          "3 BHK",
          "4 BHK",
        ])}
        {renderSelect("occupancy", "Occupancy", ["single", "double", "triple"])}
        {renderSelect("looking_for", "Looking For", ["flatmate", "vacant"])}

        {/* Amenities Section */}
        <div>
          <label className="font-semibold block mb-2">Select Amenities</label>
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
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold block mb-1">Short Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write something about the property..."
            className="w-full px-4 py-3 border rounded-lg mb-4"
            rows="4"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Image *</label>
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

        {/* Video Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Video</label>
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

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={uploading}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3 font-semibold rounded-xl transition duration-300 ${
            uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Uploading..." : "Submit Property"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddProperty;
