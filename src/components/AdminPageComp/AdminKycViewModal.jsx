import React from "react";

export default function AdminKycViewModal({ user, kycData, onClose }) {
  if (!kycData) return null;

  const { aadhaar_front, aadhaar_back, pan_card, passport_photo, work_location } = kycData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          KYC Documents - {user.firstName} {user.lastName}
        </h2>
        {work_location && (
          <p className="text-sm text-gray-600 mb-4">
            <strong>Work Location:</strong> {work_location}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aadhaar_front && (
            <div>
              <p className="text-sm text-gray-700 mb-1">Aadhaar Front</p>
              <img
                src={aadhaar_front}
                alt="Aadhaar Front"
                className="border rounded-md w-full object-contain max-h-60"
              />
            </div>
          )}
          {aadhaar_back && (
            <div>
              <p className="text-sm text-gray-700 mb-1">Aadhaar Back</p>
              <img
                src={aadhaar_back}
                alt="Aadhaar Back"
                className="border rounded-md w-full object-contain max-h-60"
              />
            </div>
          )}
          {pan_card && (
            <div>
              <p className="text-sm text-gray-700 mb-1">PAN Card</p>
              <img
                src={pan_card}
                alt="PAN Card"
                className="border rounded-md w-full object-contain max-h-60"
              />
            </div>
          )}
          {passport_photo && (
            <div>
              <p className="text-sm text-gray-700 mb-1">Passport Photo</p>
              <img
                src={passport_photo}
                alt="Passport Photo"
                className="border rounded-md w-full object-contain max-h-60"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}