import React, { useEffect, useState } from "react";
import { FiCheck, FiX, FiUser } from "react-icons/fi";
import { getAllPostRequests, handlePostRequest } from "../../API/adminApi";

export default function PostPermissionRequests() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllPostRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch post requests", err);
    } finally {
      setLoading(false);
    }
  };

 const handleActionClick = async (userId, action) => {
  try {
    setActionLoading(userId);
    await handlePostRequest(userId, action); 
    setRequests((prev) => prev.filter((u) => u.id !== userId));
  } catch (err) {
    console.error("Failed to update post request", err);
    alert("Something went wrong. Try again.");
  } finally {
    setActionLoading(null);
  }
};


  const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const options = {
    month: "short", // Jan, Feb, etc.
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return `${day}${daySuffix} ${date.toLocaleString("en-US", options)}`;
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Post Permission Requests
      </h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No pending requests</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Requested On
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <FiUser />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.firstName}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">{user.phone}</td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                   {user.requested_at ? formatDateTime(user.requested_at) : "-"}

                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                    <button
  disabled={actionLoading === user.id}
  onClick={() => handleActionClick(user.id, "approve")}
  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
>
  <FiCheck /> Approve
</button>

<button
  disabled={actionLoading === user.id}
  onClick={() => handleActionClick(user.id, "reject")}
  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
>
  <FiX /> Reject
</button>


                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
