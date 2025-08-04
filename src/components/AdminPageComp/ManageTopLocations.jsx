import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAllLocations,
  addLocation,
  deleteLocation,
} from "../../api/adminApi";

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
    if (!newLocation.trim()) {
      toast.error("Location name is required");
      return;
    }

    if (!imageFile) {
      toast.error("Image is required");
      return;
    }

    setIsAdding(true);

    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          const base64 = result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const payload = {
        name: newLocation.trim(),
        image_base64: imageBase64,
      };

      console.log("📦 Sending payload to backend:", payload);

      await addLocation(payload);

      setNewLocation("");
      setImageFile(null);
      fetchLocations();
      toast.success("Location added");
    } catch (error) {
      console.error("❌ Error adding location:", error?.response?.data || error.message);
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
    <div className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Top Locations</h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Enter location name"
          className="border p-2 w-full"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={handleImageChange}
        />
        <button
          onClick={handleAddLocation}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
            isAdding ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isAdding}
        >
          {isAdding ? "Adding…" : "Add Location"}
        </button>
      </div>

      <ul className="space-y-3">
        {locations.map((loc) => (
          <li
            key={loc.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <div className="flex items-center gap-3">
              {loc.image && (
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <span>{loc.name}</span>
            </div>
            <button
              onClick={() => setDeletingId(loc.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm text-center">
            <p className="text-lg mb-4 font-semibold">
              Are you sure you want to delete this location?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This will also remove it from the{" "}
              <strong>Top Locations</strong> section on the homepage.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="bg-gray-300 px-4 py-2 rounded"
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
