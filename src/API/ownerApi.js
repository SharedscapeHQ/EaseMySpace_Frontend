import axios from "axios";

const BASE_URL = "https://api.easemyspace.in/api/owner";

// Requests will send cookies automatically
const config = {
  withCredentials: true,
};

// 🔁 Update user role (user/admin)
export const updateUserRole = (userId, role) => {
  return axios.put(`${BASE_URL}/user/${userId}/role`, { role }, config);
};

// ❌ Delete a user
export const deleteUserById = (userId) => {
  return axios.delete(`${BASE_URL}/user/${userId}`, config);
};

// ✅ Get all users (re-using admin endpoint)
export const getAllUsers = () => {
  return axios.get("https://api.easemyspace.in/api/admin/users", config);
};

export const getDeletedProperties = () => {
  return axios.get(`${BASE_URL}/properties/deleted`, config);
};
