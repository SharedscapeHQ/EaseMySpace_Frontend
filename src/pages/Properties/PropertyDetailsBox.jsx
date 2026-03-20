import { FaHome } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";

export default function PropertyDetailsBox({ property }) {
  if (!property) return null;

  const displayLocation = property.display_location || "Mumbai, Maharashtra";

  const category =
    property.looking_for?.toLowerCase() === "pg"
      ? "PG"
      : property.looking_for;

  const details = [
    {
      icon: <FaHome className="text-gray-500 text-lg" />,
      label: "BHK Type",
      value: property.bhk_type || "Unavailable",
    },
    {
      icon: <HiOutlineLocationMarker className="text-gray-500 text-lg" />,
      label: "Location",
      value: displayLocation,
    },
    {
      icon: <FiUsers className="text-gray-500 text-lg" />,
      label: "Category",
      value: category || "Unavailable",
    },
    {
      icon: <BsGenderAmbiguous className="text-gray-500 text-lg" />,
      label: "Gender Preference",
      value: property.gender || "Unavailable",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

      <h2
        style={{ fontFamily: "para_font" }}
        className="text-lg lg:text-xl text-gray-900 mb-6"
      >
        Property Details
      </h2>

      <div className="divide-y divide-gray-100">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-4">

            <div className="flex items-center gap-4">

              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                {item.icon}
              </div>

              <span className="text-sm text-gray-500">
                {item.label}
              </span>

            </div>

            <span className="text-sm lg:text-base text-gray-900 font-medium capitalize">
              {item.value}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}