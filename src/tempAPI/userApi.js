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


export default axiosInstance;
