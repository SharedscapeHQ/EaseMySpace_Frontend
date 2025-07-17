import axios from "axios";

// Axios instance for admin-related API requests
const adminAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json", 
  },
});

// 🔹 GET all users (admin-only)
export const getAllUsers = () => {
  return adminAxios.get("/users");
};
export const getAllLeads = () => {
  return axios.get("https://api.easemyspace.in/api/leads/All", {
    withCredentials: true, 
  });
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
export const editProperty = (id, data) => {
  return axios.put(
    `https://api.easemyspace.in/api/properties/edit-property/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// Delete property with full URL and cookies
export const deleteProperty = (id) => {
  return axios.delete(`https://api.easemyspace.in/api/properties/${id}`, {
    withCredentials: true, // cookies sent automatically
  });
};

export const markNewlyListed = async (id, isNewlyListed, position) => {
  return await adminAxios.patch(`/properties/${id}/newly-listed`, {
    is_newly_listed: isNewlyListed,
    newly_listed_position: position !== null ? Number(position) : null,
  });
};

export const fetchPendingQueries = () => {
  return adminAxios.get("/edit-queries");
};