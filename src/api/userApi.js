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

export const getUnlockedProperties = async () => {
  const res = await axiosInstance.get("/unlocked-contacts");
  return res.data; // array of unlocked property objects
};

export const getRecentlyViewedProperties = async () => {
  const res = await axiosInstance.get("/recently-viewed");
  return res.data.properties; // Adjust based on your backend response shape
};

// Send a property as recently viewed
export const addRecentlyViewedProperty = async (propertyId) => {
  const res = await axiosInstance.post("/recently-viewed", { propertyId });
  return res.data;
};

export default axiosInstance;
