import axios from "axios";

// Axios instance for admin RM-related APIs
const rmAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/rm",
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

// 🔹 POST add a new RM (admin only)
export const addRM = async (rmData) => {
  const res = await rmAxios.post("/", rmData);
  return res.data;
};

// 🔹 DELETE an RM by ID (admin only)
export const deleteRM = async (rmId) => {
  const res = await rmAxios.delete(`/${rmId}`);
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

export default rmAxios;
