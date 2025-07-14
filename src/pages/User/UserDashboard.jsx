import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProperties } from "../../API/userApi";
import { logoutUser } from "../../API/authAPI";

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
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
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    const savedUser = localStorage.getItem("user"); 
    localStorage.removeItem("user");
    localStorage.removeItem("otp_verified");

    // Force storage event manually for same-tab update
    window.dispatchEvent(new StorageEvent("storage", {
      key: "user",
      oldValue: savedUser,
      newValue: null,
    }));

    navigate("/"); 
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Your Properties</button>
          <button className="text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Add New Property</button>
          <button className="text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Settings</button>
          <button
            onClick={handleLogout}
            className="text-left px-4 py-2 rounded bg-red-600 hover:bg-red-500 mt-6 transition font-medium"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Your Listed Properties</h2>

        {loading ? (
          <p>Loading your properties...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : properties.length === 0 ? (
          <div className="text-center mt-20 text-gray-600">
            <p>You haven't added any properties yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                <img
                  src={p.image || "https://via.placeholder.com/300x160?text=No+Image"}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    <strong>Price:</strong> ${p.price}<br />
                    <strong>Location:</strong> {p.location}<br />
                    <strong>Status:</strong> {p.flat_status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
