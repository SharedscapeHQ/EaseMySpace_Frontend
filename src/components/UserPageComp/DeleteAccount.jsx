import React, { useState } from "react";
import { FiTrash2, FiMail, FiAlertTriangle } from "react-icons/fi";

export default function DeleteAccount() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPolicy, setConfirmPolicy] = useState(false);

  const canProceed = confirmDelete && confirmPolicy;

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toDateString()
    : "N/A";

  const handleEmailRedirect = () => {
    const mailBody = `
Hello EaseMySpace Team,

I would like to request permanent deletion of my EaseMySpace account.

User Details:
Name: ${user?.firstName || ""} ${user?.lastName || ""}
Registered Email: ${user?.email || ""}
Phone Number: ${user?.phone || ""}
User ID: ${user?.id || ""}
Account Created On: ${formattedDate}

I understand that this action is permanent and cannot be undone.

Regards,
${user?.firstName || "User"}
    `.trim();

    window.location.href = `mailto:support@easemyspace.in?subject=Account Deletion Request&body=${encodeURIComponent(
      mailBody
    )}`;
  };

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiTrash2 className="text-3xl text-red-600" />
        <h1 style={{ fontFamily: "para_font" }} className="text-2xl font-bold text-gray-800">
          Delete Account
        </h1>
      </div>

      {/* Warning */}
      <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <FiAlertTriangle className="text-red-600 text-xl mt-1" />
        <div className="text-sm text-red-700">
          <p className="font-semibold mb-1">This action is permanent</p>
          <p>
            Deleting your EaseMySpace account will permanently remove your
            profile, bookings, wallet balance, chat history, and all associated
            data. <b>This action cannot be undone.</b>
          </p>
        </div>
      </div>

      {/* Confirmations */}
      <div className="space-y-4 mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-red-600"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I understand that all my data will be permanently deleted and cannot
            be recovered.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-red-600"
            checked={confirmPolicy}
            onChange={(e) => setConfirmPolicy(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 underline hover:text-indigo-700"
            >
              Privacy Policy
            </a>{" "}
            and confirm my request for account deletion.
          </span>
        </label>
      </div>

      {/* Email Info */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-2">
          For security and verification purposes, account deletion requests are
          processed via email.
        </p>

        <button
          onClick={handleEmailRedirect}
          disabled={!canProceed}
          className={`inline-flex items-center gap-2 font-semibold
            ${
              canProceed
                ? "text-indigo-600 hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <FiMail />
          support@easemyspace.in
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={handleEmailRedirect}
        disabled={!canProceed}
        className={`w-full py-3 rounded-lg font-semibold transition-all
          ${
            canProceed
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Request Account Deletion
      </button>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-4">
        Once your request is verified, your account and associated data will be
        permanently deleted within <b>7 working days</b> as per EaseMySpace
        policy.
      </p>
    </div>
  );
}
