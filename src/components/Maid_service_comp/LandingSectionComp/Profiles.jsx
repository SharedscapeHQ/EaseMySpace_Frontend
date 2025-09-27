import React from "react";
import { Link } from "react-router-dom";

const profiles = [
  {
    "id": 1,
    "name": "Sita Sharma",
    "gender": "Female",
    "location": "Bandra, Mumbai",
    "skills": "Cleaning, Laundry, Utensils",
    "experience": "5 years",
    "salary": { "hourly": "₹200/hr", "weekly": "₹6,000/week", "monthly": "₹25,000/month" },
    "contact": "+919876543210",
    "paymentMethods": ["Cash", "UPI", "Paytm", "Google Pay"],
    "kycVerified": true,
    "image": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  },
  {
    "id": 2,
    "name": "Rekha Joshi",
    "gender": "Female",
    "location": "Andheri, Mumbai",
    "skills": "Indian, Continental, Healthy Meals",
    "experience": "7 years",
    "salary": { "hourly": "₹250/hr", "weekly": "₹7,500/week", "monthly": "₹30,000/month" },
    "contact": "+919876543211",
    "paymentMethods": ["Cash", "UPI", "Paytm"],
    "kycVerified": true,
    "image": "https://images.unsplash.com/photo-1606788075764-8c4b799b6f6b?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  },
  {
    "id": 3,
    "name": "Rohit Verma",
    "gender": "Male",
    "location": "Juhu, Mumbai",
    "skills": "Cleaning, Gardening, Laundry",
    "experience": "4 years",
    "salary": { "hourly": "₹180/hr", "weekly": "₹5,500/week", "monthly": "₹23,000/month" },
    "contact": "+919876543212",
    "paymentMethods": ["Cash", "UPI", "Google Pay"],
    "kycVerified": true,
    "image": "https://images.unsplash.com/photo-1603415526960-f8f3f3170a86?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  },
  {
    "id": 4,
    "name": "Anita Kapoor",
    "gender": "Female",
    "location": "Powai, Mumbai",
    "skills": "Cooking, Babysitting, Cleaning",
    "experience": "8 years",
    "salary": { "hourly": "₹240/hr", "weekly": "₹7,200/week", "monthly": "₹28,000/month" },
    "contact": "+919876543213",
    "paymentMethods": ["Cash", "Paytm", "Google Pay"],
    "kycVerified": false,
    "image": "https://images.unsplash.com/photo-1614281008911-0fba8b9e3b69?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  },
  {
    "id": 5,
    "name": "Sanjay Mehra",
    "gender": "Male",
    "location": "Vile Parle, Mumbai",
    "skills": "Cooking, Cleaning, Delivery Assistance",
    "experience": "6 years",
    "salary": { "hourly": "₹220/hr", "weekly": "₹6,500/week", "monthly": "₹26,000/month" },
    "contact": "+919876543214",
    "paymentMethods": ["Cash", "UPI", "Paytm", "Google Pay"],
    "kycVerified": true,
    "image": "https://images.unsplash.com/photo-1595152772835-219674b2a8a7?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  },
  {
    "id": 6,
    "name": "Pooja Nair",
    "gender": "Female",
    "location": "Malad, Mumbai",
    "skills": "Housekeeping, Laundry, Cooking",
    "experience": "5 years",
    "salary": { "hourly": "₹210/hr", "weekly": "₹6,200/week", "monthly": "₹25,500/month" },
    "contact": "+919876543215",
    "paymentMethods": ["Cash", "UPI", "Paytm"],
    "kycVerified": true,
    "image": "https://images.unsplash.com/photo-1603415526960-62f308e9fdb0?crop=entropy&cs=tinysrgb&fit=max&w=1080&q=80"
  }
];

export default function Profiles() {
  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="lg:py-10 pt-10 rounded-2xl lg:px-10 px-3 max-w-7xl mx-auto relative bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300"
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-[16px] lg:text-3xl text-left text-black dark:text-white"
        >
           Maids & Cooks Profiles
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-2 py-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex-none w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-pink-600">{profile.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{profile.gender}</p>
                <p className="text-gray-600 dark:text-gray-300">{profile.salary.monthly}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.location}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {profile.kycVerified ? "KYC Verified" : "Not Verified"}
                </span>

                <Link
                  to={`/profile/${profile.id}`}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-600 bg-pink-600 px-6 py-2 text-white font-medium mt-4 transition-colors duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-600">
                    View Profile
                  </span>
                  <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
