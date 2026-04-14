import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdDelete, MdVerified } from "react-icons/md";
import { uploadKycDocs, getKycDocs } from "../../api/kycApi";

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
  const [allDocsAvailable, setAllDocsAvailable] = useState(false);

  useEffect(() => {
    const fetchKycDocs = async () => {
      try {
        const res = await getKycDocs();
        const { kycData } = res.data;

        if (kycData) {
          const {
            aadhaar_front,
            aadhaar_back,
            pan_card,
            passport_photo,
            work_location,
          } = kycData;

          setWorkLocation(work_location || "");

          setFiles({
            aadhaarFront: aadhaar_front
              ? { name: "Uploaded", preview: aadhaar_front }
              : null,
            aadhaarBack: aadhaar_back
              ? { name: "Uploaded", preview: aadhaar_back }
              : null,
            panCard: pan_card
              ? { name: "Uploaded", preview: pan_card }
              : null,
            passportPhoto: passport_photo
              ? { name: "Uploaded", preview: passport_photo }
              : null,
          });

          const allAvailable =
            aadhaar_front && aadhaar_back && pan_card && passport_photo;

          if (allAvailable) {
            setSubmitted(true);
            setAllDocsAvailable(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch KYC docs:", err);
      }
    };

    fetchKycDocs();
  }, []);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const removeFile = (key) => {
    const input = document.getElementById(key);
    if (input) input.value = "";

    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAadhaar = files.aadhaarFront && files.aadhaarBack;
    const hasPan = files.panCard;

    if (!hasAadhaar && !hasPan) {
      toast.error("Upload Aadhaar (front & back) OR PAN card");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      Object.keys(files).forEach((key) => {
        if (files[key] && files[key].preview === undefined) {
          formData.append(key, files[key]);
        }
      });

      formData.append("workLocation", workLocation);

      await uploadKycDocs(formData);
      toast.success("KYC submitted successfully");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const documents = [
    {
      key: "aadhaarFront",
      label: "Aadhaar Front",
    },
    {
      key: "aadhaarBack",
      label: "Aadhaar Back",
    },
    {
      key: "panCard",
      label: "PAN Card",
    },
    {
      key: "passportPhoto",
      label: "Passport Photo",
    },
  ];

  const hasAadhaar = files.aadhaarFront && files.aadhaarBack;
  const hasPan = files.panCard;
  const isValidKyc = hasAadhaar || hasPan;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          KYC Verification
        </h2>
        {submitted && <MdVerified className="text-green-500" size={20} />}
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const file = files[doc.key];
            const isImage =
              file &&
              (file.preview
                ? file.preview.startsWith("http")
                : file.type.startsWith("image"));

            return (
              <div
                key={doc.key}
                className={`border-2 justify-center border-dashed rounded-xl p-4 flex flex-col items-center text-center transition-all min-h-[170px] ${
                  file
                    ? "border-indigo-200 bg-indigo-50/30"
                    : "border-gray-200 hover:border-indigo-400"
                }`}
              >
                {!file ? (
                  <>
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
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <MdCloudUpload size={28} className="mb-2 text-gray-400" />
                      <span className="text-xs bg-white border px-3 py-1 rounded-md shadow-sm">
                        Upload File
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {isImage ? (
                      <img
                        src={file.preview || URL.createObjectURL(file)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-xs">📄 {file.name}</div>
                    )}

                    {!file.preview && (
                      <button
                        type="button"
                        onClick={() => removeFile(doc.key)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Validation hint */}
        {!isValidKyc && (
          <p className="text-xs text-red-500">
            Upload Aadhaar (front & back) OR PAN card to continue.
          </p>
        )}

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Work Location
          </label>
          <input
            type="text"
            value={workLocation}
            disabled={submitted || isSubmitting}
            onChange={(e) => setWorkLocation(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="e.g. HSR Layout, Bangalore"
          />
        </div>

        {!allDocsAvailable && (
          <button
            type="submit"
            disabled={!isValidKyc || isSubmitting || submitted}
            className={`w-1/2 py-3 rounded-lg text-white font-semibold  ${
              !isValidKyc || isSubmitting || submitted
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit KYC"}
          </button>
        )}
      </form>
    </div>
  );
}