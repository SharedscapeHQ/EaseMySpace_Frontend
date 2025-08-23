import React from "react";
import { Link } from "react-router-dom";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
   
      <>
      <div className="w-full bg-blue-100 mt-5 flex flex-col md:flex-row items-center justify-between px-4 py-2 rounded-lg shadow-sm">
  <div className="mb-2 md:mb-0">
    <div className="text-xs font-semibold text-gray-900">
      Didn't get what you are searching for?
    </div>
    <div className="text-xs text-gray-600 mt-1">
      Post your requirement and we’ll connect to solve your space issue.
    </div>
  </div>
  <Link
    to="/demand-form"
    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
  >
    Find My Space
  </Link>
</div>

       <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        className="px-3 py-1 rounded-lg border bg-white text-gray-700 border-gray-300"
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx + 1)}
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === idx + 1
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {idx + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        className="px-3 py-1 rounded-lg border bg-white text-gray-700 border-gray-300"
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>

    </div>
     
      </>
  );
}
