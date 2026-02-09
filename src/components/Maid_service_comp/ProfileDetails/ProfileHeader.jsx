import React from "react";

export default function ProfileHeader({ profile }) {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">

      {/* KYC Badge at top-left */}
      {profile.kyc_status && (
        <div className="absolute top-4 left-4 z-20 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
          KYC Verified
        </div>
      )}

      {/* Profile Image */}
      <div className="w-48 h-48 flex-shrink-0 mx-auto md:mx-0 relative z-10">
        <img
          src={profile.profile_photo || "/maid-placeholder.png"}
          alt={`${profile.first_name} ${profile.last_name}`}
          className="w-full h-full object-cover rounded-2xl border-4 border-pink-600 shadow-md"
        />
      </div>

      {/* Profile Details */}
      <div className="flex-1 space-y-4 z-10">
        <h2 style={{ fontFamily: "para_font" }} className="text-3xl font-bold text-pink-600">{profile.first_name} {profile.last_name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium text-gray-500 dark:text-gray-400">Age:</span> {profile.age}
          </p>
          {profile.experience && (
            <p>
              <span className="font-medium text-gray-500 dark:text-gray-400">Experience:</span> {profile.experience}
            </p>
          )}
          {profile.location_served && (
            <p>
              <span className="font-medium text-gray-500 dark:text-gray-400">Location:</span> {profile.location_served}
            </p>
          )}
          {profile.skills && (
            <p>
              <span className="font-medium text-gray-500 dark:text-gray-400">Skills:</span> {profile.skills}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
