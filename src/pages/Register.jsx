import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { registerUser } from "../api/authApi";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    password: "",
    referralCode: referralFromUrl, // ✅ pre-fill referral from URL
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    // Prevent spaces for firstName and lastName
  if ((name === "firstName" || name === "lastName" || name === "password") && value.includes(" ")) {
    return;
  }

   if (name === "email") {
    value = value.toLowerCase();
  }

    setForm({ ...form, [name]: value });
  };

  const handleChangePhn = (e) => {
    const { value } = e.target;

    // Allow only digits and max 10
    if (/^\d*$/.test(value) && value.length <= 10) {
      setForm({ ...form, phone: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName) {
      toast.error("First Name and Last Name cannot be empty");
      return;
    }

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOK) {
      toast.error("Enter a valid email");
      return;
    }

    const phone = form.phone;
    const phoneOK =
      /^\d{10}$/.test(phone) &&
      !/^(\d)\1{9}$/.test(phone) && // repetitive
      phone !== "1234567890"; // fake

    if (!phoneOK) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    const toastId = toast.loading("Registering…");
    try {
      await registerUser(form);
      toast.success("Registration successful", { id: toastId });
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed", {
        id: toastId,
      });
      console.error("❌ Registration failed:", err);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen bg-blue-100 flex items-center justify-center p-4"
    >
      <a
        href="/"
        className="absolute top-5 left-5 text-blue-700 hover:underline"
      >
        Back to home page
      </a>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow-xl p-10 flex flex-col gap-6
          sm:p-8 sm:max-w-md
          xs:p-6 xs:max-w-full xs:mx-2"
      >
        <h1 className="text-2xl font-bold text-center text-blue-500">
          Register
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <input
            name="firstName"
            value={form.firstName}
            required
            onChange={handleChange}
            className={inputClasses}
            type="text"
            placeholder="First Name"
          />
          <input
            name="lastName"
            value={form.lastName}
            required
            onChange={handleChange}
            className={inputClasses}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          name="email"
          value={form.email}
          required
          onChange={handleChange}
          className={inputClasses}
          type="email"
          placeholder="Email"
        />

        <input
          name="phone"
          value={form.phone}
          required
          onChange={handleChangePhn}
          className={inputClasses}
          type="tel"
          placeholder="Phone Number"
          inputMode="numeric"
        />

        <input
          name="referralCode"
          value={form.referralCode}
          onChange={handleChange}
          className={inputClasses}
          type="text"
          placeholder="Referral Code (Optional)"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <label className="font-semibold text-gray-700 whitespace-nowrap">
            Gender
          </label>
          <div className="flex flex-wrap gap-3">
            {["male", "female", "others"].map((gender) => (
              <label
                key={gender}
                className={`flex items-center cursor-pointer px-4 py-2 rounded-lg border transition-all duration-300 ease-in-out
                  ${
                    form.gender === gender
                      ? "bg-blue-400 text-black border-blue-500 shadow-md"
                      : "bg-black text-white border-gray-600"
                  }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={form.gender === gender}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="relative w-full">
  <input
    name="password"
    value={form.password}
    required
    onChange={handleChange}
    className={`${inputClasses} pr-12`} // Add padding for icon
    type={showPassword ? "text" : "password"}
    placeholder="Password"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <FiEye size={20}/>  : <FiEyeOff size={20} /> }
  </button>
</div>

        <button
          type="submit"
          className="relative group px-6 w-full sm:w-[100px] h-[50px] py-2 bg-blue-400 hover:bg-zinc-800 text-zinc-800 hover:text-blue-200 rounded-lg font-semibold overflow-hidden shadow-lg transition-all duration-200 ease-in-out self-center"
        >
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-full">
            Submit
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 group-hover:translate-x-0">
            Submit
          </span>
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

export default Register;
