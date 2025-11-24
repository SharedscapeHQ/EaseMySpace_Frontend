import axios from "axios";

const maidUserAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/user/maid",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json", 
  },
});

export const fetchKycVerifiedProfiles = async () => {
  try {
    const { data } = await maidUserAxios.get("/workers/kyc-verified");
    return data; // returns array of profiles
  } catch (err) {
    console.error("Error fetching KYC verified profiles:", err);
    return [];
  }
};

export const addWorkerBooking = async (bookingData) => {
  try {
    const { data } = await maidUserAxios.post("/worker/booking", bookingData);
    return data;
  } catch (err) {
    console.error("Error adding worker booking:", err);
    throw err;
  }
};

export const fetchUserBookings = async (userId) => {
  try {
    const { data } = await maidUserAxios.get(`/worker/bookings/${userId}`);
    return data.bookings;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    return [];
  }
};
