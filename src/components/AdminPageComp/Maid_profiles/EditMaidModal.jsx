import React, { useState, useEffect } from "react";

export default function EditMaidModal({ maid, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    experience: "",
    skills: "",
    location_served: "",
    profile_photo: "",
    aadhaar_front: "",
    aadhaar_back: "",
    pan: "",
    kyc_status: false,
    added_by_name: "",
    added_by_email: "",
    added_by_phone: "",
  });

  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    if (maid) {
      console.log("Editing Maid:", maid);
      setForm({
        first_name: maid.first_name || "",
        last_name: maid.last_name || "",
        age: maid.age || "",
        experience: maid.experience || "",
        skills: maid.skills || "",
        location_served: maid.location_served || "",
        profile_photo: maid.profile_photo || "",
        aadhaar_front: maid.aadhaar_front || "",
        aadhaar_back: maid.aadhaar_back || "",
        pan: maid.pan || "",
        kyc_status: maid.kyc_status || false,
        added_by_name: maid.added_by_name || "",
        added_by_email: maid.added_by_email || "",
        added_by_phone: maid.added_by_phone || "",
      });
    }
  }, [maid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value === "Approved";
    setForm((prev) => ({ ...prev, kyc_status: status }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!maid?.id) {
    console.error("Maid ID is missing!");
    return;
  }
  const payload = { 
    ...form, 
    added_by: maid.added_by || 0,
    age: form.age ? parseInt(form.age, 10) : null,
    id: maid.id 
  };
  await onSave(payload);
  onClose();
};



  if (!isOpen) return null;

  const renderImage = (label, field) => (
    <div className="flex flex-col items-center">
      <label className="block font-semibold mb-1">{label}</label>
      {form[field] ? (
        <>
          <img
            src={form[field]}
            alt={label}
            className="w-20 h-20 object-cover border rounded"
          />
          <button
            type="button"
            onClick={() => setViewImage(form[field])}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs mt-1"
          >
            View
          </button>
        </>
      ) : (
        <div className="w-20 h-20 border rounded flex items-center justify-center text-gray-400 text-xs mb-1">
          No Image
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4">Edit Maid Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Age & Skills */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="border p-2 rounded w-full max-w-[80px]"
                  required
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium mb-1">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Skills"
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Experience & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Location Served</label>
                <input
                  type="text"
                  name="location_served"
                  value={form.location_served}
                  onChange={handleChange}
                  placeholder="Location Served"
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            {/* Images */}
            <div className="flex gap-4 flex-wrap mb-3">
              {renderImage("Profile Photo", "profile_photo")}
              {renderImage("Aadhaar Front", "aadhaar_front")}
              {renderImage("Aadhaar Back", "aadhaar_back")}
              {renderImage("PAN", "pan")}
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col gap-1 max-w-xs">
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.kyc_status ? "Approved" : "Pending"}
                onChange={handleStatusChange}
                className="border rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            {/* Added By */}
            <div className="mb-3">
              <label className="block font-semibold mb-1">Added By</label>
              <p className="text-gray-800">
                {form.added_by_name} ({form.added_by_email}) - {form.added_by_phone}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Viewer */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setViewImage(null)}
        >
          <img
            src={viewImage}
            alt="View"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
}
