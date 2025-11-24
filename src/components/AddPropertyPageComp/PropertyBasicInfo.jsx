import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";

const PropertyBasicInfo = ({ formData, setFormData }) => {
  const bhkOptions = [
    "1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK",
    "3 BHK", "4 BHK", "1 RK", "2 RK",
  ];

  const dropdowns = [
    { name: "gender", label: "Gender Preference", options: ["male", "female", "any"], required: true },
    { name: "bhk_type", label: "BHK & RK Type", options: bhkOptions },
    { name: "looking_for", label: "Looking For", options: ["flatmate", "vacant", "pg"] },
  ];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const renderDropdown = ({ name, label, options, required }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={name}
      className="mb-6"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Listbox
        value={formData[name] || ""}
        onChange={(value) => setFormData((prev) => ({ ...prev, [name]: value }))}
      >
        <div className="relative">
          <Listbox.Button
            className="relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left 
                       border border-gray-300 shadow-sm focus:outline-none focus:ring-2 
                       focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 
                       flex justify-between items-center"
          >
            <span className="block truncate capitalize text-gray-700">
              {formData[name] || `Select ${label}`}
            </span>
            <HiChevronUpDown className="w-5 h-5 text-gray-500" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options
              className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 
                         shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
            >
              {options.map((opt, i) => (
                <Listbox.Option
                  key={i}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-700 capitalize ${
                      active ? "bg-indigo-100" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold text-indigo-600" : "font-normal"
                        }`}
                      >
                        {opt}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-2 flex items-center text-indigo-600">
                          <HiCheck className="w-4 h-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </motion.div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["title", "Name", true],
          ["location", "Location", true],
          ["owner_phone", "Owner Phone", true],
          ["bathrooms", "Bathrooms", false],
          ["distance_from_station", "Distance from Station", false],
        ].map(([key, label, required]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={["bathrooms"].includes(key) ? "number" : "text"}
              name={key}
              value={formData[key]}
              maxLength={key === "distance_from_station" ? 50 : undefined}
              onChange={(e) => {
                let val = e.target.value;

                if (key === "owner_phone") val = val.replace(/\D/g, "").slice(0, 10);
                if (key === "distance_from_station") val = val.slice(0, 50);

                handleChange({ target: { name: key, value: val } });
              }}
              placeholder={`Enter ${label}`}
              required={required}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 
                         shadow-sm transition-all duration-200"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dropdowns.map(renderDropdown)}
      </div>
    </>
  );
};

export default PropertyBasicInfo;
