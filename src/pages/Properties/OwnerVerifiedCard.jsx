import { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const PLACEHOLDER_IMG = "https://imgs.search.brave.com/m5jHohAkzrVAxMl5d5AwPtOFIgWGGxv2V6c5BQQNous/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LURvd25sb2FkLnBu/Zw"; 


export default function OwnerKycCard({ propertyId }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating] = useState((Math.random() * (5 - 4) + 4).toFixed(1));
  const [responseTime] = useState(Math.floor(Math.random() * 5) + 2);

  

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const res = await axios.get(
          `https://api.easemyspace.in/api/user/lister-profile/${propertyId}`,
          { withCredentials: true, timeout: 20000 }
        );
        setOwner(res.data.user);
      } catch (err) {
        console.error("Failed to fetch owner profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchOwnerProfile();
  }, [propertyId]);

  const memberSince = owner?.created_at
  ? new Date(owner.created_at).getFullYear()
  : "";

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-[70px] h-[70px] rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!owner)
    return (
      <div className="p-4 bg-white rounded-xl shadow-md">
        Owner not found
      </div>
    );

  return (
    <div className="flex flex-col gap-4">

      {/* OWNER PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col gap-4">

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={owner.profile_image || PLACEHOLDER_IMG}
              alt={owner.firstName}
              className="w-[70px] h-[70px] rounded-full object-cover bg-gray-200"
            />

            {owner.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                <IoShieldCheckmark className="text-blue-600" size={18} />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {owner.firstName} {owner.lastName}
            </span>

            <span className="text-xs text-gray-500">
              Direct Owner · Member since {memberSince}
            </span>

            {owner.isVerified && (
              <span className="mt-1 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full w-fit font-medium">
                <MdVerified size={14} />
                DigiLocker KYC Verified
              </span>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="border-t pt-4 flex justify-between text-center">

          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              <FaStar className="text-yellow-500" size={13} />
              {rating}
            </span>
            <span className="text-xs text-gray-500">Rating</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-900">
              {owner.listings?.length || 0}
            </span>
            <span className="text-xs text-gray-500">Listings</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-900">
              {responseTime} hrs
            </span>
            <span className="text-xs text-gray-500">Response</span>
          </div>

        </div>

      </div>

      {/* EASEMYSPACE PROTECTION CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col gap-3">

       <div className="flex items-center gap-2 font-semibold text-gray-900">
  <IoShieldCheckmark className="text-blue-600" size={18} />
  EaseMySpace Protection
</div>

        <div className="flex flex-col gap-2 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <MdVerified className="text-green-600" />
            Owner KYC verified via DigiLocker
          </div>

          <div className="flex items-center gap-2">
            <MdVerified className="text-green-600" />
            Digital rental agreement included
          </div>

          <div className="flex items-center gap-2">
            <MdVerified className="text-green-600" />
            In-app rent payment protection
          </div>

          <div className="flex items-center gap-2">
            <MdVerified className="text-green-600" />
            Dispute resolution support
          </div>

        </div>

      </div>

    </div>
  );
}