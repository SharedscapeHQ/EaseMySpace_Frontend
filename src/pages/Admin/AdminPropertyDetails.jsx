import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllProperties,
  approveProperty,
  deleteProperty,
} from "../../api/adminApi";

export default function AdminPropertyDetails() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const { data } = await getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      fetchProperties(); // Refresh list
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      fetchProperties(); // Refresh list
    } catch (err) {
      console.error("Deletion failed", err);
    }
  };

  const pending = properties.filter((p) => p.status === "pending");
  const approved = properties.filter((p) => p.status === "approved");

  if (loading)
    return (
      <div className="pt-24 text-center text-indigo-600 font-medium">
        Loading properties...
      </div>
    );

  const renderPropertyCard = (property) => (
    <div key={property.id} className="p-4 border rounded shadow bg-white">
      <h3 className="text-lg font-bold text-indigo-800">{property.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
      <p className="text-gray-800 font-semibold mb-2">
        ₹{property.price.toLocaleString()}
      </p>
      <div className="flex gap-2 mb-2">
        <Link
          to={`/admin/properties/${property.id}`}
          className="text-blue-600 underline text-sm"
        >
          View Details
        </Link>
        {property.status === "pending" && (
          <button
            onClick={() => handleApprove(property.id)}
            className="text-green-600 text-sm hover:underline"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => handleDelete(property.id)}
          className="text-red-600 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-900 mb-6">
        Admin Property Management
      </h1>

      {/* Pending Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Pending Properties</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">No pending properties.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map(renderPropertyCard)}
          </div>
        )}
      </section>

      {/* Approved Section */}
      <section>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Approved Properties</h2>
        {approved.length === 0 ? (
          <p className="text-gray-500">No approved properties.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map(renderPropertyCard)}
          </div>
        )}
      </section>
    </div>
  );
}
