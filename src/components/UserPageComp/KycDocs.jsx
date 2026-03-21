import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdDelete, MdVerified } from "react-icons/md";

export default function KycVerification() {
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    passportPhoto: null,
  });

  const [workLocation, setWorkLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(files).forEach((file) => {
        if (file) URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [files]);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const removeFile = (key) => {
    // Reset the input value so the same file can be re-uploaded if needed
    const input = document.getElementById(key);
    if (input) input.value = "";
    
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAtLeastOneFile = Object.values(files).some((file) => file !== null);

    if (!hasAtLeastOneFile) {
      toast.error("Upload at least one document");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.keys(files).forEach((key) => {
        if (files[key]) formData.append(key, files[key]);
      });
      formData.append("workLocation", workLocation);

      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("KYC submitted successfully");
      setSubmitted(true);
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const documents = [
    { key: "aadhaarFront", label: "Aadhaar Front" },
    { key: "aadhaarBack", label: "Aadhaar Back" },
    { key: "panCard", label: "PAN Card" },
    { key: "passportPhoto", label: "Passport Photo" },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-gray-800">KYC Verification</h2>
        {submitted && <MdVerified className="text-green-500" size={20} />}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const file = files[doc.key];
            const isImage = file && file.type.startsWith("image");

            return (
              <div
                key={doc.key}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all min-h-[160px] ${
                  file ? "border-indigo-200 bg-indigo-50/30" : "border-gray-200 hover:border-indigo-400"
                }`}
              >
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-tight">
                  {doc.label}
                </p>

                {!file ? (
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      className="hidden"
                      id={doc.key}
                      accept="image/*,.pdf"
                      disabled={submitted || isSubmitting}
                      onChange={(e) => handleFileChange(e, doc.key)}
                    />
                    <label
                      htmlFor={doc.key}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      <MdCloudUpload className="text-gray-400 group-hover:text-indigo-500 mb-2 transition-colors" size={30} />
                      <span className="px-4 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-300 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        Upload File
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in duration-200">
                    {isImage ? (
                      <div className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-white border rounded-lg text-[10px] text-gray-600 truncate max-w-[150px] shadow-sm">
                        📄 {file.name}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={submitted || isSubmitting}
                      onClick={() => removeFile(doc.key)}
                      className="flex items-center gap-1 text-red-500 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <MdDelete size={14} /> Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 block">
            Work Location
          </label>
          <input
            type="text"
            required
            value={workLocation}
            disabled={submitted || isSubmitting}
            onChange={(e) => setWorkLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="e.g. HSR Layout, Bangalore"
          />
        </div>

        {!submitted ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-xl transition-all text-white font-bold shadow-md flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Submitting...
              </>
            ) : (
              "Submit KYC"
            )}
          </button>
        ) : (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700">
            <MdVerified size={24} />
            <div>
              <p className="font-bold text-sm">Application Received</p>
              <p className="text-xs">Your documents are under review by our team.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}