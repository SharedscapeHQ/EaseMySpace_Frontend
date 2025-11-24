import React from "react";
import { Link } from "react-router-dom";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
   
      <>
  

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
