import axios from "axios";

const api = axios.create({
  baseURL: "https://api.easemyspace.in/api",
  withCredentials: true,
});

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getMyProperties = () =>
  api.get("/properties/my-properties", authHeaders());

export const newlyListedProperties = () =>
  api.get("/properties/newly-listed-properties");

export const addProperty = data =>
  api.post("/properties/add-property", data, authHeaders());

export const updateProperty = (id, data) =>
  api.put(`/properties/${id}`, data, authHeaders());

export const deleteProperty = id =>
  api.delete(`/properties/${id}`, authHeaders());

export const getPropertyById = id =>
  api.get(`/properties/${id}`);

export const sendLeadOtp = (phone, propertyId) =>
  api.post("/leads/send-otp", {
    phone,
    source: "property-detail",
    metadata: { propertyId },
  });

export const verifyLeadOtp = (phone, code) =>
  api.post("/leads/verify-otp", { phone, code });
