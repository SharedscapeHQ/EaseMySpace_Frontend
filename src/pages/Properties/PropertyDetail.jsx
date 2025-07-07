/* ----------------------------------------------------------------
   PropertyDetail.jsx   –   full page with gallery + OTP flow
---------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  getPropertyById,
  sendLeadOtp,
  verifyLeadOtp,
} from "../../API/propertiesApi";

/* ------------ tiny helpers (reuse everywhere) ----------------- */
const parseImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.startsWith("{"))
    return raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  return [raw];
};
const pickCover = (arr = []) =>
  arr.find((u) => /\.(jpe?g|png|webp|gif)$/i.test(u)) || null;

/* =============================================================== */
export default function PropertyDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate  = useNavigate();

  /* ---------- initial data (maybe passed from list) ------------ */
  const init = location.state?.property
    ? enrich(location.state.property)
    : null;

  const [property, setProperty] = useState(init);
  const [loading,   setLoading] = useState(!init);
  const [error,     setError]   = useState(null);

  /* ---------- OTP modal flow (UNCHANGED logic) ----------------- */
  const [isVerified, setIsVerified] = useState(false);
  const [showOtp,    setShowOtp]    = useState(false);
  const [stage,      setStage]      = useState("phone");
  const [phone,      setPhone]      = useState("");
  const [code,       setCode]       = useState("");
  const [progress,   setProgress]   = useState("");
  const RESEND = 30;
  const [wait, setWait] = useState(0);
  useEffect(() => { if (wait) setTimeout(()=>setWait(wait-1),1000); }, [wait]);

  /* ---------- gallery overlay ---------------------------------- */
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const openLightbox  = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  /* ---------- fetch if needed ---------------------------------- */
  useEffect(() => {
    if (property) return;
    getPropertyById(id)
      .then(({ data }) => setProperty(enrich(data)))
      .catch((err)=>setError(err.response?.data?.message || "Failed to load"))
      .finally(()=>setLoading(false));
  }, [id, property]);

  /* ---------- local util --------------------------------------- */
  function enrich(row){
    const images = parseImages(row.image);
    return { ...row, images, cover: pickCover(images) };
  }
  const badge = (st) => {
    if (!st) return null;
    const s=st.toLowerCase();
    const style =
      s==="available" ? "bg-green-100 text-green-700" :
      s==="booked"    ? "bg-red-100 text-red-700"   :
                       "bg-yellow-100 text-yellow-800";
    return <span className={`px-3 py-[2px] text-sm rounded-full font-medium ${style}`}>{st}</span>;
  };

  /* ---------- OTP handlers (unchanged) ------------------------- */
  const sendOtp = (e) => {
    e.preventDefault();
    setProgress("Sending OTP…");
    sendLeadOtp(phone, id)
      .then(()=>{setStage("otp"); setProgress("OTP sent"); setWait(RESEND);})
      .catch(()=>setProgress("Failed to send OTP"));
  };
  const resendOtp = ()=>{
    if (wait) return;
    setProgress("Resending…");
    sendLeadOtp(phone,id)
      .then(()=>{setProgress("OTP re‑sent"); setWait(RESEND);})
      .catch(()=>setProgress("Failed"));
  };
  const verifyOtp = (e)=>{
    e.preventDefault();
    setProgress("Verifying…");
    verifyLeadOtp(phone,code)
      .then(()=>{setIsVerified(true); setShowOtp(false);})
      .catch(()=>setProgress("Invalid / expired OTP"));
  };

  /* ---------- early UI states ---------------------------------- */
  if (loading)
    return <p className="pt-28 text-center text-sky-600">Loading details…</p>;
  if (error)
    return (
      <div className="pt-28 text-center text-red-600">
        {error}
        <button className="underline ml-2" onClick={()=>navigate(-1)}>go back</button>
      </div>
    );
  if (!property) return <p className="pt-28 text-center">Not found</p>;

  /* ======================  JSX  ================================= */
  return (
    <>
      {/* ---------- FULL‑SCREEN LIGHTBOX ---------- */}
      {lightboxIdx!==null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 "
          onClick={closeLightbox}
        >
          <button
            onClick={(e)=>{e.stopPropagation();setLightboxIdx((lightboxIdx-1+property.images.length)%property.images.length);}}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-light select-none"
          >‹</button>

          <img
            src={property.images[lightboxIdx]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={(e)=>{e.stopPropagation();setLightboxIdx((lightboxIdx+1)%property.images.length);}}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-light select-none"
          >›</button>
          <button className="absolute top-6 right-6 text-white text-3xl" onClick={closeLightbox}>×</button>
        </div>
      )}

      {/* ---------- OTP MODAL ---------- */}
      {showOtp && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e)=>e.currentTarget===e.target && setShowOtp(false)}
        >
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-2xl shadow-xl space-y-4 relative">
            <button className="absolute top-3 right-4 text-gray-400 text-xl" onClick={()=>setShowOtp(false)}>×</button>

            {stage==="phone" && (
              <form className="space-y-4" onSubmit={sendOtp}>
                <h3 className="text-center text-lg font-semibold">Verify your phone</h3>
                <input
                  type="tel" required placeholder="+91XXXXXXXXXX"
                  value={phone} onChange={(e)=>setPhone(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">Send OTP</button>
              </form>
            )}

            {stage==="otp" && (
              <form className="space-y-4" onSubmit={verifyOtp}>
                <h3 className="text-center text-lg font-semibold">Enter OTP</h3>
                <input
                  type="text" maxLength={6} required placeholder="6‑digit code"
                  value={code} onChange={(e)=>setCode(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">Verify</button>
                <button
                  type="button" onClick={resendOtp} disabled={wait}
                  className={`w-full border py-2 rounded ${wait? "text-gray-400 border-gray-300" : "text-indigo-600 border-indigo-600 hover:bg-indigo-50"}`}
                >
                  {wait? `Resend in ${wait}s` : "Resend OTP"}
                </button>
              </form>
            )}

            {progress && <p className="text-center text-sm text-gray-500">{progress}</p>}
          </div>
        </div>
      )}

      {/* ---------- PAGE ---------- */}
      <div className=" pb-16 px-4 md:px-8 max-w-6xl mx-auto">

        {/* === hero + thumbs === */}
        <div className="relative">
          {/* hero */}
          <img
            src={property.cover || property.images[0] || ""}
            alt={property.title}
            className="w-full h-72 sm:h-96 lg:h-[460px] object-cover rounded-3xl shadow-lg"
            onClick={()=>openLightbox(property.images.findIndex(i=>i===property.cover))}
          />

          {/* glass price badge */}
          <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur px-6 py-4 rounded-xl shadow space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-indigo-800">
              ₹ {property.price?.toLocaleString()}
            </p>
            {badge(property.flat_status)}
          </div>
        </div>

        {/* thumbs (desktop) */}
        {property.images.length>1 && (
          <div className="hidden sm:flex mt-4 gap-3 overflow-x-auto pb-2">
            {property.images.map((img,i)=>(
              <img
                key={i}
                src={img}
                alt=""
                onClick={()=>openLightbox(i)}
                className="h-20 w-32 object-cover rounded-lg cursor-pointer hover:brightness-110 transition"
              />
            ))}
          </div>
        )}

        {/* thumbs (mobile carousel) */}
        {property.images.length>1 && (
          <div className="sm:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
            {property.images.map((img,i)=>(
              <img
                key={i}
                src={img}
                alt=""
                onClick={()=>openLightbox(i)}
                className="h-16 w-24 flex-none object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* === main grid === */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">

          {/* ---------- text block ---------- */}
          <section className="md:col-span-2 space-y-6">
            <header className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-indigo-900">
                {property.title}
              </h1>
              <p className="text-gray-600 text-lg">{property.location}</p>
            </header>

            {/* quick facts grid */}
            <div className="bg-white rounded-2xl shadow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 px-6 py-8">
              <Info label="Property ID" value={property.id} />
              {property.built_up_area && (
                <Info label="Built‑up" value={`${property.built_up_area} sq ft`} />
              )}
              {property.rooms && <Info label="Rooms" value={property.rooms} />}
              {property.available_from && (
                <Info
                  label="Available From"
                  value={new Date(property.available_from).toLocaleDateString("en-IN")}
                />
              )}
              {property.bhk && <Info label="Configuration" value={property.bhk} />}
              {property.furnishing && <Info label="Furnishing" value={property.furnishing} />}
              {property.attachedBath && <Info label="Bath" value={property.attachedBath} />}
              {property.deposit && <Info label="Deposit" value={`₹ ${property.deposit.toLocaleString()}`} />}
            </div>

            {/* description */}
            <div>
              <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Description</h2>
              <p className={`whitespace-pre-line leading-relaxed text-gray-700 ${!isVerified && "filter blur-[2px] select-none"}`}>
                {property.description || "No description provided."}
              </p>
              {!isVerified && (
                <p className="mt-4 italic text-sm text-gray-500">Verify your phone to view full details.</p>
              )}
            </div>
          </section>

          {/* ---------- sticky action card ---------- */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 space-y-4">
              <p className="text-2xl font-bold text-indigo-800">
                ₹ {property.price?.toLocaleString()}
              </p>
              {badge(property.flat_status)}
              {property.deposit && (
                <p className="text-sm text-gray-600">
                  Deposit: <span className="font-medium">₹ {property.deposit.toLocaleString()}</span>
                </p>
              )}

              <button
                onClick={()=> isVerified ? alert("Integrate payment here!") : setShowOtp(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
              >
                {isVerified ? "Book / Pay Deposit" : "Show Owner Details"}
              </button>

              {!isVerified && (
                <p className="text-xs text-gray-500 text-center">
                  Secure your visit by verifying your phone
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/* ---------- small presentational bits ---------- */
const Info = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);
