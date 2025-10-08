import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchKycVerifiedProfiles } from "../../../api/Maid_api/maidUserApi";
import ProfileHeader from "./ProfileHeader";
import PricingOptions from "./PricingOptions";
import BookingPopup from "./BookingPopup";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchKycVerifiedProfiles();
        const selectedProfile = data.find((p) => p.id === parseInt(id));
        setProfile(selectedProfile || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-gray-500 text-center mt-10">Profile not found</p>;

  const plans = [
    profile.hourly_price > 0 && { label: "Hourly", price: profile.hourly_price, period: "per hour" },
    profile.weekly_price > 0 && { label: "Weekly", price: profile.weekly_price, period: "per week" },
    profile.monthly_price > 0 && { label: "Monthly", price: profile.monthly_price, period: "per month" },
  ].filter(Boolean);

  const handleBookNow = ({ date, time }) => {
    if (!selectedPlan) {
      alert("Please select a pricing option before booking.");
      return;
    }
    if (!date || !time) {
      alert("Please select date and time for your booking.");
      return;
    }
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBookingPopup(true);
  };

  const handlePayment = () => {
    alert("Payment successful! 🎉");
    setShowBookingPopup(false);
  };

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden border border-pink-100 dark:border-zinc-700 relative">

        {/* KYC Badge */}
        {profile.kyc_status && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            KYC Verified
          </div>
        )}

        <ProfileHeader profile={profile} />

        {plans.length > 0 && (
          <PricingOptions
            plans={plans}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onBookNow={handleBookNow}
          />
        )}
      </div>

      {showBookingPopup && selectedPlan && (
        <BookingPopup
          profile={profile}
          selectedPlan={selectedPlan}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onClose={() => setShowBookingPopup(false)}
          onPay={handlePayment}
        />
      )}
    </section>
  );
}
