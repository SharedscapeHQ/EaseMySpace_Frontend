import React from "react";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";

const PricingSection = ({ formData, setFormData }) => {
  const occupancyTypes = ["single", "double", "triple"];

  return (
    <div className="pt-6">
      <h2 style={{ fontFamily: "para_font" }} className="font-bold mb-6 text-indigo-600 text-2xl tracking-tight">
         Rent per Room
      </h2>

      {formData.pricingOptions.map((room, rIdx) => (
        <div
          key={rIdx}
          className="border border-gray-200 rounded-2xl p-6 mb-8 bg-white shadow-sm hover:shadow-md transition-all"
        >
          {/* Room Header */}
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <input
              type="text"
              value={room.room_name}
              placeholder="Room Name"
              onChange={(e) => {
                const updated = [...formData.pricingOptions];
                updated[rIdx].room_name = e.target.value;
                setFormData((prev) => ({ ...prev, pricingOptions: updated }));
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg w-3/4 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-gray-800 font-medium"
            />
            <button
              type="button"
              title="Remove Room"
              className="text-red-600 hover:text-red-700 transition-colors p-2"
              onClick={() => {
                const updated = [...formData.pricingOptions];
                updated.splice(rIdx, 1);
                setFormData((prev) => ({ ...prev, pricingOptions: updated }));
              }}
            >
              <FiTrash2 size={20} />
            </button>
          </div>

          {/* Occupancies */}
          {room.occupancies?.map((occ, oIdx) => (
            <div
              key={oIdx}
              className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
            >
              <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-3">
                {/* Occupancy Type */}
                <div className="flex flex-col w-full md:w-1/3">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Occupancy Type
                  </label>
                  <select
                    value={occ.occupancy}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].occupancy = e.target.value;
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option value="">Select</option>
                    {occupancyTypes.map((type) => {
                      const alreadyAdded = room.occupancies.some(
                        (o, idx) => o.occupancy === type && idx !== oIdx
                      );
                      return (
                        <option key={type} value={type} disabled={alreadyAdded}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Rent */}
                <div className="flex flex-col w-full md:w-1/4">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Rent (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter rent"
                    value={occ.price}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].price = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>

                {/* Deposit */}
                <div className="flex flex-col w-full md:w-1/4">
                  <label className="text-sm font-semibold text-gray-700 mb-1">
                    Deposit (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter deposit"
                    value={occ.deposit}
                    onChange={(e) => {
                      const updated = [...formData.pricingOptions];
                      updated[rIdx].occupancies[oIdx].deposit = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>

                {/* Remove Occupancy */}
                <button
                  type="button"
                  title="Remove Occupancy"
                  className="text-red-500 hover:text-red-600 transition-colors md:mt-0 mt-2 p-2"
                  onClick={() => {
                    const updated = [...formData.pricingOptions];
                    updated[rIdx].occupancies.splice(oIdx, 1);
                    setFormData((prev) => ({ ...prev, pricingOptions: updated }));
                  }}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Occupancy */}
          <button
            type="button"
            className="flex items-center gap-2 text-indigo-600 font-medium mt-2 hover:text-indigo-700 transition-colors"
            onClick={() => {
              const updated = [...formData.pricingOptions];
              if (!updated[rIdx].occupancies) updated[rIdx].occupancies = [];
              const available = occupancyTypes.filter(
                (t) => !updated[rIdx].occupancies.some((o) => o.occupancy === t)
              );
              if (available.length === 0) return;
              updated[rIdx].occupancies.push({
                occupancy: available[0],
                price: "",
                deposit: "",
              });
              setFormData((prev) => ({ ...prev, pricingOptions: updated }));
            }}
          >
            <FiPlusCircle size={18} />
            Add Occupancy
          </button>
        </div>
      ))}

      {/* Add Room */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pricingOptions: [
                ...prev.pricingOptions,
                { room_name: `Room ${prev.pricingOptions.length + 1}`, occupancies: [] },
              ],
            }))
          }
        >
          <FiPlusCircle size={18} />
          Add Room
        </button>
      </div>
    </div>
  );
};

export default PricingSection;
