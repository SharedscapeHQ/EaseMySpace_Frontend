import React, { useState, useEffect, Fragment } from "react";
import {
  FaHome,
  FaInfoCircle,
  FaCheckCircle,
  FaUpload,
} from "react-icons/fa";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { addProperty } from "../../API/propertiesApi";
import { loginUser } from "../../API/authAPI";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    flat_status: "",
    gender: "",
    looking_for: "",
    bhk: "",
    occupancy: "",
    distance_from_station: "",
    image_base64: [],
    video_base64: [],
  });

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject();
    });

  useEffect(() => {
    (async () => {
      try {
        const user = await loginUser();
        setFormData((p) => ({
          ...p,
          title: `${user.firstName} ${user.lastName}`,
        }));
      } catch {
        setError("Failed to load user info");
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    try {
      const base64s = await Promise.all(
        files.map(async (file) => {
          const result = await toBase64(file);
          const [, , data] = result.match(/^data:(.+);base64,(.*)$/);
          return data;
        })
      );
      setFormData((p) => ({
        ...p,
        [`${type}_base64`]: [...p[`${type}_base64`], ...base64s],
      }));
    } catch {
      toast.error(`Failed to read ${type} files`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.price ||
      !formData.location ||
      !formData.flat_status ||
      !formData.gender ||
      formData.image_base64.length === 0
    ) {
      toast.error("Fill all required fields & upload at least one image");
      return;
    }

    setUploading(true);
    try {
      await addProperty(formData);
      toast.success("Property submitted!");
      setFormData((p) => ({
        ...p,
        price: "",
        location: "",
        flat_status: "",
        gender: "",
        looking_for: "",
        bhk: "",
        occupancy: "",
        distance_from_station: "",
        image_base64: [],
        video_base64: [],
      }));
    } catch {
      toast.error("Upload failed – please try again");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser)
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen">
        Loading user…
      </div>
    );

  return (
    <div className="pt-4 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen flex justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 bg-white rounded-3xl shadow-2xl p-10"
      >
        <form onSubmit={handleSubmit} className="flex-1">
          <h2 className="flex items-center text-3xl font-extrabold mb-8 text-indigo-700">
            <FaHome className="mr-3 text-indigo-500" /> Add New Property
          </h2>

          <Label>Title (User) *</Label>
          <Input readOnly value={formData.title} name="title" disabled />

          <Label>Rent (₹/month) *</Label>
          <Input type="number" name="price" placeholder="12000" value={formData.price} onChange={handleChange} />

          <Label>Location *</Label>
          <Input name="location" placeholder="Andheri West, Mumbai" value={formData.location} onChange={handleChange} />

          <Label>Flat Status *</Label>
          <Input name="flat_status" placeholder="Available / Booked" value={formData.flat_status} onChange={handleChange} />

          <Label>Gender *</Label>
          <div className="flex gap-6 mb-6">
            {["male", "female", "unisex"].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="accent-indigo-600"
                />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>

          <FancySelect
            label="Looking For"
            name="looking_for"
            value={formData.looking_for}
            onChange={handleChange}
            options={[
              { value: "", label: "Select" },
              { value: "flatmate", label: "Flat-mate" },
              { value: "vacant", label: "Vacant Flat" },
            ]}
          />

          <FancySelect
            label="BHK"
            name="bhk"
            value={formData.bhk}
            onChange={handleChange}
            options={[
              { value: "", label: "Select" },
              { value: "1", label: "1 BHK" },
              { value: "1.5", label: "1.5 BHK" },
              { value: "2", label: "2 BHK" },
              { value: "2.5", label: "2.5 BHK" },
              { value: "3", label: "3 BHK" },
              { value: "4", label: "4 BHK" },
            ]}
          />

          <FancySelect
            label="Occupancy"
            name="occupancy"
            value={formData.occupancy}
            onChange={handleChange}
            options={[
              { value: "", label: "Select" },
              { value: "single", label: "Single (1 person)" },
              { value: "double", label: "Double (2 people)" },
              { value: "triple", label: "Triple (3 people)" },
            ]}
          />

          <Label>Distance from Station</Label>
          <Input
            name="distance_from_station"
            placeholder="e.g. 500 meters"
            value={formData.distance_from_station}
            onChange={handleChange}
          />

          <Label>Upload Images *</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "image")}
            className="block mb-2 mt-1 text-sm file:bg-indigo-50 file:text-indigo-700 file:rounded file:px-4 file:py-2 file:border-0 hover:file:bg-indigo-100"
            required
          />
          {formData.image_base64.length > 0 && (
            <p className="mb-6 text-green-600 flex items-center gap-2">
              <FaCheckCircle /> {formData.image_base64.length} image(s) selected
            </p>
          )}

          <Label>Upload Videos</Label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileChange(e, "video")}
            className="block mb-8 mt-1 text-sm file:bg-indigo-50 file:text-indigo-700 file:rounded file:px-4 file:py-2 file:border-0 hover:file:bg-indigo-100"
          />
          {formData.video_base64.length > 0 && (
            <p className="mb-8 -mt-6 text-green-600 flex items-center gap-2">
              <FaCheckCircle /> {formData.video_base64.length} video(s) selected
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={uploading}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-lg transition ${
              uploading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {uploading && (
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ ease: "linear", duration: 1, repeat: Infinity }}
              >
                <FaUpload />
              </motion.span>
            )}
            {uploading ? "Uploading…" : "Submit Property"}
          </motion.button>
        </form>

        <aside className="hidden lg:flex flex-col bg-indigo-50 rounded-3xl p-8 max-w-xs text-indigo-900 shadow-lg">
          <div className="flex items-center mb-6">
            <FaInfoCircle className="text-indigo-600 mr-3 text-3xl" />
            <h3 className="text-xl font-bold">Need tips?</h3>
          </div>
          {[
            "Use a catchy, descriptive title",
            "Set a competitive rent",
            "Pin‑point the exact location",
            "Clarify current flat status",
            "Upload bright, well‑lit photos",
            "A short video tour really helps!",
          ].map((tip) => (
            <p key={tip} className="mb-3 leading-relaxed before:content-['•'] before:mr-2">
              {tip}
            </p>
          ))}
        </aside>
      </motion.div>
    </div>
  );
};

/* ────── Reusable UI ────── */
const Label = ({ children }) => (
  <label className="font-semibold block mb-2">{children}</label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-4 py-3 border rounded-lg mb-6 ${props.className || ""}`}
  />
);

const FancySelect = ({ label, name, value, onChange, options }) => (
  <div className="mb-6">
    {label && <Label>{label}</Label>}
    <Listbox value={value} onChange={(val) => onChange({ target: { name, value: val } })}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="block truncate">
                {options.find((o) => o.value === value)?.label || "Select"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    value={opt.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {opt.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  </div>
);

export default AddProperty;
