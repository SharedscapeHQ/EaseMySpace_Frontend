// Hero.jsx  –  smart keyword‑aware search / query builder
import React, { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";

/* headline badges */
const badges = [
  { icon: "✅", text: "Verified Listings"     },
  { icon: "💸", text: "Zero Brokerage"        },
  { icon: "📍", text: "Top Mumbai Locations"  },
  { icon: "🛏️", text: "Rent from ₹5,000/mo"  },
  { icon: "🔒", text: "100% Secure Matches"   },
];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

/* dropdown data */
const genderOptions = [
  { value: "",       label: "Preferred Gender" },
  { value: "male",   label: "♂️ Male"          },
  { value: "female", label: "♀️ Female"        },
  { value: "unisex", label: "⚧️ Anyone"        },
];

const propertyOptions = [
  { value: "",         label: "Looking For"       },
  { value: "flatmate", label: "🏠 Shared Flat"     },
  { value: "vacant",   label: "🏢 Fully‑vacant"    },
  { value: "pg", label: "🛏️ Paying Guest (PG)" },
];

/* detect keywords in free‑text */
function detectFromFreeText(str) {
  const txt = str.toLowerCase();
  let gender = "";
  if (/male/.test(txt))            gender = "male";
  if (/female/.test(txt))          gender = "female";
  if (/(unisex|anyone|any)/.test(txt)) gender = "unisex";

  let pType = "";
  if (/(flatmate|shared|roommate)/.test(txt)) pType = "flatmate";
  if (/(vacant|empty|whole)/.test(txt))       pType = "vacant";
  if (/(pg|paying guest)/.test(txt)) pType = "pg"; 
  return { gender, pType };
}

export default function Hero() {
  /* form state */
  const [formData, setFormData] = useState({ search:"", gender:"", property_type:"" });
  const handleChange = (k,v)=> setFormData(p=>({ ...p, [k]:v }));

  /* animated badges */
  const [shuffled,setShuffled]=useState(badges);
  // useEffect(()=>{ const t=setInterval(()=>setShuffled(shuffle(badges)),3000); return ()=>clearInterval(t) },[]);

  const navigate = useNavigate();

  /* build query & nav */
  const handleSubmit = e =>{
    e.preventDefault();
    const { gender:g2, pType } = detectFromFreeText(formData.search);

    const qs = new URLSearchParams();
    if (formData.search) qs.append("location", formData.search);

    const gFinal = formData.gender || g2;
const tFinal = formData.property_type || pType;

if (gFinal) qs.append("gender", gFinal);
if (tFinal) qs.append("looking_for", tFinal);

    navigate(`/view-properties?${qs.toString()}`);
  };

  /* ─────────── JSX ─────────── */
  return (
    <section className="w-full">
      <main className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-12 px-6 rounded-b-[80px] flex items-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full px-4">
          <div className="text-center lg:text-left max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Find Your Perfect Flatmate, Flats or PG in Mumbai
            </h1>
            <p className="text-lg text-white/90 mb-10">
              Smart Matches, Verified Rooms. Your Urban Flatmate Search Starts Here.
            </p>

            {/* search form */}
            <div className="flex justify-center">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
                transition={{ duration:0.6, ease:"easeOut" }}
                className="bg-white/80 backdrop-blur-xl text-zinc-700 font-medium flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center shadow-2xl p-6 rounded-tl-[3rem] rounded-tr-md rounded-br-[3rem] rounded-bl-md w-full max-w-[900px]"
              >
                {/* free‑text */}
                <InputBox
                  placeholder="For e.g. Andheri"
                  value={formData.search}
                  onChange={v=>handleChange("search",v)}
                />

                <Dropdown
                  width="sm:w-[180px]"
                  value={formData.gender}
                  onChange={v=>handleChange("gender",v)}
                  options={genderOptions}
                />

                <Dropdown
                  width="sm:w-[200px]"
                  value={formData.property_type}
                  onChange={v=>handleChange("property_type",v)}
                  options={propertyOptions}
                />

                <motion.button
  type="submit"
  whileHover={{ scale: 1.08, rotate: 0.2 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 600, damping: 18 }}
  className="relative overflow-hidden bg-teal-500 text-white font-semibold px-6 py-3 rounded-full w-full sm:w-[140px] shadow-md group"
>
  <span className="relative z-10">Search</span>

  {/* Shine effect */}
  <span className="absolute top-0 left-[-75%] w-[200%] h-full bg-white/10 transform rotate-6 group-hover:animate-shine"></span>
</motion.button>
              </motion.form>
            </div>
          </div>
        </div>
      </main>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 my-12 max-w-3xl mx-auto px-4">
        <CTA to="/view-properties" primary  icon="🏡">Browse Properties</CTA>
        <CTA to="/add-properties"  secondary icon="✍️">List Your Property</CTA>
      </div>

      {/* badges */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
        <AnimatePresence>
          {shuffled.map(b=>(
            <motion.div
              key={b.text} layout transition={{ duration:0.8,type:"spring" }}
              className="bg-white text-gray-700 font-semibold shadow-md px-5 py-3 rounded-full flex items-center gap-2 text-sm sm:text-base hover:scale-105 transition"
            >
              <span className="text-xl">{b.icon}</span>{b.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* --- helpers / small components --------------------------------- */

const InputBox = ({ placeholder,value,onChange })=>(
  <motion.div whileHover={{scale:1.02}} whileFocusWithin={{scale:1.04}} className="relative w-full sm:w-[220px]">
    <input
      type="text" value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
      className="text-sm px-12 py-3 rounded-full border border-gray-300 w-full bg-white focus:ring-4 focus:ring-teal-400 shadow-sm hover:shadow-md transition"
    />
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      🔍
    </span>
  </motion.div>
);

const Dropdown = ({ value,onChange,options,width })=>(
  <motion.div whileHover={{scale:1.02}} whileFocusWithin={{scale:1.04}} className={`relative w-full ${width}`}>
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-full bg-white border border-gray-300 py-3 px-5 text-left shadow-sm focus:ring-4 focus:ring-indigo-400">
          <span className="block truncate">
            {options.find(o=>o.value===value)?.label || options[0].label}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
            ▼
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            {options.map(({value:v,label})=>(
              <Listbox.Option
                key={v||"empty"} value={v}
                className={({active})=>
                  `cursor-pointer select-none py-2 pl-5 pr-4 ${active?"bg-indigo-600 text-white":"text-gray-900"}`
                }
              >{label}</Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </motion.div>
);

const CTA = ({ to, children, primary, secondary, icon }) => {
  const cls = primary
    ? "px-8 py-3 text-white bg-gradient-to-r from-indigo-600 to-teal-500 border-2 border-teal-500"
    : "px-10 py-3 text-teal-700 bg-white border-2 border-teal-500";
  return (
    <Link to={to} className={`relative inline-block font-bold rounded-full shadow-inner hover:shadow-xl hover:-translate-y-1 transition ${cls}`}>
      <span className="flex items-center gap-2">{icon} {children}</span>
    </Link>
  );
};
