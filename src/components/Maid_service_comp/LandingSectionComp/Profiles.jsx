import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard"; // import the card component
import { fetchKycVerifiedProfiles } from "../../../api/Maid_api/maidUserApi";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      const data = await fetchKycVerifiedProfiles();
      setProfiles(data);
      setLoading(false);
    };
    loadProfiles();
  }, []);

  if (loading)
    return <p className="text-gray-500 text-center mt-10">Loading profiles...</p>;
  if (!profiles.length)
    return <p className="text-gray-500 text-center mt-10">No KYC verified profiles found 🎉</p>;

  return (
    <section className="lg:py-10 pt-10 rounded-2xl lg:px-10 px-3 max-w-7xl mx-auto relative bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontFamily: "para_font" }} className="text-[16px] lg:text-3xl text-left text-black dark:text-white">
          Maids & Cooks Profiles
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-2 py-2">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
