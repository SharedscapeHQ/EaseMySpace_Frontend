import axios from "axios";

// Axios instance for admin RM-related APIs
const rmAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin/rm",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 GET all RMs (admin only)
export const getAllRMs = async () => {
  const res = await rmAxios.get("/");
  return res.data;
};


// 🔹 POST assign RM to a premium user
export const assignRMToUser = async (userId, rmId) => {
  const res = await rmAxios.post("/assign", { user_id: userId, rm_id: rmId });
  return res.data;
};

export const getUltimateUsers = async () => {
  const res = await rmAxios.get("/ultimate-user");
  
  return res.data;
};

// 🔹 GET logged-in user's assigned RM (user side)
export const fetchMyRM = async (userId) => {
  const res = await axios.get(`https://api.easemyspace.in/api/user/my-rm/${userId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getAllBookings = async () => {
  const res = await rmAxios.get("/booking/all");
  return res.data;
};

export const getAssignedUserBooking = async (rmId) => {
  const res = await rmAxios.get(`/assigned-user-booking/${rmId}`);
  return res.data;
};

export const getAssignedUsers = async (rmId) => {
  const res = await rmAxios.get(`/assigned-users/${rmId}`);
  return res.data;
};

export default rmAxios;
