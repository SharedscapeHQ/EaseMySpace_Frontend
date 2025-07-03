import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/properties",
  withCredentials: true,
});

// Authorization headers helper
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

// API functions
export const getMyProperties = () =>
  axiosInstance.get(`/my-properties`, authHeaders());

export const newlyListedProperties = () =>
  axiosInstance.get(`/newly-listed-properties`);

export const addProperty = (data) =>
  axiosInstance.post(`/add-property`, data, authHeaders());

export const updateProperty = (id, data) =>
  axiosInstance.put(`/${id}`, data, authHeaders());

export const deleteProperty = (id) =>
  axiosInstance.delete(`/${id}`, authHeaders());
