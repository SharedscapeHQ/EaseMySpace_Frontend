import { FiArrowLeftCircle, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function OwnerDetailsPage({ owner, property, onBack, onViewTenants }) {
  const displayName = owner?.name?.trim() || property?.title || "-";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
      >
        <FiArrowLeftCircle size={22} /> Back to Properties
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6 hover:shadow-xl transition">
        <h2 style={{ fontFamily: "para_font" }} className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <FiUser /> Owner Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <FiUser className="text-indigo-500" />
            <span className="font-medium">Name:</span> {displayName}
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-indigo-500" />
            <span className="font-medium">Email:</span> {owner?.email || "-"}
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-indigo-500" />
            <span className="font-medium">Phone:</span> {owner?.phone || "-"}
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-indigo-500" />
            <span className="font-medium">Location:</span> {property?.location || "-"}
          </div>
        </div>

        <button
          onClick={onViewTenants}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View Tenants
        </button>
      </div>
    </div>
  );
}
