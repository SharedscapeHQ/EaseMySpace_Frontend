import React from "react";
import { Link } from "react-router-dom";

export default function ProfileCard({ profile }) {
  return (
    <div className="relative flex-none w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* KYC Badge */}
      {profile.kyc_status && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs  px-3 py-1 rounded-full shadow-lg z-10">
          KYC Verified
        </span>
      )}

      <img
        src={profile.profile_photo}
        alt={`${profile.first_name} ${profile.last_name}`}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 text-center">
        <h3 className="text-xl  text-pink-600 truncate">
          {profile.first_name} {profile.last_name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{profile.age} years old</p>
        <p className="text-gray-600 dark:text-gray-300">{profile.experience}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{profile.location_served}</p>

        <Link
          to={`/profile/${profile.id}`}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-600 bg-pink-600 px-6 py-2 text-white font-medium mt-4 transition-colors duration-300"
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-600">
            View Profile
          </span>
          <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
        </Link>
      </div>
    </div>
  );
}
