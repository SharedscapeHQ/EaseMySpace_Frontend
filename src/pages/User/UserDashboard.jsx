import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProperties, submitQuery } from "../../api/userApi";
import Sidebar from "../../components/UserPageComp/Sidebar";
import PropertyCard from "../../components/UserPageComp/PropertyCard";
import RaiseQueryModal from "../../components/UserPageComp/RaiseQueryModal";
import MyQueries from "../../components/UserPageComp/MyQueries";
import { logoutUser } from "../../api/authAPI";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("MyProperties");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewProperty, setViewProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (activeTab === "MyProperties") {
      fetchProperties();
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getUserProperties();
      setProperties(data);
      setError("");
    } catch (err) {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async (propertyId, message) => {
    try {
      await submitQuery(propertyId, message);
      alert("Query submitted successfully.");
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Failed to submit query.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10  lg:ml-64">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          {activeTab === "MyProperties"
            ? "Your Listed Properties"
            : "Your Raised Queries"}
        </h2>

        {activeTab === "MyProperties" ? (
          loading ? (
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
                  key={property._id}
                  property={property}
                  onRaiseQuery={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          )
        ) : (
          <MyQueries />
        )}

        {/* Modals */}
        {viewProperty && (
          <ViewPropertyModal
            property={viewProperty}
            onClose={() => setViewProperty(null)}
          />
        )}
        <RaiseQueryModal
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          property={selectedProperty}
          onSubmit={handleQuerySubmit}
        />
      </main>
    </div>
  );
}
