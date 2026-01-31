import axios from "axios";

// Axios instance for user-related APIs
const axiosInstance = axios.create({
  baseURL: "https://api.easemyspace.in/api/user",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required to send cookies
});

// API to fetch user's properties
export const getUserProperties = async () => {
  const res = await axiosInstance.get("/my-properties");
  return res.data;
};

export const updatePropertyAddress = async (propertyId, data) => {
  const res = await axiosInstance.patch(
    `/update-address/${propertyId}`,
    data
  );
  return res.data;
};

// ✅ API to submit a query for a property
export const submitQuery = async (propertyId, message) => {
  const res = await axiosInstance.post("/edit-query", {
    property_id: propertyId,
    message,
  });
  return res.data;
};

export const fetchMyQueries = async () => {
  const res = await axiosInstance.get("/my-queries");
  return res.data;
};

export const fetchUserContactStatus = async () => {
  try {
    const res = await axiosInstance.get("/contact-limit");
    return res.data;
    
  } catch (err) {
    console.error("❌ Error fetching contact limit:", err.response?.data || err.message);
    throw err;
  }
};

export const unlockContact = async (property_id) => {
  try {
    const res = await axiosInstance.post("/use-contact", { property_id });
    return res.data;
  } catch (err) {
    console.error("❌ Error unlocking contact:", err.response?.data || err.message);
    throw err;
  }
};

export const getUnlockedLeads = async () => {
  try {
    const res = await axiosInstance.get("/unlocked-leads");
    return res.data.unlocked; // array of property_id
  } catch (err) {
    console.error("❌ Error fetching unlocked properties:", err.response?.data || err.message);
    throw err;
  }
};

export const getUserSubscription = async () => {
  const res = await axiosInstance.get("/subscription");
  return res.data;
};

export const getListerUserSubscription = async () => {
  const res = await axiosInstance.get("/lister-subscription");
  return res.data;
};

export const checkListerUserSubscription = async () => {
  try {
    const res = await axiosInstance.get("/lister-subscription/check");
    return res.data; 
  } catch (err) {
    console.error(
      "❌ Error checking lister subscription:",
      err.response?.data || err.message
    );
    return { active: false, remaining: 0 };
  }
};

export const getUnlockedProperties = async () => {
  const res = await axiosInstance.get("/unlocked-contacts");
  return res.data; // array of unlocked property objects
};

export const getRecentlyViewedProperties = async () => {
  try {
    const res = await axiosInstance.get("/recently-viewed");
    return res.data.properties;
  } catch (err) {
    console.error("Failed to fetch recently viewed properties:", err);
    return [];
  }
};

export const markPropertyAsViewed = async (propertyId) => {
  try {
    const res = await axiosInstance.post("/recently-viewed", { propertyId });
    return res.data;
  } catch (err) {
    console.error("Failed to mark property as viewed:", err);
    return { success: false };
  }
};


export const fetchBookingLimitInfo = async () => {
  try {
    const res = await axiosInstance.get("/booking-limit");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching booking limit:", err.response?.data || err.message);
    throw err;
  }
};

// Create a new booking
export const createBooking = async (property_id, booking_date, booking_time) => {
  try {
    const res = await axiosInstance.post("/create-booking", { 
      property_id,
      booking_date,
      booking_time,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error creating booking:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch all bookings of the logged-in user
export const getMyBookings = async () => {
  try {
    const res = await axiosInstance.get("/my-bookings");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching bookings:", err.response?.data || err.message);
    throw err;
  }
};


export const saveRequirement = async (requirementData) => {
  try {
    const res = await axiosInstance.post("/requirement", requirementData);
    return res.data;
  } catch (err) {
    console.error("❌ Error saving requirement:", err.response?.data || err.message);
    throw err;
  }
};

export const getMyRequirement = async () => {
  try {
    const res = await axiosInstance.get("/requirement");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching requirement:", err.response?.data || err.message);
    throw err;
  }
};

export const getReferralTransactions = async () => {
  try {
    const res = await axiosInstance.get("/referral-transactions");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching referral transactions:", err.response?.data || err.message);
    throw err;
  }
};

// Save a property
export const saveProperty = async ({ propertyId, groupName }) => {
  try {
    const res = await axiosInstance.post("/save", { propertyId, groupName });
    return res.data;
  } catch (err) {
    console.error("❌ Error saving property:", err.response?.data || err.message);
    throw err;
  }
};

// Remove a saved property
export const removeSavedProperty = async (propertyId) => {
  try {
    const res = await axiosInstance.delete("/remove", { data: { propertyId } });
    return res.data;
  } catch (err) {
    console.error("❌ Error removing saved property:", err.response?.data || err.message);
    throw err;
  }
};

// Get all saved properties
export const getSavedProperties = async () => {
  try {
    const res = await axiosInstance.get("/all");
    return res.data.properties;
  } catch (err) {
    console.error("❌ Error fetching saved properties:", err.response?.data || err.message);
    return [];
  }
};

export const makeRentPayment = async ({ property_id, room_label, occupancy, amount, deposit }) => {
  try {
    const res = await axiosInstance.post("/rent/pay", {
      property_id,
      room_label,
      occupancy,
      amount,
      deposit: deposit || 0,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error making rent payment:", err.response?.data || err.message);
    throw err;
  }
};

export const makeMonthlyRentPayment = async ({
  property_id,
  user_id,
  amount,
  deposit = 0,
  payment_month,
  payment_year,
  room_label = "default",
  occupancy = "single"
}) => {
  try {
    const res = await axiosInstance.post("/rent/pay/monthly", {
      property_id,
      user_id,
      amount,
      deposit,
      payment_month,
      payment_year,
      room_label,
      occupancy
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error making monthly rent payment:",
      err.response?.data || err.message
    );
    throw err;
  }
};


export const getRentPaymentHistory = async () => {
  try {
    const res = await axiosInstance.get("/rent/history");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching rent payment history:", err.response?.data || err.message);
    throw err;
  }
};

export const getPropertiesWithPayments = async () => {
  try {
    const res = await axiosInstance.get("rent/properties-with-payments");
    return res.data; 
  } catch (err) {
    console.error(
      "❌ Error fetching properties with payments:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const checkIfOccupant = async () => {
  try {
    const res = await axiosInstance.get("/check-occupant"); 
    return res.data.isOccupant;
    
  } catch (err) {
    console.error("❌ Error checking occupant status:", err.response?.data || err.message);
    return false;
  }
};

export const submitPropertyReport = async ({ propertyId, type, message }) => {
  try {
    const res = await axiosInstance.post("/report", {
      propertyId,
      reportType: type, 
      message
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error submitting property report:", err.response?.data || err.message);
    throw err;
  }
};

export const updateUserProfile = async (updatedData) => {
  try {
    const res = await axiosInstance.put("/update-profile", updatedData);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating profile:", err.response?.data || err.message);
    throw err;
  }
};






export default axiosInstance;
