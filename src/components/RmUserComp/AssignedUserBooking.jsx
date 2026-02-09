import React, { useEffect, useState } from "react";
import { getAssignedUserBooking } from "../../api/rmApi";

export default function AssignedUsers() {
  const [users, setUsers] = useState([]);

  const rm = JSON.parse(localStorage.getItem("user"));
  const rmId = rm?.id;

  useEffect(() => {

    if (!rmId) {
      console.warn("RM ID is missing. Cannot fetch assigned users.");
      return;
    }

    async function fetchUsers() {
      try {
        const data = await getAssignedUserBooking(rmId);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching assigned users:", err);
      }
    }

    fetchUsers();
  }, [rmId]);

  return (
    <div className="p-6">
      <h1 style={{ fontFamily: "para_font" }} className="text-3xl  text-indigo-700 mb-4">Bookings Schedule</h1>
      <p className="text-gray-600 mb-6">
        Bookings Assigned to you
      </p>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">👤 No assigned users with bookings yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user, i) => (
            <div
              key={i}
              className="border rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <h2 style={{ fontFamily: "para_font" }} className=" text-xl text-indigo-600 mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 mb-1">{user.email} | {user.phone}</p>
              <p className="text-gray-500 mb-2">Gender: {user.gender}</p>
              <p className="text-gray-700 mb-1">
                📍 Property: {user.property_name}
              </p>
              <p className="text-gray-700 mb-3">
                📅 {new Date(user.date).toLocaleDateString()} ⏰ {user.time}
              </p>
              <a
                href={`/properties/${user.property_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                View Property
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
