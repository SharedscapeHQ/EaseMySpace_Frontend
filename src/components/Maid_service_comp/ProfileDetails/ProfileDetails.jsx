import React from "react";
import { useParams, Link } from "react-router-dom";

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

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id === parseInt(id));

  if (!profile)
    return <p className="text-center mt-20 text-gray-500">Profile not found</p>;

return (
  <section className="min-h-screen bg-pink-50 dark:bg-zinc-900 py-10 px-4 lg:px-20">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
      
      {/* Left Column: Profile */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden p-6 flex flex-col gap-4">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-96 object-cover rounded-xl mb-4 border-2 border-pink-200 dark:border-zinc-700"
        />
        <h2 className="text-4xl font-bold text-pink-600">{profile.name}</h2>
        <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 mt-2">
          <span>Gender: {profile.gender}</span>
          <span>Location: {profile.location}</span>
          <span>Experience: {profile.experience}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Skills: {profile.skills}</p>
        <span
          className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-medium ${
            profile.kycVerified ? " text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {profile.kycVerified ? "KYC Verified" : "Not Verified"}
        </span>
      </div>

      {/* Right Column: Payment & Contact */}
      <div className="space-y-6 sticky top-28">
        
        {/* Payment Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-pink-600 mb-4">Make Payment</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Payment will be collected securely. We will transfer the amount to the maid after verification.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition">
              Pay Hourly: {profile.salary.hourly}
            </button>
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition">
              Pay Weekly: {profile.salary.weekly}
            </button>
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition">
              Pay Monthly: {profile.salary.monthly}
            </button>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-pink-600 mb-3">Accepted Payment Methods</h3>
          <div className="flex flex-wrap gap-2">
            {profile.paymentMethods.map((method, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-pink-600 mb-3">Contact</h3>
          <a
            href={`tel:${profile.contact}`}
            className="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center py-3 rounded-full font-medium transition mb-2"
          >
            Call / WhatsApp
          </a>
          <a
            href={`mailto:example@example.com`}
            className="block w-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-center py-3 rounded-full font-medium transition"
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  </section>
);

}
