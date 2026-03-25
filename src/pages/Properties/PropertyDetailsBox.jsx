import { FaHome } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import { MdTrain } from "react-icons/md"; // icon for distance

export default function PropertyDetailsBox({ property }) {
  if (!property) return null;

  const displayLocation = property.display_location || "Mumbai, Maharashtra";

  const category =
    property.looking_for?.toLowerCase() === "pg"
      ? "PG"
      : property.looking_for;

  const details = [
    {
      icon: <FaHome className="text-gray-400 text-base" />,
      label: "BHK Type",
      value: property.bhk_type || "Unavailable",
    },
    {
      icon: <HiOutlineLocationMarker className="text-gray-400 text-base" />,
      label: "Location",
      value: displayLocation,
    },
    {
      icon: <MdTrain className="text-gray-400 text-base" />,
      label: "Distance from Station",
      value: property.distance_from_station || "Unavailable",
    },
    {
      icon: <FiUsers className="text-gray-400 text-base" />,
      label: "Category",
      value: category || "Unavailable",
    },
    {
      icon: <BsGenderAmbiguous className="text-gray-400 text-base" />,
      label: "Gender Preference",
      value: property.gender || "Unavailable",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 lg:h-full">

      <h2
        style={{ fontFamily: "para_font" }}
        className="text-base lg:text-lg text-gray-900 mb-4"
      >
        Property Details
      </h2>

      <div className="divide-y divide-gray-100">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                {item.icon}
              </div>

              <span className="text-xs text-gray-500">{item.label}</span>
            </div>

            <span className="text-sm text-gray-900 font-medium capitalize">
              {item.value}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}