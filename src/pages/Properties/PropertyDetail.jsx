import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  sendLeadOtp,
  verifyLeadOtp,
} from "../../API/propertiesApi";

function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState(null);

  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stage, setStage] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [progressMsg, setProgressMsg] = useState("");

  const RESEND = 30;
  const [counter, setCounter] = useState(0);
  const modalRef = useRef(null);

  /* ---------- fetch property ---------- */
  useEffect(() => {
    if (property) return;
    getPropertyById(id)
      .then((res) => setProperty(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load property.")
      )
      .finally(() => setLoading(false));
  }, [id, property]);

  /* ---------- esc key closes modal ---------- */
  useEffect(() => {
    if (!showModal) return;
    const esc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [showModal]);

  /* ---------- resend countdown ---------- */
  useEffect(() => {
    if (counter === 0) return;
    const t = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(t);
  }, [counter]);

  const closeModal = () => {
    setShowModal(false);
    setStage("phone");
    setProgressMsg("");
    setCounter(0);
  };

  const statusBadge = (status) => {
    if (!status) return null;
    const m = status.toLowerCase();
    const cls =
      m === "available"
        ? "bg-green-100 text-green-700"
        : m === "booked"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-800";
    return (
      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${cls}`}>
        {status}
      </span>
    );
  };

  const sendOtp = (e) => {
    e.preventDefault();
    setProgressMsg("Sending OTP…");
    sendLeadOtp(phone, id)
      .then(() => {
        setStage("otp");
        setProgressMsg("OTP sent. Check your phone.");
        setCounter(RESEND);
      })
      .catch(() => setProgressMsg("Failed to send OTP."));
  };

  const resendOtp = () => {
    if (counter !== 0) return;
    setProgressMsg("Resending OTP…");
    sendLeadOtp(phone, id)
      .then(() => {
        setProgressMsg("OTP re‑sent.");
        setCounter(RESEND);
      })
      .catch(() => setProgressMsg("Failed to resend OTP."));
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setProgressMsg("Verifying…");
    verifyLeadOtp(phone, code)
      .then(() => {
        setIsVerified(true);
        closeModal();
      })
      .catch(() => setProgressMsg("Invalid or expired OTP."));
  };

  const handleEnquire = () => (isVerified ? navigate(-1) : setShowModal(true));

  if (loading)
    return (
      <div className="pt-28 text-center text-sky-600">
        Loading property details…
      </div>
    );

  if (error)
    return (
      <div className="pt-28 text-center text-red-600">
        {error}
        <button className="ml-2 underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  if (!property)
    return (
      <div className="pt-28 text-center text-gray-500">Property not found.</div>
    );

  return (
    <>
      {/* ---------- modal ---------- */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            ref={modalRef}
            className="bg-white w-[90%] max-w-xs sm:max-w-sm p-6 rounded-2xl shadow-xl relative"
          >
            {stage === "phone" && (
              <form onSubmit={sendOtp} className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Enter Phone
                </h3>
                <input
                  type="tel"
                  required
                  placeholder="+91XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded"
                >
                  Send OTP
                </button>
              </form>
            )}

            {stage === "otp" && (
              <form onSubmit={verifyOtp} className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Enter OTP
                </h3>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded"
                >
                  Verify
                </button>
                <button
                  type="button"
                  disabled={counter !== 0}
                  onClick={resendOtp}
                  className={`w-full border mt-2 py-2 rounded ${
                    counter === 0
                      ? "text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      : "text-gray-400 border-gray-300 cursor-not-allowed"
                  }`}
                >
                  {counter === 0 ? "Resend OTP" : `Resend in ${counter}s`}
                </button>
              </form>
            )}

            {progressMsg && (
              <p className="mt-4 text-center text-sm text-gray-600">
                {progressMsg}
              </p>
            )}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ---------- page ---------- */}
      <div className="pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="relative h-64 sm:h-80 lg:h-[420px] w-full overflow-hidden rounded-3xl shadow-lg">
          {property.image ? (
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400 italic">
              No Image
            </div>
          )}
          <div
            className={`absolute bottom-4 right-4 bg-white/70 backdrop-blur-md rounded-xl px-6 py-4 shadow-lg space-y-1 ${
              !isVerified ? "filter blur-sm select-none" : ""
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-indigo-800">
              ₹ {property.price?.toLocaleString()}
            </p>
            {statusBadge(property.flat_status)}
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {/* left */}
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-900">
              {property.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {property.location}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-gray-700">
              <div>
                <p className="font-medium">Property ID</p>
                <p>{property.id}</p>
              </div>
              {property.built_up_area && (
                <div>
                  <p className="font-medium">Built‑up Area</p>
                  <p>{property.built_up_area} sq ft</p>
                </div>
              )}
              {property.rooms && (
                <div>
                  <p className="font-medium">Rooms</p>
                  <p>{property.rooms}</p>
                </div>
              )}
              {property.available_from && (
                <div>
                  <p className="font-medium">Available From</p>
                  <p>
                    {new Date(
                      property.available_from
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* right */}
          <div className="md:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow p-6 space-y-4">
              <p
                className={`text-lg sm:text-xl font-semibold text-indigo-800 ${
                  !isVerified ? "filter blur-sm select-none" : ""
                }`}
              >
                ₹ {property.price?.toLocaleString()}
              </p>
              {statusBadge(property.flat_status)}
              <button
                type="button"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                onClick={handleEnquire}
              >
                {isVerified ? "Go Back" : "Show Details"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">
            Description
          </h2>
          <p
            className={`leading-relaxed text-gray-700 whitespace-pre-line ${
              !isVerified ? "filter blur-sm select-none" : ""
            }`}
          >
            {property.description || "No description provided."}
          </p>
        </div>
      </div>
    </>
  );
}

export default PropertyDetail;
