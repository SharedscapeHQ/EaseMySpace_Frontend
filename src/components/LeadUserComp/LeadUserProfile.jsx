import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import toast from "react-hot-toast";
import {
  updateLeadUserProfile,
  finalizeRegistration,
  fetchLeadUserProfile,
} from "../../api/leadApi";

const requiredFields = ["firstName", "lastName", "email", "gender", "password"];

export default function LeadUserProfile() {
  const [profile, setProfile] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    password: "",
  });
  const [filledFields, setFilledFields] = useState({});
  const [completed, setCompleted] = useState(0);
  const [finalized, setFinalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genderEdited, setGenderEdited] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get stored phone with +91 prefix for display
        let storedPhone = localStorage.getItem("user_verified_mobile") || "";

        // Prepare plain 10-digit phone for backend API call (strip +91 if present)
        const phoneForApi = storedPhone.startsWith("+91")
          ? storedPhone.slice(3)
          : storedPhone;

        setProfile((prev) => ({ ...prev, phone: storedPhone }));

        const data = await fetchLeadUserProfile(phoneForApi);
        if (data.success && data.profile) {
          setProfile((prev) => ({
            ...prev,
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            email: data.profile.email || "",
            gender: data.profile.gender || "male",
          }));

          setFilledFields({
            firstName: !!data.profile.firstName,
            lastName: !!data.profile.lastName,
            email: !!data.profile.email,
            gender: !!data.profile.gender,
          });

          setFinalized(data.profile.finalized || false);
          setGenderEdited(false);
        }
      } catch {
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    const filledCount = requiredFields.reduce((count, field) => {
      if (field === "password") {
        if (!finalized && profile.password.trim() !== "") return count + 1;
        return count;
      }
      if (profile[field] && profile[field].toString().trim() !== "") return count + 1;
      return count;
    }, 0);

    const percent = Math.floor((filledCount / requiredFields.length) * 100);
    setCompleted(percent);
  }, [profile, finalized]);

  const handleChange = (e) => {
    if (finalized) return;
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "gender" && !genderEdited) {
      setGenderEdited(true);
    }
  };

  const handleUpdate = async () => {
    try {
      // Send plain 10-digit phone to backend by stripping +91
      const phonePlain = profile.phone.startsWith("+91") ? profile.phone.slice(3) : profile.phone;

      const dataToSend = { phone: phonePlain };

      requiredFields.forEach((field) => {
        if (profile[field] && profile[field].toString().trim() !== "") {
          dataToSend[field] = profile[field].toString().trim();
        }
      });

      if (!dataToSend.password) delete dataToSend.password;

      if (Object.keys(dataToSend).length <= 1) {
        toast.error("Please fill at least one field to update.");
        return;
      }

      await updateLeadUserProfile(dataToSend);
      toast.success("Profile updated successfully!");

      if (completed === 100) {
        try {
          await finalizeRegistration(phonePlain);
          toast.success("Registration finalized! Please login.");
          setFinalized(true);
        } catch (err) {
          if (err.response?.status === 409) {
            toast.error(err.response.data.message || "Already registered. Please login.");
            setFinalized(true);
          } else {
            toast.error("Failed to finalize registration");
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="bg-white shadow rounded p-4 sm:p-6 lg:p-10">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Guest User Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Form Section */}
        <div>
          <p className="mb-4 text-gray-600 text-sm sm:text-base">
            <span className="font-semibold">Phone:</span> {profile.phone}
          </p>

          {["firstName", "lastName", "email", "gender", "password"].map((field) =>
            field === "gender" ? (
              <select
                key={field}
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={genderEdited || finalized}
                className="w-full p-2 sm:p-3 border rounded mb-4 focus:outline-none focus:ring focus:ring-indigo-200 text-sm sm:text-base"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                key={field}
                name={field}
                value={profile[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === "password" ? "password" : "text"}
                disabled={filledFields[field] || finalized}
                className="w-full p-2 sm:p-3 border rounded mb-4 focus:outline-none focus:ring focus:ring-indigo-200 text-sm sm:text-base"
              />
            )
          )}

          <div className="mt-4 text-center">
            {!finalized ? (
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Update Profile
              </button>
            ) : (
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 sm:w-48 sm:h-48">
            <PieChart
              data={[
                { title: "Completed", value: completed, color: "#4caf50" },
                { title: "Remaining", value: 100 - completed, color: "#ddd" },
              ]}
              lineWidth={20}
              rounded
              label={({ dataEntry }) =>
                dataEntry.title === "Completed" ? `${completed}%` : ""
              }
              labelStyle={{
                fontSize: "14px",
                fontWeight: "bold",
                fill: "#4caf50",
              }}
              animate
            />
          </div>
          <p className="mt-4 text-gray-500 text-sm sm:text-base">Profile Completion</p>
        </div>
      </div>
    </div>
  );
}
