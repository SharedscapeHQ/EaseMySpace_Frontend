import { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import DigioImg from "/property-details-assets/digio.webp";
import DigilockerImg from "/property-details-assets/digilocker.webp";
import axios from "axios";

const PLACEHOLDER_IMG = "https://imgs.search.brave.com/m5jHohAkzrVAxMl5d5AwPtOFIgWGGxv2V6c5BQQNous/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLVBORy1GcmVl/LURvd25sb2FkLnBu/Zw"; 

export default function OwnerKycCard({ propertyId }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const res = await axios.get(
          `https://api.easemyspace.in/api/user/lister-profile/${propertyId}`,
          { withCredentials: true, timeout: 20000 }
        );
        setOwner(res.data.user);
      } catch (err) {
        console.error("❌ Failed to fetch owner profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchOwnerProfile();
  }, [propertyId]);

  // Skeleton Loader
  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-7">
          <div className="w-[72px] h-[72px] rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-200 rounded mt-1"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="h-12 w-12 bg-gray-200 rounded" />
          <div className="h-12 w-1 bg-gray-200" />
          <div className="h-12 w-12 bg-gray-200 rounded" />
        </div>

        <div className="flex justify-between text-center mt-5 border-t pt-4 gap-2">
          <div className="flex flex-col gap-1">
            <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>
    );

  if (!owner)
    return <div className="p-4 bg-white rounded-xl shadow-md">Owner not found</div>;

  return (
    <div className="bg-white rounded-2xl h-full shadow-md border border-gray-200 p-5 flex flex-col justify-between">

      {/* TOP SECTION */}
     <div className="flex items-center gap-7">
  <div className="relative">
    <img
      src={owner.profile_image || PLACEHOLDER_IMG} 
      alt={owner.firstName}
      className="w-[72px] h-[72px] rounded-full object-cover bg-gray-200"
    />

    {/* Show shield if owner is verified */}
    {owner.isVerified && (
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
        <IoShieldCheckmark className="text-blue-600" size={18} />
      </div>
    )}
  </div>

  <div className="flex flex-col">
    <span className="font-semibold text-gray-900">
      {owner.firstName} {owner.lastName}
    </span>
    <span className="text-xs text-gray-500">Property Owner</span>

    {/* Show identity verified label if owner is verified */}
    {owner.isVerified && (
      <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
        <MdVerified />
        Identity Verified
      </div>
    )}
  </div>
</div>

      {/* VERIFIED SERVICES */}
      <div className="mt-5 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <img src={DigioImg} alt="Digio" className="h-12 object-contain" />
          <span className="text-[11px] text-gray-500">eSign Verified</span>
        </div>

        <div className="w-[1px] h-10 bg-gray-200"></div>

        <div className="flex flex-col items-center gap-1">
          <img src={DigilockerImg} alt="DigiLocker" className="h-12 object-contain" />
          <span className="text-[11px] text-gray-500">Govt Identity</span>
        </div>
      </div>

      {/* TRUST DETAILS */}
      <div className="mt-5 border-t pt-4 flex justify-between text-center">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Verified</span>
          <span className="text-xs text-gray-500">Owner Identity</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Govt ID</span>
          <span className="text-xs text-gray-500">DigiLocker</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Secure</span>
          <span className="text-xs text-gray-500">Booking</span>
        </div>
      </div>

    </div>
  );
}
