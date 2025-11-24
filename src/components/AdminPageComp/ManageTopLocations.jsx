import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllLocations, addLocation, deleteLocation } from "../../api/adminApi";
import { FiTrash2 } from "react-icons/fi";

function ManageTopLocations() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await getAllLocations();
      setLocations(res.data.locations || []);
    } catch (error) {
      console.error("Error fetching locations:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return toast.error("Location name is required");
    if (!imageFile) return toast.error("Image is required");

    setIsAdding(true);

    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const payload = { name: newLocation.trim(), image_base64: imageBase64 };
      await addLocation(payload);

      setNewLocation("");
      setImageFile(null);
      fetchLocations();
      toast.success("Location added successfully");
    } catch (error) {
      console.error("Error adding location:", error?.response?.data || error.message);
      toast.error("Failed to add location");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteLocation(deletingId);
      setDeletingId(null);
      fetchLocations();
      toast.success("Location deleted");
    } catch (error) {
      console.error("Error deleting location:", error.message);
      toast.error("Failed to delete location");
    }
  };

  return (
    <div style={{fontFamily:"para_font"}} className="p-6 w-full max-w-3xl mx-auto">
      <h2 style={{fontFamily:"heading_font"}} className="text-3xl  mb-6 text-gray-800">Manage Top Locations</h2>

      {/* Add Location Form */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
        <h3 className="text-lg mb-4 text-gray-700">Add New Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            placeholder="Location Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            onChange={handleImageChange}
          />
          <button
            onClick={handleAddLocation}
            className={`col-span-1 md:col-span-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow ${
              isAdding ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isAdding}
          >
            {isAdding ? "Adding…" : "Add Location"}
          </button>
        </div>
      </div>

      {/* Locations List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex justify-between items-center bg-white rounded-xl shadow p-4 hover:shadow-lg transition border border-gray-200"
          >
            <div className="flex items-center gap-4">
              {loc.image && (
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-300"
                />
              )}
              <span className="text-gray-800 font-medium">{loc.name}</span>
            </div>
            <button
              onClick={() => setDeletingId(loc.id)}
              className="text-red-600 hover:text-red-800 transition p-2 rounded-full hover:bg-red-100"
              title="Delete Location"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-[90%] text-center border border-gray-200">
            <h4 className="text-xl  text-gray-800 mb-2">
              Confirm Deletion
            </h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this location? This will remove it from the <strong>Top Locations</strong> section.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTopLocations;
