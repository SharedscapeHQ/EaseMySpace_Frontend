import React, { useState } from "react";
import { FaHome, FaRupeeSign, FaMapMarkerAlt, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { addProperty } from "../../API/propertiesApi";  // Import the API function

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    flat_status: "",
    image_base64: "",
    image_mime: "",
    video_base64: "",
    video_mime: "",
  });

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await toBase64(file);
      const [, mime, base64] = dataUrl.match(/^data:(.+);base64,(.*)$/);
      setFormData((prev) => ({
        ...prev,
        [`${type}_mime`]: mime,
        [`${type}_base64`]: base64,
      }));
    } catch {
      setError(`Failed to read ${type} file.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.location || !formData.flat_status || !formData.image_base64) {
      setError("Please fill in all required fields and upload an image.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const response = await addProperty(formData);  // Use the imported API function
      alert("Property submitted successfully!");
      setFormData({
        title: "",
        price: "",
        location: "",
        flat_status: "",
        image_base64: "",
        image_mime: "",
        video_base64: "",
        video_mime: "",
      });
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen flex justify-center items-start px-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 bg-white rounded-3xl shadow-2xl p-10">
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="flex items-center text-3xl font-extrabold mb-8 text-indigo-700">
            <FaHome className="mr-3 text-indigo-500" /> Add New Property
          </h2>

          {error && (
            <p className="mb-6 text-center text-red-600 font-semibold bg-red-100 p-3 rounded">{error}</p>
          )}

          {/* Title */}
          <div className="mb-6 relative">
            <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">
              Title <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <FaHome className="text-gray-400 ml-3" />
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Spacious 2BHK Flat in Bandra"
                className="w-full px-4 py-3 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 relative">
            <label htmlFor="price" className="block mb-2 font-semibold text-gray-700">
              Price (₹ per month) <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <FaRupeeSign className="text-gray-400 ml-3" />
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="12000"
                className="w-full px-4 py-3 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 relative">
            <label htmlFor="location" className="block mb-2 font-semibold text-gray-700">
              Location <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <FaMapMarkerAlt className="text-gray-400 ml-3" />
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Andheri West, Mumbai"
                className="w-full px-4 py-3 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Flat Status */}
          <div className="mb-6 relative">
            <label htmlFor="flat_status" className="block mb-2 font-semibold text-gray-700">
              Flat Status <span className="text-red-600">*</span>
            </label>
            <input
              id="flat_status"
              name="flat_status"
              type="text"
              value={formData.flat_status}
              onChange={handleInputChange}
              placeholder="Ex: Available, Booked, Under Renovation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6 relative">
            <label className="block mb-2 font-semibold text-gray-700">
              Image (jpg/png) <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              required
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
            />
            {formData.image_base64 && (
              <p className="mt-2 text-green-600 flex items-center gap-2">
                <FaCheckCircle /> Image loaded successfully
              </p>
            )}
          </div>

          {/* Video Upload */}
          <div className="mb-8 relative">
            <label className="block mb-2 font-semibold text-gray-700">
              Video (mp4) – optional
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, "video")}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
            />
            {formData.video_base64 && (
              <p className="mt-2 text-green-600 flex items-center gap-2">
                <FaCheckCircle /> Video loaded successfully
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-indigo-600 text-white font-bold py-4 rounded-lg shadow-md transition duration-300 ease-in-out ${
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
          <p>- Adding a video is optional but can help showcase the property better.</p>
        </aside>
      </div>
    </div>
  );
};

export default AddProperty;
