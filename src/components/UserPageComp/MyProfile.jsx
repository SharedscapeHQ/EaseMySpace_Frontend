import React, { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiCamera } from "react-icons/fi";
import { getCurrentUser } from "../../api/authApi";
import { updateUserProfile } from "../../api/userApi";
import toast from "react-hot-toast";

export default function MyProfile() {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({ email: "", phone: "" });

  useEffect(() => {
    (async () => {
      const res = await getCurrentUser();
      const formatted = {
        ...res,
        createdAt: res.created_at,
        profileImage: res.profile_image || "",
      };
      setFormData(formatted);
      setOriginalData(formatted);
    })();
  }, []);

  if (!formData) return <div className="text-center py-10">Loading...</div>;

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData({ ...formData, profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handleEmailChange = (value) => {
    setFormData({ ...formData, email: value });
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => ({
      ...prev,
      email: pattern.test(value) ? "" : "Invalid email format",
    }));
  };

  const handlePhoneChange = (v) => {
    const cleaned = v.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: cleaned });
    setErrors((prev) => ({
      ...prev,
      phone: cleaned.length === 10 ? "" : "Phone must be exactly 10 digits",
    }));
  };

  const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

  const formatPrettyDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix =
      day === 1 ? "st" :
      day === 2 ? "nd" :
      day === 3 ? "rd" : "th";

    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  };

  const handleSave = async () => {
    if (errors.email || errors.phone) return toast.error("Fix your errors first");
    if (!isChanged) return toast("No changes to update");

    try {
      setIsSaving(true);
      await updateUserProfile(formData);

      toast.success("Profile Updated");

      const updated = await getCurrentUser();
      const formatted = { ...updated, createdAt: updated.created_at };

      setFormData(formatted);
      setOriginalData(formatted);
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const disableSave = !isChanged || !!errors.email || !!errors.phone || isSaving;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full bg-white rounded-xl shadow-sm border">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 style={{ fontFamily: "para_font" }} className="text-xl font-semibold text-gray-700">Profile Overview</h2>

          <button
            disabled={isSaving}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-all duration-200
              ${isEditing ? "bg-green-100 text-green-700 border-green-300" : "bg-indigo-100 text-indigo-700 border-indigo-300"}
              ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            `}
          >
            {isSaving ? (
              <span className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"></span>
            ) : isEditing ? (
              <FiSave />
            ) : (
              <FiEdit2 />
            )}
            {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 py-6">
          <div className="relative  w-28 h-28">
            <img
              src={formData.profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className={`w-full h-full transition-all ease-in-out duration-300 object-cover rounded-full border shadow-sm ${isEditing ? "hover:scale-105" : ""}`}
            />

            {isEditing && (
              <>
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md"
                >
                  <FiCamera size={15} />
                </label>
                <input id="profilePic" type="file" className="hidden" onChange={onImageChange} />
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            {formData.firstName} {formData.lastName}
          </h3>
        </div>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input disabled value={formData.firstName} className="p-3 border rounded-md bg-gray-100" />
            <input disabled value={formData.lastName} className="p-3 border rounded-md bg-gray-100" />

          <select
  disabled={!isEditing}
  value={formData.gender}
  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
  className="p-3 border rounded-md disabled:bg-gray-100"
>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>


            <div>
              <input
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`p-3 border rounded-md w-full ${errors.phone ? "border-red-400" : ""}`}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <input
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`p-3 border rounded-md w-full ${errors.email ? "border-red-400" : ""}`}
            />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm text-gray-600 border">
            Account active since:{" "}
            <span className="font-medium text-gray-900">
              {formatPrettyDate(formData.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
