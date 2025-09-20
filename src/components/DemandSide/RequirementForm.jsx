import React, { useEffect, useState } from "react";
import { saveRequirement, getMyRequirement } from "../../api/userApi";
import { useLocation } from "react-router-dom";

export default function RequirementForm({ onSubmit, initialData }) {

   const location = useLocation();
  const stateData = location.state?.initialData;

  const [formData, setFormData] = useState(
    initialData || stateData || {
      location: "",
      budgetMin: "",
      budgetMax: "",
      bhk: "1 BHK",
      moveIn: "",
      urgency: "Within 2–4 weeks",
      fullName: "",
      email: "",
      phone: "",
      lifestyle: {
        pureVeg: false,
        furnished: false,
        petFriendly: false,
      },
      notes: "",
    }
  );

  const [loading, setLoading] = useState(false);

  // Fetch existing requirement on mount (if no initialData passed)
  useEffect(() => {
    if (initialData) return; // parent might preload
    (async () => {
      try {
        const data = await getMyRequirement();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setFormData({
          location: data.location || "",
          budgetMin: data.budgetMin || "",
          budgetMax: data.budgetMax || "",
          bhk: data.bhk || "1 BHK",
          moveIn: data.moveIn || "",
          urgency: data.urgency || "Within 2–4 weeks",
          fullName: data.fullName || user.firstName || "",
          email: data.email || user.email || "",
          phone: data.phone || user.phone || "",
          lifestyle: data.lifestyle || {
            pureVeg: false,
            furnished: false,
            petFriendly: false,
          },
          notes: data.notes || "",
        });
      } catch (err) {
        console.log(" No existing requirement found, user will create new.");
      }
    })();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (["pureVeg", "furnished", "petFriendly"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        lifestyle: { ...prev.lifestyle, [name]: checked },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await saveRequirement(formData);
      // 🔑 instead of alert, call parent's onSubmit
      onSubmit?.(formData);
    } catch (err) {
      alert("❌ Failed to save requirement. Try again.");
    } finally {
      setLoading(false);
    }
  };

  

  const clearForm = () =>
    setFormData({
      location: "",
      budgetMin: "",
      budgetMax: "",
      bhk: "1 BHK",
      moveIn: "",
      urgency: "Within 2–4 weeks",
      fullName: "",
      email: "",
      phone: "",
      lifestyle: { pureVeg: false, furnished: false, petFriendly: false },
      notes: "",
    });

  return (
    <main
      style={{ fontFamily: "para_font" }}
      className="max-w-7xl pt-16 mx-auto space-y-2 font-sans"
    >
      {/* Section 1 */}
      <section className="p-3 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-lg">1</div>
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-sm lg:text-xl text-gray-900"
          >
            Tell us what you need
          </h2>
          <span className="text-gray-500 text-xs">Demand-First</span>
        </div>

        <div className="grid md:grid-cols-5 gap-7">
          {/* Location */}
          <div className="flex flex-col">
            <label
              htmlFor="location"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Preferred Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Preferred Location"
              value={formData.location}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 w-full text-sm"
            />
          </div>

          {/* Budget Min */}
          <div className="flex flex-col">
            <label
              htmlFor="budgetMin"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Min Budget (₹)
            </label>
            <input
              type="number"
              id="budgetMin"
              name="budgetMin"
              placeholder="Min Budget (₹)"
              value={formData.budgetMin}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Budget Max */}
          <div className="flex flex-col">
            <label
              htmlFor="budgetMax"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Max Budget (₹)
            </label>
            <input
              type="number"
              id="budgetMax"
              name="budgetMax"
              placeholder="Max Budget (₹)"
              value={formData.budgetMax}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* BHK */}
          <div className="flex flex-col">
            <label
              htmlFor="bhk"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              BHK
            </label>
            <select
              id="bhk"
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option>1 BHK</option>
              <option>1.5 BHK</option>
              <option>2 BHK</option>
              <option>2.5 BHK</option>
              <option>3 BHK</option>
              <option>4+ BHK</option>
            </select>
          </div>

          {/* Move-in */}
          <div className="flex flex-col">
            <label
              htmlFor="moveIn"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Move-in Date (Optional)
            </label>
            <input
              type="date"
              id="moveIn"
              name="moveIn"
              value={formData.moveIn}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-lg">2</div>
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-sm lg:text-xl text-gray-900"
          >
            Your lifestyle preferences (Optional)
          </h2>
        </div>

        <div className="flex flex-wrap gap-7">
          {["pureVeg", "furnished", "petFriendly"].map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer w-60 hover:bg-gray-100 transition text-sm"
            >
              <input
                type="checkbox"
                name={key}
                checked={formData.lifestyle[key]}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>
                {key === "pureVeg"
                  ? "Pure Veg Only"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </label>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Notes */}
          <div className="flex flex-col">
            <label
              htmlFor="notes"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Additional Notes
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              placeholder="Additional Notes"
              value={formData.notes}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Urgency */}
          <div className="flex flex-col">
            <label
              htmlFor="urgency"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Urgency
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            >
              <option value="Within 2–4 weeks">Within 2–4 weeks</option>
              <option value="Immediate">Urgent (Within 7 days)</option>
              <option value="Flexible">Exploring (1-2 months)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-blue-600 text-lg">3</div>
          <h2
            style={{ fontFamily: "heading_font" }}
            className="text-sm lg:text-xl text-gray-900"
          >
            Contact & Verification
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {/* Name */}
          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Mobile
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Mobile"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-gray-600 lg:text-sm text-[10px] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Buttons */}
      <div className="flex justify-between text-base px-6">
        <button
          onClick={clearForm}
          type="button"
          className="px-6 py-2 border-2 border-zinc-200 rounded-lg hover:bg-gray-200 transition font-medium lg:text-sm text-xs"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium lg:text-sm text-xs"
        >
          {loading ? "Saving..." : "Post My Requirement"}
        </button>
      </div>
    </main>
  );
}
