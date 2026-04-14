import React, { useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";

export default function AdminKycUploadModal({ user, onClose, onSubmit }) {
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    passportPhoto: null,
  });
  const [workLocation, setWorkLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documents = [
    { key: "aadhaarFront", label: "Aadhaar Front" },
    { key: "aadhaarBack", label: "Aadhaar Back" },
    { key: "panCard", label: "PAN Card" },
    { key: "passportPhoto", label: "Passport Photo" },
  ];

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const removeFile = (key) => {
    const input = document.getElementById(key);
    if (input) input.value = "";
    setFiles((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAadhaar = files.aadhaarFront && files.aadhaarBack;
    const hasPan = files.panCard;

    if (!hasAadhaar && !hasPan) {
      return alert("Upload Aadhaar (Front & Back) OR PAN Card");
    }

    setIsSubmitting(true);
    await onSubmit({ userId: user.id, files, workLocation });
    setIsSubmitting(false);
  };

  // ✅ Validation state for button
  const hasAadhaar = files.aadhaarFront && files.aadhaarBack;
  const hasPan = files.panCard;
  const isValidKyc = hasAadhaar || hasPan;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full">
        
        {/* Header */}
        <h2 className="text-xl font-bold mb-2">
          Upload KYC for {user.firstName} {user.lastName}
        </h2>

        {/* 🔥 Instruction UI */}
        <div className="mb-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
          <p className="font-semibold">Required:</p>
          <p> Upload <b>Aadhaar (Front & Back)</b> OR <b>PAN Card</b></p>
        
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.key}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[140px] transition ${
                  files[doc.key]
                    ? "border-indigo-400 bg-indigo-50/20"
                    : "border-gray-200 hover:border-indigo-400"
                }`}
              >
                {/* Label */}
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                  {doc.label}
                </p>

                {!files[doc.key] ? (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      id={doc.key}
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, doc.key)}
                    />
                    <label
                      htmlFor={doc.key}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <MdCloudUpload size={30} className="text-gray-400 mb-2" />
                      <span className="text-xs font-medium px-3 py-1 bg-white border border-gray-300 rounded shadow-sm">
                        Upload File
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    
                    {/* Preview */}
                    {files[doc.key].type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(files[doc.key])}
                        alt={doc.label}
                        className="w-24 h-24 object-contain border rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center border rounded bg-gray-50 text-gray-600 text-xs px-2 py-1 text-center">
                        {files[doc.key].name}
                      </div>
                    )}

                    <span className="text-sm text-gray-700 truncate max-w-[120px]">
                      {files[doc.key].name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFile(doc.key)}
                      className="text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Work Location */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Work Location
            </label>
            <input
              type="text"
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter work location (optional)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValidKyc || isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${
                !isValidKyc || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Uploading..." : "Upload KYC"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}