import React, { Fragment, useState, useEffect, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";
import { HiLocationMarker, HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

const PropertyBasicInfo = ({ formData, setFormData }) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [activeLocation, setActiveLocation] = useState(false);

  const autocompleteServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const locationInputRef = useRef(null);
  const locationWrapperRef = useRef(null);

  const bhkOptions = [
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "4 BHK",
    "1 RK",
    "2 RK",
  ];

  const foodOptions = [
  { label: "Veg", value: "veg" },
  { label: "Non-Veg", value: "nonveg" },
  { label: "Vegan", value: "vegan" },
  { label: "Any", value: "any" },
];


  const dropdowns = [
    { name: "gender", label: "Gender Preference", options: ["male", "female", "any"], required: true },
    { name: "bhk_type", label: "BHK & RK Type", options: bhkOptions, required: true },
    { name: "looking_for", label: "Looking For", options: [
      { label: "Flat", value: "vacant" },
      { label: "Shared flat", value: "flatmate" },
      { label: "PGs", value: "pg" },
    ], required: true },
    {
    name: "food_preference",
    label: "Food Preference",
    options: foodOptions,
    required: false, 
  },
  ];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ---------- Load Google Autocomplete Service ---------- */
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyARyFU8-dg2b25qj4bq8Vhp3K4-LCoL57U&libraries=places";
      script.async = true;
      document.body.appendChild(script);
      script.onload = initAutocompleteService;
    } else {
      initAutocompleteService();
    }

    function initAutocompleteService() {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  const fetchSuggestions = (input) => {
    if (!input || !autocompleteServiceRef.current) {
      setLocationSuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getQueryPredictions(
      {
        input,
        componentRestrictions: { country: "in" },
        sessionToken: sessionTokenRef.current,
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setLocationSuggestions(predictions);
        } else {
          setLocationSuggestions([]);
        }
      }
    );
  };

  const handleSelectLocation = (description) => {
    setFormData((prev) => ({ ...prev, location: description }));
    setActiveLocation(false);
    setLocationSuggestions([]);
  };

const fetchCurrentLocation = () => {
  if (!navigator.geolocation) return toast.error("Geolocation not supported");

  setLoadingLocation(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA7eEHeUbXgAcQpRh9Drs0lXetq7VB8N4A`
        );

        if (!res.ok) throw new Error("Failed to fetch location");

        const data = await res.json();
        if (!data.results?.length) throw new Error("No results");

        const address = data.results[0].formatted_address;

        // Extract postal code
        const postalComponent = data.results[0].address_components.find((comp) =>
          comp.types.includes("postal_code")
        );
        const pincode = postalComponent?.long_name || "";

        setFormData((prev) => ({ ...prev, location: address, pincode }));
        toast.success("Location fetched successfully!");
      } catch (err) {
        toast.error("Failed to fetch location");
      } finally {
        setLoadingLocation(false); // ensure it always resets
      }
    },
    (err) => {
      if (err.code === 1) toast.error("Location permission denied");
      else toast.error("Unable to fetch your location");
      setLoadingLocation(false); // reset here too
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // optional but prevents hanging
  );
};


  /* ---------- Close suggestions when clicking or scrolling outside ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target)) {
        setActiveLocation(false);
      }
    };

    const handleScrollOutside = (e) => {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target)) {
        setActiveLocation(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOutside, true);
    };
  }, []);

  const renderDropdown = ({ name, label, options, required }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={name}
      className="mb-6"
    >
      <label className="block text-sm  text-gray-700 mb-2 ">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Listbox value={formData[name] || ""} onChange={(value) => setFormData((prev) => ({ ...prev, [name]: value }))}>
        <div className="relative">
          <Listbox.Button className="relative  w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 flex justify-between items-center">
            <span className="block truncate capitalize text-gray-700">
              {(() => {
                const selectedOption = options.find((opt) =>
                  typeof opt === "object" ? opt.value === formData[name] : opt === formData[name]
                );
                return selectedOption
                  ? typeof selectedOption === "object"
                    ? selectedOption.label
                    : selectedOption
                  : `Select ${label}`;
              })()}
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
            <Listbox.Options className="absolute scrollbar-hide mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              {options.map((opt, i) => {
                const displayLabel = typeof opt === "object" ? opt.label : opt;
                const value = typeof opt === "object" ? opt.value : opt;
                return (
                  <Listbox.Option
                    key={i}
                    value={value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-700 capitalize ${
                        active ? "bg-indigo-100" : ""
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? " text-indigo-600" : "font-normal"}`}
                        >
                          {displayLabel}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-2 flex items-center text-indigo-600">
                            <HiCheck className="w-4 h-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
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
          ["pincode", "Pincode", true],
          ["owner_phone", "Owner Phone", true],
          ["bathrooms", "Bathrooms", false],
          ["distance_from_station", "Distance from Station", false],
        ].map(([key, label, required]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 relative"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm  text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {key === "location" && (
                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  disabled={loadingLocation}
                  className=" text-indigo-700 px-3 py-1 rounded-xl flex items-center gap-1 transition text-sm"
                >
                  {loadingLocation ? (
                    <>
                      <HiOutlineRefresh className="w-5 h-5 animate-spin" /> Fetching...
                    </>
                  ) : (
                    <>
                      <HiLocationMarker className="w-5 h-5" /> Use Current Location
                    </>
                  )}
                </button>
              )}
            </div>

            {key === "location" ? (
              <div ref={locationWrapperRef} className="relative">
                <input
                  type="text"
                  ref={locationInputRef}
                  name="location"
                  value={formData.location || ""}
                  onChange={(e) => {
                    handleChange(e);
                    fetchSuggestions(e.target.value);
                    setActiveLocation(true);
                  }}
                  placeholder={`Enter ${label}`}
                  required={required}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                />

                {activeLocation && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 bg-white scrollbar-hide rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto w-full">
                    {locationSuggestions.map((sug) => (
                      <div
                        key={sug.place_id}
                        onClick={() => handleSelectLocation(sug.description)}
                        className="flex items-start gap-3 px-4 py-5 cursor-pointer hover:bg-gray-100"
                      >
                        <HiLocationMarker className="text-gray-400 w-5 h-5 flex-shrink-0 mt-1" />
                        <span className="text-sm text-gray-700 break-words leading-snug">
                          {sug.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : key === "pincode" ? (
              <input
                type="text"
                name="pincode"
                value={formData.pincode || ""}
                onChange={(e) =>
                  handleChange({ target: { name: key, value: e.target.value.replace(/\D/g, "").slice(0, 6) } })
                }
                placeholder={`Enter ${label}`}
                required={required}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            ) : (
              <input
                type={["bathrooms"].includes(key) ? "number" : "text"}
                name={key}
                value={formData[key] || ""}
                onChange={(e) => {
                  let val = e.target.value;
                  if (key === "owner_phone") val = val.replace(/\D/g, "").slice(0, 10);
                  if (key === "distance_from_station") val = val.slice(0, 50);
                  handleChange({ target: { name: key, value: val } });
                }}
                placeholder={`Enter ${label}`}
                required={required}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm transition-all duration-200"
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{dropdowns.map(renderDropdown)}</div>
    </>
  );
};

export default PropertyBasicInfo;
