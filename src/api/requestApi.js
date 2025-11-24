import axios from "axios";

// Axios instance for request-related APIs
const requestAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin/request",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 POST - Save a new request (public)
export const saveRequest = async (requestData) => {
  const res = await requestAxios.post("/", requestData);
  return res.data;
};

// 🔹 GET - Get all requests (admin/owner only)
export const getAllRequests = async () => {
  const res = await requestAxios.get("/");
  return res.data;
};


export const markFollowUp = async ({ requestId, remark }) => {
  const res = await requestAxios.post("/mark-followup", { requestId, remark });
  return res.data;
};

export const clearFollowUp = async (requestId) => {
  const res = await requestAxios.post("/clear-followup", { requestId });
  return res.data;
};

export const requirementReq = async () => {
  const res = await requestAxios.get("/requirement-request");
  return res.data.requests; 
};

export default requestAxios;
