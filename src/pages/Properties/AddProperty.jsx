import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { addProperty } from "../../API/propertiesApi"; // Your API function
import { loginUser } from "../../API/authAPI"; // Your auth API

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "", // will hold logged-in user's name
    price: "",
    location: "",
    flat_status: "",
    image_base64: [],
    video_base64: [],
    looking_for: "",
    bhk: "",
    occupancy: "",
    distance_from_station: "",
  });

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Convert file to base64 helper
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // Load logged-in user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await loginUser(); 
        setFormData((prev) => ({ ...prev, title: user.firstName + " " + user.lastName }));
      } catch (err) {
        console.error("Failed to load user info", err);
        setError("Failed to load user info");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    try {
      const base64s = await Promise.all(
        files.map(async (file) => {
          const result = await toBase64(file);
          const [, , base64] = result.match(/^data:(.+);base64,(.*)$/);
          return base64;
        })
      );

      setFormData((prev) => ({
        ...prev,
        [`${type}_base64`]: [...prev[`${type}_base64`], ...base64s],
      }));
    } catch {
      setError(`Failed to read ${type} files.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.location ||
      !formData.flat_status ||
      formData.image_base64.length === 0
    ) {
      setError("Please fill all required fields and upload at least one image.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      await addProperty(formData);
      alert("Property submitted successfully!");
      setFormData({
        title: formData.title, // keep the user name after submit
        price: "",
        location: "",
        flat_status: "",
        image_base64: [],
        video_base64: [],
        looking_for: "",
        bhk: "",
        occupancy: "",
        distance_from_station: "",
      });
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen">
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen flex justify-center items-start px-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 bg-white rounded-3xl shadow-2xl p-10">
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="flex items-center text-3xl font-extrabold mb-8 text-indigo-700">
            <FaHome className="mr-3 text-indigo-500" /> Add New Property
          </h2>

          {error && (
            <p className="mb-6 text-center text-red-600 font-semibold bg-red-100 p-3 rounded">
              {error}
            </p>
          )}

          {/* Title (User Name, uneditable) */}
          <div className="mb-6">
            <label className="font-semibold">Title (User Name) *</label>
            <input
              name="title"
              value={formData.title}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="font-semibold">Price (₹/month) *</label>
            <input
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="12000"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="font-semibold">Location *</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Andheri West, Mumbai"
              required
            />
          </div>

          {/* Flat Status */}
          <div className="mb-6">
            <label className="font-semibold">Flat Status *</label>
            <input
              name="flat_status"
              value={formData.flat_status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Available / Booked"
              required
            />
          </div>

          {/* Looking For (Dropdown) */}
          <div className="mb-6">
            <label className="font-semibold">Looking For</label>
            <select
              name="looking_for"
              value={formData.looking_for}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="flatmate">Flatmate</option>
              <option value="vacant">Vacant Flat</option>
            </select>
          </div>

          {/* BHK (Dropdown) */}
          <div className="mb-6">
            <label className="font-semibold">BHK</label>
            <select
              name="bhk"
              value={formData.bhk}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          {/* Occupancy (Dropdown) */}
          <div className="mb-6">
            <label className="font-semibold">Occupancy</label>
            <select
              name="occupancy"
              value={formData.occupancy}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>

          {/* Distance from Station */}
          <div className="mb-6">
            <label className="font-semibold">Distance from Station</label>
            <input
              name="distance_from_station"
              value={formData.distance_from_station}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="e.g. 500 meters"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="font-semibold">Upload Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "image")}
              className="block w-full mt-1 text-sm file:bg-indigo-50 file:text-indigo-700 file:rounded file:px-4 file:py-2 file:border-0 hover:file:bg-indigo-100"
              required
            />
            {formData.image_base64.length > 0 && (
              <p className="mt-2 text-green-600 flex items-center gap-2">
                <FaCheckCircle /> {formData.image_base64.length} image(s) selected
              </p>
            )}
          </div>

          {/* Video Upload */}
          <div className="mb-8">
            <label className="font-semibold">Upload Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, "video")}
              className="block w-full mt-1 text-sm file:bg-indigo-50 file:text-indigo-700 file:rounded file:px-4 file:py-2 file:border-0 hover:file:bg-indigo-100"
            />
            {formData.video_base64.length > 0 && (
              <p className="mt-2 text-green-600 flex items-center gap-2">
                <FaCheckCircle /> {formData.video_base64.length} video(s) selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-indigo-600 text-white font-bold py-4 rounded-lg transition duration-300 ${
              uploading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Submit Property"}
          </button>
        </form>

        {/* Info Sidebar */}
        <aside className="hidden lg:flex flex-col bg-indigo-50 rounded-3xl p-8 max-w-md text-indigo-900 shadow-lg">
          <div className="flex items-center mb-6">
            <FaInfoCircle className="text-indigo-600 mr-3 text-3xl" />
            <h3 className="text-xl font-bold">Need help filling the form?</h3>
          </div>
          <p className="mb-4">- Make sure your title is catchy and descriptive.</p>
          <p className="mb-4">- Set a competitive price based on the market rates.</p>
          <p className="mb-4">- Include an accurate location to attract the right tenants.</p>
          <p className="mb-4">- Specify the current status of the flat (e.g., Available, Booked).</p>
          <p className="mb-4">- Upload a clear image for the best first impression.</p>
          <p>- Adding a video is optional but can help show the property better.</p>
        </aside>
      </div>
    </div>
  );
};

export default AddProperty;
