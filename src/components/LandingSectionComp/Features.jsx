import React from "react";
import { FaHome, FaLock, FaRocket, FaUserCheck } from "react-icons/fa";

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
    description: "End-to-end encrypted. Your data is yours alone — always.",
    gradient: "from-yellow-400 to-orange-500",
  },
];

const FeatureSection = () => {
  return (
    <section className="w-full overflow-hidden relative py-10">
      <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Why Choose EaseMy<span className="text-blue-500">Space</span><span className="lg:text-7xl">?</span><span>in</span>
        </h2>
        <p className="text-zinc-600 max-w-2xl mx-auto mb-14 text-lg">
          Not just listings. A smarter, safer, and faster way to rent and list spaces you trust.
        </p>

       <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4 lg:px-0">
  {features.map((feature, i) => (
    <div
      key={i}
      className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-blue-100/50 via-blue-200/50 to-purple-100/50 shadow-xl transition-all duration-100 hover:scale-[1.03] hover:shadow-2xl"
    >
      <div className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-2xl p-6">
        {/* Gradient icon bubble */}
        <div
          className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} text-white shadow-md transform transition-all duration-300 group-hover:rotate-3 group-hover:scale-105`}
        >
          {feature.icon}
        </div>

        <h3 className="text-lg font-bold text-zinc-800 mb-2 tracking-tight">
          {feature.title}
        </h3>

        <p className="text-sm text-zinc-600 leading-relaxed mb-auto">
          {feature.description}
        </p>

        {/* Micro-detail bottom glow bar */}
        <div className="mt-6 h-[3px] w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default FeatureSection;
