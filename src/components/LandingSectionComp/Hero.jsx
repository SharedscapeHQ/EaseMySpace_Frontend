import React, { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";

const badges = [
  { icon: "✅", text: "Verified Listings" },
  { icon: "💸", text: "Zero Brokerage" },
  { icon: "📍", text: "Top Mumbai Locations" },
  { icon: "🛏️", text: "Rent from ₹5,000/mo" },
  { icon: "🔒", text: "100% Secure Matches" },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const genderOptions = [
  { value: "", label: "Preferred Gender" },
  { value: "Male", label: "♂️ Male" },
  { value: "Female", label: "♀️ Female" },
];

const propertyOptions = [
  { value: "", label: "Looking For" },
  { value: "profiles.php", label: "🏠 Shared Flat" },
  { value: "vacant_listings.php", label: "🏢 Fully Vacant Flat" },
];

const Hero = () => {
  const [formData, setFormData] = useState({
    search: "",
    gender: "",
    property_type: "",
  });

  const [formAction, setFormAction] = useState("profiles.php");
  const [shuffledBadges, setShuffledBadges] = useState(badges);

  useEffect(() => {
    const interval = setInterval(() => {
      setShuffledBadges(shuffle(badges));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "property_type" && value) {
      setFormAction(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted to:", formAction);
    console.log("Form Data:", formData);
  };

  return (
    <>
      <section className="w-full ">
        <main className="bg-gradient-to-r overflow-visible from-indigo-600 to-teal-500 text-white py-12 px-6 rounded-b-[80px]  flex items-center">
          <div className="max-w-7xl mx-auto relative z-10 w-full px-4">
            <div className="text-center lg:text-left max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Find Your Perfect Flatmate, Flats or PG in Mumbai
              </h1>
              <p className="text-lg text-white/90 mb-10">
                Verified Listings. Zero Brokerage. Smarter Urban Living Starts Here.
              </p>

              <div className="flex justify-center">
                <motion.form
                  onSubmit={handleSubmit}
                  action={formAction}
                  method="get"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/80 backdrop-blur-xl text-zinc-700 font-medium flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center shadow-2xl p-6
                    rounded-tl-[3rem] rounded-tr-md rounded-br-[3rem] rounded-bl-md w-full max-w-[900px] relative "
                >
                  {/* Search Input with Location Icon */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocusWithin={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative w-full sm:w-[220px]"
                  >
                    <input
                      type="text"
                      name="search"
                      placeholder="Enter Area e.g. Andheri"
                      value={formData.search}
                      onChange={(e) => handleChange("search", e.target.value)}
                      className="text-sm px-12 py-3 rounded-full border border-gray-300 w-full
                        focus:outline-none focus:ring-4 focus:ring-teal-400 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                    />
                    {/* Location Pin SVG Icon */}
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 22s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  {/* Gender Dropdown */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocusWithin={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative w-full sm:w-[180px]"
                  >
                    <Listbox
                      value={formData.gender}
                      onChange={(val) => handleChange("gender", val)}
                    >
                      <div className="relative">
                        <Listbox.Button
                          className="relative w-full cursor-pointer rounded-full bg-white border border-gray-300 py-3 px-5 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 "
                        >
                          <span className="block truncate">
                            {
                              genderOptions.find((o) => o.value === formData.gender)
                                ?.label || "Preferred Gender"
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            ▼
                          </span>
                        </Listbox.Button>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                          >
                            {genderOptions.map(({ value, label }) => (
                              <Listbox.Option
                                key={value || "empty"}
                                value={value}
                                className={({ active }) =>
                                  `cursor-pointer select-none relative py-2 pl-5 pr-4 ${
                                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                                  }`
                                }
                              >
                                {label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </motion.div>

                  {/* Property Type Dropdown */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocusWithin={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative w-full sm:w-[200px]"
                  >
                    <Listbox
                      value={formData.property_type}
                      onChange={(val) => handleChange("property_type", val)}
                    >
                      <div className="relative">
                        <Listbox.Button
                          className="relative w-full cursor-pointer rounded-full bg-white border border-gray-300 py-3 px-5 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400"
                        >
                          <span className="block truncate">
                            {
                              propertyOptions.find(
                                (o) => o.value === formData.property_type
                              )?.label || "Looking For"
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 select-none">
                            ▼
                          </span>
                        </Listbox.Button>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                          >
                            {propertyOptions.map(({ value, label }) => (
                              <Listbox.Option
                                key={value || "empty"}
                                value={value}
                                className={({ active }) =>
                                  `cursor-pointer select-none relative py-2 pl-5 pr-4 ${
                                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                                  }`
                                }
                              >
                                {label}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full transition w-full sm:w-[140px] shadow-md"
                  >
                    Search
                  </motion.button>
                </motion.form>
              </div>
            </div>
          </div>
        </main>

       <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 my-12 max-w-3xl mx-auto px-4">
  {/* Browse Button */}
  <a
    href="/view-properties"
    className="relative inline-block px-8 py-3 text-white font-bold text-md rounded-full border-2 border-teal-500 bg-gradient-to-r from-indigo-600 to-teal-500  shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 overflow-hidden group"
  >
    <span className="relative z-10 flex items-center gap-2">
      🏡 Browse Properties
      <svg
        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </span>
    <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
  </a>

  {/* Add Property Button */}
  <a
    href="/add-properties"
    className="relative inline-block px-10 py-3 text-teal-700 font-bold text-md rounded-full bg-white border-2 border-teal-500 shadow-inner transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-teal-50 overflow-hidden group"
  >
    <span className="relative z-10 flex items-center gap-2">
      ✍️ List Your Property
    </span>
    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse" />
  </a>
</div>



        {/* Shuffling Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
          <AnimatePresence>
            {shuffledBadges.map((item) => (
              <motion.div
                key={item.text}
                layout
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-white text-gray-700 font-semibold shadow-md px-5 py-3 rounded-full flex items-center gap-2 text-sm sm:text-base cursor-default hover:scale-105 transform transition"
              >
                <span className="text-xl">{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default Hero;
