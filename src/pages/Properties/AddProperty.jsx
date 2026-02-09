import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addProperty } from "../../api/propertiesApi";

import PropertyBasicInfo from "../../components/AddPropertyPageComp/PropertyBasicInfo";
import PricingSection from "../../components/AddPropertyPageComp/PricingSection";
import AmenitiesMediaDescription from "../../components/AddPropertyPageComp/AmenitiesMediaDescription";

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
    bedroom_images_base64: [],
  kitchen_images_base64: [],
  bathroom_images_base64: [],
  hall_images_base64: [],
  additional_images_base64: [],
    image_base64: [],
    video_base64: [],
    amenities: [],
    pricingOptions: [],
  });

  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedLocation = formData.location?.trim() || "";
  const requiredFields = ["title", "location", "gender", "owner_phone"];

  for (const field of requiredFields) {
    const value = field === "location" ? trimmedLocation : formData[field];
    if (!value) {
      toast.error(`Please fill ${field.replace("_", " ")}`);
      return;
    }
  }

  // ✅ Check mandatory image sections
  const requiredImageSections = [
    "bedroom_images_base64",
    "kitchen_images_base64",
    "bathroom_images_base64",
    "hall_images_base64",
  ];

  const missingSections = requiredImageSections.filter(
    (section) => !formData[section] || formData[section].length === 0
  );

  if (missingSections.length > 0) {
    toast.error(
      `Please upload at least one image for: ${missingSections
        .map((s) => s.replace("_base64", "").replace("_", " "))
        .join(", ")}`
    );
    return;
  }

  // Filter valid pricing rooms
  const validRooms = (formData.pricingOptions || []).filter(
    (room) =>
      room.room_name &&
      room.occupancies &&
      room.occupancies.some((occ) => occ.occupancy && occ.price && occ.deposit)
  );

  if (!validRooms.length) {
    toast.error("Please enter at least one pricing option with occupancy");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
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
      pricingOptions: validRooms,
      owner_code,
    });

    setShowPopup(true);

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
      bedroom_images_base64: [],
      kitchen_images_base64: [],
      bathroom_images_base64: [],
      hall_images_base64: [],
      additional_images_base64: [],
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

  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-10">
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 space-y-8 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontFamily: "para_font" }} className="text-3xl font-bold text-indigo-700 flex items-center gap-3 mb-6">
          <FaHome /> Add Property Details
        </h1>

        <PropertyBasicInfo formData={formData} setFormData={setFormData} />
        <PricingSection formData={formData} setFormData={setFormData} />
        <AmenitiesMediaDescription
          formData={formData}
          setFormData={setFormData}
        />

        <motion.button
          type="submit"
          disabled={uploading}
          whileTap={{ scale: 0.97 }}
          className={`w-1/2 py-3 font-semibold rounded-xl transition duration-300 ${
            uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Uploading..." : "Submit Property"}
        </motion.button>
      </motion.form>

      {/* ✅ Simplified Popup */}
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
                  <h2 style={{ fontFamily: "para_font" }} className="text-lg text-blue-600 font-bold">
                    Property Submitted!
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Your property is in the queue for admin approval. Once approved,
                  it will be visible on{" "}
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
