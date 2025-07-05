import axios from "axios";

// Axios instance for admin-related API requests
const adminAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin",
  withCredentials: true, // Send cookies automatically
});

// 🔹 GET all users (admin-only)
export const getAllUsers = () => {
  return adminAxios.get("/users");
};

// 🔹 GET all properties (admin-only)
export const getAllProperties = () => {
  return adminAxios.get("/properties");
};

// 🔹 GET property details by ID
export const getPropertyDetails = (id) => {
  return adminAxios.get(`/properties/${id}`);
};

// 🔹 PUT approve a property by ID
export const approveProperty = (id) => {
  return adminAxios.put(`/properties/${id}/approve`);
};

// Edit property with full URL and cookies
export const editProperty = (id, formData) => {
  return axios.put(`https://api.easemyspace.in/api/properties/edit-property/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // cookies sent automatically
  });
};

// Delete property with full URL and cookies
export const deleteProperty = (id) => {
  return axios.delete(`https://api.easemyspace.in/api/properties/${id}`, {
    withCredentials: true, // cookies sent automatically
  });
};

export const markNewlyListed = async (id, isNew, position = null) => {
  return adminAxios.patch(`/properties/${id}/newly-listed`, {
    is_newly_listed: isNew,
    newly_listed_position: isNew ? position : null,
  });
};
