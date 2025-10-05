import axios from "axios";

const adminAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin/maid",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json", 
  },
});

 export const getAllMaidProfiles = async () => {
  const res = await adminAxios.get("/all-profiles");
  return res.data; 
};

export const updateMaidProfile = async (id, data) => {
  const res = await adminAxios.put(`/update-worker/${id}`, data);
  return res;
};

export const getAllAdminQueries = async () => {
  const res = await adminAxios.get("/queries");
  return res.data;
};

export const resolveAdminQuery = async (id, remark) => {
  const res = await adminAxios.put(`/queries/${id}/resolve`, { remark });
  return res.data;
};

export const getAllWithdrawalRequests = async () => {
  const res = await adminAxios.get("/withdrawals");
  return res.data;
};

export const approveWithdrawalRequest = async (id) => {
  const res = await adminAxios.put(`/withdrawals/${id}/approve`);
  return res.data;
};