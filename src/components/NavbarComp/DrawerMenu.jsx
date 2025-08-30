import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaBuilding, FaPhone, FaRegCreditCard } from "react-icons/fa";

export default function DrawerMenu({ open, setOpen }) {
  return (
    <div className="relative">
      {/* Overlay */}
      <div className={`fixed inset-0 z-40 bg-black backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />

      {/* Drawer */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-[80vw] sm:w-[65vw] md:w-80 bg-white backdrop-blur-md shadow-2xl rounded-r-2xl px-6 py-6 flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-blue-600 text-2xl font-bold tracking-wide">Explore</h2>
          <button onClick={() => setOpen(false)} className="text-zinc-700 text-2xl hover:rotate-90 transition-transform duration-300" aria-label="Close drawer">✕</button>
        </div>

        <ul className="space-y-3 text-zinc-800 font-medium text-base">
          <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1 mt-2">Main</p>
          {[
            ["Home", <FaHome />, "/"],
            ["About Us", <FaInfoCircle />, "/about"],
            ["Listings", <FaBuilding />, "/view-properties"],
            ["Contact", <FaPhone />, "/contact"],
          ].map(([label, icon, href]) => (
            <li key={href}>
              <Link to={href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all group hover:bg-blue-100">
                <span className="text-lg text-blue-600 group-hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className="truncate group-hover:translate-x-1 transition-transform duration-200">{label}</span>
              </Link>
            </li>
          ))}

          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-6 mb-1">Premium</p>
          <li>
            <Link to="/subscription" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-100 text-yellow-900 shadow border border-yellow-400 group">
              <span className="text-lg text-yellow-700 group-hover:scale-110 transition-transform duration-200"><FaRegCreditCard /></span>
              <span className="truncate group-hover:translate-x-1 transition-transform duration-200">EMS Subscription Plans</span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto text-xs lg:text-lg pt-6 border-t border-zinc-200" style={{ fontFamily: "heading_font" }}>Making Urban Living Easy</div>
      </aside>
    </div>
  );
}
