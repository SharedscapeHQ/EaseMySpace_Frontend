import React, { useState, useEffect } from "react";
import { FaHome, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addProperty } from "../../api/propertiesApi";

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
    amenities: [],
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
  const [showPopup, setShowPopup] = useState(false);

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

      // Show popup
      setShowPopup(true);

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
        amenities: [],
      });
    } catch {
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  // Auto-hide popup after 5 seconds
  useEffect(() => {
    if (showPopup) {
      // const timer = setTimeout(() => setShowPopup(false), 5000);
      // return () => clearTimeout(timer);
    }
  }, [showPopup]);

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
    <div className="min-h-screen bg-indigo-50 p-4 md:p-10 relative">
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
        {renderSelect("looking_for", "Looking For", ["flatmate", "vacant", "pg"])}

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
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Other Amenities
              </label>
              <input
                type="text"
                placeholder="e.g. gym, garden, intercom"
                onBlur={(e) => {
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
                }}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate with commas (e.g. intercom, gym)
              </p>
            </div>
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

    {/* Popup Container */}
    <div style={{fontFamily:"para_font"}} className="fixed inset-0 flex items-center justify-center z-50 px-4">
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

       <div className="flex items-center justify-center   mt-4">
  <span className="text-sm text-green-700">For any query connect with us on</span>
  <button
    onClick={() =>
      window.open(
        "https://wa.me/+919004463371?text=Hi,%20I’ve%20just%20listed%20my%20property%20on%20your%20EasemySpace.in.%20Please%20approve%20it%20and%20let%20me%20know%20the%20status."
      )
    }
    className=" text-green-600 py-2 px-4 rounded-full hover:text-green-700 transition flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path d="M20.52 3.48A11.77 11.77 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.97L0 24l6.3-1.65A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.18-1.24-6.17-3.48-8.52zM12 22a9.9 9.9 0 01-5.05-1.38l-.36-.21-3.73.98 1-3.64-.24-.38A9.95 9.95 0 012 12c0-5.51 4.49-10 10-10s10 4.49 10 10-4.49 10-10 10zm5.44-7.62c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
    </svg>
  </button>
</div>

      </motion.div>
    </div>
  </>
)}

</AnimatePresence>


    </div>
  );
};

export default AddProperty;
