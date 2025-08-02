import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { getAllLocations, addLocation, deleteLocation } from "../../api/adminApi";

function ManageTopLocations() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [deletingId, setDeletingId] = useState(null); // For confirmation popup

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await getAllLocations();
      setLocations(res.data.locations);
    } catch (error) {
      console.error("Error fetching locations:", error.message);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;

    try {
      await addLocation(newLocation);
      setNewLocation("");
      fetchLocations();
    } catch (error) {
      console.error("Error adding location:", error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteLocation(deletingId);
      setDeletingId(null);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error.message);
    }
  };

  return (
    <div className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Top Locations</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter location name"
          className="border p-2 w-full"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
        <button
          onClick={handleAddLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {locations.map((loc) => (
          <li key={loc.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <span>{loc.name}</span>
            <button
              onClick={() => setDeletingId(loc.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* 🔔 Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm text-center">
            <p className="text-lg mb-4 font-semibold">
              Are you sure you want to delete this location?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This will also remove it from the <strong>Top Locations</strong> section on the homepage.
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
