import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiTrash2, FiUserPlus } from "react-icons/fi";
import { getAllRMs, addRM, deleteRM } from "../../api/rmApi";
import dayjs from "dayjs";

export default function ManageRMs() {
  const [rmList, setRmList] = useState([]);
  const [newRM, setNewRM] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchRMs();
  }, []);

  const capitalizeName = (name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const fetchRMs = async () => {
    try {
      const data = await getAllRMs();
      setRmList(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch RMs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRM = async () => {
    const name = capitalizeName(newRM.name);
    const { email, phone } = newRM;

    if (!name || !email || !phone) {
      toast.error("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }

    setAdding(true);
    try {
      const addedRM = await addRM({ name, email, phone });
      setRmList([addedRM, ...rmList]);
      setNewRM({ name: "", email: "", phone: "" });
      toast.success("RM added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add RM");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteRM = async (id) => {
    try {
      await deleteRM(id);
      setRmList(rmList.filter((rm) => rm.id !== id));
      toast.success("RM deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete RM");
    }
  };

  return (
    <div style={{fontFamily:"para_font"}} className="p-6 max-w-5xl mx-auto">
      <h2 style={{fontFamily:"para_font"}} className="text-3xl mb-8 text-zinc-800">Manage RMs</h2>

      {/* Add RM Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
        <h3 className="text-xl mb-5 text-gray-700 flex items-center gap-2">
          <FiUserPlus size={22} /> Add New RM
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newRM.name}
            onChange={(e) => setNewRM({ ...newRM, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newRM.email}
            onChange={(e) => setNewRM({ ...newRM, email: e.target.value })}
            list="email-suggestions"
          />
          <datalist id="email-suggestions">
            {["easemyspace.in","gmail.com", "yahoo.com", "outlook.com"].map((domain) =>
              newRM.email.includes("@") ? null : (
                <option key={domain} value={`${newRM.email}@${domain}`} />
              )
            )}
          </datalist>

          <input
            type="text"
            placeholder="Phone"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newRM.phone}
            maxLength={10}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setNewRM({ ...newRM, phone: onlyNums });
            }}
          />
        </div>

        <button
          onClick={handleAddRM}
          disabled={adding}
          className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {adding ? "Adding…" : "Add RM"}
        </button>
      </div>

      {/* RM List */}
      <div style={{fontFamily:"para_font"}} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rmList.map((rm) => (
          <div
            key={rm.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
          >
            <div className="flex-1">
              <p style={{fontFamily:"para_font"}} className=" text-lg text-gray-800">{rm.name}</p>
              <p className="text-gray-600">{rm.email}</p>
              <p className="text-gray-500">{rm.phone}</p>
              {rm.created_at && (
                <p className="text-sm text-gray-400 mt-1">
                  Added: {dayjs(rm.created_at).format("DD MMM YYYY, hh:mm A")}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteRM(rm.id)}
              className="text-red-600 hover:text-red-800 p-3 rounded-full transition duration-300 self-end sm:self-auto"
            >
              <FiTrash2 size={22} />
            </button>
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-500 mt-4">Loading RMs...</p>}
    </div>
  );
}
