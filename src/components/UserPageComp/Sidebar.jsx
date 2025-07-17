import React from "react";

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-60 bg-gray-800 text-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <button className="text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
          Your Properties
        </button>
       
        <button
          onClick={onLogout}
          className="text-left px-4 py-2 rounded bg-red-600 hover:bg-red-500 mt-6 transition font-medium"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
