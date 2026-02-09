import React from "react";
import { FiTrash2, FiMail, FiAlertTriangle } from "react-icons/fi";
import Footer from "../components/Footer";

export default function AccountDeletion() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FiTrash2 className="text-3xl text-red-600" />
          <h1 style={{ fontFamily: "para_font" }} className="text-2xl font-bold text-gray-800">
            Delete Your EaseMySpace Account
          </h1>
        </div>

        {/* Intro */}
        <p className="text-gray-700 mb-6 text-sm">
          EaseMySpace allows users to request permanent deletion of their
          account and associated data. For security and identity verification
          reasons, account deletion requests are processed manually via email.
        </p>

        {/* Warning Box */}
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <FiAlertTriangle className="text-red-600 text-xl mt-1" />
          <div className="text-sm text-red-700">
            <p className="font-semibold mb-1">Permanent action</p>
            <p>
              Once your account is deleted, all associated data will be
              permanently removed and cannot be recovered.
            </p>
          </div>
        </div>

        {/* How to delete */}
        <div className="mb-6">
          <h2 style={{ fontFamily: "para_font" }} className="text-lg font-semibold text-gray-800 mb-2">
            How to request account deletion
          </h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
            <li>Send an email from your registered email address</li>
            <li>
              Email us at <b>support@easemyspace.in</b>
            </li>
            <li>
              Use the subject: <b>Account Deletion Request</b>
            </li>
            <li>
              Include the following details in the email:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Registered email address</li>
                <li>Registered phone number</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Data info */}
        <div className="mb-6">
          <h2 style={{ fontFamily: "para_font" }} className="text-lg font-semibold text-gray-800 mb-2">
            Data that will be deleted
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>User profile information</li>
            <li>Bookings and property activity</li>
            <li>Wallet balance and rewards</li>
            <li>Chat history and queries</li>
            <li>Uploaded images and documents</li>
          </ul>
        </div>

        {/* Retention */}
        <div className="mb-6">
          <h2 style={{ fontFamily: "para_font" }} className="text-lg font-semibold text-gray-800 mb-2">
            Data retention
          </h2>
          <p className="text-sm text-gray-700">
            Some information may be retained if required by law or for
            legitimate business purposes, in accordance with our Privacy Policy.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-3">
            Click below to send an account deletion request email:
          </p>
          <a
            href="mailto:support@easemyspace.in?subject=Account Deletion Request&body=Hello EaseMySpace Team,%0D%0A%0D%0AI would like to request permanent deletion of my EaseMySpace account.%0D%0A%0D%0ARegistered Email:%0D%0ARegistered Phone Number:%0D%0A%0D%0AThank you."
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:underline"
          >
            <FiMail />
            support@easemyspace.in
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6">
          Account deletion requests are processed within <b>7 working days</b>
          after verification.
        </p>
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
