import { Link } from "react-router-dom";
import DarkModeSwitch from "../LandingSectionComp/DarkModeToggle";

export default function NavbarRightActions() {
  return (
    <div className="relative inline-flex items-center space-x-3">
      {/* Dark Mode Switch */}

{/* <div className="lg:block hidden">

      <DarkModeSwitch  />
</div> */}
      {/* Desktop EMS / FlipUI */}
      <div className="hidden lg:inline-block group border-2 pt-2 border-blue-500 hover:border-zinc-300  hover:bg-blue-600 transition-all duration-200 pl-3 rounded-full">
        <Link to="demand-form">
          <div className="relative text-blue-600 group-hover:text-white dark:text-white mr-14 text-lg font-bold inline-block">
            EMS
            <span className="absolute -top-1 left-full group-hover:text-white dark:text-white ml-1 text-xs">
              FlipUI
            </span>
          </div>
        </Link>
      </div>

      {/* Mobile Add Property Button */}
      <Link
        to="/add-properties"
        className="lg:hidden px-2 py-1 text-[8px] sm:text-sm bg-indigo-100 text-indigo-700 lg:rounded-lg rounded-md shadow hover:bg-indigo-200 transition inline-block"
      >
        Add Property
      </Link>

      {/* Mobile FREE Badge */}
      <span className="lg:hidden absolute lg:-top-2.5 -top-0.5 lg:font-thin -right-2 inline-block px-1.5 py-0.2 text-[7px] sm:text-xs text-green-800 bg-green-100 lg:rounded-md rounded-sm shadow">
        FREE
      </span>
    </div>
  );
}
