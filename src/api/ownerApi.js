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

export const restorePropertyById = (id) => {
  return axios.post(`${BASE_URL}/properties/restore/${id}`, config);
};

export const getAllDeletedPropertiesById = (id) => {
  return axios.get(`${BASE_URL}/properties/deleted/${id}`, config);
};

export const getRMAssignments = () => {
  return axios.get(`${BASE_URL}/rm-assignments`, config);
};

export const clearFollowUp = (payload) =>
  axios.post("https://api.easemyspace.in/api/leads/clear-followup", payload, {
    withCredentials: true,
  });

  export const getAllRentPayments = () => {
  return axios.get(`${BASE_URL}/rent-payments`, config);
};

export const getAllWithdrawals = () => {
  return axios.get(`${BASE_URL}/withdrawals`, config);
};

export const approveWithdrawal = (withdrawalId) => {
  return axios.post(`${BASE_URL}/withdrawals/${withdrawalId}/approve`, {}, config);
};

export const getPlatformRevenue = () => {
  return axios.get(`${BASE_URL}/platform/revenue`, config);
};


