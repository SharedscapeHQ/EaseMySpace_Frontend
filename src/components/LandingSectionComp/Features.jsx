import React from "react";
import { FaHome, FaRocket, FaUserCheck, FaLock } from "react-icons/fa";

const features = [
  {
    icon: <FaHome size={24} />,
    title: "Verified Listings",
    description: "Only approved spaces make it to our platform. No spam, no scams.",
    gradient: "from-blue-400 to-purple-500",
  },
  {
    icon: <FaRocket size={24} />,
    title: "Instant Upload",
    description: "List your space in minutes with seamless tools and smart inputs.",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: <FaUserCheck size={24} />,
    title: "User Dashboard",
    description: "Full control over your listings, inquiries, and performance.",
    gradient: "from-green-400 to-blue-500",
  },
  {
    icon: <FaLock size={24} />,
    title: "Secure Platform",
    description: "End-to-end encrypted. Your data is yours alone always.",
    gradient: "from-yellow-400 to-orange-500",
  },
];

const FeatureSection = () => {
  return (
   <section className="w-full py-10 lg:px-20 px-3  bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-left">
      Why Choose EaseMySpace.in ?
    </h2>

    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 ">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex items-center sm:items-center flex-row sm:flex-col text-left sm:text-center px-4 py-6
            border-b border-gray-200 sm:border-b-0
            sm:border-r ${index % 4 === 3 ? 'sm:border-r-0' : ''}`}
        >
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl mr-4 sm:mr-0 sm:mb-4">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base sm:text-lg lg:mb-1 mb-0 ">{feature.title}</h3>
            <p className="text-xs text-zinc-800 lg:leading-relaxed leading-none">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



  );
};

export default FeatureSection;
