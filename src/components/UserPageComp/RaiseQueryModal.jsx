import React, { useState } from "react";

const RaiseQueryModal = ({ isOpen, onClose, property, onSubmit }) => {
  const [message, setMessage] = useState("");

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await onSubmit(property.id, message);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ×
        </button>

        <h3 className="text-xl font-bold mb-4">Raise a Query</h3>
        <p className="mb-2 text-gray-600 text-sm">
          Property: <strong>{property.title}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            rows={4}
            placeholder="Describe your issue or edit request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4 resize-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Query
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseQueryModal;
