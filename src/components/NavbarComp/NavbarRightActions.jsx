import { Link } from "react-router-dom";
// import DarkModeSwitch from "../LandingSectionComp/DarkModeToggle";

export default function NavbarRightActions() {
  return (
    <div className="relative inline-flex items-center space-x-3">
      {/* Dark Mode Switch */}

{/* <div className="lg:block hidden">

      <DarkModeSwitch  />
</div> */}

      {/* Desktop EMS / FlipUI */}
      
     <div className="lg:hidden group">
  <a
    href="https://property.easemyspace.in/"
  target="_blank"
  rel="noopener noreferrer"
    className="inline-block text-center px-4 py-2 rounded-full border-2 border-blue-500  lg:text-base text-xs text-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-md"
  >
    Become a Partner
  </a>
</div>
    <div className="hidden lg:inline-block group">
  <Link
    to="demand-form"
    className="inline-block text-center px-4 py-2 rounded-full lg:text-base text-xs bg-white hover:bg-blue-600 hover:text-white transition-all duration-200"
  >
    Post Requirement
  </Link>
</div>

<div className="hidden lg:inline-block group">
<a
  href="https://property.easemyspace.in/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block text-center px-4 py-2 rounded-full lg:text-base text-xs bg-white hover:bg-blue-600 hover:text-white transition-all duration-200"
>
  Become a Partner
</a>
</div>



      {/* Mobile Add Property Button
      <Link
        to="/add-properties"
        className="lg:hidden px-2 py-1 text-[8px] sm:text-sm bg-indigo-100 text-indigo-700 lg:rounded-lg rounded-md shadow hover:bg-indigo-200 transition inline-block"
      >
        Add Property
      </Link>

      {/* Mobile FREE Badge */}
      {/* <span className="lg:hidden absolute lg:-top-2.5 -top-0.5 lg:font-thin -right-2 inline-block px-1.5 py-0.2 text-[7px] sm:text-xs text-green-800 bg-green-100 lg:rounded-md rounded-sm shadow">
        FREE
      </span> */} 
    </div>
  );
}
