import axios from "axios";

const BASE_URL = "http://localhost:3000/api/owner";

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
  return axios.get("http://localhost:3000/api/admin/users", config);
};
