import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProperties, submitQuery } from "../../API/userApi";
import { logoutUser } from "../../API/authAPI";
import Sidebar from "../../components/UserPageComp/Sidebar";
import PropertyCard from "../../components/UserPageComp/PropertyCard";
import RaiseQueryModal from "../../components/UserPageComp/RaiseQueryModal";
import ViewPropertyModal from "../../components/UserPageComp/ViewPropertyModal"; 

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null); // for RaiseQueryModal
  const [viewProperty, setViewProperty] = useState(null); // for ViewPropertyModal
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getUserProperties();
      setProperties(data);
      setError(null);
    } catch {
      setError("Failed to load your properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      const savedUser = localStorage.getItem("user");
      localStorage.removeItem("user");
      localStorage.removeItem("otp_verified");
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          oldValue: savedUser,
          newValue: null,
        })
      );
      navigate("/");
    }
  };

  const handleQuerySubmit = async (propertyId, message) => {
    try {
      await submitQuery(propertyId, message);
      alert("Query submitted successfully!");
      setSelectedProperty(null); // close modal after success
    } catch (err) {
      console.error(err);
      alert("Failed to submit query.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Your Listed Properties
        </h2>

        {loading ? (
          <p>Loading your properties...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : properties.length === 0 ? (
          <p className="text-center mt-20 text-gray-600">
            You haven't added any properties yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onRaiseQuery={() => setSelectedProperty(property)}
                onViewDetails={() => setViewProperty(property)} // 👈 pass view handler
              />
            ))}
          </div>
        )}

        {/* View-only modal */}
        {viewProperty && (
          <ViewPropertyModal
            property={viewProperty}
            onClose={() => setViewProperty(null)}
          />
        )}

        {/* Raise Query modal */}
        <RaiseQueryModal
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          property={selectedProperty}
          onSubmit={handleQuerySubmit}
        />
      </main>
    </div>
  );
};

export default UserDashboard;
